import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroBanner = () => {
  return (
    <section className="relative h-96 md:h-[500px] bg-gradient-to-r from-pink-500 to-pink-700 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white max-w-2xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Beautiful Fresh
            <span className="block text-pink-200">Flowers</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Brighten every moment with our exquisite collection of fresh flowers and plants. 
            From romantic roses to elegant arrangements, we bring nature's beauty to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="btn btn-primary btn-lg bg-pink-500 hover:bg-pink-600"
            >
              Shop Now
            </Link>
            <Link
              to="/products?category=Fresh+Flowers"
              className="btn btn-outline border-white text-white hover:bg-white hover:text-gray-900 btn-lg"
            >
              View Fresh Flowers
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroBanner;
