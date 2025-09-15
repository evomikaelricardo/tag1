import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertOrderSchema, insertContactSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching products: " + error.message });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching product: " + error.message });
    }
  });

  // Get products by category
  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const products = await storage.getProductsByCategory(req.params.category);
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching products: " + error.message });
    }
  });

  // Create order
  app.post("/api/create-order", async (req, res) => {
    try {
      const orderData = req.body;
      
      // Validate order data
      const validatedOrder = insertOrderSchema.parse(orderData);
      
      // Create order in storage
      const order = await storage.createOrder(validatedOrder);

      res.json({ 
        orderId: order.id,
        order: order
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Validation error: " + error.message });
      }
      console.error("Order creation error:", error);
      res.status(500).json({ message: "Error creating order: " + error.message });
    }
  });

  // Confirm order (for payment methods like cash on delivery, this marks order as confirmed)
  app.post("/api/confirm-order", async (req, res) => {
    try {
      // Validate request body
      const confirmOrderSchema = z.object({
        orderId: z.string().uuid("Invalid order ID format")
      });
      
      const { orderId } = confirmOrderSchema.parse(req.body);
      
      // Get the order to check if it exists
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      
      // Validate payment method is one of the allowed options
      const allowedMethods = ["cash_on_delivery", "credit_card", "bank_transfer"];
      if (!allowedMethods.includes(order.paymentMethod)) {
        return res.status(400).json({ success: false, message: "Invalid payment method" });
      }
      
      // Update order status based on payment method
      let newStatus = "confirmed";
      if (order.paymentMethod === "cash_on_delivery") {
        newStatus = "confirmed";
      } else if (order.paymentMethod === "credit_card" || order.paymentMethod === "bank_transfer") {
        newStatus = "awaiting_payment";
      }
      
      await storage.updateOrderStatus(orderId, newStatus);
      res.json({ success: true, message: "Order confirmed", status: newStatus });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Validation error: " + error.message });
      }
      res.status(500).json({ message: "Error confirming order: " + error.message });
    }
  });

  // Get order
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching order: " + error.message });
    }
  });

  // Create contact submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedContact = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedContact);
      res.json(contact);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating contact: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
