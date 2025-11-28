import React from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600">Search results page will be implemented here.</p>
      </div>
    </div>
  );
};

export default SearchResults;
