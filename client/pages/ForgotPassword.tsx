import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
// Removed useToast to prevent React hook corruption

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Email address is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        // Success notification - could be replaced with a proper toast system later
        console.log("Reset link sent - Check your email for password reset instructions.");
      } else {
        setError(data.error || "Failed to send reset email");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>
          </div>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600 w-6 h-6" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800">
                Check your email
              </CardTitle>
              <p className="text-slate-600 mt-2">
                We've sent password reset instructions to:
              </p>
              <p className="text-slate-800 font-medium">{email}</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center text-sm text-slate-600">
                <p>Didn't receive the email? Check your spam folder or</p>
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium text-blue-600"
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                  }}
                >
                  try a different email address
                </Button>
              </div>

              <div className="text-center">
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
          </Link>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Mail className="text-white w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">
              Forgot Password?
            </CardTitle>
            <p className="text-slate-600 mt-2">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    className={`pl-10 ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    autoComplete="email"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Instructions"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-slate-600">
                Remember your password?{" "}
                <Link 
                  to="/login" 
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
