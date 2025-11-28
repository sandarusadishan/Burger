import React from 'react';
import Navbar from '../components/Navbar';
import { Card } from '../components/ui/card';
import { ChefHat, Globe, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Footer } from '../pages/Index';

const featureVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

const About = () => {
  return (
    <div className="min-h-screen flex flex-col font-inter bg-gradient-to-b from-background to-secondary">
      <Navbar />
      <main className="flex-grow py-16 md:py-28">
        <div className="container mx-auto px-6">
          <motion.h1 
            className="text-4xl md:text-5xl font-poppins font-extrabold mb-12 text-center text-primary"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            🍔 About BurgerShop
          </motion.h1>

          <Card className="p-8 lg:p-14 glass shadow-2xl mb-16 hover:shadow-3xl transition-all duration-300">
            <h2 className="text-3xl font-semibold mb-6 text-primary font-poppins">Our Story</h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              Founded in 2025 with a simple yet ambitious goal: to create the perfect burger. We believe that great food starts with great ingredients. That's why we <strong>hand-select every component</strong>, from prime cuts of meat to fresh, locally-sourced vegetables and freshly baked buns.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              More than just a restaurant, BurgerShop is a place where quality meets passion. We're committed to giving you a delightful, satisfying, and memorable experience with every bite.
            </p>
          </Card>

          <h2 className="text-3xl font-semibold text-center mb-12 mt-16 text-primary font-poppins">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {[{
              icon: ChefHat,
              title: 'Uncompromising Quality',
              description: 'We never settle for less than the best ingredients available.'
            },{
              icon: Globe,
              title: 'Sustainable Sourcing',
              description: 'Supporting local farms and eco-friendly practices is central to our mission.'
            },{
              icon: Trophy,
              title: 'Customer Happiness',
              description: 'Your satisfaction is our biggest achievement and priority.'
            }].map((feature, index) => (
              <motion.div 
                key={index}
                variants={featureVariants} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="p-6 text-center glass border border-primary/20 h-full rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                  <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
