
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
  const [recoveryStep, setRecoveryStep] = useState(0); 
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const t = TRANSLATIONS[language];

  const passwordRequirements = useMemo(() => {
    return [
      { key: 'length', label: t.passwordRequirementLength, met: password.length >= 8 },
      { key: 'upper', label: t.passwordRequirementUpper, met: /[A-Z]/.test(password) },
      { key: 'lower', label: t.passwordRequirementLower, met: /[a-z]/.test(password) },
      { key: 'number', label: t.passwordRequirementNumber, met: /[0-9]/.test(password) },
      { key: 'special', label: t.passwordRequirementSpecial, met: /[^A-Za-z0-9]/.test(password) },
    ];
  }, [password, t]);

  const strengthCount = passwordRequirements.filter(req => req.met).length;
  const isPasswordValid = strengthCount === 5;
  const strengthPercentage = (strengthCount / 5) * 100;

  const strengthLabel = useMemo(() => {
    if (strengthCount === 0) return '';
    if (strengthCount < 3) return 'Insecure Protocol';
    if (strengthCount < 5) return 'Standard Protection';
    return 'Omega Clearance';
  }, [strengthCount]);

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
      setMode('email-verification');
    } else if (mode === 'login') {
      onAuthSuccess({ name: 'Verified Supporter', username: 'nordic_user', email, emailVerified: true, isLoggedIn: true });
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
      <div className="text-center py-16 animate-fade-in">
        <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-900 border border-black/10 dark:border-gold/30 flex items-center justify-center text-4xl mx-auto mb-10">
          <i className={`fas ${isPass ? 'fa-key' : 'fa-id-card'} text-maroon dark:text-gold`}></i>
        </div>
        <p className="text-black dark:text-white mb-12 font-bold uppercase tracking-widest text-[10px] leading-loose max-w-xs mx-auto">
          {isPass ? t.resetLinkSent : t.usernameSent}
        </p>
        <button 
          onClick={() => resetAuth('login')} 
          className="w-full py-5 bg-maroon text-gold font-black border border-black uppercase text-[10px] tracking-widest transition-all btn-press"
        >
          Return to Login
        </button>
      </div>
    );
  };

  const renderEmailVerification = () => (
    <div className="text-center py-16 animate-fade-in">
      <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-900 border border-black/10 dark:border-gold/30 flex items-center justify-center text-4xl mx-auto mb-10">
        <i className="fas fa-envelope-open-text text-maroon dark:text-gold"></i>
      </div>
      <h3 className="text-xl font-black uppercase tracking-tighter mb-6 text-maroon dark:text-gold">Verify Link Sent</h3>
      <p className="text-black dark:text-white mb-12 font-bold uppercase tracking-[0.1em] text-[10px] leading-loose max-w-xs mx-auto opacity-60">
        We've sent a unique protocol link to <strong>{email}</strong>
      </p>
      
      <div className="space-y-6">
        <button 
          onClick={handleSimulateVerification}
          className="w-full py-6 bg-gold text-maroon font-black border border-black uppercase text-[10px] tracking-[0.4em] btn-press"
        >
          Simulate Activation
        </button>
        <button 
          onClick={() => resetAuth('login')}
          className="w-full py-4 text-gray-400 font-black uppercase text-[9px] tracking-widest hover:text-black dark:hover:text-gold transition-all"
        >
          Back to Login
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F9F9F9] dark:bg-[#0F0F0F] animate-fade-in py-32">
      <div className="bg-white dark:bg-[#0A0A0A] border-premium w-full max-w-md overflow-hidden">
        <div className="bg-maroon p-14 text-center relative border-b border-black">
          <button 
            onClick={onCancel}
            className="absolute top-8 right-8 text-white/40 hover:text-gold transition-colors text-xl"
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
          <h2 className="text-5xl font-black text-gold tracking-tighter lowercase">dadonate</h2>
          <p className="text-gold/40 text-[9px] mt-6 font-black uppercase tracking-[0.6em]">
            {mode === 'login' ? t.login : mode === 'register' ? t.register : mode === 'email-verification' ? 'Verification' : t.recoveryTitle}
          </p>
        </div>

        <div className="p-12">
          {isSuccess ? renderSuccessMessage() : mode === 'email-verification' ? renderEmailVerification() : (
            <div className="space-y-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="p-5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest border border-red-200 dark:border-red-900/40">
                    <i className="fas fa-exclamation-circle mr-4"></i> {error}
                  </div>
                )}

                {mode === 'register' && (
                  <div className="grid grid-cols-1 gap-8">
                    <div className="group">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 group-focus-within:text-maroon dark:group-focus-within:text-gold transition-colors">{t.name}</label>
                      <input 
                        required
                        type="text"
                        placeholder="Nordic Supporter"
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-900 border-b border-black/10 dark:border-gold/20 focus:border-maroon dark:focus:border-gold transition-all outline-none font-bold text-sm uppercase tracking-tight"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 group-focus-within:text-maroon dark:group-focus-within:text-gold transition-colors">{t.username}</label>
                      <input 
                        required
                        type="text"
                        placeholder="nordic_user_01"
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-900 border-b border-black/10 dark:border-gold/20 focus:border-maroon dark:focus:border-gold transition-all outline-none font-bold text-sm uppercase tracking-tight"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 group-focus-within:text-maroon dark:group-focus-within:text-gold transition-colors">
                    {mode === 'forgot-password' && recoveryStep === 1 ? t.confirmEmail : t.email}
                  </label>
                  <input 
                    required
                    type="email"
                    placeholder="support@nordic.com"
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-900 border-b border-black/10 dark:border-gold/20 focus:border-maroon dark:focus:border-gold transition-all outline-none font-bold text-sm uppercase tracking-tight"
                    value={mode === 'forgot-password' && recoveryStep === 1 ? recoveryEmailConfirm : email}
                    onChange={(e) => mode === 'forgot-password' && recoveryStep === 1 ? setRecoveryEmailConfirm(e.target.value) : setEmail(e.target.value)}
                  />
                </div>

                {mode !== 'forgot-password' && mode !== 'forgot-username' && (
                  <div className="group">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-focus-within:text-maroon dark:group-focus-within:text-gold transition-colors">{t.password}</label>
                      {mode === 'login' && (
                        <button type="button" onClick={() => resetAuth('forgot-password')} className="text-[9px] text-maroon dark:text-gold font-black opacity-50 hover:opacity-100 transition-opacity uppercase tracking-widest">
                          Recovery
                        </button>
                      )}
                    </div>
                    <input 
                      required
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-900 border-b border-black/10 dark:border-gold/20 focus:border-maroon dark:focus:border-gold transition-all outline-none font-bold text-sm uppercase tracking-tight"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    {/* Real-time Password Validation UI for Register */}
                    {mode === 'register' && password.length > 0 && (
                      <div className="mt-6 space-y-4 animate-fade-in">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-maroon dark:text-gold">
                            {strengthLabel}
                          </span>
                          <span className="text-[9px] font-black text-gray-300">
                            {Math.round(strengthPercentage)}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 dark:bg-zinc-800 border border-black/5 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              strengthCount < 3 ? 'bg-red-500' : strengthCount < 5 ? 'bg-gold' : 'bg-green-600'
                            }`}
                            style={{ width: `${strengthPercentage}%` }}
                          />
                        </div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {passwordRequirements.map((req) => (
                            <li key={req.key} className="flex items-center gap-3">
                              <div className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-all ${
                                req.met ? 'bg-maroon dark:bg-gold border-maroon dark:border-gold' : 'border-gray-200 dark:border-zinc-700'
                              }`}>
                                {req.met && <i className="fas fa-check text-[8px] text-white dark:text-black"></i>}
                              </div>
                              <span className={`text-[9px] font-bold uppercase tracking-widest ${
                                req.met ? 'text-black dark:text-white' : 'text-gray-300'
                              }`}>
                                {req.label}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {mode === 'register' && (
                  <div className="flex items-start gap-4 py-4 cursor-pointer group" onClick={() => setIsAgeVerified(!isAgeVerified)}>
                    <div className={`w-5 h-5 border border-black/20 dark:border-gold/30 shrink-0 flex items-center justify-center transition-all ${isAgeVerified ? 'bg-maroon dark:bg-gold border-maroon dark:border-gold' : ''}`}>
                        {isAgeVerified && <i className={`fas fa-check text-[10px] ${darkMode ? 'text-black' : 'text-gold'}`}></i>}
                    </div>
                    <label className="text-[10px] font-bold uppercase tracking-wide cursor-pointer text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                      {t.ageVerify}
                    </label>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-6 bg-maroon text-gold font-black border border-black uppercase tracking-[0.5em] text-[10px] transition-all btn-press disabled:opacity-50"
                  disabled={mode === 'register' && !isPasswordValid}
                >
                  {mode === 'login' ? t.login : mode === 'register' ? t.register : 'Initiate Recovery'}
                </button>
              </form>

              <div className="text-center pt-10 border-t border-black/5 dark:border-gold/10">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] leading-loose">
                  {mode === 'login' ? t.noAccount : t.haveAccount}<br/>
                  <button 
                    type="button"
                    onClick={() => resetAuth(mode === 'login' ? 'register' : 'login')}
                    className="text-maroon dark:text-gold font-black hover:opacity-70 transition-opacity mt-2 text-[11px] uppercase"
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
