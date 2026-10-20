import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import PwaInstallPrompt from './components/PwaInstallPrompt'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Food from './pages/Food'
import Workout from './pages/Workout'
import Supplements from './pages/Supplements'
import Weight from './pages/Weight'
import Progress from './pages/Progress'
import Profile from './pages/Profile'
import Habits from './pages/Habits'
import AICoach from './pages/AICoach'
import FoodScanner from './pages/FoodScanner'
import Market from './pages/Market'
import Kvkk from './pages/Kvkk'
import GizlilikPolitikasi from './pages/GizlilikPolitikasi'
import KullanimKosullari from './pages/KullanimKosullari'
import MesafeliSatisSozlesmesi from './pages/MesafeliSatisSozlesmesi'
import IadePolitikasi from './pages/IadePolitikasi'
import Landing from './pages/Landing'
import Paywall from './pages/Paywall'
import Onboarding from './pages/Onboarding'
import Social from './pages/Social'
import Support from './pages/Support'
import Strength from './pages/Strength'

function Guard({ children }) {
  const { session, loading } = useAuth()
  if (loading) return <div className="auth-wrap">Yükleniyor…</div>
  if (!session) return <Navigate to="/giris" replace />
  return children
}

function PublicOnly({ children }) {
  const { session, loading } = useAuth()
  if (loading) return <div className="auth-wrap">Yükleniyor…</div>
  if (session) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Giriş & Kayıt */}
          <Route path="/giris" element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/kayit" element={<PublicOnly><Signup /></PublicOnly>} />
          <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Tanıtım & Yasal Sayfalar */}
          <Route path="/" element={<Landing />} />
          <Route path="/kvkk" element={<Kvkk />} />
          <Route path="/gizlilik-politikasi" element={<GizlilikPolitikasi />} />
          <Route path="/kullanim-kosullari" element={<KullanimKosullari />} />
          <Route path="/mesafeli-satis-sozlesmesi" element={<MesafeliSatisSozlesmesi />} />
          <Route path="/iade-politikasi" element={<IadePolitikasi />} />
          <Route path="/destek" element={<Support />} />

          {/* Giriş Yapılmış Panel (Sidebar + İçerik) */}
          <Route element={<Guard><Layout /></Guard>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/yemek" element={<Food />} />
            <Route path="/antrenman" element={<Workout />} />
            <Route path="/supplement" element={<Supplements />} />
            <Route path="/kilo" element={<Weight />} />
            <Route path="/ilerleme" element={<Progress />} />
            <Route path="/guc-artisi" element={<Strength />} />
            <Route path="/aliskanliklar" element={<Habits />} />
            <Route path="/ai-koc" element={<AICoach />} />
            <Route path="/etiket-okuyucu" element={<FoodScanner />} />
            <Route path="/pazar" element={<Market />} />
            <Route path="/sosyal" element={<Social />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/premium" element={<Paywall />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <PwaInstallPrompt />
      </BrowserRouter>
    </AuthProvider>
  )
}