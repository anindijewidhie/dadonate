
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
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
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
    <div className={`min-h-screen flex flex-col transition-all duration-200 
      ${darkMode ? 'bg-[#0A0A0A]' : 'bg-[#FFFFFF]'} 
      ${isRTL ? 'rtl text-right' : 'ltr text-left'}
      ${accessibility.highContrast ? 'high-contrast-mode' : ''}
      ${accessibility.dyslexicFont ? 'dyslexic-mode' : ''}
      ${textScaleClass}
    `} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* ACCESSIBILITY FLOATING ACTION BUTTON */}
      <button 
        onClick={() => setShowAccessModal(true)}
        aria-label="Accessibility Settings"
        className="fixed bottom-8 left-8 z-[60] w-14 h-14 bg-maroon text-gold border-premium shadow-flat hover:scale-110 transition-transform flex items-center justify-center text-2xl"
      >
        <i className="fas fa-universal-access"></i>
      </button>

      <nav className="sticky top-0 z-50 bg-white dark:bg-[#0A0A0A] border-b-2 border-black dark:border-gold">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => onNavigate('home')}
            >
              <span className="text-2xl font-black tracking-tighter text-maroon dark:text-gold">
                dadonate
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => onNavigate('home')}
                className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-2 transition-all ${currentView === 'home' ? 'bg-maroon text-gold shadow-flat' : 'hover:text-maroon dark:hover:text-gold'}`}
              >
                {t.home}
              </button>
              <button 
                onClick={() => onNavigate('fund-platform')}
                className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-2 transition-all ${currentView === 'fund-platform' ? 'bg-maroon text-gold shadow-flat' : 'hover:text-maroon dark:hover:text-gold'}`}
              >
                {t.fundPlatform}
              </button>
              <button 
                onClick={() => isLoggedIn ? onNavigate('dashboard') : onNavigate('login')}
                className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-2 transition-all ${currentView === 'dashboard' ? 'bg-maroon text-gold shadow-flat' : 'hover:text-maroon dark:hover:text-gold'}`}
              >
                {t.dashboard}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={onThemeToggle}
                aria-label="Toggle Dark Mode"
                className="w-8 h-8 border-2 border-black dark:border-gold flex items-center justify-center text-xs hover:bg-gold hover:text-maroon transition-colors"
              >
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>
              
              <select 
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                aria-label="Select Language"
                className="bg-transparent text-[10px] font-black px-2 py-1 border-2 border-black dark:border-gold uppercase outline-none cursor-pointer hover:bg-gold hover:text-maroon transition-colors"
              >
                <option value="en">English</option>
                <option value="id">Indonesian</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="zh-TW">Traditional Chinese</option>
                <option value="zh-CN">Simplified Chinese</option>
                <option value="pt">Portuguese</option>
                <option value="ru">Russian</option>
                <option value="ar">Arabic</option>
              </select>

              {isLoggedIn ? (
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="flex items-center gap-2 bg-black dark:bg-gold text-white dark:text-black px-3 py-1 border-2 border-black hover:bg-maroon dark:hover:bg-maroon transition-all"
                >
                  <div className="w-6 h-6 bg-maroon text-gold flex items-center justify-center font-black text-[10px] border border-black">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline">{user?.name.split(' ')[0]}</span>
                </button>
              ) : (
                <button 
                  onClick={() => onNavigate('login')}
                  className="bg-maroon text-gold px-4 py-1.5 border-2 border-black font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all"
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

      <footer className="bg-white dark:bg-[#0A0A0A] border-t-2 border-black dark:border-gold py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            <div className="max-w-xs">
              <div className="text-3xl font-black text-maroon dark:text-gold tracking-tighter mb-4">dadonate</div>
              <p className="text-sm font-medium text-gray-500 leading-relaxed uppercase tracking-tight">{t.sharing}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-16">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-4">Support</h4>
                <ul className="space-y-3 text-xs font-bold text-gray-400">
                  <li><a href="#" className="hover:text-maroon dark:hover:text-gold transition-colors">Platform Help</a></li>
                  <li><a href="#" className="hover:text-maroon dark:hover:text-gold transition-colors">Creator Terms</a></li>
                  <li>
                    <button 
                      onClick={() => onNavigate('fund-platform')}
                      className="hover:text-maroon dark:hover:text-gold transition-colors text-left"
                    >
                      Fund the Ecosystem
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setShowDisclaimerModal(true)}
                      className="text-maroon dark:text-gold font-black hover:underline transition-colors text-left uppercase text-[10px] tracking-widest"
                    >
                      Transparency & Funding
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-4">Connect</h4>
                <ul className="space-y-3 text-xs font-bold text-gray-400">
                  <li>
                    <a href="#" className="flex items-center gap-2 hover:text-maroon dark:hover:text-gold transition-colors group">
                      <i className="fab fa-twitter text-maroon dark:text-gold group-hover:scale-110 transition-transform"></i>
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-2 hover:text-maroon dark:hover:text-gold transition-colors group">
                      <i className="fab fa-instagram text-maroon dark:text-gold group-hover:scale-110 transition-transform"></i>
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-2 hover:text-maroon dark:hover:text-gold transition-colors group">
                      <i className="fab fa-youtube text-maroon dark:text-gold group-hover:scale-110 transition-transform"></i>
                      YouTube
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 dark:border-gray-900 flex flex-col md:flex-row justify-between gap-8 items-end">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              &copy; {new Date().getFullYear()} dadonate • Creative Livelihood Standard
            </div>
            <div className="max-w-md text-right">
              <div className="flex flex-col items-end gap-2">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed line-clamp-1 max-w-xs">
                  {t.fundingDisclaimer}
                </p>
                <button 
                  onClick={() => setShowDisclaimerModal(true)}
                  className="bg-gray-100 dark:bg-black border border-black/10 dark:border-gold/30 px-4 py-2 text-[10px] font-black text-maroon dark:text-gold hover:bg-maroon hover:text-gold dark:hover:bg-gold dark:hover:text-black transition-all flex items-center gap-2 group shadow-sm"
                >
                  <i className="fas fa-hand-holding-dollar group-hover:animate-bounce"></i>
                  FUNDING TRANSPARENCY & INTEGRITY [LEARN MORE]
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ACCESSIBILITY MODAL */}
      {showAccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#0A0A0A] border-premium shadow-flat-lg w-full max-w-md overflow-hidden">
            <div className="bg-maroon p-8 text-center border-b-2 border-black flex justify-between items-center">
              <h2 className="text-2xl font-black text-gold tracking-tighter italic uppercase leading-none">{t.accessibilityTitle}</h2>
              <button onClick={() => setShowAccessModal(false)} className="text-gold hover:scale-125 transition-transform"><i className="fas fa-times text-xl"></i></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-black border-premium">
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest">{t.highContrast}</h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">Max Visibility Mode</p>
                </div>
                <button 
                  onClick={() => toggleAccessibility('highContrast')}
                  className={`w-12 h-6 border-premium transition-colors relative ${accessibility.highContrast ? 'bg-maroon' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-gold transition-all ${accessibility.highContrast ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-black border-premium">
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest">{t.dyslexicFont}</h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">Dyslexia Friendly Layout</p>
                </div>
                <button 
                  onClick={() => toggleAccessibility('dyslexicFont')}
                  className={`w-12 h-6 border-premium transition-colors relative ${accessibility.dyslexicFont ? 'bg-maroon' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-gold transition-all ${accessibility.dyslexicFont ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-black border-premium">
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest">{t.autoRead}</h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">Audio Descriptions (TTS)</p>
                </div>
                <button 
                  onClick={() => toggleAccessibility('autoRead')}
                  className={`w-12 h-6 border-premium transition-colors relative ${accessibility.autoRead ? 'bg-maroon' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-gold transition-all ${accessibility.autoRead ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-black border-premium space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-widest">{t.fontSize}</h4>
                <div className="flex gap-2">
                  {(['standard', 'large', 'extra-large'] as const).map(size => (
                    <button 
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`flex-1 py-2 text-[9px] font-black uppercase border-premium transition-all ${accessibility.fontSize === size ? 'bg-maroon text-gold' : 'bg-white dark:bg-gray-900 text-gray-400'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setShowAccessModal(false)}
                className="w-full py-4 bg-gold text-maroon font-black uppercase text-[10px] tracking-widest border-premium shadow-flat btn-press"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FUNDING DISCLAIMER MODAL */}
      {showDisclaimerModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#0A0A0A] border-premium shadow-flat-lg w-full max-w-2xl overflow-hidden">
            <div className="bg-maroon p-10 text-center border-b-2 border-black relative">
              <button 
                onClick={() => setShowDisclaimerModal(false)}
                className="absolute top-4 right-4 text-gold hover:rotate-90 transition-transform"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
              <h2 className="text-4xl font-black text-gold tracking-tighter italic uppercase leading-none">Transparency Report</h2>
              <p className="text-gold/60 text-[10px] font-black uppercase tracking-[0.4em] mt-4 italic">Commitment to Livelihood Excellence</p>
            </div>
            <div className="p-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="badge">Platform Integrity</div>
                <div className="h-px flex-grow bg-black/10 dark:bg-gold/20"></div>
              </div>
              <p className="text-sm font-black text-black dark:text-white uppercase tracking-tight leading-relaxed">
                {t.fundingDisclaimer}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-gray-50 dark:bg-black border-premium group hover:shadow-flat transition-all">
                  <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Funds directed to Creators</div>
                  <div className="text-3xl font-black text-maroon dark:text-gold italic">98.2%</div>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-black border-premium group hover:shadow-flat transition-all">
                  <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Standard Processing Fees</div>
                  <div className="text-3xl font-black italic">1.8%</div>
                </div>
              </div>

              <div className="pt-6 border-t border-black/10 dark:border-gold/20">
                <button 
                  onClick={() => setShowDisclaimerModal(false)}
                  className="w-full py-5 bg-black dark:bg-gold text-white dark:text-black border-premium font-black uppercase text-[10px] tracking-widest btn-press"
                >
                  Acknowledge Integrity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
