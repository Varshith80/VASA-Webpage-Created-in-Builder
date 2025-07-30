import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Upload, ArrowRight, Globe, Shield, TrendingUp } from "lucide-react";

export default function Index() {
  const popularMaterials = [
    "Cotton", "Polyester", "Wool", "Silk", "Linen", "Nylon", "Jute", "Spices"
  ];

  const features = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Network",
      description: "Connect with verified importers and exporters worldwide"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Payments",
      description: "Protected transactions with our 3-step payment system"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Market Insights",
      description: "Access real-time pricing and quality analytics"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">TextileTrade</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-slate-600 hover:text-slate-800">Features</a>
            <a href="#materials" className="text-slate-600 hover:text-slate-800">Materials</a>
            <a href="#about" className="text-slate-600 hover:text-slate-800">About</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-slate-800 mb-6 leading-tight">
            Global Marketplace for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700 block">
              Textile Raw Materials
            </span>
          </h2>
          <p className="text-xl text-slate-600 mb-12 leading-relaxed">
            Connect importers and exporters of premium raw materials for the clothing and textile industry. 
            Trade cotton, silk, polyester, wool, and more with confidence.
          </p>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link to="/importer">
              <Button 
                size="lg" 
                className="w-full sm:w-auto px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                <ShoppingCart className="mr-3 h-6 w-6" />
                I am an Importer
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Link to="/exporter">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto px-8 py-6 text-lg font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                <Upload className="mr-3 h-6 w-6" />
                I am an Exporter
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Popular Materials */}
          <div id="materials" className="mb-16">
            <h3 className="text-2xl font-semibold text-slate-800 mb-6">Popular Materials</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {popularMaterials.map((material) => (
                <span 
                  key={material}
                  className="px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 text-slate-700 hover:shadow-md transition-shadow"
                >
                  {material}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div id="features" className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-blue-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-slate-800 mb-3">
                  {feature.title}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold">TextileTrade</span>
            </div>
            <p className="text-slate-400 max-w-md mx-auto">
              Connecting the global textile industry through secure, efficient raw material trading.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
