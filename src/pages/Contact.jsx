import React, { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";
import { Footer } from "../pages/Index";
import { useToast } from "../hooks/use-toast";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const formRef = useRef();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // EmailJS Config
  const emailJsServiceID = "service_ze926ld";
  const templateIDToCustomer = "template_od8r6i9";
  const templateIDToCompany = "template_fj1lc4l";
  const emailJsPublicKey = "FhHt8CgcP4bW9u7PF";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = formRef.current;
    const formData = {
      name: form.name.value,
      email: form.email.value,
      whatsapp: form.whatsapp.value,
      message: form.message.value,
    };

    try {
      // Send email to customer
      await emailjs.send(
        emailJsServiceID,
        templateIDToCustomer,
        formData,
        emailJsPublicKey
      );

      // Send email to company
      await emailjs.send(
        emailJsServiceID,
        templateIDToCompany,
        formData,
        emailJsPublicKey
      );

      toast({
        title: "✅ Message Sent",
        description: "We will get back to you soon!",
        duration: 2000,
      });
      form.reset();
    } catch (error) {
      console.error("EmailJS error:", error);
      toast({
        title: "❌ Failed",
        description: "Could not send the message.",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <Navbar />

      <main className="flex-grow py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-primary font-poppins">
            📞 Get in Touch
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Contact Form */}
            <Card className="p-10 glass shadow-xl flex flex-col justify-between h-full">
              <h2 className="text-2xl font-semibold mb-6 text-primary font-poppins flex items-center gap-2">
                <MessageSquare className="w-6 h-6" /> Send Us a Message
              </h2>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="bg-background/80"
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="bg-background/80"
                />
                <Input
                  type="text"
                  name="whatsapp"
                  placeholder="Your WhatsApp Number"
                  required
                  className="bg-background/80"
                />
                <Textarea
                  name="message"
                  placeholder="Your Message"
                  rows={5}
                  required
                  className="bg-background/80"
                />

                <Button
                  type="submit"
                  className="w-full bg-primary text-white hover:bg-primary/90 transition-all"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Submit Message"}
                </Button>
              </form>
            </Card>

            {/* Contact Info & Map */}
            <div className="space-y-8">
              <Card className="w-100 h-50 p-8 glass border-white/10 shadow-lg">
                <h2 className="text-xl font-semibold mb-5 text-primary font-poppins">
                  Contact Details
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-primary" /> (011) 234 5678
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-primary" />{" "}
                    info@burgershop.com
                  </div>
                  <div className="flex items-center gap-4">
                    <MapPin className="w-5 h-5 text-primary" /> 123 Burger Lane,
                    Colombo 03, Sri Lanka
                  </div>
                </div>
              </Card>

              {/* Google Map */}
              {/* Google Map */}
              <Card className="p-0 overflow-hidden rounded-xl shadow-lg border border-primary/20">
                <iframe
                  title="Our Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.9168019323146!2d79.85966051477298!3d6.901594295039268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259163e8d2e8b%3A0xc3f8b0d4b0f4e1f7!2sColombo%2003%2C%20Colombo!5e0!3m2!1sen!2slk!4v1678886400000"
                  width="100%"
                  height="300" // increased height from h-80 (~320px) to 450px
                  className="w-full"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
