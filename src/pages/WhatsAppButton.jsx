import React from 'react';
import { BotMessageSquare } from 'lucide-react'; // Changed to a more bot-like icon

const WhatsAppButton = () => {
  // 🎯 Replace with your WhatsApp number and a pre-filled message
  const phoneNumber = '94123456789'; // Example: Sri Lankan number
  const message = "Hello BurgerShop! I have a question.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <BotMessageSquare className="w-7 h-7" />
    </a>
  );
};

export default WhatsAppButton;