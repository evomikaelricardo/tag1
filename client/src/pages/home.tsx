import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Zap, Shield, Smartphone, Phone, Mail, Clock, ChevronDown, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { type Product } from '@shared/schema';
import Header from '@/components/header';
import ProductCard from '@/components/product-card';
import CartSidebar from '@/components/cart-sidebar';
import Footer from '@/components/footer';
import { apiRequest } from '@/lib/queryClient';
import { useState } from 'react';

export default function Home() {
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'General Question',
    message: '',
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const categories = [
    {
      id: 'kids',
      name: 'Kids Safety Tags',
      description: 'Colorful, fun designs for children with emergency contact info and medical details.',
      imageUrl: '/attached_assets/kids-safety-tags-v2_1757931875055.png',
      price: '24.99'
    },
    {
      id: 'pets',
      name: 'Pet Tags',
      description: 'Durable, waterproof tags for pets with owner contact and vet information.',
      imageUrl: '/attached_assets/pet-safety-tags_1757932812919.png',
      price: '19.99'
    },
    {
      id: 'luggage',
      name: 'Luggage Tags',
      description: 'Smart travel tags with contact info and return instructions for lost luggage.',
      imageUrl: '/attached_assets/luggage-safety-tags_1757931776551.png',
      price: '14.99'
    },
    {
      id: 'elderly',
      name: 'Senior Tags',
      description: 'Discreet tags for seniors with medical history and emergency contacts.',
      imageUrl: '/attached_assets/senior-safety-tags v2_1757934659937.png',
      price: '29.99'
    }
  ];

  const filteredProducts = selectedCategory 
    ? products?.filter(product => product.category === selectedCategory)
    : [];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('POST', '/api/contact', contactForm);
      toast({
        title: "Message sent successfully",
        description: "We'll get back to you within 24 hours.",
      });
      setContactForm({ name: '', email: '', subject: 'General Question', message: '' });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartSidebar />

      {/* Hero Section */}
      <section className="hero-gradient text-primary-foreground py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" data-testid="text-hero-title">
              Emergency Tags for <span className="text-yellow-300">Peace of Mind</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto" data-testid="text-hero-description">
              Instant access to vital information when it matters most. Our smart NFC tags help first responders and Good Samaritans assist your loved ones quickly and effectively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#products"
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
                data-testid="button-shop-now"
              >
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="#how-it-works"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                data-testid="button-learn-more"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="text-products-title">
              {selectedCategory ? `${categories.find(cat => cat.id === selectedCategory)?.name} Options` : 'Choose Your Protection'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-products-description">
              {selectedCategory 
                ? 'Select the contact method that works best for your needs.'
                : 'Our emergency NFC tags are designed for every member of your family and every important item you care about.'
              }
            </p>
          </div>

          {selectedCategory && (
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => setSelectedCategory(null)}
                className="inline-flex items-center"
                data-testid="button-back-to-categories"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : selectedCategory ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="products-grid">
              {filteredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="categories-grid">
              {categories.map((category) => (
                <Card 
                  key={category.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedCategory(category.id)}
                  data-testid={`card-category-${category.id}`}
                >
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-48 object-cover"
                    data-testid={`img-category-${category.id}`}
                  />
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2" data-testid={`text-category-name-${category.id}`}>
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4" data-testid={`text-category-description-${category.id}`}>
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary" data-testid={`text-category-price-${category.id}`}>
                        From ${category.price}
                      </span>
                      <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        data-testid={`button-view-options-${category.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory(category.id);
                        }}
                      >
                        Select
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center" data-testid="feature-instant-access">
              <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Access</h3>
              <p className="text-muted-foreground">One tap reveals critical information instantly - no apps required</p>
            </div>
            <div className="text-center" data-testid="feature-secure">
              <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">Your data is encrypted and only accessible when needed most</p>
            </div>
            <div className="text-center" data-testid="feature-compatible">
              <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full mx-auto mb-4 flex items-center justify-center">
                <Smartphone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Universal Compatibility</h3>
              <p className="text-muted-foreground">Works with any NFC-enabled smartphone - iOS and Android</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="text-how-it-works-title">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-how-it-works-description">
              Our NFC emergency tags provide instant access to vital information when every second counts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center" data-testid="step-1">
              <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Tap to Access</h3>
              <p className="text-muted-foreground">
                Simply tap any NFC-enabled smartphone to the tag - no app download required
              </p>
            </div>
            <div className="text-center" data-testid="step-2">
              <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">View Information</h3>
              <p className="text-muted-foreground">
                Emergency contacts, medical info, and care instructions appear instantly on screen
              </p>
            </div>
            <div className="text-center" data-testid="step-3">
              <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Take Action</h3>
              <p className="text-muted-foreground">
                First responders can quickly contact family and provide appropriate care
              </p>
            </div>
          </div>

          <Card className="p-8 text-center">
            <img
              src="https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=600"
              alt="NFC tag demonstration"
              className="w-full max-w-2xl mx-auto rounded-lg mb-4"
              data-testid="img-nfc-demo"
            />
            <p className="text-muted-foreground">
              Watch how easy it is to access emergency information with just a tap
            </p>
          </Card>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="text-support-title">
              Support & FAQ
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-support-description">
              Get answers to common questions about our emergency NFC tags and how to use them effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h3>
              <Accordion type="single" collapsible className="space-y-4" data-testid="faq-accordion">
                <AccordionItem value="item-1" className="bg-card border border-border rounded-lg p-4">
                  <AccordionTrigger className="text-left">
                    How do NFC tags work?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    NFC (Near Field Communication) tags store digital information that can be accessed by tapping any NFC-enabled smartphone. No app installation required - the information appears directly in the phone's browser.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="bg-card border border-border rounded-lg p-4">
                  <AccordionTrigger className="text-left">
                    What information can be stored?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    You can store emergency contacts, medical conditions, allergies, medications, care instructions, and any other vital information first responders might need.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="bg-card border border-border rounded-lg p-4">
                  <AccordionTrigger className="text-left">
                    Are the tags waterproof?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes, all our NFC tags are IP67 rated, making them waterproof and suitable for outdoor activities, swimming, and daily wear.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="bg-card border border-border rounded-lg p-4">
                  <AccordionTrigger className="text-left">
                    How do I update the information?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Each tag comes with a unique QR code that allows you to securely update the stored information anytime through our web portal.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6">Contact Support</h3>
              <Card className="p-6">
                <form onSubmit={handleContactSubmit} className="space-y-4" data-testid="contact-form">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      data-testid="input-email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={contactForm.subject} onValueChange={(value) => setContactForm(prev => ({ ...prev, subject: value }))}>
                      <SelectTrigger data-testid="select-subject">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General Question">General Question</SelectItem>
                        <SelectItem value="Technical Support">Technical Support</SelectItem>
                        <SelectItem value="Order Issue">Order Issue</SelectItem>
                        <SelectItem value="Product Information">Product Information</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      placeholder="How can we help you?"
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      required
                      data-testid="textarea-message"
                    />
                  </div>
                  <Button type="submit" className="w-full" data-testid="button-send-message">
                    Send Message
                  </Button>
                </form>
              </Card>

              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-3 text-muted-foreground" data-testid="contact-phone">
                  <Phone className="w-5 h-5" />
                  <span>1-800-SAFETAG (1-800-723-3824)</span>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground" data-testid="contact-email">
                  <Mail className="w-5 h-5" />
                  <span>support@safetagpro.com</span>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground" data-testid="contact-hours">
                  <Clock className="w-5 h-5" />
                  <span>Mon-Fri 9AM-6PM EST</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
