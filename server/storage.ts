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
      // Kids Safety Tags - 3 variants
      {
        id: "kids-tag-phone",
        name: "Kids Safety Tags - Phone Call",
        description: "Colorful, fun designs for children with emergency contact info. When scanned, automatically initiates a phone call to parents. Includes fun stickers and child-friendly designs that kids will want to wear.",
        price: "24.99",
        category: "kids",
        imageUrl: "/attached_assets/kids-safety-tags-v2_1757931875055.png",
        features: ["Waterproof IP67 rating", "Fun colorful designs", "Instant phone call to parents", "Emergency contact storage", "Medical condition alerts"],
        isPopular: 1,
      },
      {
        id: "kids-tag-whatsapp",
        name: "Kids Safety Tags - WhatsApp Call",
        description: "Colorful, fun designs for children with emergency contact info. When scanned, automatically opens WhatsApp to call parents. Includes fun stickers and child-friendly designs that kids will want to wear.",
        price: "24.99",
        category: "kids",
        imageUrl: "/attached_assets/kids-safety-tags-v2_1757931875055.png",
        features: ["Waterproof IP67 rating", "Fun colorful designs", "Instant WhatsApp call to parents", "Emergency contact storage", "Medical condition alerts"],
        isPopular: 0,
      },
      {
        id: "kids-tag-emergency",
        name: "Kids Safety Tags - Emergency Info",
        description: "Colorful, fun designs for children with emergency contact info. When scanned, displays comprehensive emergency contact information and medical details. Includes fun stickers and child-friendly designs that kids will want to wear.",
        price: "24.99",
        category: "kids",
        imageUrl: "/attached_assets/kids-safety-tags-v2_1757931875055.png",
        features: ["Waterproof IP67 rating", "Fun colorful designs", "Complete emergency contact display", "Medical information access", "Parent contact details"],
        isPopular: 0,
      },
      
      // Pet Tags - 3 variants
      {
        id: "pet-tag-phone",
        name: "Pet Tags - Phone Call",
        description: "Durable, waterproof tags for pets with owner contact. When scanned, automatically initiates a phone call to the owner. Perfect for dogs, cats, and other beloved pets.",
        price: "19.99",
        category: "pets",
        imageUrl: "/attached_assets/pet-safety-tags_1757932812919.png",
        features: ["Ultra-durable construction", "Waterproof and weatherproof", "Instant phone call to owner", "Vet contact information", "GPS location sharing"],
        isPopular: 0,
      },
      {
        id: "pet-tag-whatsapp",
        name: "Pet Tags - WhatsApp Call",
        description: "Durable, waterproof tags for pets with owner contact. When scanned, automatically opens WhatsApp to call the owner. Perfect for dogs, cats, and other beloved pets.",
        price: "19.99",
        category: "pets",
        imageUrl: "/attached_assets/pet-safety-tags_1757932812919.png",
        features: ["Ultra-durable construction", "Waterproof and weatherproof", "Instant WhatsApp call to owner", "Vet contact information", "Medical needs storage"],
        isPopular: 0,
      },
      {
        id: "pet-tag-emergency",
        name: "Pet Tags - Emergency Info",
        description: "Durable, waterproof tags for pets with owner contact. When scanned, displays comprehensive pet information including medical needs, vet details, and owner contact information.",
        price: "19.99",
        category: "pets",
        imageUrl: "/attached_assets/pet-safety-tags_1757932812919.png",
        features: ["Ultra-durable construction", "Waterproof and weatherproof", "Complete pet information display", "Medical needs storage", "Vet contact information"],
        isPopular: 0,
      },
      
      // Luggage Tags - 3 variants
      {
        id: "luggage-tag-phone",
        name: "Luggage Tags - Phone Call",
        description: "Smart travel tags with contact info. When scanned, automatically initiates a phone call to the owner for quick luggage return. Never lose your bags again with instant contact.",
        price: "14.99",
        category: "luggage",
        imageUrl: "/attached_assets/luggage-safety-tags_1757931776551.png",
        features: ["Secure attachment system", "Travel-ready design", "Instant phone call to owner", "Destination details", "Return instructions"],
        isPopular: 0,
      },
      {
        id: "luggage-tag-whatsapp",
        name: "Luggage Tags - WhatsApp Call",
        description: "Smart travel tags with contact info. When scanned, automatically opens WhatsApp to contact the owner for quick luggage return. Never lose your bags again with instant messaging.",
        price: "14.99",
        category: "luggage",
        imageUrl: "/attached_assets/luggage-safety-tags_1757931776551.png",
        features: ["Secure attachment system", "Travel-ready design", "Instant WhatsApp contact", "Destination details", "Return instructions"],
        isPopular: 0,
      },
      {
        id: "luggage-tag-emergency",
        name: "Luggage Tags - Emergency Info",
        description: "Smart travel tags with contact info. When scanned, displays comprehensive contact information, destination details, and return instructions for efficient luggage recovery.",
        price: "14.99",
        category: "luggage",
        imageUrl: "/attached_assets/luggage-safety-tags_1757931776551.png",
        features: ["Secure attachment system", "Travel-ready design", "Complete contact information display", "Destination details", "Return instructions"],
        isPopular: 0,
      },
      
      // Senior Tags - 3 variants
      {
        id: "senior-tag-phone",
        name: "Senior Tags - Phone Call",
        description: "Discreet tags for seniors with medical history and emergency contacts. When scanned, automatically initiates a phone call to emergency contacts. Designed for dignity and peace of mind.",
        price: "29.99",
        category: "elderly",
        imageUrl: "/attached_assets/senior-safety-tags v2_1757934659937.png",
        features: ["Discreet, elegant design", "Instant phone call to emergency contacts", "Complete medical history", "Medication information", "Care instructions"],
        isPopular: 0,
      },
      {
        id: "senior-tag-whatsapp",
        name: "Senior Tags - WhatsApp Call",
        description: "Discreet tags for seniors with medical history and emergency contacts. When scanned, automatically opens WhatsApp to contact family or caregivers. Designed for dignity and peace of mind.",
        price: "29.99",
        category: "elderly",
        imageUrl: "/attached_assets/senior-safety-tags v2_1757934659937.png",
        features: ["Discreet, elegant design", "Instant WhatsApp call to family", "Complete medical history", "Medication information", "Care instructions"],
        isPopular: 0,
      },
      {
        id: "senior-tag-emergency",
        name: "Senior Tags - Emergency Info",
        description: "Discreet tags for seniors with medical history and emergency contacts. When scanned, displays comprehensive medical information, medication details, and emergency contact information.",
        price: "29.99",
        category: "elderly",
        imageUrl: "/attached_assets/senior-safety-tags v2_1757934659937.png",
        features: ["Discreet, elegant design", "Complete medical information display", "Medication information", "Emergency contacts", "Care instructions"],
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
