import { useState } from "react";
import { 
  Bug, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Calendar,
  MapPin,
  Users,
  Filter,
  Search,
  RefreshCw,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Outbreak {
  id: string;
  disease: string;
  severity: "low" | "medium" | "high" | "critical";
  affectedAreas: string[];
  reportedCases: number;
  trend: "increasing" | "stable" | "decreasing";
  seasonality: "annual" | "seasonal" | "sporadic";
  detectionDate: string;
  predictedPeak: string;
  riskFactors: string[];
  recommendations: string[];
}

const OutbreakDetection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("all");

  const outbreaks: Outbreak[] = [
    {
      id: "1",
      disease: "Influenza Type A",
      severity: "high",
      affectedAreas: ["Downtown District", "North Suburbs", "East Side"],
      reportedCases: 342,
      trend: "increasing",
      seasonality: "seasonal",
      detectionDate: "2024-01-15",
      predictedPeak: "2024-02-10",
      riskFactors: ["Low vaccination rates", "Cold weather", "Indoor crowding"],
      recommendations: ["Increase vaccination campaigns", "Public awareness", "Stockpile antivirals"]
    },
    {
      id: "2",
      disease: "Norovirus",
      severity: "medium",
      affectedAreas: ["West End", "Central District"],
      reportedCases: 87,
      trend: "stable",
      seasonality: "annual",
      detectionDate: "2024-01-20",
      predictedPeak: "2024-02-05",
      riskFactors: ["Food handling practices", "School gatherings"],
      recommendations: ["Enhanced food safety inspections", "School hygiene programs"]
    },
    {
      id: "3",
      disease: "RSV (Respiratory Syncytial Virus)",
      severity: "critical",
      affectedAreas: ["Pediatric Ward - City General", "Children's Hospital"],
      reportedCases: 156,
      trend: "increasing",
      seasonality: "seasonal",
      detectionDate: "2024-01-10",
      predictedPeak: "2024-01-28",
      riskFactors: ["Vulnerable infant population", "Daycare centers"],
      recommendations: ["Visitor restrictions", "Enhanced PPE protocols", "Parent education"]
    },
    {
      id: "4",
      disease: "Hand, Foot & Mouth Disease",
      severity: "low",
      affectedAreas: ["South District"],
      reportedCases: 23,
      trend: "decreasing",
      seasonality: "sporadic",
      detectionDate: "2024-01-18",
      predictedPeak: "2024-01-25",
      riskFactors: ["School environments", "Young children"],
      recommendations: ["School monitoring", "Parent notifications"]
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "text-green-600 bg-green-100 border-green-500";
      case "medium": return "text-yellow-600 bg-yellow-100 border-yellow-500";
      case "high": return "text-orange-600 bg-orange-100 border-orange-500";
      case "critical": return "text-red-600 bg-red-100 border-red-500";
      default: return "text-gray-600 bg-gray-100 border-gray-500";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing": return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "stable": return <Activity className="w-4 h-4 text-yellow-500" />;
      case "decreasing": return <TrendingUp className="w-4 h-4 text-green-500 transform rotate-180" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredOutbreaks = outbreaks.filter(outbreak => {
    const matchesSearch = outbreak.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         outbreak.affectedAreas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSeverity = selectedSeverity === "all" || outbreak.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  const severities = ["all", "low", "medium", "high", "critical"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <Bug className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Disease Outbreak Detection</h1>
              <p className="text-gray-600">Annual and seasonal disease pattern analysis to predict and prepare for potential health outbreaks</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Outbreaks</p>
                  <p className="text-2xl font-bold text-red-600">4</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Cases</p>
                  <p className="text-2xl font-bold text-orange-600">608</p>
                </div>
                <Users className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Critical Alerts</p>
                  <p className="text-2xl font-bold text-red-600">1</p>
                </div>
                <Shield className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Areas Affected</p>
                  <p className="text-2xl font-bold text-blue-600">8</p>
                </div>
                <MapPin className="w-8 h-8 text-blue-500" />
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
                  placeholder="Search by disease name or affected area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              {severities.map(severity => (
                <Button
                  key={severity}
                  variant={selectedSeverity === severity ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSeverity(severity)}
                  className="capitalize"
                >
                  {severity}
                </Button>
              ))}
            </div>

            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Outbreaks List */}
        <div className="space-y-6">
          {filteredOutbreaks.map((outbreak) => (
            <Card key={outbreak.id} className={`border-l-4 ${getSeverityColor(outbreak.severity).split(' ')[2]}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{outbreak.disease}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(outbreak.severity)}`}>
                        {outbreak.severity.toUpperCase()} SEVERITY
                      </span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(outbreak.trend)}
                        <span className="text-sm text-gray-600">{outbreak.trend}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-600">Reported Cases:</span>
                        <span className="ml-2 font-semibold text-lg">{outbreak.reportedCases}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Seasonality:</span>
                        <span className="ml-2 font-medium capitalize">{outbreak.seasonality}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Detected:</span>
                        <span className="ml-2 font-medium">{outbreak.detectionDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Peak Prediction:</span>
                        <span className="ml-2 font-medium">{outbreak.predictedPeak}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        Affected Areas
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {outbreak.affectedAreas.map((area, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          Risk Factors
                        </div>
                        <ul className="text-sm space-y-1">
                          {outbreak.riskFactors.map((factor, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-orange-500 mt-1">•</span>
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Shield className="w-4 h-4" />
                          Recommendations
                        </div>
                        <ul className="text-sm space-y-1">
                          {outbreak.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {outbreak.severity === "critical" && (
                      <Button variant="destructive" size="sm">
                        Emergency Response
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredOutbreaks.length === 0 && (
          <div className="text-center py-12">
            <Bug className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No outbreaks found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutbreakDetection;
