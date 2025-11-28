import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FiSearch, 
  FiShoppingCart, 
  FiUser, 
  FiMenu,
  FiX,
  FiHeart,
  FiLogOut
} from 'react-icons/fi';
import { logout } from '../../store/slices/authSlice';
import { getCartCount } from '../../store/slices/cartSlice';
import { 
  toggleMobileMenu, 
  toggleCart, 
  toggleSearch,
  closeAllModals 
} from '../../store/slices/uiSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartCount } = useSelector((state) => state.cart);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      dispatch(toggleSearch());
    }
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    navigate('/login');
  };

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-amazon-dark'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
            onClick={() => dispatch(closeAllModals())}
          >
            <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className={`font-bold text-xl ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              Flower Boutique
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for flowers..."
                  className="w-full px-4 py-2 pl-10 pr-4 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 bg-amazon-orange text-white rounded-r-lg hover:bg-orange-600 transition-colors"
                >
                  <FiSearch />
                </button>
              </div>
            </form>
          </div>

          {/* Right Side Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Icon - Mobile */}
            <button
              onClick={() => dispatch(toggleSearch())}
              className={`md:hidden p-2 rounded-lg ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-gray-700'
              }`}
            >
              <FiSearch className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className={`p-2 rounded-lg ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-gray-700'
              }`}
              onClick={() => dispatch(closeAllModals())}
            >
              <FiHeart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <button
              onClick={() => dispatch(toggleCart())}
              className={`relative p-2 rounded-lg ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-gray-700'
              }`}
            >
              <FiShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amazon-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click from closing the menu immediately
                    setShowUserMenu(!showUserMenu);
                  }}
                  className={`flex items-center space-x-2 p-2 rounded-lg ${
                    isScrolled 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-white hover:bg-gray-700'
                  }`}
                >
                  <FiUser className="w-5 h-5" />
                  <span className="hidden sm:block text-sm">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Wishlist
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <FiLogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`px-3 py-1 text-sm rounded-lg ${
                    isScrolled 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-white hover:bg-gray-700'
                  }`}
                  onClick={() => dispatch(closeAllModals())}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1 text-sm bg-amazon-orange text-white rounded-lg hover:bg-orange-600 transition-colors"
                  onClick={() => dispatch(closeAllModals())}
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => dispatch(toggleMobileMenu())}
              className={`md:hidden p-2 rounded-lg ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-gray-700'
              }`}
            >
              <FiMenu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for flowers..."
                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 bg-amazon-orange text-white rounded-r-lg hover:bg-orange-600 transition-colors"
              >
                <FiSearch />
              </button>
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
