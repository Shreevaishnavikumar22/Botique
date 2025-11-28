import React from 'react';
import { useParams } from 'react-router-dom';

const OrderDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Detail</h1>
        <p className="text-gray-600">Order detail page for order ID: {id}</p>
      </div>
    </div>
  );
};

export default OrderDetail;
