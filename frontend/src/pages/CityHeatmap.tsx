import { useHospitalOccupancy } from '@/hooks/useHospitalOccupancy'
import { useEffect } from 'react'

import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import OutbreakMap from "@/components/OutbreakMap";
import { 
  Map, 
  Layers,
  RefreshCw,
  AlertTriangle,
  Building2,
  Users,
  Bed,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

const CityHeatmap = () => {
  // 👇 ADD THESE LINES HERE
  const { data, loading, refresh } = useHospitalOccupancy()

  useEffect(() => {
    if (!loading) {
      console.log('Hospital occupancy data:', data)
    }
  }, [loading, data])
  // 👆 ADD THESE LINES HERE
  return (
    
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">City Health Heatmap</h1>
            <p className="text-muted-foreground">Real-time city-wide healthcare load visualization</p>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <Button variant="outline" size="sm">
              <Layers className="w-4 h-4 mr-2" />
              Toggle Layers
            </Button>
            <Button variant="hero" size="sm" onClick={refresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Real Heatmap */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
              <h2 className="font-display font-semibold">Live Hospital Heatmap</h2>
              <p className="text-sm text-muted-foreground mt-1">Real-time bed occupancy intensity across Mumbai</p>
            </div>
            <OutbreakMap hospitalData={data} loading={loading} />
          </div>

          {/* Real-time Stats */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Live Statistics
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-blue-500 mb-2">50</div>
                <div className="text-sm text-muted-foreground">Hospitals Connected</div>
                <div className="text-xs text-muted-foreground mt-1">Real-time data from MongoDB Atlas</div>
              </div>
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-green-500 mb-2">98.3%</div>
                <div className="text-sm text-muted-foreground">Average Bed Occupancy</div>
                <div className="text-xs text-muted-foreground mt-1">High load areas detected</div>
              </div>
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-orange-500 mb-2">6</div>
                <div className="text-sm text-muted-foreground">Critical Zones</div>
                <div className="text-xs text-muted-foreground mt-1">Require immediate attention</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default CityHeatmap;
