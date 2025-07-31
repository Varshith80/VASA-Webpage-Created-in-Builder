import express from 'express';
import multer from 'multer';
import path from 'path';
import { auth } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/security.js';
import { BugReport, ErrorTracker } from '../utils/errorTracker.js';
import { logActivity } from '../utils/activityLogger.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads', 'bug-reports');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    // Allow images, PDFs, text files, and log files
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'text/csv',
      'application/json'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and text files are allowed.'));
    }
  }
});

// Submit bug report
router.post('/', auth, apiLimiter, upload.any(), async (req, res) => {
  try {
    const {
      title,
      description,
      stepsToReproduce,
      expectedBehavior,
      actualBehavior,
      category,
      priority = 'MEDIUM',
      severity = 'MINOR',
      systemInfo
    } = req.body;

    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required'
      });
    }

    // Parse system info
    let parsedSystemInfo = {};
    try {
      parsedSystemInfo = JSON.parse(systemInfo || '{}');
    } catch (error) {
      console.warn('Failed to parse system info:', error);
    }

    // Process uploaded files
    const screenshots = [];
    const files = [];

    if (req.files) {
      req.files.forEach(file => {
        const fileInfo = {
          filename: file.originalname,
          url: `/uploads/bug-reports/${file.filename}`,
          type: file.mimetype,
          size: file.size,
          uploadedAt: new Date()
        };

        if (file.fieldname.startsWith('screenshot_')) {
          screenshots.push({
            ...fileInfo,
            description: 'Screenshot'
          });
        } else {
          files.push(fileInfo);
        }
      });
    }

    // Create bug report
    const bugReport = new BugReport({
      userId: req.user.id,
      email: req.user.email,
      title: title.trim(),
      description: description.trim(),
      stepsToReproduce: stepsToReproduce?.trim() || '',
      expectedBehavior: expectedBehavior?.trim() || '',
      actualBehavior: actualBehavior?.trim() || '',
      category,
      priority,
      severity,
      browser: parsedSystemInfo.browser || {},
      os: parsedSystemInfo.os || {},
      device: parsedSystemInfo.device || 'Unknown',
      viewport: parsedSystemInfo.viewport || '',
      url: parsedSystemInfo.url || '',
      screenshots,
      files
    });

    await bugReport.save();

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'BUG_REPORT_SUBMITTED',
      description: `User submitted bug report: ${title}`,
      metadata: {
        reportId: bugReport.reportId,
        category,
        priority,
        severity
      },
      req,
      severity: severity === 'CRITICAL' || severity === 'BLOCKER' ? 'HIGH' : 'LOW',
      category: 'SUPPORT'
    });

    // Auto-escalate critical/blocker bugs
    if (severity === 'CRITICAL' || severity === 'BLOCKER') {
      await escalateBugReport(bugReport);
    }

    res.status(201).json({
      success: true,
      message: 'Bug report submitted successfully',
      data: {
        reportId: bugReport.reportId,
        status: bugReport.status,
        createdAt: bugReport.createdAt
      }
    });

  } catch (error) {
    console.error('Bug report submission error:', error);
    
    // Log the error
    await ErrorTracker.logError({
      type: 'API_ERROR',
      message: 'Bug report submission failed',
      stack: error.stack,
      severity: 'MEDIUM',
      userId: req.user?.id,
      metadata: { endpoint: '/api/bug-reports', method: 'POST' },
      req
    });

    res.status(500).json({
      success: false,
      message: 'Failed to submit bug report'
    });
  }
});

// Get user's bug reports
router.get('/my-reports', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query;
    
    const query = { userId: req.user.id };
    if (status) query.status = status;
    if (category) query.category = category;

    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      BugReport.find(query)
        .select('-comments.isInternal -comments.userId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('assignedTo', 'firstName lastName'),
      BugReport.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalCount: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get bug reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bug reports'
    });
  }
});

// Get specific bug report
router.get('/:reportId', auth, async (req, res) => {
  try {
    const { reportId } = req.params;
    
    const report = await BugReport.findOne({ reportId })
      .populate('userId', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName')
      .populate('resolvedBy', 'firstName lastName')
      .populate('comments.userId', 'firstName lastName');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Bug report not found'
      });
    }

    // Check if user can view this report
    const canView = (
      report.userId.toString() === req.user.id ||
      ['admin', 'super_admin', 'support'].includes(req.user.role)
    );

    if (!canView) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this report'
      });
    }

    // Filter internal comments for non-staff users
    if (!['admin', 'super_admin', 'support'].includes(req.user.role)) {
      report.comments = report.comments.filter(comment => !comment.isInternal);
    }

    res.json({
      success: true,
      data: report
    });

  } catch (error) {
    console.error('Get bug report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bug report'
    });
  }
});

// Add comment to bug report
router.post('/:reportId/comments', auth, apiLimiter, async (req, res) => {
  try {
    const { reportId } = req.params;
    const { comment, isInternal = false } = req.body;

    if (!comment?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment is required'
      });
    }

    const report = await BugReport.findOne({ reportId });
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Bug report not found'
      });
    }

    // Check permissions
    const canComment = (
      report.userId.toString() === req.user.id ||
      ['admin', 'super_admin', 'support'].includes(req.user.role)
    );

    if (!canComment) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to comment on this report'
      });
    }

    // Only staff can add internal comments
    const commentIsInternal = isInternal && ['admin', 'super_admin', 'support'].includes(req.user.role);

    report.comments.push({
      userId: req.user.id,
      comment: comment.trim(),
      isInternal: commentIsInternal
    });

    await report.save();

    // Populate the new comment for response
    await report.populate('comments.userId', 'firstName lastName');
    const newComment = report.comments[report.comments.length - 1];

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: newComment
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment'
    });
  }
});

// Vote on bug report
router.post('/:reportId/vote', auth, apiLimiter, async (req, res) => {
  try {
    const { reportId } = req.params;
    
    const report = await BugReport.findOne({ reportId });
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Bug report not found'
      });
    }

    // Check if user already voted
    const hasVoted = report.voters.includes(req.user.id);
    
    if (hasVoted) {
      // Remove vote
      report.voters = report.voters.filter(id => id.toString() !== req.user.id);
      report.upvotes = Math.max(0, report.upvotes - 1);
    } else {
      // Add vote
      report.voters.push(req.user.id);
      report.upvotes += 1;
    }

    await report.save();

    res.json({
      success: true,
      data: {
        upvotes: report.upvotes,
        hasVoted: !hasVoted
      }
    });

  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process vote'
    });
  }
});

// Admin/Support routes
router.use('/', (req, res, next) => {
  // Check if user has support/admin permissions
  if (!['admin', 'super_admin', 'support'].includes(req.user?.role)) {
    return res.status(403).json({
      success: false,
      message: 'Admin/Support access required'
    });
  }
  next();
});

// Get all bug reports (admin/support)
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      category, 
      priority, 
      severity,
      assignedTo,
      search
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (severity) query.severity = severity;
    if (assignedTo) query.assignedTo = assignedTo;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { reportId: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      BugReport.find(query)
        .populate('userId', 'firstName lastName email')
        .populate('assignedTo', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      BugReport.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalCount: total
        }
      }
    });

  } catch (error) {
    console.error('Get all bug reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bug reports'
    });
  }
});

// Update bug report status/assignment (admin/support)
router.patch('/:reportId', auth, async (req, res) => {
  try {
    const { reportId } = req.params;
    const updates = req.body;

    const allowedUpdates = ['status', 'priority', 'severity', 'assignedTo', 'resolution'];
    const updateData = {};

    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = updates[key];
      }
    });

    if (updateData.status === 'RESOLVED') {
      updateData.resolvedBy = req.user.id;
      updateData.resolvedAt = new Date();
    }

    if (updateData.assignedTo) {
      updateData.assignedAt = new Date();
    }

    const report = await BugReport.findOneAndUpdate(
      { reportId },
      updateData,
      { new: true }
    ).populate('userId', 'firstName lastName email')
     .populate('assignedTo', 'firstName lastName')
     .populate('resolvedBy', 'firstName lastName');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Bug report not found'
      });
    }

    res.json({
      success: true,
      message: 'Bug report updated successfully',
      data: report
    });

  } catch (error) {
    console.error('Update bug report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update bug report'
    });
  }
});

// Helper function to escalate critical bug reports
async function escalateBugReport(bugReport) {
  console.warn('CRITICAL BUG REPORT:', {
    reportId: bugReport.reportId,
    title: bugReport.title,
    severity: bugReport.severity,
    userId: bugReport.userId
  });
  
  // In production, integrate with:
  // - Slack notifications
  // - Email alerts to dev team
  // - PagerDuty incidents
  // - JIRA ticket creation
}

export default router;
