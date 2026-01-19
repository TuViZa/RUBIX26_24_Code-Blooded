import { useState, useEffect } from "react";
import { 
  Ambulance, 
  MapPin, 
  Navigation, 
  Phone, 
  Clock,
  AlertTriangle,
  Activity,
  Users,
  Filter,
  Search,
  RefreshCw,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AmbulanceUnit {
  id: string;
  unitNumber: string;
  status: "active" | "dispatched" | "available" | "maintenance";
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  destination?: {
    lat: number;
    lng: number;
    address: string;
  };
  eta?: number;
  crew: {
    driver: string;
    paramedic: string;
    emt: string;
  };
  patient?: {
    name: string;
    condition: "critical" | "stable" | "minor";
    destination: string;
  };
  lastUpdate: string;
}

const AmbulanceDetection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentTime, setCurrentTime] = useState(new Date());

  const ambulances: AmbulanceUnit[] = [
    {
      id: "1",
      unitNumber: "AMB-001",
      status: "active",
      location: {
        lat: 40.7128,
        lng: -74.0060,
        address: "123 Main St, Downtown"
      },
      destination: {
        lat: 40.7580,
        lng: -73.9855,
        address: "City General Hospital, 456 Health Ave"
      },
      eta: 8,
      crew: {
        driver: "John Smith",
        paramedic: "Sarah Johnson",
        emt: "Mike Davis"
      },
      patient: {
        name: "Jane Doe",
        condition: "critical",
        destination: "City General Hospital"
      },
      lastUpdate: "2 mins ago"
    },
    {
      id: "2",
      unitNumber: "AMB-002",
      status: "dispatched",
      location: {
        lat: 40.7489,
        lng: -73.9680,
        address: "789 Emergency Rd"
      },
      destination: {
        lat: 40.7282,
        lng: -74.0776,
        address: "St. Mary's Medical, 321 Care Blvd"
      },
      eta: 12,
      crew: {
        driver: "Robert Brown",
        paramedic: "Lisa Wilson",
        emt: "Tom Martinez"
      },
      patient: {
        name: "John Smith",
        condition: "stable",
        destination: "St. Mary's Medical"
      },
      lastUpdate: "5 mins ago"
    },
    {
      id: "3",
      unitNumber: "AMB-003",
      status: "available",
      location: {
        lat: 40.7282,
        lng: -74.0776,
        address: "Central Station, 555 Base St"
      },
      crew: {
        driver: "David Lee",
        paramedic: "Emily Chen",
        emt: "Chris Taylor"
      },
      lastUpdate: "1 min ago"
    },
    {
      id: "4",
      unitNumber: "AMB-004",
      status: "maintenance",
      location: {
        lat: 40.7589,
        lng: -73.9851,
        address: "Maintenance Garage, 999 Service Rd"
      },
      crew: {
        driver: "James Wilson",
        paramedic: "Anna Garcia",
        emt: "Kevin White"
      },
      lastUpdate: "3 hours ago"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-100 border-green-500";
      case "dispatched": return "text-blue-600 bg-blue-100 border-blue-500";
      case "available": return "text-gray-600 bg-gray-100 border-gray-500";
      case "maintenance": return "text-orange-600 bg-orange-100 border-orange-500";
      default: return "text-gray-600 bg-gray-100 border-gray-500";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "critical": return "text-red-600 bg-red-100";
      case "stable": return "text-yellow-600 bg-yellow-100";
      case "minor": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const filteredAmbulances = ambulances.filter(ambulance => {
    const matchesSearch = ambulance.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ambulance.crew.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ambulance.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || ambulance.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["all", "active", "dispatched", "available", "maintenance"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Ambulance className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dynamic Ambulance Detection</h1>
                <p className="text-gray-600">Real-time tracking and optimization of ambulance fleet deployment</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">System Time</div>
              <div className="text-lg font-semibold">{currentTime.toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Units</p>
                  <p className="text-2xl font-bold text-green-600">1</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Dispatched</p>
                  <p className="text-2xl font-bold text-blue-600">1</p>
                </div>
                <Navigation className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-600">1</p>
                </div>
                <Zap className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Maintenance</p>
                  <p className="text-2xl font-bold text-orange-600">1</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
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
                  placeholder="Search by unit number, crew, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              {statuses.map(status => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>

            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Ambulance Fleet */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAmbulances.map((ambulance) => (
            <Card key={ambulance.id} className={`border-l-4 ${getStatusColor(ambulance.status).split(' ')[2]}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${getStatusColor(ambulance.status)} flex items-center justify-center`}>
                      <Ambulance className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{ambulance.unitNumber}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ambulance.status)}`}>
                        {ambulance.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Last Update</div>
                    <div className="text-sm font-medium">{ambulance.lastUpdate}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <MapPin className="w-4 h-4" />
                      Current Location
                    </div>
                    <div className="text-sm font-medium">{ambulance.location.address}</div>
                  </div>
                  
                  {ambulance.destination && (
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Navigation className="w-4 h-4" />
                        Destination
                      </div>
                      <div className="text-sm font-medium">{ambulance.destination.address}</div>
                      {ambulance.eta && (
                        <div className="text-sm text-blue-600">ETA: {ambulance.eta} mins</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Users className="w-4 h-4" />
                    Crew Members
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Driver:</span>
                      <div className="font-medium">{ambulance.crew.driver}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Paramedic:</span>
                      <div className="font-medium">{ambulance.crew.paramedic}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">EMT:</span>
                      <div className="font-medium">{ambulance.crew.emt}</div>
                    </div>
                  </div>
                </div>

                {ambulance.patient && (
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Users className="w-4 h-4" />
                          Patient Information
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Name:</span>
                          <span className="ml-2 font-medium">{ambulance.patient.name}</span>
                        </div>
                        <div className="text-sm mt-1">
                          <span className="text-gray-600">Condition:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(ambulance.patient.condition)}`}>
                            {ambulance.patient.condition.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                        <Button variant="default" size="sm">
                          Track
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {ambulance.status === "available" && (
                  <div className="border-t pt-4 mt-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="w-4 h-4 mr-2" />
                        Contact Crew
                      </Button>
                      <Button variant="default" size="sm" className="flex-1">
                        Dispatch Unit
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAmbulances.length === 0 && (
          <div className="text-center py-12">
            <Ambulance className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No ambulances found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmbulanceDetection;
