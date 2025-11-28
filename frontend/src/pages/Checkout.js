import React from 'react';
import PaymentButton from '../components/payment/PaymentButton';

const Checkout = () => {
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <div className="max-w-md mx-auto">
          <PaymentButton />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
