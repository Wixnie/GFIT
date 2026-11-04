import { cloneElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';

export default function GuestGuard({ children, action, ...props }) {
  const { guestMode, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const guarded = guestMode && !user;
  const handleClick = async (event) => { if (guarded) { event.preventDefault(); setOpen(true); return; } if (action) await action(event); };
  const element = children || <button type="button" {...props} />;
  const childOnClick = element.props?.onClick;
  const guardedClick = async (event) => { await handleClick(event); if (!guarded && childOnClick) await childOnClick(event); };
  return <>{cloneElement(element, { onClick: guardedClick })}<Modal open={open} onClose={() => setOpen(false)} title="Demo Modu"><p className="text-sm text-white/60">Bu işlemi kaydetmek için ücretsiz bir GFitt hesabı oluştur.</p><div className="mt-5 flex gap-3"><button type="button" onClick={() => navigate('/login')} className="flex-1 rounded-xl bg-[#7C3AED] px-4 py-3 text-sm font-bold text-white">Kayıt Ol</button><button type="button" onClick={() => setOpen(false)} className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70">Vazgeç</button></div></Modal></>;
}
