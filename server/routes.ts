import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { z } from "zod";
import { storage } from "./storage";
import { insertOrderSchema, insertContactSchema } from "@shared/schema";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

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

  // Create payment intent
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, orderData } = req.body;
      
      // Validate order data
      const validatedOrder = insertOrderSchema.parse(orderData);
      
      // Create order in storage
      const order = await storage.createOrder(validatedOrder);
      
      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          orderId: order.id,
        },
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        orderId: order.id 
      });
    } catch (error: any) {
      console.error("Payment intent creation error:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Confirm payment and update order
  app.post("/api/confirm-payment", async (req, res) => {
    try {
      const { paymentIntentId, orderId } = req.body;
      
      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === "succeeded") {
        // Update order status
        await storage.updateOrderStatus(orderId, "paid", paymentIntentId);
        res.json({ success: true, message: "Payment confirmed" });
      } else {
        res.status(400).json({ success: false, message: "Payment not successful" });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error confirming payment: " + error.message });
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
