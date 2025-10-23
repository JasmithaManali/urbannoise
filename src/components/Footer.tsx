import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; {new Date().getFullYear()} Urban Noise . All rights reserved.</p>
        <p className="text-sm mt-2">Built with React and Tailwind CSS</p>
      </div>
    </footer>
  );
};

export default Footer;