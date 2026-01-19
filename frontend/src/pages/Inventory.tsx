import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { 
  Package, 
  AlertTriangle, 
  TrendingDown,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const inventoryItems = [
  { name: "Paracetamol 500mg", category: "Medicine", stock: 150, minStock: 500, unit: "tablets", trend: "down", usage: 45 },
  { name: "Surgical Gloves (L)", category: "Consumable", stock: 2500, minStock: 1000, unit: "pairs", trend: "stable", usage: 120 },
  { name: "IV Saline 500ml", category: "Medicine", stock: 80, minStock: 200, unit: "bottles", trend: "down", usage: 25 },
  { name: "Syringes 5ml", category: "Consumable", stock: 3200, minStock: 2000, unit: "pieces", trend: "up", usage: 180 },
  { name: "Bandage Rolls", category: "Consumable", stock: 450, minStock: 300, unit: "rolls", trend: "stable", usage: 35 },
  { name: "Oxygen Cylinders", category: "Equipment", stock: 12, minStock: 20, unit: "cylinders", trend: "down", usage: 3 },
  { name: "Antibiotics (Amoxicillin)", category: "Medicine", stock: 200, minStock: 400, unit: "strips", trend: "down", usage: 28 },
  { name: "Cotton Wool 500g", category: "Consumable", stock: 180, minStock: 100, unit: "packs", trend: "stable", usage: 15 },
];

const lowStockAlerts = inventoryItems.filter(item => item.stock < item.minStock);

const Inventory = () => {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Inventory Tracking</h1>
            <p className="text-muted-foreground">Medicine and consumable usage monitoring</p>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="hero" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Stock
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Items"
            value={inventoryItems.length}
            icon={Package}
            variant="primary"
          />
          <StatCard
            title="Low Stock Alerts"
            value={lowStockAlerts.length}
            icon={AlertTriangle}
            variant="critical"
          />
          <StatCard
            title="Items Used Today"
            value={456}
            icon={TrendingDown}
            variant="accent"
          />
          <StatCard
            title="Pending Orders"
            value={3}
            icon={Package}
            variant="warning"
          />
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Low Stock Alerts */}
          <div className="lg:col-span-1">
            <div className="bg-critical/5 rounded-2xl border border-critical/20 p-4 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-critical" />
                <h3 className="font-semibold text-critical">Low Stock Alerts</h3>
              </div>
              <div className="space-y-3">
                {lowStockAlerts.map((item) => (
                  <div key={item.name} className="p-3 rounded-xl bg-card border border-border">
                    <div className="font-medium text-sm mb-1">{item.name}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-critical font-medium">
                        {item.stock} / {item.minStock} {item.unit}
                      </span>
                      <Button variant="outline" size="sm" className="h-6 text-xs">
                        Reorder
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="lg:col-span-3 bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-semibold">All Inventory</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search items..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Item</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Current Stock</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Min Required</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Daily Usage</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryItems.map((item) => {
                    const isLow = item.stock < item.minStock;
                    const stockPercent = (item.stock / item.minStock) * 100;
                    
                    return (
                      <tr key={item.name} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-medium">{item.name}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full bg-muted text-xs">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-medium",
                              isLow ? "text-critical" : "text-foreground"
                            )}>
                              {item.stock}
                            </span>
                            <span className="text-sm text-muted-foreground">{item.unit}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {item.minStock} {item.unit}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <span>{item.usage}</span>
                            {item.trend === "up" ? (
                              <ArrowUpRight className="w-4 h-4 text-critical" />
                            ) : item.trend === "down" ? (
                              <ArrowDownRight className="w-4 h-4 text-success" />
                            ) : null}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge 
                            status={isLow ? "critical" : stockPercent < 150 ? "warning" : "normal"}
                            label={isLow ? "Low" : stockPercent < 150 ? "Moderate" : "Good"}
                            size="sm"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Inventory;
