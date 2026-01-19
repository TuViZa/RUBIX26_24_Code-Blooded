import React, { useState, useEffect } from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package, Clock, TrendingDown } from 'lucide-react';
import io from 'socket.io-client';

const InventoryTest = () => {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Connect to socket for real-time alerts
    const socket = io('http://localhost:5000');
    
    socket.on('inventory_alert', (alert) => {
      setAlerts(prev => [...prev, { ...alert, type: 'expiry', timestamp: new Date() }]);
      console.log('🚨 Expiry Alert:', alert);
    });
    
    socket.on('low_stock_alert', (alert) => {
      setAlerts(prev => [...prev, { ...alert, type: 'low_stock', timestamp: new Date() }]);
      console.log('⚠️ Low Stock Alert:', alert);
    });

    return () => socket.disconnect();
  }, []);

  const fetchInventory = async (hospitalIndex) => {
    setLoading(true);
    try {
      // Get hospital data first
      const heatmapResponse = await fetch('http://localhost:5000/api/hospital/heatmap-data');
      const hospitals = await heatmapResponse.json();
      
      // For demo, we'll show mock inventory since we need actual MongoDB IDs
      const mockInventory = [
        {
          name: 'Paracetamol',
          stock: 500,
          unit: 'tablets',
          expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'Medicine'
        },
        {
          name: 'Oxygen Tanks',
          stock: 20,
          unit: 'cylinders',
          expiryDate: null,
          category: 'Equipment'
        },
        {
          name: 'Vaccines',
          stock: 100,
          unit: 'doses',
          expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'Medicine'
        }
      ];
      
      setInventory(mockInventory);
      setSelectedHospital(`Hospital #${hospitalIndex + 1}`);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitals = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/hospital/heatmap-data');
      const data = await response.json();
      setHospitals(data);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const getStockStatus = (stock) => {
    if (stock < 10) return { color: 'bg-red-500', text: 'Critical', icon: AlertTriangle };
    if (stock < 50) return { color: 'bg-yellow-500', text: 'Low', icon: TrendingDown };
    return { color: 'bg-green-500', text: 'Good', icon: Package };
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { color: 'bg-gray-500', text: 'N/A' };
    const daysUntilExpiry = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry <= 7) return { color: 'bg-red-500', text: `${daysUntilExpiry} days`, icon: AlertTriangle };
    if (daysUntilExpiry <= 30) return { color: 'bg-yellow-500', text: `${daysUntilExpiry} days`, icon: Clock };
    return { color: 'bg-green-500', text: 'OK', icon: Package };
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Inventory Tracking System</h1>
          <p className="text-muted-foreground">Real-time hospital inventory monitoring with alerts</p>
        </div>

        {/* Real-time Alerts */}
        {alerts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">🚨 Real-time Alerts</h2>
            <div className="space-y-2">
              {alerts.slice(-5).map((alert, index) => (
                <div key={index} className="p-4 rounded-lg border border-red-200 bg-red-50">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="font-medium">{alert.hospitalName}</span>
                    <Badge variant={alert.type === 'expiry' ? 'destructive' : 'secondary'}>
                      {alert.type === 'expiry' ? 'Expiring' : 'Low Stock'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {alert.itemName}: {alert.type === 'expiry' 
                      ? `Expires in ${alert.daysUntilExpiry} days`
                      : `Only ${alert.stock} ${alert.unit} remaining`
                    }
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Hospital List */}
          <Card>
            <CardHeader>
              <CardTitle>Select Hospital</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {hospitals.map((hospital, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => fetchInventory(index)}
                  >
                    Hospital #{index + 1}
                    <span className="ml-auto text-xs text-gray-500">
                      Lat: {hospital.lat.toFixed(3)}, Lng: {hospital.lng.toFixed(3)}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inventory Details */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Details</CardTitle>
              {selectedHospital && (
                <p className="text-sm text-muted-foreground">{selectedHospital}</p>
              )}
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p>Loading inventory...</p>
                </div>
              ) : inventory.length > 0 ? (
                <div className="space-y-4">
                  {inventory.map((item, index) => {
                    const stockStatus = getStockStatus(item.stock);
                    const expiryStatus = getExpiryStatus(item.expiryDate);
                    const StockIcon = stockStatus.icon;
                    const ExpiryIcon = expiryStatus.icon;
                    
                    return (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{item.name}</h3>
                          <Badge variant="outline">{item.category}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <StockIcon className="w-4 h-4" />
                            <span className="text-sm">Stock: {item.stock} {item.unit}</span>
                            <div className={`w-2 h-2 rounded-full ${stockStatus.color}`}></div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <ExpiryIcon className="w-4 h-4" />
                            <span className="text-sm">Expires: {expiryStatus.text}</span>
                            <div className={`w-2 h-2 rounded-full ${expiryStatus.color}`}></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Select a hospital to view inventory</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{hospitals.length}</div>
                <div className="text-sm text-muted-foreground">Hospitals Connected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">3</div>
                <div className="text-sm text-muted-foreground">Items per Hospital</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{alerts.length}</div>
                <div className="text-sm text-muted-foreground">Active Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default InventoryTest;
