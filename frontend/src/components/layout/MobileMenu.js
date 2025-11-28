import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMobileMenuOpen } from '../../store/slices/uiSlice';

const MobileMenu = () => {
  const { mobileMenuOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
      mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Mobile menu content will be implemented */}
      <div className="p-4">
        <h2 className="text-lg font-semibold">Mobile Menu</h2>
      </div>
    </div>
  );
};

export default MobileMenu;
