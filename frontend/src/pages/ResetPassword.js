import React from 'react';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Reset Password</h1>
        <p className="text-gray-600">Reset password page for token: {token}</p>
      </div>
    </div>
  );
};

export default ResetPassword;
