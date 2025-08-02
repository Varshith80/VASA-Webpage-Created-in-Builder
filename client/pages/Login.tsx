import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from "lucide-react";
// Removed useToast to prevent React hook corruption

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    role: "importer" | "exporter";
    verified: boolean;
  };
  token?: string;
  error?: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [googleReady, setGoogleReady] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state
  const from = location.state?.from?.pathname || "/importer-dashboard";

  useEffect(() => {
    // Load Google Sign-In API
    const loadGoogleAPI = () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "demo-google-client-id.googleusercontent.com";

      // Check if client ID is valid (not a demo/placeholder)
      const isValidClientId = clientId &&
        !clientId.includes("demo-") &&
        !clientId.includes("your-") &&
        clientId.endsWith(".googleusercontent.com") &&
        clientId.length > 30; // Real client IDs are much longer

      if (!isValidClientId) {
        console.warn("Google Sign-In disabled: Invalid or demo client ID provided");
        setGoogleReady(true); // Set ready but don't initialize GSI
        return;
      }

      if (window.google && window.google.accounts) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleSignIn,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false,
          });
          setGoogleReady(true);
        } catch (error) {
          console.warn("Google Sign-In initialization failed:", error);
          setGoogleReady(true);
        }
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && window.google.accounts) {
          try {
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: handleGoogleSignIn,
              auto_select: false,
              cancel_on_tap_outside: true,
              use_fedcm_for_prompt: false,
            });
            setGoogleReady(true);
          } catch (error) {
            console.warn("Google Sign-In initialization failed:", error);
            setGoogleReady(true);
          }
        }
      };
      script.onerror = () => {
        console.warn("Failed to load Google Sign-In script");
        setGoogleReady(true);
      };
      document.head.appendChild(script);
    };

    loadGoogleAPI();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    // Clear auth error when user makes changes
    if (authError) {
      setAuthError("");
    }
  };

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setAuthError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: LoginResponse = await response.json();

      if (data.success && data.user && data.token) {
        // Store authentication token
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Success notification - could be replaced with a proper toast system later
        console.log(`Welcome back! Signed in successfully as ${data.user.name}`);

        // Redirect to appropriate dashboard based on user role
        const redirectPath = data.user.role === "exporter" 
          ? "/exporter-dashboard" 
          : "/importer-dashboard";
        
        navigate(redirectPath, { replace: true });
      } else {
        setAuthError(data.error || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (credentialResponse: any) => {
    setGoogleLoading(true);
    setAuthError("");

    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      const data: LoginResponse = await response.json();

      if (data.success && data.user && data.token) {
        // Store authentication token
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Success notification - could be replaced with a proper toast system later
        console.log(`Welcome! Signed in successfully with Google as ${data.user.name}`);

        // If new user, redirect to complete registration
        if (!data.user.verified) {
          navigate("/register?step=verify", { 
            state: { user: data.user },
            replace: true 
          });
          return;
        }

        // Redirect to appropriate dashboard
        const redirectPath = data.user.role === "exporter" 
          ? "/exporter-dashboard" 
          : "/importer-dashboard";
        
        navigate(redirectPath, { replace: true });
      } else {
        setAuthError(data.error || "Google sign-in failed. Please try again.");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setAuthError("Failed to sign in with Google. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const fallbackGoogleSignIn = () => {
    // Simple OAuth redirect flow as fallback
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "demo-google-client-id.googleusercontent.com";
    const redirectUri = `${window.location.origin}/login`;
    const scope = "openid email profile";
    const responseType = "code";

    const authUrl = `https://accounts.google.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&access_type=offline`;

    // For demo purposes, show a message instead of redirecting
    console.log("Google OAuth URL:", authUrl);
    setAuthError("Google Sign-In demo - In production, this would redirect to Google OAuth");
  };

  const renderGoogleSignInButton = () => {
    if (!googleReady) {
      return (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled
        >
          Loading Google Sign-In...
        </Button>
      );
    }

    return (
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={googleLoading}
        onClick={() => {
          if (window.google && window.google.accounts) {
            try {
              window.google.accounts.id.prompt();
            } catch (error) {
              console.warn("Google Sign-In prompt failed, using fallback:", error);
              fallbackGoogleSignIn();
            }
          } else {
            console.warn("Google Sign-In not available, using fallback");
            fallbackGoogleSignIn();
          }
        }}
      >
        {googleLoading ? (
          <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        Sign in with Google
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">
              Welcome Back
            </CardTitle>
            <p className="text-slate-600 mt-2">
              Sign in to your VASA account
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Authentication Error */}
            {authError && (
              <Alert variant="destructive">
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label 
                  htmlFor="email" 
                  className="text-sm font-medium text-slate-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    autoComplete="email"
                    required
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="text-sm text-red-600" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label 
                  htmlFor="password" 
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    autoComplete="current-password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-sm text-red-600" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            {renderGoogleSignInButton()}

            {/* Register Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <Link 
                  to="/register" 
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Register here
                </Link>
              </p>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center">
              <Link 
                to="/forgot-password" 
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
