import React from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';

const PaymentButton = () => {
  // Get cart from Redux
  const cart = useSelector((state) => state.cart.cart);
  // TODO: Replace with real shipping address and order number collection
  const shippingAddress = {
    type: 'home',
    name: 'Recipient Name',
    address: '123 Main St',
    city: 'City',
    state: 'State',
    pincode: '123456',
    phone: '9999999999',
  };
  const orderNumber = 'ORDER-' + Date.now();

  const handlePayment = async () => {
    try {
      // 1️⃣ Get Razorpay key
      const { data: { key } } = await api.get('/payment/getkey', { withCredentials: true });

      // 2️⃣ Create order
      const { data: order } = await api.post('/payment/orders', {}, { withCredentials: true });

      // 3️⃣ Razorpay options
      const options = {
        key,
        amount: order.amount, // in paise
        currency: order.currency,
        name: 'Boutique',
        description: 'Test Transaction',
        order_id: order.id,
        handler: async function (response) {
          // Verify payment and send order details
          const verifyPayload = {
            order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            shippingAddress,
            orderNumber,
            items: cart ? cart.items.map(item => ({
              product: item.product?._id || item.product,
              name: item.product?.name || 'Product',
              image: item.product?.images?.[0]?.url || 'https://via.placeholder.com/150',
              price: item.product?.price || 1,
              quantity: item.quantity || 1,
            })) : [],
            paymentInfo: {
              method: 'online',
            },
          };
          const { data } = await api.post('/payment/verify', verifyPayload, { withCredentials: true });
          if (data.success) {
            alert('✅ Payment successful!');
          } else {
            alert('❌ Payment verification failed.');
          }
        },
        prefill: {
          name: shippingAddress.name,
          email: 'test.user@example.com',
          contact: shippingAddress.phone,
        },
        notes: {
          address: shippingAddress.address,
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          escape: false, // prevents accidental closing
        },
      };

      // 4️⃣ Open Razorpay
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('An error occurred during payment. Please try again.');
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Proceed to Payment
    </button>
  );
};

export default PaymentButton;
