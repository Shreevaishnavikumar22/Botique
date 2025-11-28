import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Register</h1>
        <p className="text-gray-600 mb-4">Registration page will be implemented here.</p>
        <Link to="/login" className="text-amazon-orange hover:underline">
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
};

export default Register;
