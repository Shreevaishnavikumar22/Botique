import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiTruck, 
  FiShield, 
  FiHeadphones, 
  FiRefreshCw,
  FiAward,
  FiClock
} from 'react-icons/fi';

const FeaturesSection = () => {
  const features = [
    {
      icon: FiTruck,
      title: 'Free Shipping',
      description: 'Free shipping on orders above ₹999 across India'
    },
    {
      icon: FiShield,
      title: 'Secure Payment',
      description: '100% secure payment with SSL encryption'
    },
    {
      icon: FiHeadphones,
      title: '24/7 Support',
      description: 'Round the clock customer support for all your queries'
    },
    {
      icon: FiRefreshCw,
      title: 'Easy Returns',
      description: '7-day return policy for fresh flowers'
    },
    {
      icon: FiAward,
      title: 'Quality Guarantee',
      description: 'All flowers are freshly picked and guaranteed'
    },
    {
      icon: FiClock,
      title: 'Fast Delivery',
      description: 'Quick delivery within 2-5 business days'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Flower Boutique?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide the best flower shopping experience with fresh, beautiful blooms, 
            excellent customer service, and competitive prices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500 bg-opacity-10 rounded-full mb-4 group-hover:bg-opacity-20 transition-all duration-300">
                <feature.icon className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
