import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  FiStar, 
  FiTruck, 
  FiShield, 
  FiRefreshCw, 
  FiHeart,
  FiShoppingCart,
  FiMinus,
  FiPlus,
  FiShare2
} from 'react-icons/fi';
import { getProduct, clearCurrentProduct } from '../store/slices/productSlice';
import { addToCart, getCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { currentProduct, isLoading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(getProduct(id));
    }
    
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (currentProduct?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    setIsAddingToCart(true);
    try {
      await dispatch(addToCart({ productId: id, quantity })).unwrap();
      toast.success('Product added to cart successfully!');
      // Refetch the cart to update the UI
      dispatch(getCart());
    } catch (error) {
      toast.error(error || 'Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="skeleton h-96 w-full"></div>
              </div>
              <div className="space-y-6">
                <div className="skeleton h-8 w-3/4"></div>
                <div className="skeleton h-6 w-1/2"></div>
                <div className="skeleton h-4 w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/products')}
            className="btn btn-primary"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const discountPercentage = currentProduct.originalPrice > currentProduct.price 
    ? Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-amazon-orange">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-amazon-orange">
            Products
          </button>
          <span>/</span>
          <span className="text-gray-900">{currentProduct.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={currentProduct.images[selectedImageIndex]?.url || 'https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=Flower+Image'}
                alt={currentProduct.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=Flower+Image';
                }}
              />
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {currentProduct.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {currentProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-amazon-orange' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${currentProduct.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x80/f3f4f6/9ca3af?text=Flower';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentProduct.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(currentProduct.ratings.average)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {currentProduct.ratings.average} ({currentProduct.ratings.count} reviews)
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  Brand: {currentProduct.brand}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{currentProduct.price.toLocaleString()}
                </span>
                {currentProduct.originalPrice > currentProduct.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ₹{currentProduct.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {discountPercentage > 0 && (
                <p className="text-green-600 font-medium">
                  You save ₹{(currentProduct.originalPrice - currentProduct.price).toLocaleString()}
                </p>
              )}
            </div>

            {/* Key Features */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Key Features:</h3>
              <ul className="space-y-2">
                {currentProduct.features.slice(0, 5).map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-amazon-orange rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || currentProduct.stock === 0}
                  className="flex-1 btn btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
                </button>
                
                <button
                  disabled={currentProduct.stock === 0}
                  className="flex-1 btn bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <FiTruck className="w-5 h-5 text-pink-600" />
                <span className="font-medium text-pink-900">Shipping Information</span>
              </div>
              <ul className="text-sm text-pink-800 space-y-1">
                <li>• Free shipping on orders above ₹999</li>
                <li>• Delivery within 2-5 business days</li>
                <li>• Cash on delivery available</li>
                <li>• 30-day return policy</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed">
              {currentProduct.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
