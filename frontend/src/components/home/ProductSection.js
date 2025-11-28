import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductSection = ({ products = [], isLoading, type }) => {
  const displayProducts = products;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="product-card p-4">
            <div className="skeleton h-48 w-full mb-4"></div>
            <div className="skeleton h-4 w-3/4 mb-2"></div>
            <div className="skeleton h-4 w-1/2 mb-4"></div>
            <div className="skeleton h-8 w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayProducts.map((product, index) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Link
            to={`/products/${product._id}`}
            className="group block product-card p-4"
          >
            <div className="relative mb-4">
              <img
                src={product.images[0]?.url}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
              {product.originalPrice > product.price && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 group-hover:text-amazon-orange transition-colors line-clamp-2">
                {product.name}
              </h3>
              
              <div className="flex items-center space-x-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < Math.floor(product.ratings.average)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({product.ratings.count})
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="price">₹{product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{product.brand}</span>
                <span>{product.category}</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductSection;
