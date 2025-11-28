import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  FiFilter, 
  FiGrid, 
  FiList,
  FiChevronDown,
  FiStar,
  FiShoppingCart
} from 'react-icons/fi';
import { 
  getProducts, 
  getCategories, 
  getBrands,
  setFilters,
  clearFilters,
  setCurrentPage
} from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const { 
    products, 
    categories, 
    brands,
    filters,
    pagination,
    isLoading 
  } = useSelector((state) => state.products);

  const { user } = useSelector((state) => state.auth);

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters = {
      keyword: searchParams.get('q') || '',
      category: searchParams.get('category') || '',
      brand: searchParams.get('brand') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      minRating: searchParams.get('minRating') || '',
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
      page: searchParams.get('page') || '1'
    };
    
    dispatch(setFilters(urlFilters));
    dispatch(setCurrentPage(parseInt(urlFilters.page)));
  }, [searchParams, dispatch]);

  // Fetch products when filters change
  useEffect(() => {
    dispatch(getProducts({
      ...filters,
      page: pagination.currentPage
    }));
  }, [dispatch, filters, pagination.currentPage]);

  // Fetch categories and brands
  useEffect(() => {
    dispatch(getCategories());
    dispatch(getBrands());
  }, [dispatch]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    dispatch(setFilters(newFilters));
    dispatch(setCurrentPage(1));
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== '') {
        newSearchParams.set(k, v);
      }
    });
    setSearchParams(newSearchParams);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    handleFilterChange('page', page.toString());
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      toast.success('Product added to cart successfully!');
    } catch (error) {
      toast.error(error || 'Failed to add to cart');
    }
  };

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First', order: 'desc' },
    { value: 'createdAt', label: 'Oldest First', order: 'asc' },
    { value: 'price', label: 'Price: Low to High', order: 'asc' },
    { value: 'price', label: 'Price: High to Low', order: 'desc' },
    { value: 'rating', label: 'Highest Rated', order: 'desc' }
  ];

  const currentSort = sortOptions.find(option => 
    option.value === filters.sortBy && option.order === filters.sortOrder
  ) || sortOptions[0];

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {filters.category ? `${filters.category}` : 'All Products'}
          </h1>
          {filters.keyword && (
            <p className="text-gray-600">
              Search results for "{filters.keyword}" ({pagination.total} products found)
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-amazon-orange hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={filters.category === ''}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.category}
                        checked={filters.category === category.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">
                        {category.category} ({category.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Brand</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="brand"
                      value=""
                      checked={filters.brand === ''}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">All Brands</span>
                  </label>
                  {brands.map((brand) => (
                    <label key={brand.brand} className="flex items-center">
                      <input
                        type="radio"
                        name="brand"
                        value={brand.brand}
                        checked={filters.brand === brand.brand}
                        onChange={(e) => handleFilterChange('brand', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">
                        {brand.brand} ({brand.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      placeholder="0"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      placeholder="50000"
                      className="input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <FiFilter className="w-4 h-4" />
                    <span>Filters</span>
                  </button>
                  
                  <span className="text-sm text-gray-600">
                    {pagination.total} products found
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSortMenu(!showSortMenu)}
                      className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <span className="text-sm">Sort by: {currentSort.label}</span>
                      <FiChevronDown className="w-4 h-4" />
                    </button>
                    
                    {showSortMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        {sortOptions.map((option) => (
                          <button
                            key={`${option.value}-${option.order}`}
                            onClick={() => {
                              handleFilterChange('sortBy', option.value);
                              handleFilterChange('sortOrder', option.order);
                              setShowSortMenu(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                              filters.sortBy === option.value && filters.sortOrder === option.order
                                ? 'bg-gray-50 text-amazon-orange'
                                : 'text-gray-700'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-amazon-orange text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <FiGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-amazon-orange text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <FiList className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="product-card p-4">
                    <div className="skeleton h-48 w-full mb-4"></div>
                    <div className="skeleton h-4 w-3/4 mb-2"></div>
                    <div className="skeleton h-4 w-1/2 mb-4"></div>
                    <div className="skeleton h-8 w-full"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`product-card p-4 ${viewMode === 'list' ? 'flex' : ''}`}
                  >
                    <div className={`${viewMode === 'list' ? 'w-48 mr-4' : 'mb-4'}`}>
                      <img
                        src={product.images[0]?.url || 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=Flower'}
                        alt={product.name}
                        className={`${viewMode === 'list' ? 'w-full h-32' : 'w-full h-48'} object-cover rounded-lg`}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=Flower';
                        }}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-semibold text-gray-900 mb-2 ${viewMode === 'list' ? 'text-lg' : ''} line-clamp-2`}>
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.ratings.average)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-1 text-sm text-gray-600">
                          ({product.ratings.count})
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="price">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice > product.price && (
                          <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => navigate(`/products/${product._id}`)}
                          className="btn btn-outline btn-sm"
                        >
                          View Details
                        </button>
                        
                        <button
                          onClick={() => handleAddToCart(product._id)}
                          className="btn btn-primary btn-sm flex items-center space-x-1"
                        >
                          <FiShoppingCart className="w-4 h-4" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms.</p>
                <button
                  onClick={handleClearFilters}
                  className="btn btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === pagination.currentPage;
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 border rounded-lg ${
                          isCurrentPage
                            ? 'bg-amazon-orange text-white border-amazon-orange'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
