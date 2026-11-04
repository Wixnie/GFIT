import { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserDataProvider } from './context/UserDataContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import Sidebar from './components/layout/Sidebar';
import Drawer from './components/layout/Drawer';
import Login from './features/auth/Login';
import Onboarding from './features/auth/Onboarding';
import GuestGuard from './features/auth/GuestGuard';
import Dashboard from './pages/Dashboard';
import Food from './pages/Food';
import Workout from './pages/Workout';
import Mobility from './pages/Mobility';
import Supplements from './pages/Supplements';
import WaterFasting from './pages/WaterFasting';
import Health from './pages/Health';
import Progress from './pages/Progress';
import DietPlans from './pages/DietPlans';
import Social from './pages/Social';
import NotesGuide from './pages/NotesGuide';
import Profile from './pages/Profile';
import AICoachPage from './pages/AICoachPage';
import Pro from './pages/Pro';
import Habits from './pages/Habits';

const Page = ({ title }) => <section className="mx-auto max-w-7xl p-6 pt-24 md:ml-64"><h1 className="text-2xl font-bold text-white">{title}</h1></section>;
const Settings = () => <Page title="Ayarlar" />;

function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  return <div className="min-h-screen bg-[#0F0C1A] pb-20 md:pb-0"><Header onMenuClick={() => setDrawerOpen(true)} /><Sidebar /><Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} /><main><Outlet /></main><BottomNav onMicClick={() => navigate('/ai-coach')} /></div>;
}

function OnboardingGate() {
  const { loading, user, guestMode } = useAuth();
  const location = useLocation();
  const [done, setDone] = useState(() => localStorage.getItem('gfitt_onboarding_done') === 'true');
  useEffect(() => setDone(localStorage.getItem('gfitt_onboarding_done') === 'true'), [location.pathname]);
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#0F0C1A] text-white">GFitt</div>;
  if (!done && !user && !guestMode && location.pathname !== '/onboarding') return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}

function AppRoutes() {
  return <Routes><Route path="/login" element={<Login />} /><Route path="/auth" element={<Login />} /><Route path="/onboarding" element={<Onboarding />} /><Route element={<OnboardingGate />}><Route element={<Layout />}><Route path="/" element={<Dashboard />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="/food" element={<Food />} /><Route path="/workout" element={<Workout />} /><Route path="/mobility" element={<Mobility />} /><Route path="/supplements" element={<Supplements />} /><Route path="/diet-plans" element={<DietPlans />} /><Route path="/social" element={<Social />} /><Route path="/notes-guide" element={<NotesGuide />} /><Route path="/water-fasting" element={<WaterFasting />} /><Route path="/health" element={<Health />} /><Route path="/progress" element={<Progress />} /><Route path="/profile" element={<Profile />} /><Route path="/ai-coach" element={<AICoachPage />} /><Route path="/pro" element={<Pro />} /><Route path="/habits" element={<Habits />} /><Route path="/settings" element={<Settings />} /></Route></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes>;
}

export default function App() {
  return <AuthProvider><UserDataProvider><LanguageProvider><AppRoutes /></LanguageProvider></UserDataProvider></AuthProvider>;
}

export { GuestGuard };
