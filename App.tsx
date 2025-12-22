
import { useState, useEffect, useMemo } from 'react';
import React from 'react';
import Layout from './components/Layout';
import CreatorCard from './components/CreatorCard';
import QRGenerator from './components/QRGenerator';
import GoalProgress from './components/GoalProgress';
import TierCard from './components/TierCard';
import Auth from './components/Auth';
import { Creator, AppView, Tier, Language, User, AccessibilitySettings, PaymentMethod, VerificationStatus } from './types';
import { MOCK_CREATORS, PAYMENT_PROVIDERS, SUPPORTED_CURRENCIES } from './constants';
import { TRANSLATIONS } from './translations';
import { suggestThankYouMessage } from './services/geminiService';
import { GoogleGenAI, Modality } from "@google/genai";

interface Activity {
  id: string;
  type: 'security' | 'financial' | 'account';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('dadonate_theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('dadonate_access');
    return saved ? JSON.parse(saved) : { highContrast: false, dyslexicFont: false, autoRead: false, fontSize: 'standard' };
  });

  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('dadonate_user');
    return saved ? JSON.parse(saved) : { 
      isLoggedIn: false, 
      name: '', 
      username: '', 
      emailVerified: false,
      verificationStatus: 'unverified',
      paymentMethods: [
        { id: 'pm_1', type: 'bank', provider: 'Chase', accountNumber: '****4455', accountName: 'User Account', label: 'Primary Bank' }
      ] 
    };
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('dadonate_activities');
    return saved ? JSON.parse(saved) : [
      { id: 'a1', type: 'account', title: 'Account Created', description: 'Your dadonate journey began.', timestamp: '2 days ago', icon: 'fa-user-plus' },
      { id: 'a2', type: 'security', title: 'Login Detected', description: 'Browser: Chrome on macOS', timestamp: '1 hour ago', icon: 'fa-shield-check' }
    ];
  });

  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [donationAmount, setDonationAmount] = useState<number>(5);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [thankYouMessage, setThankYouMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [donorName, setDonorName] = useState("anonymous supporter");
  const [selectedProvider, setSelectedProvider] = useState(PAYMENT_PROVIDERS.eWallets[0]);
  const [profileTab, setProfileTab] = useState<'feed' | 'about' | 'tiers'>('feed');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Platform donation state
  const [platformDonationAmount, setPlatformDonationAmount] = useState<number>(50);
  const [showPlatformQR, setShowPlatformQR] = useState(false);

  // Email update states
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmailValue, setNewEmailValue] = useState('');
  const [isResending, setIsResending] = useState(false);

  // Password change states
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  const passwordRequirements = useMemo(() => {
    return {
      length: newPassword.length >= 8,
      upper: /[A-Z]/.test(newPassword),
      lower: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[^A-Za-z0-9]/.test(newPassword),
    };
  }, [newPassword]);

  const passwordStrength = Object.values(passwordRequirements).filter(Boolean).length;
  const isNewPasswordValid = passwordStrength === 5;

  // Verification process states
  const [isUploading, setIsUploading] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);

  // Payment Management states
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [newMethodType, setNewMethodType] = useState<'bank' | 'e-wallet'>('bank');
  const [newMethodProvider, setNewMethodProvider] = useState(PAYMENT_PROVIDERS.banks[0]);
  const [newMethodNumber, setNewMethodNumber] = useState('');
  const [newMethodName, setNewMethodName] = useState('');
  const [newMethodLabel, setNewMethodLabel] = useState('');
  const [methodToRemove, setMethodToRemove] = useState<string | null>(null);

  // Withdrawal Modal states
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [selectedPayoutMethodId, setSelectedPayoutMethodId] = useState<string | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const [userCurrencyCode, setUserCurrencyCode] = useState<string>('USD');
  const [creatorBalance, setCreatorBalance] = useState<number>(1450.00);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dadonate_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dadonate_theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('dadonate_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('dadonate_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('dadonate_access', JSON.stringify(accessibility));
  }, [accessibility]);

  const activeCurrency = useMemo(() => {
    return SUPPORTED_CURRENCIES.find(c => c.code === userCurrencyCode) || SUPPORTED_CURRENCIES[0];
  }, [userCurrencyCode]);

  const creators = useMemo(() => {
    return MOCK_CREATORS.map(c => ({
      ...c,
      verificationStatus: (['verified', 'verified', 'verified', 'pending', 'unverified', 'verified'][parseInt(c.id) % 6]) as VerificationStatus
    }));
  }, []);

  const addActivity = (type: Activity['type'], title: string, description: string, icon: string) => {
    const newActivity: Activity = {
      id: `a_${Date.now()}`,
      type,
      title,
      description,
      timestamp: 'Just now',
      icon
    };
    setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep last 10
  };

  const handleCreatorClick = (creator: Creator) => {
    setSelectedCreator(creator);
    setView('creator-profile');
    setProfileTab('feed');
    window.scrollTo(0, 0);
    
    // Auto-read if enabled
    if (accessibility.autoRead) {
      setTimeout(() => readText(`Opening profile for ${creator.name}. Niche: ${creator.niche}. ${creator.bio}`), 1000);
    }
  };

  const handleDonateStart = () => {
    setView('donate');
    window.scrollTo(0, 0);
  };

  const handleTierSelect = (tier: Tier) => {
    setDonationAmount(tier.amount);
    setSelectedTierId(tier.id);
  };

  const handleAuthSuccess = (userData: User) => {
    setUser({ 
      ...userData, 
      paymentMethods: user.paymentMethods || [], 
      verificationStatus: user.verificationStatus || 'unverified' 
    });
    addActivity('account', 'Account Session', `User ${userData.username} signed in.`, 'fa-right-to-bracket');
    setView('home');
  };

  const handleAddPaymentMethod = () => {
    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: newMethodType,
      provider: newMethodProvider,
      accountNumber: newMethodNumber,
      accountName: newMethodName || user.name,
      label: newMethodLabel || `${newMethodProvider} ${newMethodType === 'bank' ? 'Account' : 'Wallet'}`
    };
    
    setUser(prev => ({
      ...prev,
      paymentMethods: [...(prev.paymentMethods || []), newMethod]
    }));
    
    addActivity('financial', 'Payment Method Added', `${newMethodProvider} (${newMethodType}) connected.`, 'fa-credit-card');
    
    setShowAddMethod(false);
    setNewMethodNumber('');
    setNewMethodName('');
    setNewMethodLabel('');
  };

  const handleRemovePaymentMethod = (id: string) => {
    const method = user.paymentMethods?.find(m => m.id === id);
    setUser(prev => ({
      ...prev,
      paymentMethods: (prev.paymentMethods || []).filter(m => m.id !== id)
    }));
    addActivity('financial', 'Payment Method Removed', `${method?.label || 'Account'} disconnected.`, 'fa-trash-can');
    setMethodToRemove(null);
  };

  const handleVerificationSubmit = () => {
    setIsUploading(true);
    setTimeout(() => {
      setUser(prev => ({ ...prev, verificationStatus: 'pending' }));
      setIsUploading(false);
      setShowVerificationForm(false);
      addActivity('security', 'ID Verification Initiated', 'Government ID submitted for review.', 'fa-address-card');
      setTimeout(() => {
        setUser(prev => ({ ...prev, verificationStatus: 'verified' }));
        addActivity('security', 'Identity Verified', 'Full payout privileges enabled.', 'fa-badge-check');
      }, 10000);
    }, 2000);
  };

  const handleFinalWithdrawal = () => {
    if (withdrawAmount <= 0 || withdrawAmount > creatorBalance || !selectedPayoutMethodId) return;
    setIsWithdrawing(true);
    setTimeout(() => {
      setCreatorBalance(prev => prev - withdrawAmount);
      setIsWithdrawing(false);
      setShowWithdrawModal(false);
      addActivity('financial', 'Withdrawal Executed', `${activeCurrency.symbol}${withdrawAmount} transferred to linked account.`, 'fa-money-bill-transfer');
    }, 2000);
  };

  const handleChangePassword = () => {
    if (!isNewPasswordValid) return;
    setIsChangingPassword(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordChangeSuccess(true);
      setNewPassword('');
      addActivity('security', 'Password Changed', 'Account credentials were updated successfully.', 'fa-lock');
      setTimeout(() => setPasswordChangeSuccess(false), 3000);
    }, 1500);
  };

  const handleEmailUpdateStart = () => {
    setNewEmailValue(user.email || '');
    setEditingEmail(true);
  };

  const handleEmailUpdateSubmit = () => {
    if (!newEmailValue || newEmailValue === user.email) {
      setEditingEmail(false);
      return;
    }
    // Simulate setting pending email
    setUser(prev => ({
      ...prev,
      pendingEmail: newEmailValue,
      emailVerified: false
    }));
    addActivity('security', 'Email Update Requested', `Request to change email to ${newEmailValue}.`, 'fa-envelope-circle-check');
    setEditingEmail(false);
  };

  const handleResendVerification = () => {
    setIsResending(true);
    setTimeout(() => setIsResending(false), 2000);
  };

  const handleSimulateEmailVerification = () => {
    setUser(prev => ({
      ...prev,
      email: prev.pendingEmail || prev.email,
      pendingEmail: undefined,
      emailVerified: true
    }));
    addActivity('security', 'Email Verified', 'New primary email confirmed.', 'fa-check-double');
  };

  const handleGenerateQR = async () => {
    if (!selectedCreator) return;
    setIsGenerating(true);
    try {
      const msg = await suggestThankYouMessage(
        user.isLoggedIn ? user.name : donorName,
        donationAmount,
        selectedCreator.currency
      );
      setThankYouMessage(msg);
      setShowQR(true);
    } catch (error) {
      console.error("QR Generation failed", error);
      setThankYouMessage(`Thank you for supporting my creative work! Your ${donationAmount} ${selectedCreator.currency} makes a huge difference.`);
      setShowQR(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePlatformQR = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setShowPlatformQR(true);
      setIsGenerating(false);
    }, 1000);
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const readText = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Speak this text clearly: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        },
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
        const audioBuffer = await decodeAudioData(bytes, audioCtx, 24000, 1);
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      }
    } catch (e) {
      console.error(e);
      setIsSpeaking(false);
    }
  };

  const renderHome = () => (
    <div className="animate-fade-in">
      <section className="bg-white dark:bg-[#050505] pt-32 pb-48 px-6 border-b-2 border-black dark:border-gold relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="badge mb-8 scale-125">{t.livelihoodStandard}</div>
          <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter mb-10 leading-[0.85] animate-slide-up">
            Secure <br/> <span className="text-maroon dark:text-gold italic">Livelihood</span> <br/> Direct
          </h1>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mb-16 font-bold uppercase tracking-tight leading-relaxed">
            {t.heroSubtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button 
              onClick={() => user.isLoggedIn ? setView('dashboard') : setView('login')}
              className="px-12 py-5 bg-maroon text-gold font-black text-sm uppercase tracking-[0.2em] border-premium shadow-flat hover:shadow-flat-lg transition-all btn-press"
            >
              {t.startCreating}
            </button>
            <button 
              onClick={() => setView('fund-platform')}
              className="px-12 py-5 bg-white dark:bg-black text-black dark:text-white border-premium shadow-flat hover:shadow-flat-lg transition-all btn-press font-black text-sm uppercase tracking-[0.2em]"
            >
              {t.fundPlatform}
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="flex flex-col items-start">
            <div className="badge mb-6">Empowerment for All</div>
            <h2 className="text-5xl md:text-7xl font-black mb-10 uppercase tracking-tighter leading-[0.9]">
              {t.mandatoryTitle}
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 leading-relaxed font-bold uppercase tracking-tight max-w-lg">
              {t.mandatoryDesc}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {[t.freelancer, t.athlete, t.lowIncomeWorker, t.housewife, t.retiredProfessional, t.studentLabel].map(label => (
                <div key={label} className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-[#0A0A0A] border-premium shadow-flat hover:translate-x-1 transition-transform">
                  <div className="w-2 h-2 bg-maroon dark:bg-gold shrink-0"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-maroon text-gold p-16 border-premium shadow-flat-lg flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-700">
               <i className="fas fa-landmark text-[20rem]"></i>
            </div>
            <div className="w-24 h-24 bg-gold text-maroon border-2 border-black flex items-center justify-center text-5xl mb-12 shadow-flat relative z-10">
              <i className="fas fa-hand-holding-dollar"></i>
            </div>
            <h3 className="text-4xl font-black mb-6 uppercase tracking-tighter leading-none relative z-10">Weekly Sustainability</h3>
            <p className="text-lg text-gold/80 mb-12 max-w-sm font-bold uppercase leading-tight tracking-tighter relative z-10">Automatic $200 weekly allowance for every verified user in the ecosystem.</p>
            <div className="flex flex-col gap-4 w-full relative z-10">
              <div className="px-10 py-4 bg-gold text-maroon border-2 border-black font-black text-xs uppercase tracking-[0.3em] shadow-flat">Lifetime Guaranteed</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-[#0A0A0A] py-40 px-6 border-y-2 border-black dark:border-gold">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <div>
              <div className="badge mb-4">Discovery</div>
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">Community <br/> Leaders</h2>
            </div>
            <button className="text-xs font-black uppercase tracking-[0.3em] text-maroon dark:text-gold border-b-4 border-current pb-2 hover:opacity-70 transition-opacity">
              {t.browseAll} →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {creators.map(creator => (
              <CreatorCard key={creator.id} creator={creator} onClick={handleCreatorClick} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const renderFundPlatform = () => (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-fade-in pb-64">
      <div className="badge mb-10 scale-125">Direct Vision Support</div>
      <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter mb-16 leading-[0.85] italic">
        {t.fundSubtitle}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
        <div className="lg:col-span-7 space-y-16">
          <p className="text-2xl text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tight leading-relaxed max-w-3xl border-l-8 border-maroon dark:border-gold pl-10 italic">
            {t.fundDesc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="p-10 bg-gray-50 dark:bg-black border-premium shadow-flat">
               <div className="w-12 h-12 bg-maroon text-gold border-2 border-black flex items-center justify-center text-xl mb-8 shadow-flat">
                 <i className="fas fa-crown"></i>
               </div>
               <h4 className="text-xl font-black uppercase tracking-tighter mb-4 italic">{t.globalPool}</h4>
               <p className="text-[10px] font-bold text-gray-500 uppercase leading-relaxed tracking-widest">{t.poolDesc}</p>
               <div className="mt-8 pt-6 border-t-2 border-black/5 dark:border-gold/20 flex items-end gap-4">
                 <span className="text-3xl font-black text-maroon dark:text-gold">Direct</span>
                 <span className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-50">Funding Path</span>
               </div>
            </div>
            <div className="p-10 bg-gray-50 dark:bg-black border-premium shadow-flat">
               <div className="w-12 h-12 bg-black text-gold dark:bg-gold dark:text-black border-2 border-black flex items-center justify-center text-xl mb-8 shadow-flat">
                 <i className="fas fa-code-branch"></i>
               </div>
               <h4 className="text-xl font-black uppercase tracking-tighter mb-4 italic">{t.infrastructure}</h4>
               <p className="text-[10px] font-bold text-gray-500 uppercase leading-relaxed tracking-widest">{t.infraDesc}</p>
               <div className="mt-8 pt-6 border-t-2 border-black/5 dark:border-gold/20 flex items-end gap-4">
                 <span className="text-3xl font-black">Maintenance</span>
                 <span className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-50">Focused</span>
               </div>
            </div>
          </div>
          
          <div className="p-12 bg-maroon text-gold border-premium shadow-flat">
            <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">A Note from the Founders</h4>
            <p className="text-sm font-bold uppercase tracking-tight leading-relaxed opacity-80">
              "We believe that independence is the cornerstone of creativity. By funding dadonate directly, you bypass corporate agendas and invest in a platform built for and by creators. Your support ensures that our owners and developers can continue building a world where livelihood is guaranteed for everyone."
            </p>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-[#0A0A0A] border-premium shadow-flat-lg p-16 sticky top-24">
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-12 italic border-b-4 border-black dark:border-gold pb-4">{t.supportEcosystem}</h3>
            
            <div className="grid grid-cols-1 gap-6 mb-12">
               {[25, 100, 500].map(amount => (
                 <button 
                  key={amount}
                  onClick={() => { setPlatformDonationAmount(amount); setShowPlatformQR(false); }}
                  className={`p-6 border-premium transition-all flex items-center justify-between font-black text-lg uppercase tracking-[0.2em] italic ${
                    platformDonationAmount === amount && !showPlatformQR ? 'bg-maroon text-gold shadow-none translate-x-1 translate-y-1' : 'bg-white dark:bg-black shadow-flat hover:shadow-none'
                  }`}
                 >
                   <span>${amount}</span>
                   {platformDonationAmount === amount && !showPlatformQR && <i className="fas fa-check"></i>}
                 </button>
               ))}
               
               <div className="relative">
                  <input 
                    type="number"
                    value={platformDonationAmount}
                    onChange={(e) => { setPlatformDonationAmount(Number(e.target.value)); setShowPlatformQR(false); }}
                    className="w-full pl-16 pr-6 py-6 bg-gray-50 dark:bg-black border-premium outline-none font-black text-xl italic tracking-tighter uppercase focus:bg-maroon focus:text-gold transition-all"
                  />
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-lg text-maroon dark:text-gold">$</span>
               </div>
            </div>

            {showPlatformQR ? (
              <div className="animate-fade-in">
                <QRGenerator 
                  value="founder-fund-ref" 
                  amount={platformDonationAmount} 
                  currency="USD" 
                  provider={PAYMENT_PROVIDERS.eWallets[0]} 
                  language={language}
                />
              </div>
            ) : (
              <button 
                onClick={handleGeneratePlatformQR}
                disabled={isGenerating}
                className="w-full py-8 bg-black text-gold dark:bg-gold dark:text-black font-black uppercase tracking-[0.5em] text-[10px] border-premium shadow-flat hover:shadow-none transition-all btn-press"
              >
                {isGenerating ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-qrcode mr-3"></i>} 
                Finalize Support
              </button>
            )}
            
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center mt-8 italic leading-relaxed">
              Donations are routed directly to the founders and maintenance pools. We appreciate your role in building this ecosystem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-fade-in pb-64">
      {/* EMAIL CONFIRMATION WARNING */}
      {!user.emailVerified && (
        <div className="mb-12 p-8 bg-maroon text-gold border-premium shadow-flat flex flex-col md:flex-row justify-between items-center gap-6 animate-fade-in">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-gold text-maroon border-2 border-black flex items-center justify-center text-xl shadow-flat shrink-0">
               <i className="fas fa-envelope-circle-check"></i>
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-[0.2em]">{t.pendingConfirmation}</h4>
              <p className="text-[10px] font-bold uppercase opacity-80 mt-1">Please confirm your email address <strong>{user.pendingEmail || user.email}</strong> to activate full payouts.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleResendVerification}
              disabled={isResending}
              className="px-6 py-3 bg-white text-maroon border-2 border-black font-black text-[10px] uppercase tracking-widest hover:bg-gold transition-all"
            >
              {isResending ? <i className="fas fa-spinner fa-spin"></i> : t.resendVerification}
            </button>
            <button 
              onClick={handleSimulateEmailVerification}
              className="px-6 py-3 bg-black text-gold border-2 border-gold font-black text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-all"
            >
              Simulate Confirm Link Click
            </button>
          </div>
        </div>
      )}

      <div className="badge mb-10 scale-125">Command Center</div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-black dark:bg-gold border-premium shadow-flat-lg overflow-hidden">
        <div className="lg:col-span-4 bg-white dark:bg-[#0A0A0A] p-16 md:p-24 flex flex-col items-center">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="w-48 h-48 border-premium bg-maroon text-gold flex items-center justify-center text-7xl font-black shadow-flat rotate-[-3deg] mb-12 italic relative">
              {user.name?.[0]?.toUpperCase() || 'U'}
              {user.verificationStatus === 'verified' && (
                <div className="absolute -bottom-4 -right-4 bg-gold text-maroon w-12 h-12 rounded-full border-4 border-black dark:border-gold flex items-center justify-center text-xl shadow-flat">
                  <i className="fas fa-check"></i>
                </div>
              )}
            </div>
            <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter leading-none italic">{user.name}</h2>
            <div className="flex flex-col items-center gap-2 mt-4">
              <p className="badge">Verified Livelihood</p>
              <div className="flex gap-2">
                <div className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 border-premium ${
                  user.verificationStatus === 'verified' ? 'bg-green-500 text-white border-green-700' :
                  user.verificationStatus === 'pending' ? 'bg-gold text-black border-gold-dark animate-pulse' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  ID: {t[user.verificationStatus || 'unverified']}
                </div>
                <div className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 border-premium ${
                  user.emailVerified ? 'bg-green-500 text-white border-green-700' : 'bg-red-500 text-white border-red-700'
                }`}>
                  Email: {user.emailVerified ? 'Verified' : 'Pending'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full mt-8 p-6 bg-gray-50 dark:bg-black border-premium">
             <h4 className="text-xs font-black uppercase tracking-widest mb-4 border-b border-black/10 dark:border-gold/20 pb-2">{t.identityVerification}</h4>
             
             {user.verificationStatus === 'unverified' && !showVerificationForm && (
                <button 
                  onClick={() => setShowVerificationForm(true)}
                  className="w-full py-4 bg-maroon text-gold font-black uppercase text-[10px] tracking-widest border-premium btn-press"
                >
                  {t.submitVerification}
                </button>
             )}

             {showVerificationForm && (
               <div className="space-y-4 animate-fade-in">
                  <p className="text-[10px] font-bold uppercase text-gray-500 leading-relaxed">{t.uploadDesc}</p>
                  <div className="w-full h-32 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                     <i className="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2"></i>
                     <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Drop ID Photo Here</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowVerificationForm(false)}
                      className="flex-1 py-3 bg-white border-premium text-black font-black text-[9px] uppercase tracking-widest"
                    >
                      {t.cancel}
                    </button>
                    <button 
                      onClick={handleVerificationSubmit}
                      disabled={isUploading}
                      className="flex-1 py-3 bg-gold text-black border-premium font-black text-[9px] uppercase tracking-widest btn-press"
                    >
                      {isUploading ? <i className="fas fa-spinner fa-spin"></i> : t.submitVerification}
                    </button>
                  </div>
               </div>
             )}

             {user.verificationStatus === 'pending' && (
               <p className="text-[9px] font-bold text-maroon dark:text-gold italic">{t.verificationThanks}</p>
             )}
          </div>

          <button 
            onClick={() => setView('login')}
            className="w-full py-6 mt-8 bg-black text-white font-black uppercase text-[11px] tracking-[0.5em] border-premium hover:bg-maroon transition-all btn-press"
          >
            {t.logout}
          </button>
        </div>

        <div className="lg:col-span-8 bg-white dark:bg-[#0A0A0A] p-16 md:p-24 space-y-32 border-l-2 border-black/5 dark:border-gold/20">
          <div>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-12 border-b-4 border-black dark:border-gold pb-4 italic">Sustainability Matrix</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="p-10 bg-gray-50 dark:bg-black border-premium shadow-flat group">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-6 block border-b border-black/5 pb-2">Community Pool</span>
                <p className="text-6xl font-black text-maroon dark:text-gold tracking-tighter leading-none italic group-hover:scale-105 transition-transform origin-left">{activeCurrency.symbol}{creatorBalance.toFixed(2)}</p>
                <button 
                  onClick={() => {
                    setWithdrawAmount(creatorBalance);
                    if (user.paymentMethods && user.paymentMethods.length > 0) {
                      setSelectedPayoutMethodId(user.paymentMethods[0].id);
                    }
                    setShowWithdrawModal(true);
                  }}
                  className="mt-10 text-[10px] font-black uppercase tracking-[0.5em] text-maroon dark:text-gold hover:translate-x-4 transition-transform inline-block disabled:opacity-30 disabled:hover:translate-x-0"
                  disabled={!user.emailVerified}
                >
                  Execute Payout →
                  {!user.emailVerified && <span className="block text-[8px] opacity-50">Email Verification Required</span>}
                </button>
              </div>
              <div className="p-10 bg-maroon text-gold border-premium shadow-flat">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] border-b border-gold/30 pb-2">Base Allowance</span>
                  <div className="badge bg-white text-maroon border-none py-1 text-[8px] animate-pulse">ACTIVE</div>
                </div>
                <p className="text-6xl font-black tracking-tighter leading-none italic">$200.00</p>
                <p className="text-[9px] font-black mt-10 uppercase tracking-[0.3em] opacity-50 italic">Automatic Weekly Disbursement</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-12 border-b-4 border-black dark:border-gold pb-4 italic">{t.securitySettings}</h3>
            
            <div className="space-y-12">
              {/* EMAIL UPDATE SECTION */}
              <div className="p-10 bg-gray-50 dark:bg-black border-premium shadow-flat">
                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{t.email}</label>
                 {editingEmail ? (
                   <div className="space-y-4">
                     <input 
                       type="email"
                       value={newEmailValue}
                       onChange={(e) => setNewEmailValue(e.target.value)}
                       className="w-full px-6 py-4 bg-white dark:bg-black border-premium outline-none font-black text-sm uppercase tracking-tight focus:bg-maroon focus:text-gold transition-all"
                     />
                     <div className="flex gap-4">
                       <button onClick={() => setEditingEmail(false)} className="px-6 py-3 bg-white border-premium font-black text-[10px] uppercase">{t.cancel}</button>
                       <button onClick={handleEmailUpdateSubmit} className="px-6 py-3 bg-maroon text-gold border-premium font-black text-[10px] uppercase">Update</button>
                     </div>
                   </div>
                 ) : (
                   <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-black uppercase tracking-tight">{user.email}</p>
                        {user.pendingEmail && (
                          <p className="text-[9px] font-bold text-maroon dark:text-gold mt-1 italic">Pending update to: {user.pendingEmail}</p>
                        )}
                      </div>
                      <button onClick={handleEmailUpdateStart} className="text-[10px] font-black text-maroon dark:text-gold uppercase tracking-widest hover:underline">{t.updateEmail}</button>
                   </div>
                 )}
              </div>

              {/* PASSWORD UPDATE SECTION */}
              <div className="p-10 bg-gray-50 dark:bg-black border-premium shadow-flat animate-fade-in">
                <div className="max-w-md">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{t.newPassword}</label>
                  <div className="flex flex-col gap-4">
                    <input 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter Secure Password"
                      className="w-full px-6 py-4 bg-white dark:bg-black border-premium outline-none font-black text-sm uppercase tracking-tight focus:bg-maroon focus:text-gold transition-all"
                    />
                    
                    {newPassword.length > 0 && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="flex gap-1 h-1 w-full">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div 
                              key={level} 
                              className={`flex-1 h-full transition-colors duration-500 ${
                                level <= passwordStrength ? 'bg-maroon dark:bg-gold' : 'bg-gray-200 dark:bg-gray-800'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                          {[
                            { key: 'length', label: t.passwordRequirementLength },
                            { key: 'upper', label: t.passwordRequirementUpper },
                            { key: 'lower', label: t.passwordRequirementLower },
                            { key: 'number', label: t.passwordRequirementNumber },
                            { key: 'special', label: t.passwordRequirementSpecial },
                          ].map((req) => (
                            <div 
                              key={req.key} 
                              className={`flex items-center gap-2 text-[8px] font-black uppercase tracking-widest transition-colors ${
                                (passwordRequirements as any)[req.key] ? 'text-maroon dark:text-gold' : 'text-gray-400'
                              }`}
                            >
                              <i className={`fas ${(passwordRequirements as any)[req.key] ? 'fa-check-circle' : 'fa-circle-notch'}`}></i>
                              {req.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={handleChangePassword}
                      disabled={!isNewPasswordValid || isChangingPassword}
                      className="mt-4 px-10 py-5 bg-black text-white dark:bg-gold dark:text-black font-black uppercase text-[10px] tracking-widest border-premium shadow-flat btn-press disabled:opacity-50"
                    >
                      {isChangingPassword ? <i className="fas fa-spinner fa-spin mr-2"></i> : t.changePassword}
                    </button>

                    {passwordChangeSuccess && (
                      <p className="text-[9px] font-black text-green-500 uppercase tracking-widest mt-2">
                        <i className="fas fa-check-circle mr-1"></i> Security Updated Successfully
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-12 border-b-4 border-black dark:border-gold pb-4">
               <h3 className="text-3xl font-black uppercase tracking-tighter italic">{t.managePayments}</h3>
               <button 
                  onClick={() => setShowAddMethod(!showAddMethod)}
                  className="px-6 py-2 bg-black text-white dark:bg-gold dark:text-black font-black uppercase text-[10px] tracking-widest border-premium btn-press"
               >
                  {showAddMethod ? t.cancel : t.addMethod}
               </button>
            </div>

            {showAddMethod && (
              <div className="mb-12 p-10 bg-gray-50 dark:bg-black border-premium shadow-flat animate-fade-in relative">
                <div className="absolute top-4 right-4 text-[8px] font-black text-maroon dark:text-gold uppercase tracking-[0.2em]">
                   <i className="fas fa-shield-halved mr-1"></i> Secure Connection
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{t.paymentMethod}</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setNewMethodType('bank'); setNewMethodProvider(PAYMENT_PROVIDERS.banks[0]); }}
                        className={`flex-1 py-3 border-premium font-black text-[10px] uppercase tracking-widest transition-all ${newMethodType === 'bank' ? 'bg-maroon text-gold shadow-none' : 'bg-white dark:bg-black shadow-flat hover:shadow-none'}`}
                      >
                        {t.bankAccount}
                      </button>
                      <button 
                        onClick={() => { setNewMethodType('e-wallet'); setNewMethodProvider(PAYMENT_PROVIDERS.eWallets[0]); }}
                        className={`flex-1 py-3 border-premium font-black text-[10px] uppercase tracking-widest transition-all ${newMethodType === 'e-wallet' ? 'bg-maroon text-gold shadow-none' : 'bg-white dark:bg-black shadow-flat hover:shadow-none'}`}
                      >
                        {t.eWallet}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{t.selectProvider}</label>
                    <select 
                      value={newMethodProvider}
                      onChange={(e) => setNewMethodProvider(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-black border-premium outline-none font-black text-[10px] uppercase tracking-widest focus:bg-maroon focus:text-gold transition-colors"
                    >
                      {(newMethodType === 'bank' ? PAYMENT_PROVIDERS.banks : PAYMENT_PROVIDERS.eWallets).map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{t.accountLabel}</label>
                    <input 
                      type="text"
                      value={newMethodLabel}
                      onChange={(e) => setNewMethodLabel(e.target.value)}
                      placeholder="e.g. Personal Savings"
                      className="w-full px-4 py-3 bg-white dark:bg-black border-premium outline-none font-black text-[10px] uppercase tracking-widest focus:bg-maroon focus:text-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{t.accountNumber}</label>
                    <input 
                      type="text"
                      value={newMethodNumber}
                      onChange={(e) => setNewMethodNumber(e.target.value)}
                      placeholder="e.g. 123456789"
                      className="w-full px-4 py-3 bg-white dark:bg-black border-premium outline-none font-black text-[10px] uppercase tracking-widest focus:bg-maroon focus:text-gold transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{t.accountName}</label>
                    <input 
                      type="text"
                      value={newMethodName}
                      onChange={(e) => setNewMethodName(e.target.value)}
                      placeholder={user.name}
                      className="w-full px-4 py-3 bg-white dark:bg-black border-premium outline-none font-black text-[10px] uppercase tracking-widest focus:bg-maroon focus:text-gold transition-colors"
                    />
                  </div>
                </div>
                <button 
                   onClick={handleAddPaymentMethod}
                   disabled={!newMethodNumber || !newMethodProvider}
                   className="w-full py-4 bg-maroon text-gold font-black uppercase text-[11px] tracking-[0.3em] border-premium shadow-flat btn-press disabled:opacity-50"
                >
                  Confirm Payout Registration
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(user.paymentMethods || []).map(method => (
                <div key={method.id} className="p-8 bg-white dark:bg-black border-premium shadow-flat flex flex-col justify-between group relative overflow-hidden">
                  {methodToRemove === method.id ? (
                    <div className="absolute inset-0 bg-maroon text-gold p-6 flex flex-col items-center justify-center text-center animate-fade-in z-10">
                       <i className="fas fa-exclamation-triangle text-2xl mb-4"></i>
                       <p className="text-[10px] font-black uppercase tracking-widest mb-6">Confirm Permanent Removal?</p>
                       <div className="flex gap-4 w-full">
                         <button 
                           onClick={() => setMethodToRemove(null)}
                           className="flex-1 py-2 bg-white text-maroon font-black text-[9px] uppercase tracking-widest border-premium shadow-flat hover:shadow-none transition-all"
                         >
                           Keep
                         </button>
                         <button 
                           onClick={() => handleRemovePaymentMethod(method.id)}
                           className="flex-1 py-2 bg-black text-gold font-black text-[9px] uppercase tracking-widest border-premium shadow-flat hover:shadow-none transition-all"
                         >
                           Remove
                         </button>
                       </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <span className="badge mb-2">{method.type}</span>
                          <h4 className="text-xl font-black uppercase tracking-tight italic text-maroon dark:text-gold">{method.label}</h4>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{method.provider}</p>
                        </div>
                        <div className="text-2xl text-maroon dark:text-gold opacity-30 group-hover:opacity-100 transition-opacity">
                          <i className={`fas ${method.type === 'bank' ? 'fa-building-columns' : 'fa-wallet'}`}></i>
                        </div>
                      </div>
                      <div className="pt-6 border-t border-black/5 dark:border-gold/20 flex justify-between items-end">
                        <div>
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Account Number</p>
                          <p className="text-sm font-black italic tracking-wider">{method.accountNumber}</p>
                        </div>
                        <button 
                          onClick={() => setMethodToRemove(method.id)}
                          className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {t.remove}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              
              <button 
                onClick={() => {
                  setShowAddMethod(true);
                  setNewMethodType('bank');
                  setNewMethodProvider(PAYMENT_PROVIDERS.banks[0]);
                }}
                className="p-8 border-2 border-dashed border-black/20 dark:border-gold/20 flex flex-col items-center justify-center text-gray-400 hover:text-black dark:hover:text-gold hover:border-black dark:hover:border-gold transition-all group"
              >
                <i className="fas fa-plus text-2xl mb-4 group-hover:scale-110 transition-transform"></i>
                <span className="text-[10px] font-black uppercase tracking-widest">{t.addMethod}</span>
              </button>
            </div>
          </div>

          {/* RECENT ACTIVITY SECTION */}
          <div>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-12 border-b-4 border-black dark:border-gold pb-4 italic">{t.securityLog}</h3>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-10 -mt-6 italic">{t.activityDesc}</p>
            
            <div className="space-y-4">
              {activities.map((activity, idx) => (
                <div key={activity.id} className="relative flex items-start gap-8 group">
                  {/* Timeline bar */}
                  {idx !== activities.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-[-16px] w-[2px] bg-black/5 dark:bg-gold/10"></div>
                  )}
                  
                  <div className={`w-12 h-12 flex-shrink-0 border-premium flex items-center justify-center text-sm shadow-flat group-hover:scale-110 transition-transform z-10 ${
                    activity.type === 'security' ? 'bg-maroon text-gold' : 
                    activity.type === 'financial' ? 'bg-black text-gold dark:bg-gold dark:text-black' : 
                    'bg-gray-100 text-maroon dark:bg-black dark:text-gold'
                  }`}>
                    <i className={`fas ${activity.icon}`}></i>
                  </div>
                  
                  <div className="flex-grow p-8 bg-gray-50 dark:bg-black border-premium shadow-flat transition-all group-hover:shadow-flat-lg">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-black/10 dark:bg-gold/20">
                          {activity.type}
                        </span>
                        <h4 className="text-sm font-black uppercase tracking-tight italic">{activity.title}</h4>
                      </div>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">{activity.timestamp}</span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-relaxed">
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showWithdrawModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#0A0A0A] border-premium shadow-flat-lg w-full max-lg overflow-hidden">
            <div className="bg-maroon p-10 text-center border-b-2 border-black">
              <h2 className="text-4xl font-black text-gold tracking-tighter italic uppercase leading-none">{t.confirmWithdrawal}</h2>
            </div>
            <div className="p-10 space-y-8">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-tight leading-relaxed">{t.reviewDetails}</p>
              
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{t.withdrawAmount}</label>
                  <div className="relative">
                    <input 
                      type="number"
                      max={creatorBalance}
                      min={0}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(Math.min(creatorBalance, Math.max(0, Number(e.target.value))))}
                      className="w-full pl-16 pr-6 py-4 bg-gray-50 dark:bg-black border-premium outline-none font-black text-3xl italic tracking-tighter"
                    />
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-xl text-maroon dark:text-gold">{activeCurrency.symbol}</span>
                  </div>
                  <button 
                    onClick={() => setWithdrawAmount(creatorBalance)}
                    className="mt-2 text-[9px] font-black text-maroon dark:text-gold uppercase tracking-widest hover:underline"
                  >
                    Use Max Balance ({activeCurrency.symbol}{creatorBalance.toFixed(2)})
                  </button>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{t.selectTarget}</label>
                  <select 
                    value={selectedPayoutMethodId || ''}
                    onChange={(e) => setSelectedPayoutMethodId(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-black border-premium outline-none font-black text-sm uppercase tracking-tight focus:bg-maroon focus:text-gold transition-colors"
                  >
                    <option value="" disabled>-- Select Verified Account --</option>
                    {(user.paymentMethods || []).map(m => (
                      <option key={m.id} value={m.id}>{m.label} ({m.provider})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-black/5">
                <button 
                  onClick={() => setShowWithdrawModal(false)}
                  disabled={isWithdrawing}
                  className="flex-1 py-4 bg-white dark:bg-black border-premium text-black dark:text-white font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all shadow-flat hover:shadow-none"
                >
                  {t.cancel}
                </button>
                <button 
                  disabled={!selectedPayoutMethodId || withdrawAmount <= 0 || isWithdrawing}
                  onClick={handleFinalWithdrawal}
                  className="flex-1 py-4 bg-maroon text-gold border-premium font-black uppercase text-[10px] tracking-widest btn-press disabled:opacity-50"
                >
                  {isWithdrawing ? <i className="fas fa-spinner fa-spin"></i> : t.proceed}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCreatorProfile = () => {
    if (!selectedCreator) return null;
    const isVerified = selectedCreator.verificationStatus === 'verified';
    return (
      <div className="animate-fade-in bg-white dark:bg-[#050505]">
        <div className="h-[40rem] relative border-b-2 border-black dark:border-gold overflow-hidden">
          <img src={selectedCreator.coverImage} className="w-full h-full object-cover grayscale opacity-30 scale-105" alt="cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-12 md:p-24">
            <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-end gap-12">
              <div className="w-48 h-48 border-premium bg-white dark:bg-black flex-shrink-0 shadow-flat-lg overflow-hidden rotate-[-2deg] relative">
                <img src={selectedCreator.avatar} className="w-full h-full object-cover" alt="avatar" />
                {isVerified && (
                  <div className="absolute top-2 right-2 bg-gold text-maroon w-10 h-10 border-2 border-black flex items-center justify-center text-lg shadow-flat z-20">
                    <i className="fas fa-check"></i>
                  </div>
                )}
              </div>
              <div className="flex-grow text-white">
                <div className="flex items-center gap-4 mb-6">
                  <div className="badge bg-gold text-maroon border-none shadow-flat">Verified Livelihood</div>
                  {isVerified && (
                    <span className="text-[10px] font-black bg-maroon text-gold px-3 py-1 border border-gold uppercase tracking-[0.2em] italic">
                      {t.verified} Identity
                    </span>
                  )}
                </div>
                <h1 className="text-7xl md:text-9xl font-black mb-4 leading-[0.85] uppercase tracking-tighter drop-shadow-2xl">
                   {selectedCreator.name}
                </h1>
                <p className="text-gold text-2xl font-black uppercase tracking-widest bg-black px-4 py-1 w-fit border-premium">@{selectedCreator.username}</p>
              </div>
              <div className="flex flex-col gap-4 mb-4">
                  <button 
                    onClick={handleDonateStart}
                    className="px-16 py-6 bg-gold text-maroon font-black text-sm uppercase tracking-[0.3em] border-premium shadow-flat-lg hover:bg-white transition-all btn-press"
                  >
                    {t.supportNow}
                  </button>
                  <button 
                     onClick={() => readText(`${selectedCreator.name} specializing in ${selectedCreator.niche}. Biography: ${selectedCreator.bio}`)}
                     disabled={isSpeaking}
                     className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest border border-white hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                  >
                      <i className={`fas ${isSpeaking ? 'fa-spinner fa-spin' : 'fa-volume-up'}`}></i> {t.readAloud}
                  </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0A0A0A] sticky top-16 z-30 border-b-2 border-black dark:border-gold">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-center md:justify-start overflow-x-auto no-scrollbar">
            {['feed', 'about', 'tiers'].map(tab => (
              <button 
                key={tab}
                onClick={() => setProfileTab(tab as any)}
                className={`py-8 px-12 text-[11px] font-black uppercase tracking-[0.4em] transition-all whitespace-nowrap ${
                  profileTab === tab ? 'bg-maroon text-gold' : 'text-gray-400 hover:text-black dark:hover:text-gold'
                }`}
              >
                {tab === 'feed' ? 'Updates' : tab === 'tiers' ? 'Memberships' : 'Biography'}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-24 pb-64">
          <div className="lg:col-span-8 space-y-24">
            {profileTab === 'feed' && (
              <div className="space-y-16">
                {selectedCreator.feed?.map(item => (
                  <article key={item.id} className="bg-white dark:bg-[#0A0A0A] border-premium shadow-flat p-12 hover:shadow-flat-lg transition-all">
                    <div className="flex justify-between items-center mb-10 border-b-2 border-gray-100 dark:border-gray-900 pb-6">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 border-premium overflow-hidden bg-gray-100">
                            <img src={selectedCreator.avatar} className="w-full h-full object-cover" alt="avatar" />
                        </div>
                        <div>
                          <h4 className="font-black text-sm uppercase tracking-widest leading-none mb-1">{selectedCreator.name}</h4>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{item.timestamp}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => readText(`Post titled: ${item.title}. Content: ${item.content}`)}
                        className="text-maroon dark:text-gold hover:scale-110 transition-transform"
                      >
                        <i className="fas fa-volume-up text-lg"></i>
                      </button>
                    </div>
                    <h5 className="text-4xl font-black mb-6 uppercase tracking-tighter leading-none">{item.title}</h5>
                    <p className="text-lg text-black dark:text-gray-300 mb-10 leading-relaxed font-bold uppercase tracking-tight">{item.content}</p>
                    {item.image && <img src={item.image} className="w-full border-premium mb-10 shadow-flat" alt="post visualization" />}
                    <div className="flex gap-10 border-t-2 border-gray-100 dark:border-gray-900 pt-8">
                      <button className="flex items-center gap-3 text-xs font-black text-gray-500 hover:text-maroon dark:hover:text-gold transition-colors uppercase tracking-widest">
                        <i className="far fa-heart text-lg"></i> {item.likes} Appreciation
                      </button>
                      <button className="flex items-center gap-3 text-xs font-black text-gray-500 hover:text-maroon dark:hover:text-gold transition-colors uppercase tracking-widest">
                        <i className="far fa-comment text-lg"></i> Discuss
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {profileTab === 'about' && (
              <div className="bg-white dark:bg-[#0A0A0A] border-premium shadow-flat p-16">
                <div className="badge mb-10">Biography</div>
                <h3 className="text-5xl font-black mb-12 uppercase tracking-tighter leading-none">The Vision</h3>
                <div className="text-lg text-black dark:text-gray-300 font-bold uppercase tracking-tight leading-relaxed space-y-12">
                  <p className="border-l-8 border-maroon dark:border-gold pl-10 italic text-2xl leading-snug">{selectedCreator.bio}</p>
                  <p>In a world of fluctuating economies, dadonate provides the stable bridge I need to focus entirely on craft. My mission is to advance cultural value through uncompromised creative effort.</p>
                </div>
              </div>
            )}

            {profileTab === 'tiers' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {selectedCreator.tiers.map(tier => (
                  <TierCard 
                    key={tier.id} 
                    tier={tier} 
                    currency={selectedCreator.currency} 
                    selected={selectedTierId === tier.id}
                    onSelect={(t) => { handleTierSelect(t); handleDonateStart(); }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-16">
            <div className="bg-white dark:bg-[#0A0A0A] border-premium shadow-flat p-10">
              <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] block mb-10 border-b-2 border-black/5 dark:border-gold/20 pb-4">Financial Vitality</span>
              <div className="grid grid-cols-1 gap-12">
                <div>
                  <p className="text-5xl font-black tracking-tighter leading-none italic">{(selectedCreator.stats?.supporters || 0).toLocaleString()}</p>
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-3">Verified Patrons</p>
                </div>
                <div className="pt-10 border-t-2 border-black dark:border-gold">
                  <p className="text-5xl font-black text-maroon dark:text-gold tracking-tighter leading-none italic">{selectedCreator.currency} {selectedCreator.totalRaised.toLocaleString()}</p>
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-3">Community Funding</p>
                </div>
              </div>
            </div>
            
            {selectedCreator.activeGoal && (
              <GoalProgress goal={selectedCreator.activeGoal} currency={selectedCreator.currency} language={language} />
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDonate = () => {
    if (!selectedCreator) return null;
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 animate-fade-in pb-64">
        <button onClick={() => setView('creator-profile')} className="mb-16 text-[11px] font-black uppercase tracking-[0.5em] text-black dark:text-gold hover:translate-x-[-8px] transition-transform flex items-center gap-4">
          <i className="fas fa-arrow-left"></i> {t.backToProfile}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-black dark:bg-gold border-premium shadow-flat-lg overflow-hidden">
          <div className="bg-white dark:bg-[#0A0A0A] p-16 md:p-24 border-b-2 lg:border-b-0">
            <div className="badge mb-10">Selection</div>
            <h2 className="text-5xl font-black mb-16 uppercase tracking-tighter leading-none italic">Choose <br/> Membership</h2>
            <div className="grid grid-cols-1 gap-8 mb-16">
              {selectedCreator.tiers.map(tier => (
                <TierCard 
                  key={tier.id} 
                  tier={tier} 
                  currency={selectedCreator.currency} 
                  selected={selectedTierId === tier.id}
                  onSelect={handleTierSelect}
                />
              ))}
            </div>
            <div className="pt-16 border-t-2 border-black/10 dark:border-gold/20">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] block mb-8 italic">Alternative Amount</label>
              <div className="relative">
                <input 
                  type="number"
                  value={donationAmount}
                  onChange={(e) => { setDonationAmount(Number(e.target.value)); setSelectedTierId(null); }}
                  className="w-full pl-24 pr-10 py-8 bg-gray-50 dark:bg-black border-premium focus:bg-maroon focus:text-gold transition-all outline-none text-5xl font-black tracking-tighter italic"
                />
                <span className="absolute left-10 top-1/2 -translate-y-1/2 font-black text-3xl text-maroon dark:text-gold">{selectedCreator.currency}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0A0A0A] p-16 md:p-24 flex flex-col">
            <div className="badge mb-10 bg-maroon text-gold">Gate</div>
            <h2 className="text-5xl font-black mb-16 uppercase tracking-tighter leading-none italic">Payment <br/> Clearance</h2>
            
            {!user.isLoggedIn && (
              <div className="mb-16">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] block mb-6 italic">Identity Verification</label>
                <input 
                  type="text"
                  placeholder={t.name}
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-10 py-6 bg-gray-50 dark:bg-black border-premium outline-none font-black text-base uppercase tracking-widest focus:bg-gold focus:text-maroon transition-all"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-6 mb-16">
              {PAYMENT_PROVIDERS.eWallets.slice(0, 4).map(provider => (
                <button 
                  key={provider}
                  onClick={() => setSelectedProvider(provider)}
                  className={`p-6 border-premium transition-all flex items-center justify-between font-black text-[11px] uppercase tracking-[0.3em] italic ${
                    selectedProvider === provider ? 'bg-maroon text-gold shadow-none translate-x-1 translate-y-1' : 'bg-white text-black hover:bg-gold hover:text-maroon shadow-flat'
                  }`}
                >
                  {provider}
                  {selectedProvider === provider && <i className="fas fa-check"></i>}
                </button>
              ))}
            </div>

            {showQR ? (
              <div className="animate-fade-in flex-grow flex flex-col">
                <QRGenerator 
                  value="donation-ref-123" 
                  amount={donationAmount} 
                  currency={selectedCreator.currency} 
                  provider={selectedProvider} 
                  language={language}
                />
              </div>
            ) : (
              <button 
                onClick={handleGenerateQR}
                disabled={isGenerating}
                className="mt-auto w-full py-10 bg-maroon text-gold font-black uppercase tracking-[0.5em] text-sm border-premium shadow-flat hover:shadow-flat-lg transition-all btn-press disabled:opacity-50"
              >
                {isGenerating ? <><i className="fas fa-spinner fa-spin mr-4"></i> Generating QR</> : <><i className="fas fa-qrcode mr-4"></i> Finalize Payment</>}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout 
      currentView={view} 
      onNavigate={(v) => { setView(v); setShowQR(false); setSelectedTierId(null); setSelectedCreator(null); setShowPlatformQR(false); }}
      language={language}
      onLanguageChange={setLanguage}
      darkMode={darkMode}
      onThemeToggle={() => setDarkMode(!darkMode)}
      isLoggedIn={user.isLoggedIn}
      user={user}
      accessibility={accessibility}
      onAccessibilityChange={setAccessibility}
    >
      {view === 'home' && renderHome()}
      {view === 'creator-profile' && renderCreatorProfile()}
      {view === 'donate' && renderDonate()}
      {view === 'dashboard' && renderDashboard()}
      {view === 'fund-platform' && renderFundPlatform()}
      {view === 'login' && <Auth language={language} darkMode={darkMode} onAuthSuccess={handleAuthSuccess} onCancel={() => setView('home')} />}
    </Layout>
  );
};

export default App;
