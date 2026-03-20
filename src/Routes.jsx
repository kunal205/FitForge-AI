import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Workout from './pages/Workout';
import Diet from './pages/Diet';
import BMI from './pages/BMI';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

function PageWrapper({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

export default function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <NavBar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/workout" element={<PageWrapper><Workout /></PageWrapper>} />
          <Route path="/diet" element={<PageWrapper><Diet /></PageWrapper>} />
          <Route path="/bmi" element={<PageWrapper><BMI /></PageWrapper>} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
