
import React, { useState } from 'react';
import { AppView, Language, User, AccessibilitySettings } from '../types';
import { TRANSLATIONS } from '../translations';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  darkMode: boolean;
  onThemeToggle: () => void;
  isLoggedIn: boolean;
  user?: User;
  accessibility: AccessibilitySettings;
  onAccessibilityChange: (settings: AccessibilitySettings) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  onNavigate, 
  language, 
  onLanguageChange, 
  darkMode, 
  onThemeToggle, 
  isLoggedIn,
  user,
  accessibility,
  onAccessibilityChange
}) => {
  const [showAccessModal, setShowAccessModal] = useState(false);
  const t = TRANSLATIONS[language];
  const isRTL = t.isRTL;

  const toggleAccessibility = (key: keyof AccessibilitySettings) => {
    onAccessibilityChange({
      ...accessibility,
      [key]: !accessibility[key as keyof Omit<AccessibilitySettings, 'fontSize'>]
    });
  };

  const setFontSize = (size: AccessibilitySettings['fontSize']) => {
    onAccessibilityChange({
      ...accessibility,
      fontSize: size
    });
  };

  const textScaleClass = accessibility.fontSize === 'large' ? 'text-scale-large' : accessibility.fontSize === 'extra-large' ? 'text-scale-xl' : '';

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-300 
      ${darkMode ? 'bg-[#0F0F0F]' : 'bg-[#F9F9F9]'} 
      ${isRTL ? 'rtl text-right' : 'ltr text-left'}
      ${accessibility.highContrast ? 'high-contrast-mode' : ''}
      ${accessibility.dyslexicFont ? 'dyslexic-mode' : ''}
      ${textScaleClass}
    `} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* ACCESSIBILITY FLOATING ACTION BUTTON (No Shadows) */}
      <button 
        onClick={() => {
          if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(10);
          }
          setShowAccessModal(true);
        }}
        aria-label="Accessibility Settings"
        className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[60] w-12 h-12 md:w-16 md:h-16 bg-maroon text-gold border-premium transition-transform flex items-center justify-center text-xl md:text-2xl hover:scale-105 active:scale-95"
      >
        <i className="fas fa-universal-access"></i>
      </button>

      <nav className="sticky top-0 z-50 bg-white dark:bg-[#0F0F0F] border-b border-black/10 dark:border-gold/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-20">
            <div 
              className="flex items-center cursor-pointer group"
              onClick={() => onNavigate('home')}
            >
              <span className="text-2xl font-black tracking-tighter text-maroon dark:text-gold lowercase group-hover:opacity-80 transition-opacity">
                dadonate
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-10">
              <button 
                onClick={() => onNavigate('home')}
                className={`text-[10px] font-black uppercase tracking-[0.3em] px-3 py-2 transition-all ${currentView === 'home' ? 'text-maroon dark:text-gold border-b-2 border-current' : 'text-gray-400 hover:text-black dark:hover:text-gold'}`}
              >
                {t.home}
              </button>
              <button 
                onClick={() => onNavigate('fund-platform')}
                className={`text-[10px] font-black uppercase tracking-[0.3em] px-3 py-2 transition-all ${currentView === 'fund-platform' ? 'text-maroon dark:text-gold border-b-2 border-current' : 'text-gray-400 hover:text-black dark:hover:text-gold'}`}
              >
                Support
              </button>
              <button 
                onClick={() => isLoggedIn ? onNavigate('dashboard') : onNavigate('login')}
                className={`text-[10px] font-black uppercase tracking-[0.3em] px-3 py-2 transition-all ${currentView === 'dashboard' ? 'text-maroon dark:text-gold border-b-2 border-current' : 'text-gray-400 hover:text-black dark:hover:text-gold'}`}
              >
                {t.dashboard}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={onThemeToggle}
                aria-label="Toggle Theme"
                className="w-9 h-9 border border-black/10 dark:border-gold/30 flex items-center justify-center text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>
              
              <div className="relative group">
                <select 
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value as Language)}
                  aria-label="Language"
                  className="appearance-none bg-transparent text-[10px] font-black pl-3 pr-8 py-2 border border-black/10 dark:border-gold/30 uppercase outline-none cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                >
                  <option value="en">EN</option>
                  <option value="id">ID</option>
                  <option value="es">ES</option>
                  <option value="fr">FR</option>
                  <option value="pt">PT</option>
                  <option value="ar">AR</option>
                </select>
                <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[8px] pointer-events-none opacity-40"></i>
              </div>

              {isLoggedIn ? (
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="flex items-center gap-3 bg-black dark:bg-gold text-white dark:text-black px-4 py-2 hover:opacity-90 transition-all border border-black"
                >
                  <div className="w-6 h-6 bg-maroon text-gold flex items-center justify-center font-black text-[10px]">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline">{user?.name.split(' ')[0]}</span>
                </button>
              ) : (
                <button 
                  onClick={() => onNavigate('login')}
                  className="bg-maroon text-gold px-6 py-2 border border-black font-black text-[10px] uppercase tracking-[0.2em] transition-all btn-press"
                >
                  {t.login}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white dark:bg-[#0F0F0F] border-t border-black/10 dark:border-gold/30 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 md:gap-32 mb-20">
            <div className="max-w-sm">
              <div className="text-3xl font-black text-maroon dark:text-gold tracking-tighter mb-6 lowercase">dadonate</div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-widest leading-loose">{t.sharing}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-16 md:gap-32 w-full md:w-auto">
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] mb-6 border-b border-black/5 dark:border-gold/10 pb-2">Platform</h4>
                <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  <li><a href="#" className="hover:text-maroon dark:hover:text-gold transition-colors">Help</a></li>
                  <li><a href="#" className="hover:text-maroon dark:hover:text-gold transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-maroon dark:hover:text-gold transition-colors">Privacy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] mb-6 border-b border-black/5 dark:border-gold/10 pb-2">Connect</h4>
                <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  <li><a href="#" className="flex items-center gap-3 hover:text-maroon dark:hover:text-gold transition-colors">X</a></li>
                  <li><a href="#" className="flex items-center gap-3 hover:text-maroon dark:hover:text-gold transition-colors">IG</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-black/5 dark:border-gold/10 flex flex-col md:flex-row justify-between gap-12 items-start md:items-end">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
              &copy; {new Date().getFullYear()} dadonate • by A. Widhi
            </div>
            <div className="max-w-md w-full md:w-auto">
              <div className="flex flex-col items-start md:items-end gap-6">
                <p className="text-[9px] text-gray-400 uppercase tracking-widest leading-relaxed text-left md:text-right max-w-xs">
                  A radical transparency model: Split 50/50 between maintenance and development.
                </p>
                <button 
                  onClick={() => onNavigate('fund-platform')}
                  className="w-full md:w-auto bg-white dark:bg-black border-premium px-8 py-4 text-[10px] font-black text-maroon dark:text-gold hover:bg-maroon hover:text-gold dark:hover:bg-gold dark:hover:text-black transition-all uppercase tracking-[0.3em]"
                >
                  Transparency & Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ACCESSIBILITY MODAL (Nordic Minimalist) */}
      {showAccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#121212] border-premium-thick w-full max-w-md overflow-hidden">
            <div className="bg-maroon p-8 text-center border-b border-black flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-black text-gold tracking-tighter uppercase leading-none">{t.accessibilityTitle}</h2>
              <button onClick={() => setShowAccessModal(false)} className="text-gold hover:opacity-70 transition-opacity"><i className="fas fa-times text-xl"></i></button>
            </div>
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-center p-5 bg-zinc-50 dark:bg-zinc-900 border border-black/10 dark:border-gold/20">
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest">{t.highContrast}</h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Enhanced Visibility</p>
                </div>
                <button 
                  onClick={() => toggleAccessibility('highContrast')}
                  className={`w-12 h-6 border transition-all relative ${accessibility.highContrast ? 'bg-maroon border-maroon' : 'bg-gray-200 border-gray-300'}`}
                >
                  <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white transition-all ${accessibility.highContrast ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex justify-between items-center p-5 bg-zinc-50 dark:bg-zinc-900 border border-black/10 dark:border-gold/20">
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest">{t.dyslexicFont}</h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Legibility Optimized</p>
                </div>
                <button 
                  onClick={() => toggleAccessibility('dyslexicFont')}
                  className={`w-12 h-6 border transition-all relative ${accessibility.dyslexicFont ? 'bg-maroon border-maroon' : 'bg-gray-200 border-gray-300'}`}
                >
                  <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white transition-all ${accessibility.dyslexicFont ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-black/10 dark:border-gold/20 space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-center">{t.fontSize}</h4>
                <div className="flex gap-2">
                  {(['standard', 'large', 'extra-large'] as const).map(size => (
                    <button 
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`flex-1 py-3 text-[9px] font-black uppercase border transition-all ${accessibility.fontSize === size ? 'bg-maroon text-gold border-maroon' : 'bg-white dark:bg-zinc-800 text-gray-400 border-black/10 dark:border-gold/20'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setShowAccessModal(false)}
                className="w-full py-5 bg-maroon text-gold font-black uppercase text-[11px] tracking-[0.4em] border border-black transition-all btn-press"
              >
                Save Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
