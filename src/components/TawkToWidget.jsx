import React, { useEffect } from 'react';

const TawkToWidget = () => {
  useEffect(() => {
    // ❗ ඔබගේ Tawk.to ගිණුමෙන් ලබාගත් Property ID සහ Widget ID මෙතනට යොදන්න
    const TAWK_PROPERTY_ID = 'YOUR_PROPERTY_ID'; // Example: 60c8a9b8b1d518247e000000
    const TAWK_WIDGET_ID = 'YOUR_WIDGET_ID';     // Example: 1f8b9c0d

    // Avoid creating duplicate scripts
    if (document.getElementById('tawk-to-script')) {
      return;
    }

    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];

    s1.id = 'tawk-to-script';
    s1.async = true;
    s1.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);

  }, []);

  return null; // මෙම component එක මගින් කිසිවක් render නොකරයි
};

export default TawkToWidget;