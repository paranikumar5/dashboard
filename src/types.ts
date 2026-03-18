export type WidgetType = 'bar' | 'line' | 'pie' | 'area' | 'table' | 'kpi';

export interface WidgetConfig {
  dataSource: string;
  aggregation?: 'sum' | 'average' | 'count';
  xAxis?: string;
  yAxis?: string;
  groupBy?: string;
  showLegend?: boolean;
  columns?: string[];
  pageSize?: number;
  icon?: string;
  color?: string;
  filter?: {
    field: string;
    value: any;
  };
}

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  config: WidgetConfig;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  stock: number;
  image: string;
}

export interface Order {
  _id: string;
  customerName: string;
  customerEmail: string;
  products: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}
