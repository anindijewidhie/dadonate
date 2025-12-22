
import React, { useState, useMemo } from 'react';
import { Language, User } from '../types';
import { TRANSLATIONS } from '../translations';

interface AuthProps {
  language: Language;
  darkMode: boolean;
  onAuthSuccess: (user: User) => void;
  onCancel: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot-password' | 'forgot-username' | 'email-verification';

const Auth: React.FC<AuthProps> = ({ language, darkMode, onAuthSuccess, onCancel }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [recoveryEmailConfirm, setRecoveryEmailConfirm] = useState('');
  const [recoveryStep, setRecoveryStep] = useState(0); // 0 for initial email, 1 for confirmation
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const t = TRANSLATIONS[language];

  const passwordRequirements = useMemo(() => {
    return {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const strength = Object.values(passwordRequirements).filter(Boolean).length;
  const isPasswordValid = strength === 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (!isAgeVerified) {
        setError(t.ageWarning);
        return;
      }
      if (!isPasswordValid) {
        setError(t.passwordComplexityError);
        return;
      }
      // Instead of immediate login, show verification screen
      setMode('email-verification');
    } else if (mode === 'login') {
      onAuthSuccess({ name: 'Verified User', username: 'user_active', email, emailVerified: true, isLoggedIn: true });
    } else if (mode === 'forgot-password') {
      if (recoveryStep === 0) {
        setRecoveryStep(1);
      } else {
        if (email.toLowerCase() === recoveryEmailConfirm.toLowerCase()) {
          setIsSuccess(true);
        } else {
          setError(t.emailsDoNotMatch);
        }
      }
    } else if (mode === 'forgot-username') {
      setIsSuccess(true);
    }
  };

  const handleSimulateVerification = () => {
    onAuthSuccess({ name, username, email, emailVerified: true, isLoggedIn: true });
  };

  const handleSocialLogin = (provider: string) => {
    onAuthSuccess({ 
      name: `Social ${provider} User`, 
      username: `${provider.toLowerCase()}_user`, 
      email: `social@${provider.toLowerCase()}.com`, 
      emailVerified: true,
      isLoggedIn: true 
    });
  };

  const resetAuth = (newMode: AuthMode) => {
    setMode(newMode);
    setPassword('');
    setEmail('');
    setRecoveryEmailConfirm('');
    setRecoveryStep(0);
    setUsername('');
    setName('');
    setError('');
    setIsSuccess(false);
  };

  const renderSuccessMessage = () => {
    const isPass = mode === 'forgot-password';
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="w-20 h-20 bg-gray-50 dark:bg-black border-premium flex items-center justify-center text-4xl mx-auto mb-10 shadow-flat">
          <i className={`fas ${isPass ? 'fa-key' : 'fa-id-card'} text-maroon dark:text-gold`}></i>
        </div>
        <p className="text-black dark:text-white mb-10 font-bold uppercase tracking-tight text-sm leading-relaxed">
          {isPass ? t.resetLinkSent : t.usernameSent}
        </p>
        <button 
          onClick={() => resetAuth('login')} 
          className="w-full py-4 bg-maroon text-gold font-black border-premium shadow-flat btn-press uppercase text-[10px] tracking-widest"
        >
          Return to Login
        </button>
      </div>
    );
  };

  const renderEmailVerification = () => (
    <div className="text-center py-12 animate-fade-in">
      <div className="w-20 h-20 bg-gray-50 dark:bg-black border-premium flex items-center justify-center text-4xl mx-auto mb-10 shadow-flat">
        <i className="fas fa-envelope-open-text text-maroon dark:text-gold"></i>
      </div>
      <h3 className="text-xl font-black uppercase tracking-tighter mb-4 italic text-maroon dark:text-gold">{t.emailVerificationSent}</h3>
      <p className="text-black dark:text-white mb-10 font-bold uppercase tracking-tight text-[10px] leading-relaxed max-w-xs mx-auto">
        {t.emailVerificationDesc} <strong>{email}</strong>
      </p>
      
      <div className="space-y-4">
        <button 
          onClick={handleSimulateVerification}
          className="w-full py-5 bg-gold text-maroon font-black border-premium shadow-flat btn-press uppercase text-[10px] tracking-widest"
        >
          Simulate Verification Click
        </button>
        <button 
          onClick={() => resetAuth('login')}
          className="w-full py-4 text-gray-500 font-black uppercase text-[9px] tracking-widest hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );

  const SocialButtons = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4 py-2">
        <div className="flex-grow h-px bg-black/10 dark:bg-gold/20"></div>
        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{t.continueWith}</span>
        <div className="flex-grow h-px bg-black/10 dark:bg-gold/20"></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <button 
          type="button"
          onClick={() => handleSocialLogin('Google')}
          className="py-3 border-premium bg-white dark:bg-black shadow-flat hover:shadow-none transition-all flex items-center justify-center text-lg"
          aria-label="Continue with Google"
        >
          <i className="fab fa-google"></i>
        </button>
        <button 
          type="button"
          onClick={() => handleSocialLogin('Twitter')}
          className="py-3 border-premium bg-white dark:bg-black shadow-flat hover:shadow-none transition-all flex items-center justify-center text-lg text-blue-400"
          aria-label="Continue with Twitter"
        >
          <i className="fab fa-x-twitter"></i>
        </button>
        <button 
          type="button"
          onClick={() => handleSocialLogin('GitHub')}
          className="py-3 border-premium bg-white dark:bg-black shadow-flat hover:shadow-none transition-all flex items-center justify-center text-lg"
          aria-label="Continue with GitHub"
        >
          <i className="fab fa-github"></i>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FDFDFD] dark:bg-[#050505] animate-fade-in py-24">
      <div className="bg-white dark:bg-[#0A0A0A] border-premium shadow-flat-lg w-full max-w-md overflow-hidden">
        <div className="bg-maroon p-12 text-center relative border-b-2 border-black">
          <button 
            onClick={onCancel}
            className="absolute top-6 right-6 text-white/50 hover:text-gold transition-colors text-xl"
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
          <h2 className="text-5xl font-black text-gold tracking-tighter italic">dadonate</h2>
          <p className="text-gold/60 text-[10px] mt-4 font-black uppercase tracking-[0.5em]">
            {mode === 'login' ? t.login : mode === 'register' ? t.register : mode === 'email-verification' ? 'Verification' : t.recoveryTitle}
          </p>
        </div>

        <div className="p-10">
          {isSuccess ? renderSuccessMessage() : mode === 'email-verification' ? renderEmailVerification() : (
            <div className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest border border-red-200 dark:border-red-900 shadow-flat">
                    <i className="fas fa-exclamation-circle mr-3"></i> {error}
                  </div>
                )}

                {mode === 'register' && (
                  <div className="grid grid-cols-1 gap-6">
                    <div className="group">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-maroon dark:group-focus-within:text-gold transition-colors">{t.name}</label>
                      <input 
                        required
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-5 py-3 bg-gray-50 dark:bg-black border-premium focus:bg-maroon focus:text-gold transition-all outline-none font-black text-sm uppercase tracking-tight"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-maroon dark:group-focus-within:text-gold transition-colors">{t.username}</label>
                      <input 
                        required
                        type="text"
                        placeholder="john_doe_99"
                        className="w-full px-5 py-3 bg-gray-50 dark:bg-black border-premium focus:bg-maroon focus:text-gold transition-all outline-none font-black text-sm uppercase tracking-tight"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-maroon dark:group-focus-within:text-gold transition-colors">
                    {mode === 'forgot-password' && recoveryStep === 1 ? t.confirmEmail : t.email}
                  </label>
                  {mode === 'forgot-password' && recoveryStep === 1 ? (
                    <input 
                      required
                      type="email"
                      placeholder="re-enter@example.com"
                      className="w-full px-5 py-3 bg-gray-50 dark:bg-black border-premium focus:bg-maroon focus:text-gold transition-all outline-none font-black text-sm uppercase tracking-tight"
                      value={recoveryEmailConfirm}
                      onChange={(e) => setRecoveryEmailConfirm(e.target.value)}
                    />
                  ) : (
                    <input 
                      required
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-5 py-3 bg-gray-50 dark:bg-black border-premium focus:bg-maroon focus:text-gold transition-all outline-none font-black text-sm uppercase tracking-tight"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  )}
                  {mode === 'forgot-password' && recoveryStep === 1 && (
                    <p className="text-[9px] font-bold text-maroon dark:text-gold mt-2 uppercase tracking-widest italic">Please confirm your identity by re-entering your email.</p>
                  )}
                </div>

                {mode !== 'forgot-password' && mode !== 'forgot-username' && (
                  <div className="group">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-focus-within:text-maroon dark:group-focus-within:text-gold transition-colors">{t.password}</label>
                      {mode === 'login' && (
                        <div className="flex flex-col items-end gap-1">
                          <button type="button" onClick={() => resetAuth('forgot-password')} className="text-[9px] text-maroon dark:text-gold font-black hover:opacity-70 transition-opacity uppercase tracking-tighter">
                            {t.forgotPassword}
                          </button>
                          <button type="button" onClick={() => resetAuth('forgot-username')} className="text-[9px] text-maroon dark:text-gold font-black hover:opacity-70 transition-opacity uppercase tracking-tighter">
                            {t.forgotUsername}
                          </button>
                        </div>
                      )}
                    </div>
                    <input 
                      required
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-5 py-3 bg-gray-50 dark:bg-black border-premium focus:bg-maroon focus:text-gold transition-all outline-none font-black text-sm uppercase tracking-tight"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {mode === 'register' && password.length > 0 && (
                      <div className="mt-3 space-y-3 animate-fade-in">
                        <div className="flex gap-1 h-1 w-full">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div 
                              key={level} 
                              className={`flex-1 h-full transition-colors duration-500 ${
                                level <= strength ? 'bg-maroon dark:bg-gold' : 'bg-gray-200 dark:bg-gray-800'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {mode === 'register' && (
                  <div className="flex items-start gap-3 py-2 cursor-pointer group" onClick={() => setIsAgeVerified(!isAgeVerified)}>
                    <div className={`w-5 h-5 border-2 border-black dark:border-gold shrink-0 flex items-center justify-center transition-colors ${isAgeVerified ? 'bg-maroon dark:bg-gold' : ''}`}>
                        {isAgeVerified && <i className={`fas fa-check text-[10px] ${darkMode ? 'text-black' : 'text-gold'}`}></i>}
                    </div>
                    <label className="text-[10px] font-black uppercase tracking-tight cursor-pointer text-gray-500 group-hover:text-black dark:group-hover:text-gold transition-colors">
                      {t.ageVerify}
                    </label>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-5 bg-maroon text-gold font-black border-premium shadow-flat btn-press uppercase tracking-[0.4em] text-[10px] disabled:opacity-50 mt-4"
                  disabled={mode === 'register' && !isPasswordValid}
                >
                  {mode === 'login' ? t.login : mode === 'register' ? t.register : (mode === 'forgot-password' && recoveryStep === 0 ? 'Next' : t.proceed)}
                </button>
              </form>

              {mode !== 'forgot-password' && mode !== 'forgot-username' && <SocialButtons />}

              <div className="text-center pt-6 border-t border-black/5 dark:border-gold/10">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-loose">
                  {mode === 'login' ? t.noAccount : t.haveAccount}<br/>
                  <button 
                    type="button"
                    onClick={() => resetAuth(mode === 'login' ? 'register' : 'login')}
                    className="text-maroon dark:text-gold font-black hover:underline mt-1 text-xs"
                  >
                    {mode === 'login' ? `${t.register} Now` : `${t.login} Now`}
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
