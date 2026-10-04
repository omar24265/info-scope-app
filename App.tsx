import React, { useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';
import { useTheme } from './hooks/useTheme';
import { ShieldCheck, Cloud, Bell, Moon, Sun, Languages } from 'lucide-react';

const socket = io('http://localhost:3000');

function App() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    socket.on('connect', () => {
      toast.success(t('sync_status'), { icon: '☁️' });
    });
    
    socket.on('progress_updated', () => {
      toast(t('notifications'), { icon: '🔔' });
    });

    return () => {
      socket.off('connect');
      socket.off('progress_updated');
    };
  }, [t]);

  const changeLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    toast.success(newLang === 'ar' ? 'تم التبديل للغة العربية' : 'Switched to English');
  };

  const simulateProgress = () => {
    socket.emit('sync_progress', { task: 'completed' });
    toast.success('Task synced across devices!');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-[#0f172a] shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400">{t('welcome')}</h1>
        </div>
        
        <div className="flex gap-3">
          <button onClick={toggleTheme} className="p-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-2">
            {theme === 'dark' ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
            <span className="hidden sm:inline">{t('toggle_theme')}</span>
          </button>
          
          <button onClick={changeLanguage} className="p-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-2">
            <Languages className="w-5 h-5"/>
            <span>{t('toggle_lang')}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-5xl mx-auto mt-10 space-y-8">
        <div className="text-center space-y-4">
          <p className="text-lg text-slate-600 dark:text-slate-400">{t('subtitle')}</p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center gap-4 hover:border-blue-500 transition">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold">{t('two_factor')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Secure your account with E2EE and Time-based OTPs.</p>
            <button className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full">Enable</button>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center gap-4 hover:border-blue-500 transition">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
              <Cloud className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold">{t('sync_status')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your progress is automatically saved and synced to the cloud via MongoDB.</p>
            <button onClick={simulateProgress} className="mt-auto px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-900 dark:hover:bg-slate-600 w-full">Sync Now</button>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center gap-4 hover:border-blue-500 transition">
            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold">{t('notifications')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Smart reminders and real-time alerts for your training tasks.</p>
            <button onClick={() => toast('Task reminder: Complete module 2!', { icon: '📅' })} className="mt-auto px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-900 dark:hover:bg-slate-600 w-full">Test Alert</button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
