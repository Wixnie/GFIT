import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useEffect } from 'react';

const variants = { success: { icon: CheckCircle2, className: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100' }, error: { icon: XCircle, className: 'border-red-400/30 bg-red-500/15 text-red-100' }, info: { icon: Info, className: 'border-blue-400/30 bg-blue-500/15 text-blue-100' } };

export default function Toast({ message, variant = 'info', onDismiss, duration = 3000 }) {
  useEffect(() => { if (!message || !onDismiss) return undefined; const timer = window.setTimeout(onDismiss, duration); return () => window.clearTimeout(timer); }, [message, onDismiss, duration]);
  if (!message) return null;
  const { icon: Icon, className } = variants[variant] || variants.info;
  return <div role="status" className={`fixed right-4 top-20 z-[80] flex max-w-sm items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-xl backdrop-blur-xl ${className}`}><Icon size={19} /><span className="flex-1">{message}</span>{onDismiss && <button type="button" onClick={onDismiss} aria-label="Bildirimi kapat"><X size={16} /></button>}</div>;
}
