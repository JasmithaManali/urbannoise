import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import ConsentModal from './components/ConsentModal';
import SimpleMap from './components/SimpleMap';
import { ApiProvider } from './contexts/ApiContext';
import { PrivacyProvider } from './contexts/PrivacyContext';

function App() {
  return (
    <ApiProvider>
      <PrivacyProvider>
        <Router>
            <Routes>
              <Route path="/" element={<Layout><Dashboard /></Layout>} />
              <Route path="/admin" element={<Layout><Admin /></Layout>} />
            </Routes>
          <ConsentModal />
        </Router>
      </PrivacyProvider>
    </ApiProvider>
  );
}

export default App;