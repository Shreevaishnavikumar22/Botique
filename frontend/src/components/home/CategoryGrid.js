import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CategoryGrid = ({ categories = [] }) => {
  const defaultCategories = [
    {
      category: 'Wedding',
      count: 25,
      icon: '💒',
      description: 'Beautiful wedding bouquets and arrangements for your special day'
    },
    {
      category: 'Funeral',
      count: 18,
      icon: '🕊️',
      description: 'Respectful and elegant funeral arrangements and sympathy flowers'
    },
    {
      category: 'Birthday',
      count: 15,
      icon: '🎂',
      description: 'Cheerful birthday bouquets to celebrate special moments'
    },
    {
      category: 'Anniversary',
      count: 12,
      icon: '💕',
      description: 'Romantic anniversary flowers to express your love'
    },
    {
      category: 'Valentine\'s Day',
      count: 8,
      icon: '💘',
      description: 'Romantic red roses and Valentine\'s Day special arrangements'
    },
    {
      category: 'Mother\'s Day',
      count: 10,
      icon: '🌹',
      description: 'Beautiful flowers to show appreciation for mothers'
    }
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayCategories.map((category, index) => (
        <motion.div
          key={category.category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Link
            to={`/products?category=${encodeURIComponent(category.category)}`}
            className="group block p-6 bg-white rounded-lg shadow-amazon hover:shadow-amazon-lg transition-all duration-300 border border-gray-200 hover:border-amazon-orange"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amazon-orange transition-colors">
                {category.category}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {category.description}
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <span>{category.count} products</span>
                <span className="text-amazon-orange">→</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default CategoryGrid;
