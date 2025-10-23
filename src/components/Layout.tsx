import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, Volume2 } from 'lucide-react';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">

      
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;