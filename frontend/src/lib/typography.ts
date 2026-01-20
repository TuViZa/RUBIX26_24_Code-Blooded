// src/lib/typography.ts

export const typographyClasses = {
  // Page headers
  pageHeader: "font-sans text-4xl font-bold tracking-tight text-foreground",
  sectionHeader: "text-lg font-semibold text-slate-900",
  cardHeader: "text-lg font-semibold text-slate-800",
  
  // Descriptions and small text
  description: "text-sm text-slate-500",
  small: "text-sm text-slate-400",
  metricLabel: "text-sm text-slate-500 font-medium",
  
  // Tables
  tableHeader: "text-left py-3 px-4 text-sm font-semibold text-slate-600 bg-slate-50/50",
  
  // Compact variants
  compact: {
    page: "p-6",
    card: "p-4",
  }
};

export const colorClasses = {
  card: {
    bg: "bg-white",
    border: "border-slate-200",
    text: "text-slate-900",
  },
  status: {
    critical: "text-red-600 bg-red-50 border-red-100",
    warning: "text-orange-600 bg-orange-50 border-orange-100",
    success: "text-green-600 bg-green-50 border-green-100",
    info: "text-blue-600 bg-blue-50 border-blue-100",
  }
};