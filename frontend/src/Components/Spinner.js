import React from 'react';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white-900"></div>
    </div>
  );
};

export default Spinner;