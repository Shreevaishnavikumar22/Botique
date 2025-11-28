import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSidebarOpen } from '../../store/slices/uiSlice';

const Sidebar = () => {
  const { sidebarOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Sidebar content will be implemented */}
      <div className="p-4">
        <h2 className="text-lg font-semibold">Sidebar</h2>
      </div>
    </div>
  );
};

export default Sidebar;
