import React, { useState, useEffect, useCallback } from 'react';
import { 
  Download, 
  Wifi, 
  WifiOff, 
  Bell, 
  BellOff, 
  Smartphone, 
  Share2,
  RefreshCw,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

// PWA Installation Hook
export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = useCallback(async () => {
    if (!deferredPrompt) return false;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('PWA installation failed:', error);
      return false;
    }
  }, [deferredPrompt]);

  return {
    isInstallable,
    isInstalled,
    installPWA
  };
};

// Network Status Hook
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get connection type if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionType(connection.effectiveType || 'unknown');
      
      const handleConnectionChange = () => {
        setConnectionType(connection.effectiveType || 'unknown');
      };
      
      connection.addEventListener('change', handleConnectionChange);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', handleConnectionChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, connectionType };
};

// Push Notifications Hook
export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }

    // Get existing subscription
    navigator.serviceWorker.ready.then(registration => {
      registration.pushManager.getSubscription().then(sub => {
        setSubscription(sub);
      });
    });
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      return permission === 'granted';
    } catch (error) {
      console.error('Notification permission request failed:', error);
      return false;
    }
  }, [isSupported]);

  const subscribeToPush = useCallback(async () => {
    if (!isSupported || permission !== 'granted') return null;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
      });
      
      setSubscription(subscription);
      
      // Send subscription to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });
      
      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }, [isSupported, permission]);

  const unsubscribeFromPush = useCallback(async () => {
    if (!subscription) return false;

    try {
      await subscription.unsubscribe();
      setSubscription(null);
      
      // Remove subscription from server
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: subscription.endpoint })
      });
      
      return true;
    } catch (error) {
      console.error('Push unsubscription failed:', error);
      return false;
    }
  }, [subscription]);

  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush
  };
};

// PWA Install Prompt Component
export const PWAInstallPrompt: React.FC<{ 
  show: boolean; 
  onClose: () => void; 
}> = ({ show, onClose }) => {
  const { installPWA } = usePWAInstall();
  const [installing, setInstalling] = useState(false);

  const handleInstall = async () => {
    setInstalling(true);
    const success = await installPWA();
    if (success) {
      onClose();
    }
    setInstalling(false);
  };

  if (!show) return null;

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-blue-600" />
            Install VASA Trade App
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-gray-700">
              Install VASA Trade for a faster, more reliable experience with offline access.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Check className="h-4 w-4 text-green-600" />
              <span>Work offline with cached data</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Check className="h-4 w-4 text-green-600" />
              <span>Receive push notifications</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Check className="h-4 w-4 text-green-600" />
              <span>Faster loading and better performance</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Check className="h-4 w-4 text-green-600" />
              <span>Native app-like experience</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Maybe Later
            </Button>
            <Button 
              onClick={handleInstall} 
              disabled={installing}
              className="flex-1"
            >
              {installing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Install App
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Network Status Indicator
export const NetworkStatusIndicator: React.FC = () => {
  const { isOnline, connectionType } = useNetworkStatus();
  const [showDetails, setShowDetails] = useState(false);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">You're offline</span>
          <Badge variant="secondary" className="text-xs bg-red-400 text-white">
            Limited functionality
          </Badge>
        </div>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs hover:underline"
        >
          {showDetails ? 'Hide' : 'Info'}
        </button>
      </div>
      
      {showDetails && (
        <div className="border-t border-red-400 mt-2 pt-2 text-xs">
          <p>Some features may not be available offline. Your actions will sync when connection is restored.</p>
        </div>
      )}
    </div>
  );
};

// Push Notification Manager Component
export const PushNotificationManager: React.FC = () => {
  const { 
    isSupported, 
    permission, 
    subscription, 
    requestPermission, 
    subscribeToPush, 
    unsubscribeFromPush 
  } = usePushNotifications();
  
  const [loading, setLoading] = useState(false);

  const handleToggleNotifications = async () => {
    setLoading(true);
    
    try {
      if (subscription) {
        await unsubscribeFromPush();
      } else {
        if (permission !== 'granted') {
          const granted = await requestPermission();
          if (!granted) {
            setLoading(false);
            return;
          }
        }
        await subscribeToPush();
      }
    } catch (error) {
      console.error('Failed to toggle notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <BellOff className="h-5 w-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">Push Notifications</p>
            <p className="text-sm text-gray-500">Not supported in this browser</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {subscription ? (
            <Bell className="h-5 w-5 text-green-600" />
          ) : (
            <BellOff className="h-5 w-5 text-gray-400" />
          )}
          <div>
            <p className="font-medium text-gray-900">Push Notifications</p>
            <p className="text-sm text-gray-500">
              {subscription 
                ? 'Receive updates about your orders and messages' 
                : 'Enable notifications for order updates and messages'
              }
            </p>
          </div>
        </div>
        
        <Button
          variant={subscription ? "outline" : "default"}
          size="sm"
          onClick={handleToggleNotifications}
          disabled={loading}
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : subscription ? (
            'Disable'
          ) : (
            'Enable'
          )}
        </Button>
      </div>
    </Card>
  );
};

// Offline Actions Manager
export const useOfflineActions = () => {
  const [offlineActions, setOfflineActions] = useState<any[]>([]);

  const addOfflineAction = useCallback((action: any) => {
    setOfflineActions(prev => [...prev, { ...action, id: Date.now() }]);
    
    // Store in localStorage for persistence
    const stored = localStorage.getItem('offlineActions');
    const actions = stored ? JSON.parse(stored) : [];
    localStorage.setItem('offlineActions', JSON.stringify([...actions, action]));
  }, []);

  const syncOfflineActions = useCallback(async () => {
    const stored = localStorage.getItem('offlineActions');
    if (!stored) return;

    const actions = JSON.parse(stored);
    const results = [];

    for (const action of actions) {
      try {
        const response = await fetch(action.url, {
          method: action.method || 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        });

        if (response.ok) {
          results.push({ ...action, status: 'synced' });
        } else {
          results.push({ ...action, status: 'failed' });
        }
      } catch (error) {
        results.push({ ...action, status: 'failed', error: error.message });
      }
    }

    // Remove successfully synced actions
    const remainingActions = results.filter(r => r.status !== 'synced');
    localStorage.setItem('offlineActions', JSON.stringify(remainingActions));
    setOfflineActions(remainingActions);

    return results;
  }, []);

  useEffect(() => {
    // Load offline actions from storage
    const stored = localStorage.getItem('offlineActions');
    if (stored) {
      setOfflineActions(JSON.parse(stored));
    }

    // Sync when coming online
    const handleOnline = () => {
      syncOfflineActions();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [syncOfflineActions]);

  return {
    offlineActions,
    addOfflineAction,
    syncOfflineActions
  };
};

// Service Worker Updater
export const ServiceWorkerUpdater: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      navigator.serviceWorker.register('/sw.js').then(registration => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    setUpdating(true);
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <Card className="p-4 shadow-lg border-blue-200 bg-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Update Available</p>
              <p className="text-sm text-blue-700">A new version of VASA Trade is ready</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUpdateAvailable(false)}
            >
              Later
            </Button>
            <Button
              size="sm"
              onClick={handleUpdate}
              disabled={updating}
            >
              {updating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                'Update'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default {
  usePWAInstall,
  useNetworkStatus,
  usePushNotifications,
  useOfflineActions,
  PWAInstallPrompt,
  NetworkStatusIndicator,
  PushNotificationManager,
  ServiceWorkerUpdater
};
