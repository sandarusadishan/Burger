import React from 'react';
import LegalPage from '../components/LegalPage'; // ✅ components/ui folder එකෙන් import කළා
import Navbar from '../components/Navbar';
// ✅ නිවැරදි import
import { Footer } from '../pages/Index'; 

const Privacy = () => {
    const privacyContent = [
        { title: '1. Information We Collect', 
          sections: [
              "We collect information you provide directly to us, such as your name, email, shipping address, and payment information when you place an order or create an account.",
              "We automatically collect log data, device information, and usage information when you access and use our services."
          ] 
        },
        { title: '2. How We Use Your Information', 
          sections: [
              "To process and fulfill your orders.",
              "To communicate with you about your account and our services.",
              "To personalize and improve your experience on our app and website."
          ] 
        },
        { title: '3. Data Security', 
          sections: [
              "We implement industry-standard security measures to protect your personal data.",
              "Payment information is encrypted and handled securely by third-party payment processors."
          ] 
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <LegalPage 
                title="Privacy Policy" 
                lastUpdated="November 9, 2025"
                content={privacyContent}
            />
            <Footer />
        </div>
    );
};

export default Privacy;