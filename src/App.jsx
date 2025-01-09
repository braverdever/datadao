import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import CanvasCursor from './components/canvas_effects/CanvasCursor';
import GridAnimation from './components/canvas_effects/GridAnimation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Benefits = lazy(() => import('./pages/Benefits'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Networks = lazy(() => import('./pages/Networks'));
const Contacts = lazy(() => import('./pages/Contacts'));
const DaoList = lazy(() => import('./pages/DaoList'));
const Transactions = lazy(() => import('./pages/Transactions'));
const RegisterForm = lazy(() => import('./components/RegisterForm'));
const Deposit = lazy(() => import('./pages/Deposit'));
const RunAndEarn = lazy(() => import('./pages/RunAndEarn'));

const PageWrapper = () => {
  const location = useLocation();

  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'white' 
      }}>
        Loading...
      </div>
    }>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/benefits" element={<Benefits />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/networks" element={<Networks />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/dao-list" element={<DaoList />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/run-and-earn" element={<RunAndEarn />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <CanvasCursor />
        <PageWrapper />
        <GridAnimation />
        <ToastContainer />
      </Layout>
    </Router>
  );
};

export default App;