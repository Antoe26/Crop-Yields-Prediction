
import React from 'react';

const LeafIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


export const Header = () => {
  return (
    <header className="p-4 md:p-6">
      <div className="container mx-auto flex items-center justify-center space-x-3">
        <LeafIcon />
        <h1 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500 dark:from-green-400 dark:to-teal-300">
          Crop Yield Prediction AI
        </h1>
      </div>
        <p className="text-center text-gray-600 dark:text-gray-300 mt-2">Estimate future food production with the power of AI.</p>
    </header>
  );
};
