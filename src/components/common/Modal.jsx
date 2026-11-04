import { X } from 'lucide-react';

export default function Modal({ open = true, onClose, title, children, className = '' }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}><div className={`relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#161326] p-6 text-white shadow-2xl ${className}`}>{onClose && <button type="button" onClick={onClose} aria-label="Kapat" className="absolute right-4 top-4 rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white"><X size={20} /></button>}{title && <h2 className="mb-4 pr-8 text-lg font-bold">{title}</h2>}{children}</div></div>;
}
