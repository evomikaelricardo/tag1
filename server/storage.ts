import { type Product, type InsertProduct, type Order, type InsertOrder, type Contact, type InsertContact } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  
  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private contacts: Map<string, Contact>;

  constructor() {
    this.products = new Map();
    this.orders = new Map();
    this.contacts = new Map();
    
    // Initialize with product data
    this.initializeProducts();
  }

  private initializeProducts() {
    const initialProducts: Product[] = [
      {
        id: "kids-tag",
        name: "Kids Safety Tags",
        description: "Colorful, fun designs for children with emergency contact info, medical conditions, and parent details. Includes fun stickers and child-friendly designs that kids will want to wear.",
        price: "24.99",
        category: "kids",
        imageUrl: "/attached_assets/kids-safety-tags-v2_1757931875055.png",
        features: ["Waterproof IP67 rating", "Fun colorful designs", "Easy setup for parents", "Emergency contact storage", "Medical condition alerts"],
        isPopular: 1,
      },
      {
        id: "pet-tag",
        name: "Pet Tags",
        description: "Durable, waterproof tags for pets with owner contact, vet info, medical needs, and GPS location sharing. Perfect for dogs, cats, and other beloved pets.",
        price: "19.99",
        category: "pets",
        imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        features: ["Ultra-durable construction", "Waterproof and weatherproof", "Vet contact information", "Medical needs storage", "GPS location sharing"],
        isPopular: 0,
      },
      {
        id: "luggage-tag",
        name: "Luggage Tags",
        description: "Smart travel tags with contact info, destination details, and return instructions for lost luggage. Never lose your bags again with instant contact information.",
        price: "14.99",
        category: "luggage",
        imageUrl: "/attached_assets/luggage-safety-tags_1757931776551.png",
        features: ["Secure attachment system", "Travel-ready design", "Contact information storage", "Destination details", "Return instructions"],
        isPopular: 0,
      },
      {
        id: "senior-tag",
        name: "Senior Tags",
        description: "Discreet tags for seniors with medical history, medications, emergency contacts, and care instructions. Designed for dignity and peace of mind.",
        price: "29.99",
        category: "elderly",
        imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        features: ["Discreet, elegant design", "Complete medical history", "Medication information", "Emergency contacts", "Care instructions"],
        isPopular: 0,
      },
    ];

    initialProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.category === category);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      status: insertOrder.status || "pending",
      paymentMethod: insertOrder.paymentMethod || "cash_on_delivery",
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      const updatedOrder = { ...order, status };
      this.orders.set(id, updatedOrder);
      return updatedOrder;
    }
    return undefined;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      ...insertContact,
      id,
      createdAt: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }
}

export const storage = new MemStorage();
