import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  getFeaturedProducts, 
  getTopRatedProducts, 
  getNewArrivals,
  getCategories 
} from '../store/slices/productSlice';
import HeroBanner from '../components/home/HeroBanner';
import CategoryGrid from '../components/home/CategoryGrid';
import ProductSection from '../components/home/ProductSection';
import FeaturesSection from '../components/home/FeaturesSection';
import Newsletter from '../components/home/Newsletter';

const Home = () => {
  const dispatch = useDispatch();
  const { 
    featuredProducts, 
    topRatedProducts, 
    newArrivals,
    categories,
    isLoading 
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getFeaturedProducts());
    dispatch(getTopRatedProducts());
    dispatch(getNewArrivals());
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the perfect flowers for every occasion. We offer a beautiful range of 
              fresh flowers, plants, and floral arrangements for every moment.
            </p>
          </div>
          <CategoryGrid categories={categories} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-gray-600">
                Handpicked flowers with the most beautiful blooms and freshness
              </p>
            </div>
            <Link
              to="/products?featured=true"
              className="btn btn-primary hidden md:block"
            >
              View All
            </Link>
          </div>
          <ProductSection 
            products={featuredProducts} 
            isLoading={isLoading}
            type="featured"
          />
          <div className="text-center mt-8 md:hidden">
            <Link to="/products?featured=true" className="btn btn-primary">
              View All Featured Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Top Rated Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Top Rated Products
              </h2>
              <p className="text-gray-600">
                Customer favorites with beautiful blooms and excellent reviews
              </p>
            </div>
            <Link
              to="/products?sortBy=rating&sortOrder=desc"
              className="btn btn-primary hidden md:block"
            >
              View All
            </Link>
          </div>
          <ProductSection 
            products={topRatedProducts} 
            isLoading={isLoading}
            type="top-rated"
          />
          <div className="text-center mt-8 md:hidden">
            <Link 
              to="/products?sortBy=rating&sortOrder=desc" 
              className="btn btn-primary"
            >
              View All Top Rated
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                New Arrivals
              </h2>
              <p className="text-gray-600">
                Latest additions to our flower collection
              </p>
            </div>
            <Link
              to="/products?sortBy=createdAt&sortOrder=desc"
              className="btn btn-primary hidden md:block"
            >
              View All
            </Link>
          </div>
          <ProductSection 
            products={newArrivals} 
            isLoading={isLoading}
            type="new-arrivals"
          />
          <div className="text-center mt-8 md:hidden">
            <Link 
              to="/products?sortBy=createdAt&sortOrder=desc" 
              className="btn btn-primary"
            >
              View All New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};

export default Home;
