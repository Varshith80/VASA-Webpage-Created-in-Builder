import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          
          <h1 className="text-6xl font-bold text-slate-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
          <p className="text-slate-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="space-y-3">
            <Link to="/">
              <Button className="w-full sm:w-auto" size="lg">
                <Home className="mr-2 h-5 w-5" />
                Back to Homepage
              </Button>
            </Link>
            <div>
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
                className="text-slate-600 hover:text-slate-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
