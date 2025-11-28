import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiX, FiTrash2 } from 'react-icons/fi';
import { toggleCart } from '../../store/slices/uiSlice';
import { getCart, removeFromCart, updateCartItem } from '../../store/slices/cartSlice';

const CartSidebar = () => {
  const dispatch = useDispatch();
  const { cartOpen } = useSelector((state) => state.ui);
  const { cart, isLoading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity > 0) {
      dispatch(updateCartItem({ productId, quantity }));
    } else {
      handleRemove(productId);
    }
  };

  const subtotal = cart?.items?.reduce((total, item) => total + (item.product ? item.product.price * item.quantity : 0), 0) || 0;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${cartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => dispatch(toggleCart())}
      />

      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        cartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
            <button onClick={() => dispatch(toggleCart())} className="p-2 rounded-full hover:bg-gray-100">
              <FiX className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Cart Content */}
          {isLoading ? (
            <div className="flex-grow flex items-center justify-center">
              <p>Loading...</p>
            </div>
          ) : !cart || !cart.items || cart.items.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
              {/* <img src="/empty-cart.svg" alt="Empty Cart" className="w-48 h-48 mb-4" /> */}
              <h3 className="text-xl font-semibold text-gray-800">Your cart is empty</h3>
              <p className="text-gray-500 mt-2 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <button
                onClick={() => dispatch(toggleCart())}
                className="btn btn-primary"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {cart.items.map((item) => (
                <div key={item.product} className="flex items-start space-x-4">
                  <img 
                    src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/80x80/f3f4f6/9ca3af?text=Flower'} 
                    alt={item.product?.name || 'Product'} 
                    className="w-20 h-20 object-cover rounded-lg border"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x80/f3f4f6/9ca3af?text=Flower';
                    }}
                  />
                  <div className="flex-grow">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">{item.product?.name || 'Unknown Product'}</h3>
                    <p className="text-sm text-gray-600">₹{item.product?.price?.toLocaleString() || '0'}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-md">
                        <button onClick={() => handleQuantityChange(item.product?._id, item.quantity - 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md">-</button>
                        <span className="px-3 py-1 text-sm">{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.product?._id, item.quantity + 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md">+</button>
                      </div>
                      <button onClick={() => handleRemove(item.product?._id)} className="p-1 text-red-500 hover:text-red-700">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {cart && cart.items && cart.items.length > 0 && (
            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-800">Subtotal</span>
                <span className="text-xl font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="space-y-2">
                <Link to="/checkout" onClick={() => dispatch(toggleCart())} className="btn btn-primary w-full">
                  Proceed to Checkout
                </Link>
                <Link to="/cart" onClick={() => dispatch(toggleCart())} className="btn btn-secondary w-full">
                  View Cart
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
