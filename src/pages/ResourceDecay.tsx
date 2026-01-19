import { useState } from "react";
import { 
  Trash2, 
  AlertTriangle, 
  TrendingDown, 
  Package, 
  Clock,
  Calendar,
  BarChart3,
  Filter,
  Search,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResourceItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  usageVelocity: number;
  expiryDate: string;
  wasteRisk: "low" | "medium" | "high" | "critical";
  lastUpdated: string;
  location: string;
}

const ResourceDecay = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const resources: ResourceItem[] = [
    {
      id: "1",
      name: "Paracetamol 500mg",
      category: "Medicine",
      currentStock: 245,
      usageVelocity: 12,
      expiryDate: "2024-03-15",
      wasteRisk: "high",
      lastUpdated: "2 hours ago",
      location: "Pharmacy A"
    },
    {
      id: "2", 
      name: "IV Catheters",
      category: "Equipment",
      currentStock: 89,
      usageVelocity: 3,
      expiryDate: "2024-06-30",
      wasteRisk: "medium",
      lastUpdated: "1 hour ago",
      location: "Storage B"
    },
    {
      id: "3",
      name: "Surgical Gloves",
      category: "Supplies",
      currentStock: 1200,
      usageVelocity: 45,
      expiryDate: "2024-04-20",
      wasteRisk: "low",
      lastUpdated: "30 mins ago",
      location: "Supply Room C"
    },
    {
      id: "4",
      name: "Insulin Vials",
      category: "Medicine",
      currentStock: 34,
      usageVelocity: 2,
      expiryDate: "2024-02-10",
      wasteRisk: "critical",
      lastUpdated: "15 mins ago",
      location: "Refrigerator D"
    },
    {
      id: "5",
      name: "Blood Bags O+",
      category: "Blood",
      currentStock: 8,
      usageVelocity: 1,
      expiryDate: "2024-02-05",
      wasteRisk: "critical",
      lastUpdated: "5 mins ago",
      location: "Blood Bank"
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-green-600 bg-green-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "high": return "text-orange-600 bg-orange-100";
      case "critical": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getRiskBorder = (risk: string) => {
    switch (risk) {
      case "low": return "border-l-green-500";
      case "medium": return "border-l-yellow-500";
      case "high": return "border-l-orange-500";
      case "critical": return "border-l-red-500";
      default: return "border-l-gray-500";
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", "Medicine", "Equipment", "Supplies", "Blood"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resource Decay & Waste Predictor</h1>
              <p className="text-gray-600">Predicts unused or expiring resources by tracking usage velocity</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Critical Risk Items</p>
                  <p className="text-2xl font-bold text-red-600">2</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">High Risk Items</p>
                  <p className="text-2xl font-bold text-orange-600">1</p>
                </div>
                <TrendingDown className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Resources</p>
                  <p className="text-2xl font-bold text-blue-600">156</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Est. Monthly Waste</p>
                  <p className="text-2xl font-bold text-gray-600">$12.4K</p>
                </div>
                <BarChart3 className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>

            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Resources List */}
        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className={`border-l-4 ${getRiskBorder(resource.wasteRisk)}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{resource.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(resource.wasteRisk)}`}>
                        {resource.wasteRisk.toUpperCase()} RISK
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <span className="ml-2 font-medium">{resource.category}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Current Stock:</span>
                        <span className="ml-2 font-medium">{resource.currentStock} units</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Usage Velocity:</span>
                        <span className="ml-2 font-medium">{resource.usageVelocity}/day</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <span className="ml-2 font-medium">{resource.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Expires:</span>
                        <span className="font-medium">{resource.expiryDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Updated:</span>
                        <span>{resource.lastUpdated}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {resource.wasteRisk === "critical" && (
                      <Button variant="destructive" size="sm">
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceDecay;
