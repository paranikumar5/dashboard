import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// --- Mock Data for Demo ---
const MOCK_PRODUCTS = [
  { _id: "1", name: "Premium Wireless Headphones", price: 299, category: "Electronics", description: "High-quality sound with noise cancellation.", stock: 50, image: "https://picsum.photos/seed/headphones/400/400" },
  { _id: "2", name: "Smart Watch Series 5", price: 399, category: "Electronics", description: "Track your health and fitness.", stock: 30, image: "https://picsum.photos/seed/watch/400/400" },
  { _id: "3", name: "Mechanical Keyboard", price: 150, category: "Accessories", description: "Tactile feedback for better typing.", stock: 100, image: "https://picsum.photos/seed/keyboard/400/400" },
  { _id: "4", name: "Ergonomic Mouse", price: 80, category: "Accessories", description: "Comfortable grip for long hours.", stock: 80, image: "https://picsum.photos/seed/mouse/400/400" },
  { _id: "5", name: "4K Monitor 27\"", price: 450, category: "Electronics", description: "Crystal clear display for work and play.", stock: 20, image: "https://picsum.photos/seed/monitor/400/400" },
  { _id: "6", name: "USB-C Hub", price: 60, category: "Accessories", description: "Expand your connectivity.", stock: 150, image: "https://picsum.photos/seed/hub/400/400" },
];

let MOCK_ORDERS: any[] = [
  {
    _id: "o1",
    customerName: "Demo User",
    customerEmail: "user@example.com",
    products: [{ productId: "1", name: "Premium Wireless Headphones", quantity: 1, price: 299 }],
    totalAmount: 299,
    status: "Completed",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: "o2",
    customerName: "Admin User",
    customerEmail: "admin@example.com",
    products: [{ productId: "2", name: "Smart Watch Series 5", quantity: 1, price: 399 }],
    totalAmount: 399,
    status: "Pending",
    createdAt: new Date().toISOString()
  }
];

// --- API Routes ---

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    database: "mocked",
    timestamp: new Date().toISOString()
  });
});

// Auth - Mocked
app.post("/api/auth/signup", (req, res) => {
  res.status(201).json({ message: "User created (mocked)" });
});

app.post("/api/auth/login", (req, res) => {
  const { email } = req.body;
  const mockUser = { 
    id: "mock-id", 
    name: email.split("@")[0], 
    email, 
    role: email.includes("admin") ? "admin" : "customer" 
  };
  res.json({ token: "mock-token", user: mockUser });
});

// Products - Mocked
app.get("/api/products", (req, res) => {
  res.json(MOCK_PRODUCTS);
});

// Orders - Mocked
app.get("/api/orders", (req, res) => {
  res.json(MOCK_ORDERS);
});

app.post("/api/orders", (req, res) => {
  const { products, totalAmount } = req.body;
  const newOrder = {
    _id: Math.random().toString(36).substr(2, 9),
    customerName: "Demo User",
    customerEmail: "user@example.com",
    products,
    totalAmount,
    status: "Pending",
    createdAt: new Date().toISOString()
  };
  MOCK_ORDERS.unshift(newOrder);
  res.status(201).json(newOrder);
});

// Dashboard Analytics - Mocked
app.get("/api/dashboard/analytics", (req, res) => {
  const totalOrders = MOCK_ORDERS.length;
  const totalRevenue = MOCK_ORDERS.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalCustomers = 12;
  const totalSoldQuantity = MOCK_ORDERS.reduce((acc, curr) => acc + curr.products.reduce((pAcc: number, p: any) => pAcc + p.quantity, 0), 0);

  res.json({
    kpis: {
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalSoldQuantity
    },
    charts: {
      monthlyRevenue: [
        { month: "2024-01", amount: 1200 },
        { month: "2024-02", amount: 1900 },
        { month: "2024-03", amount: totalRevenue }
      ],
      statusDistribution: [
        { name: "Pending", value: MOCK_ORDERS.filter(o => o.status === "Pending").length },
        { name: "Completed", value: MOCK_ORDERS.filter(o => o.status === "Completed").length },
        { name: "Cancelled", value: MOCK_ORDERS.filter(o => o.status === "Cancelled").length }
      ]
    },
    recentOrders: MOCK_ORDERS.slice(0, 10)
  });
});

// Dashboard Config - Mocked
app.get("/api/dashboard/config", (req, res) => {
  res.json({
    widgets: [
      { id: "kpi-1", type: "kpi", title: "Total Orders", x: 0, y: 0, w: 3, h: 2, config: { dataSource: "totalOrders", icon: "ShoppingCart" } },
      { id: "kpi-2", type: "kpi", title: "Total Revenue", x: 3, y: 0, w: 3, h: 2, config: { dataSource: "totalRevenue", icon: "DollarSign" } },
      { id: "kpi-3", type: "kpi", title: "Total Customers", x: 6, y: 0, w: 3, h: 2, config: { dataSource: "totalCustomers", icon: "Users" } },
      { id: "kpi-4", type: "kpi", title: "Total Sold", x: 9, y: 0, w: 3, h: 2, config: { dataSource: "totalSoldQuantity", icon: "Package" } },
      { id: "chart-1", type: "bar", title: "Monthly Revenue", x: 0, y: 2, w: 6, h: 4, config: { dataSource: "monthlyRevenue", xAxis: "month", yAxis: "amount" } },
      { id: "chart-2", type: "pie", title: "Order Status", x: 6, y: 2, w: 6, h: 4, config: { dataSource: "statusDistribution", xAxis: "name", yAxis: "value" } },
      { id: "table-1", type: "table", title: "Recent Orders", x: 0, y: 6, w: 12, h: 6, config: { dataSource: "recentOrders" } }
    ]
  });
});

app.post("/api/dashboard/config", (req, res) => {
  res.json({ status: "success" });
});

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});

// --- Server Start ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("🛠️ Starting Vite in middleware mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server started successfully on http://0.0.0.0:${PORT}`);
    console.log("📡 API Routes loaded (Mocked Mode)");
  });
}

startServer();
