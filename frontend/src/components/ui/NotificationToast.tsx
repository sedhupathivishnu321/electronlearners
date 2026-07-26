import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notification } = useApp();

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className="flex items-center space-x-3 bg-slate-900 border border-blue-500/50 shadow-2xl shadow-blue-500/20 text-white text-xs px-4 py-3 rounded-xl">
        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        <span className="font-medium">{notification}</span>
      </div>
    </div>
  );
};
