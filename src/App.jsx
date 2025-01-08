import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Benefits from './pages/Benefits';
import Layout from './components/Layout';
import CanvasCursor from './components/canvas_effects/CanvasCursor';
import GridAnimation from './components/canvas_effects/GridAnimation';
import AboutUs from './pages/AboutUs';
import Networks from './pages/Networks';
import Contacts from './pages/Contacts';
import DaoList from './pages/DaoList';
import Transactions from './pages/Transactions';
import RegisterForm from './components/RegisterForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Deposit from './pages/Deposit';
import RunAndEarn from './pages/RunAndEarn';

const PageWrapper = () => {
  const location = useLocation();

  return (
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
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <CanvasCursor />
        <PageWrapper />
        <GridAnimation />
        {/* <SoftDotsBackground /> */}
        <ToastContainer />
      </Layout>
    </Router>
  );
};

export default App;