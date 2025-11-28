import React from 'react';
import LegalPage from '../components/LegalPage'; // ✅ components/ui folder එකෙන් import කළා
import Navbar from '../components/Navbar';
// ✅ නිවැරදි import
import { Footer } from '../pages/Index'; 

const Terms = () => {
    const termsContent = [
        { title: '1. Acceptance of Terms', 
          sections: [
              "By accessing and using BurgerShop, you accept and agree to be bound by the terms and provisions of this agreement.",
              "If you do not agree to abide by the above, please do not use this service."
          ] 
        },
        { title: '2. Ordering and Payment', 
          sections: [
              "All prices are listed in LKR (Sri Lankan Rupees).",
              "We reserve the right to refuse any order you place with us."
          ] 
        },
        { title: '3. Liability and Disclaimers', 
          sections: [
              "BurgerShop provides the service on an 'as is' basis. We make no warranties regarding the accuracy or completeness of the content.",
              "We shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of the service."
          ] 
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <LegalPage 
                title="Terms of Service" 
                lastUpdated="November 9, 2025"
                content={termsContent}
            />
            <Footer />
        </div>
    );
};

export default Terms;