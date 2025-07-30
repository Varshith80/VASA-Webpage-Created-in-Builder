import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ArrowLeft, MapPin, Package, Star } from "lucide-react";

export default function Importer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [materialFilter, setMaterialFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  // Mock data for materials
  const materials = [
    {
      id: 1,
      type: "Cotton",
      quality: "Premium Grade A",
      price: "$2.50",
      unit: "per kg",
      moq: "1000 kg",
      exporter: "Global Cotton Co.",
      location: "India",
      rating: 4.8,
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      type: "Silk",
      quality: "Mulberry Silk",
      price: "$45.00",
      unit: "per kg",
      moq: "100 kg",
      exporter: "Silk Masters Ltd.",
      location: "China",
      rating: 4.9,
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      type: "Polyester",
      quality: "Industrial Grade",
      price: "$1.80",
      unit: "per kg",
      moq: "2000 kg",
      exporter: "Poly Industries",
      location: "South Korea",
      rating: 4.6,
      image: "/api/placeholder/300/200"
    },
    {
      id: 4,
      type: "Wool",
      quality: "Merino Wool",
      price: "$12.00",
      unit: "per kg",
      moq: "500 kg",
      exporter: "Wool Traders Inc.",
      location: "Australia",
      rating: 4.7,
      image: "/api/placeholder/300/200"
    },
    {
      id: 5,
      type: "Linen",
      quality: "European Flax",
      price: "$8.50",
      unit: "per kg",
      moq: "300 kg",
      exporter: "Linen Supply Co.",
      location: "France",
      rating: 4.5,
      image: "/api/placeholder/300/200"
    },
    {
      id: 6,
      type: "Nylon",
      quality: "High Strength",
      price: "$3.20",
      unit: "per kg",
      moq: "1500 kg",
      exporter: "Synthetic Solutions",
      location: "Germany",
      rating: 4.4,
      image: "/api/placeholder/300/200"
    }
  ];

  const materialTypes = ["Cotton", "Silk", "Polyester", "Wool", "Linen", "Nylon", "Jute", "Spices"];
  const locations = ["India", "China", "South Korea", "Australia", "France", "Germany", "USA", "Brazil"];

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.exporter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMaterial = materialFilter === "all" || material.type === materialFilter;
    const matchesLocation = locationFilter === "all" || material.location === locationFilter;
    
    return matchesSearch && matchesMaterial && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <h1 className="text-xl font-bold text-slate-800">TextileTrade</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Importer Dashboard
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Raw Materials Catalog</h2>
          <p className="text-slate-600">Discover and purchase high-quality raw materials from verified exporters worldwide</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Search Materials</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by material type or exporter..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-slate-700 mb-2">Material Type</label>
              <Select value={materialFilter} onValueChange={setMaterialFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All materials" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Materials</SelectItem>
                  {materialTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full lg:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600">
            Showing {filteredMaterials.length} materials
          </p>
        </div>

        {/* Materials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-3 flex items-center justify-center">
                  <Package className="h-12 w-12 text-slate-400" />
                </div>
                <CardTitle className="text-lg">{material.type}</CardTitle>
                <p className="text-sm text-slate-600">{material.quality}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {material.price}
                    </span>
                    <span className="text-sm text-slate-500">{material.unit}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">{material.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-slate-600">{material.rating}</span>
                  </div>
                  
                  <div className="text-sm text-slate-600">
                    <strong>MOQ:</strong> {material.moq}
                  </div>
                  
                  <div className="text-sm text-slate-600">
                    <strong>Exporter:</strong> {material.exporter}
                  </div>
                  
                  <Button className="w-full mt-4">
                    Request Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No materials found</h3>
            <p className="text-slate-500">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
