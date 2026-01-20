
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
  
  const [userCurrencyCode, setUserCurrencyCode] = useState<string>('USD');
  const [creatorBalance, setCreatorBalance] = useState<number>(1450.00);

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
  const [dashTab, setDashTab] = useState<'overview' | 'payouts' | 'security'>('overview');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  const [platformDonationAmount, setPlatformDonationAmount] = useState<number>(50);
  const [showPlatformQR, setShowPlatformQR] = useState(false);

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

  const passwordRequirements = useMemo(() => {
    return [
      { key: 'length', label: t.passwordRequirementLength, met: newPassword.length >= 8 },
      { key: 'upper', label: t.passwordRequirementUpper, met: /[A-Z]/.test(newPassword) },
      { key: 'lower', label: t.passwordRequirementLower, met: /[a-z]/.test(newPassword) },
      { key: 'number', label: t.passwordRequirementNumber, met: /[0-9]/.test(newPassword) },
      { key: 'special', label: t.passwordRequirementSpecial, met: /[^A-Za-z0-9]/.test(newPassword) },
    ];
  }, [newPassword, t]);

  const strengthCount = passwordRequirements.filter(r => r.met).length;
  const isNewPasswordValid = strengthCount === 5;
  const strengthPercentage = (strengthCount / 5) * 100;
  
  const strengthLabel = useMemo(() => {
    if (strengthCount === 0) return '';
    if (strengthCount < 3) return 'Insecure Protocol';
    if (strengthCount < 5) return 'Standard Protection';
    return 'Omega Clearance';
  }, [strengthCount]);

  const creators = useMemo(() => {
    return MOCK_CREATORS.map(c => ({
      ...c,
      verificationStatus: (['verified', 'verified', 'verified', 'pending', 'unverified', 'verified'][parseInt(c.id) % 6]) as VerificationStatus
    }));
  }, []);

  const handleCreatorClick = (creator: Creator) => {
    setSelectedCreator(creator);
    setView('creator-profile');
    setProfileTab('feed');
    window.scrollTo(0, 0);
  };

  const handleDonateStart = () => {
    setView('donate');
    window.scrollTo(0, 0);
  };

  const handleTierSelect = (tier: Tier) => {
    setDonationAmount(tier.amount);
    setSelectedTierId(tier.id);
    setShowQR(false);
  };

  const handleAuthSuccess = (userData: User) => {
    setUser({ 
      ...userData, 
      paymentMethods: user.paymentMethods || [], 
      verificationStatus: user.verificationStatus || 'unverified' 
    });
    setView('home');
  };

  const handleChangePassword = () => {
    if (!isNewPasswordValid) return;
    setIsChangingPass(true);
    setTimeout(() => {
      setNewPassword('');
      setIsChangingPass(false);
      setActivities([
        { id: Date.now().toString(), type: 'security', title: 'Password Changed', description: 'Your account security protocol was updated.', timestamp: 'Just now', icon: 'fa-key' },
        ...activities
      ]);
      alert("Password updated successfully.");
    }, 1500);
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
      setThankYouMessage(`Thank you for supporting my work!`);
      setShowQR(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePlatformQR = () => {
    if (platformDonationAmount < 1) return;
    setIsGenerating(true);
    setTimeout(() => {
      setShowPlatformQR(true);
      setIsGenerating(false);
    }, 1000);
  };

  const renderHome = () => (
    <div className="animate-fade-in overflow-hidden">
      <section className="bg-white dark:bg-[#050505] pt-16 pb-24 md:pt-32 md:pb-48 px-4 md:px-6 border-b border-black/10 dark:border-gold/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="badge mb-8 scale-110 md:scale-125 whitespace-normal max-w-xs">{t.livelihoodStandard}</div>
          <h1 className="text-4xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter mb-10 leading-[1] animate-slide-up break-words w-full">
            Secure <br/> <span className="text-maroon dark:text-gold font-bold">Livelihood</span> <br/> Direct
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl mb-16 font-bold uppercase tracking-widest leading-relaxed px-4">
            {t.heroSubtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 w-full px-4">
            <button 
              onClick={() => user.isLoggedIn ? setView('dashboard') : setView('login')}
              className="flex-1 sm:flex-none px-6 py-4 md:px-12 md:py-5 bg-maroon text-gold font-bold text-xs md:text-sm uppercase tracking-[0.2em] border-premium btn-press"
            >
              {t.startCreating}
            </button>
            <button 
              onClick={() => setView('fund-platform')}
              className="flex-1 sm:flex-none px-6 py-4 md:px-12 md:py-5 bg-white dark:bg-black text-black dark:text-white border-premium btn-press font-bold text-xs md:text-sm uppercase tracking-[0.2em]"
            >
              {t.fundPlatform}
            </button>
          </div>
        </div>
      </section>

      {/* Platform Availability Section */}
      <section className="py-12 border-b border-black/5 dark:border-gold/10 bg-gray-50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-maroon text-gold border border-black flex items-center justify-center">
              <i className="fas fa-mobile-screen-button"></i>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">{t.universalAccessibility}</h4>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{t.availableOn}</p>
            </div>
          </div>
          <div className="flex gap-10 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
             <i className="fab fa-android text-2xl" title="Android"></i>
             <i className="fab fa-apple text-2xl" title="iOS"></i>
             <i className="fas fa-microchip text-2xl" title="HarmonyOS"></i>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-center">
          <div className="flex flex-col items-start">
            <div className="badge mb-6">Empowerment for All</div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black mb-10 uppercase tracking-tighter leading-[1] break-words">
              {t.mandatoryTitle}
            </h2>
            <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mb-12 leading-relaxed font-bold uppercase tracking-tight max-w-lg">
              {t.mandatoryDesc}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {[t.freelancer, t.athlete, t.lowIncomeWorker, t.housewife, t.retiredProfessional, t.studentLabel].map(label => (
                <div key={label} className="flex items-center gap-4 p-4 md:p-6 bg-white dark:bg-[#0A0A0A] border-premium hover:border-maroon dark:hover:border-gold transition-colors">
                  <div className="w-1.5 h-1.5 bg-maroon dark:bg-gold shrink-0"></div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em]">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-maroon text-gold p-8 md:p-20 border-premium flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gold text-maroon border border-black flex items-center justify-center text-3xl md:text-4xl mb-10 relative z-10">
              <i className="fas fa-hand-holding-dollar"></i>
            </div>
            <h3 className="text-2xl md:text-3xl font-black mb-6 uppercase tracking-tighter leading-none relative z-10">Weekly Sustainability</h3>
            <p className="text-sm md:text-base text-gold/80 mb-12 max-w-sm font-bold uppercase leading-relaxed tracking-wider relative z-10">Automatic $200 weekly allowance for every verified user in the ecosystem.</p>
            <div className="px-6 py-4 bg-gold text-maroon border border-black font-black text-[10px] uppercase tracking-[0.3em] relative z-10 w-full">Lifetime Guaranteed</div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-[#0A0A0A] py-20 md:py-40 px-4 md:px-6 border-y border-black/10 dark:border-gold/20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-20 flex flex-col md:row justify-between items-start md:items-end gap-10">
            <div>
              <div className="badge mb-4">Discovery</div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">Community <br className="hidden md:block"/> Leaders</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {creators.map(creator => (
              <CreatorCard key={creator.id} creator={creator} onClick={handleCreatorClick} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const renderFundPlatform = () => {
    const siteOwnerAccounts = "Bank Jago: 107863277869, PayPal: dhea_wasisto@yahoo.com, E-wallet: +628567239000";

    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32 animate-fade-in pb-48 md:pb-64">
        <div className="badge mb-10 px-4 py-2 text-center w-full md:w-auto inline-block whitespace-normal leading-tight">
          Direct Foundation Transparency
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter mb-16 leading-[1] break-words">
          {t.fundSubtitle}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-32">
          <div className="lg:col-span-7 space-y-12 md:space-y-20">
            <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tight leading-relaxed max-w-3xl border-l-4 border-maroon dark:border-gold pl-6 md:pl-10">
              {t.fundDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
              <div className="p-8 md:p-12 bg-white dark:bg-black border-premium">
                 <div className="w-10 h-10 bg-maroon text-gold flex items-center justify-center text-lg mb-8">
                   <i className="fas fa-users"></i>
                 </div>
                 <h4 className="text-lg md:text-xl font-black uppercase tracking-tighter mb-4">{t.globalPool}</h4>
                 <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed tracking-widest">{t.poolDesc}</p>
              </div>
              <div className="p-8 md:p-12 bg-white dark:bg-black border-premium">
                 <div className="w-10 h-10 bg-black text-gold dark:bg-gold dark:text-black flex items-center justify-center text-lg mb-8 border border-black dark:border-none">
                   <i className="fas fa-server"></i>
                 </div>
                 <h4 className="text-lg md:text-xl font-black uppercase tracking-tighter mb-4">{t.infrastructure}</h4>
                 <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed tracking-widest">{t.infraDesc}</p>
              </div>
              <div className="p-8 md:p-12 bg-white dark:bg-black border-premium">
                 <div className="w-10 h-10 bg-maroon text-gold flex items-center justify-center text-lg mb-8">
                   <i className="fas fa-laptop-code"></i>
                 </div>
                 <h4 className="text-lg md:text-xl font-black uppercase tracking-tighter mb-4">{t.development}</h4>
                 <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed tracking-widest">{t.devDesc}</p>
              </div>
              <div className="p-8 md:p-12 bg-white dark:bg-black border-premium">
                 <div className="w-10 h-10 bg-black text-gold dark:bg-gold dark:text-black flex items-center justify-center text-lg mb-8 border border-black dark:border-none">
                   <i className="fas fa-crown"></i>
                 </div>
                 <h4 className="text-lg md:text-xl font-black uppercase tracking-tighter mb-4">{t.siteOwner}</h4>
                 <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed tracking-widest">{t.ownerDesc}</p>
              </div>
            </div>
            
            <div className="p-8 md:p-16 bg-maroon text-gold border-premium">
              <h4 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-8 border-b border-gold/20 pb-6">Integrity Split</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                <div>
                  <div className="text-[9px] font-black text-gold/60 uppercase tracking-widest mb-2">Paying Users</div>
                  <div className="text-3xl md:text-4xl font-black tracking-tighter">40.0%</div>
                </div>
                <div>
                  <div className="text-[9px] font-black text-gold/60 uppercase tracking-widest mb-2">Maintenance</div>
                  <div className="text-3xl md:text-4xl font-black tracking-tighter">20.0%</div>
                </div>
                <div>
                  <div className="text-[9px] font-black text-gold/60 uppercase tracking-widest mb-2">Development</div>
                  <div className="text-3xl md:text-4xl font-black tracking-tighter">20.0%</div>
                </div>
                <div>
                  <div className="text-[9px] font-black text-gold/60 uppercase tracking-widest mb-2">Site Owner</div>
                  <div className="text-3xl md:text-4xl font-black tracking-tighter">20.0%</div>
                </div>
              </div>
              <p className="text-xs md:text-sm font-bold uppercase tracking-wide leading-relaxed opacity-80">
                "Total transparency in our economic model: split into four distinct vectors of growth and sustainability."
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-[#0A0A0A] border-premium p-8 md:p-12 sticky top-24">
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-10 border-b-2 border-black dark:border-gold pb-4">{t.supportEcosystem}</h3>
              
              <div className="grid grid-cols-4 gap-3 md:gap-4 mb-10">
                 {[1, 2, 5, 10, 20, 50, 100].map(amount => (
                   <button 
                    key={amount}
                    onClick={() => { setPlatformDonationAmount(amount); setShowPlatformQR(false); }}
                    className={`p-3 md:p-4 border-premium transition-all flex items-center justify-center font-bold text-xs md:text-sm uppercase tracking-tight ${
                      platformDonationAmount === amount && !showPlatformQR ? 'bg-maroon text-gold' : 'bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-zinc-900'
                    }`}
                   >
                     <span>${amount}</span>
                   </button>
                 ))}
                 
                 <div className="col-span-4 relative mt-4">
                    <input 
                      type="number"
                      value={platformDonationAmount}
                      onChange={(e) => { setPlatformDonationAmount(Number(e.target.value)); setShowPlatformQR(false); }}
                      min={1}
                      className="w-full pl-12 md:pl-14 pr-6 py-5 bg-gray-50 dark:bg-black border-premium outline-none font-black text-lg md:text-xl tracking-tighter uppercase focus:border-maroon dark:focus:border-gold transition-all"
                    />
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-lg text-maroon dark:text-gold">$</span>
                 </div>
              </div>

              {showPlatformQR ? (
                <div className="animate-fade-in">
                  <QRGenerator 
                    value="platform-split-4pillar" 
                    amount={platformDonationAmount} 
                    currency="USD" 
                    provider={selectedProvider} 
                    language={language}
                    destinationAccount={siteOwnerAccounts}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <select 
                      value={selectedProvider}
                      onChange={(e) => setSelectedProvider(e.target.value)}
                      className="w-full appearance-none px-8 py-6 bg-white dark:bg-black border-premium outline-none font-black text-[10px] uppercase tracking-[0.3em] cursor-pointer"
                    >
                      {PAYMENT_PROVIDERS.eWallets.map(p => <option key={p} value={p}>{p}</option>)}
                      {PAYMENT_PROVIDERS.banks.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <i className="fas fa-chevron-down absolute right-8 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none opacity-40"></i>
                  </div>
                  
                  <button 
                    onClick={handleGeneratePlatformQR}
                    disabled={isGenerating || platformDonationAmount < 1}
                    className="w-full py-6 md:py-8 bg-black text-gold dark:bg-gold dark:text-black font-black uppercase tracking-[0.4em] text-[10px] border-premium hover:opacity-90 transition-all btn-press disabled:opacity-30"
                  >
                    {isGenerating ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-qrcode mr-3"></i>} 
                    Authorize Support
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20">
        <div className="w-full">
          <div className="badge mb-4">Command Center</div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none break-words">Dashboard</h1>
        </div>
        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trust Index</span>
           <div className={`w-full md:w-auto px-8 py-4 border-premium text-[10px] font-black uppercase tracking-[0.2em] text-center ${user.verificationStatus === 'verified' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gold text-maroon border-black'}`}>
             {user.verificationStatus === 'verified' ? <><i className="fas fa-check-circle mr-2"></i> Verified Identity</> : <><i className="fas fa-clock mr-2"></i> Pending Trust</>}
           </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-black/10 dark:border-gold/20 mb-16 overflow-x-auto no-scrollbar">
        {(['overview', 'payouts', 'security'] as const).map(tab => (
          <button 
            key={tab} 
            onClick={() => setDashTab(tab)}
            className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all border-b-2 whitespace-nowrap ${dashTab === tab ? 'border-maroon dark:border-gold text-maroon dark:text-gold' : 'border-transparent text-gray-400 hover:text-black dark:hover:text-gold'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
        {dashTab === 'overview' && (
          <>
            <div className="lg:col-span-8 space-y-10 md:space-y-16 animate-fade-in">
              <div className="bg-maroon text-gold p-10 md:p-16 border-premium flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="w-full">
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] block mb-6 opacity-70">Secured Reservoir</span>
                  <h3 className="text-5xl md:text-8xl font-black tracking-tighter leading-none break-all">{creatorBalance.toLocaleString()} <span className="text-xl md:text-3xl opacity-60">{activeCurrency.code}</span></h3>
                </div>
                <button className="w-full md:w-auto px-12 py-6 bg-gold text-maroon font-black uppercase tracking-[0.3em] text-[10px] border border-black transition-all btn-press">Initiate Payout</button>
              </div>
              <div className="bg-white dark:bg-[#0A0A0A] border-premium p-8 md:p-12">
                <h4 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-12 border-b-2 border-black/5 pb-6">Network Intelligence</h4>
                <div className="space-y-8">
                  {activities.map(activity => (
                    <div key={activity.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-8 p-6 md:p-8 bg-gray-50 dark:bg-black border border-black/5 dark:border-gold/10">
                      <div className="w-12 h-12 bg-white dark:bg-[#0F0F0F] border border-black/10 dark:border-gold/30 flex items-center justify-center text-maroon dark:text-gold text-xl shrink-0"><i className={`fas ${activity.icon}`}></i></div>
                      <div className="flex-grow w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                          <h5 className="text-sm font-black uppercase tracking-widest leading-none">{activity.title}</h5>
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{activity.timestamp}</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.05em] mt-3 leading-relaxed">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-4 space-y-10 md:space-y-16">
              <div className="bg-white dark:bg-[#0A0A0A] border-premium p-8 md:p-12">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] mb-10">Linked Gates</h4>
                <div className="space-y-5 mb-10">
                  {user.paymentMethods?.map(pm => (
                    <div key={pm.id} className="p-5 border border-black/10 dark:border-gold/30 bg-gray-50 dark:bg-black flex items-center justify-between gap-6">
                      <div className="flex items-center gap-5 min-w-0">
                        <i className={`fas ${pm.type === 'bank' ? 'fa-building-columns' : 'fa-wallet'} text-maroon dark:text-gold shrink-0`}></i>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-widest truncate">{pm.label}</p>
                          <p className="text-[10px] font-bold text-gray-400 truncate opacity-60">{pm.provider} • {pm.accountNumber}</p>
                        </div>
                      </div>
                      <button className="text-[9px] font-black text-maroon dark:text-gold uppercase hover:opacity-70 transition-opacity shrink-0">Edit</button>
                    </div>
                  ))}
                </div>
                <button className="w-full py-6 border border-dashed border-black/30 dark:border-gold/40 font-black text-[9px] uppercase tracking-[0.2em] text-gray-400 hover:border-maroon hover:text-maroon dark:hover:border-gold dark:hover:text-gold transition-all">Connect New Gate</button>
              </div>
              
              <div className="bg-maroon/5 dark:bg-gold/5 p-10 border border-maroon/20 dark:border-gold/20">
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 text-maroon dark:text-gold">Sustainability Logic</h4>
                <p className="text-[11px] font-medium text-gray-600 dark:text-gray-400 uppercase leading-relaxed tracking-wider mb-8">
                  Mandatory weekly livelihood credit ($200) initiates automatically every Monday at 00:00 UTC.
                </p>
                <div className="text-[9px] font-bold text-maroon/40 dark:text-gold/40 uppercase tracking-[0.3em] pt-6 border-t border-black/5 dark:border-gold/10">
                   Auto-Clearance Enabled
                </div>
              </div>
            </div>
          </>
        )}

        {dashTab === 'security' && (
          <div className="lg:col-span-12 max-w-2xl mx-auto w-full animate-fade-in">
            <div className="bg-white dark:bg-[#0A0A0A] border-premium p-10 md:p-16">
              <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">{t.securitySettings || 'Security Protocol'}</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-12">{t.activityDesc || 'Update your authentication keys.'}</p>
              
              <div className="space-y-12">
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{t.newPassword}</label>
                  <input 
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-900 border-b border-black/10 dark:border-gold/20 focus:border-maroon dark:focus:border-gold transition-all outline-none font-bold text-sm uppercase tracking-tight"
                  />
                  
                  {/* Real-time Validation for Password Change */}
                  {newPassword.length > 0 && (
                    <div className="mt-8 space-y-6 animate-fade-in">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-maroon dark:text-gold">
                          {strengthLabel}
                        </span>
                        <span className="text-[9px] font-black text-gray-300">
                          {Math.round(strengthPercentage)}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 dark:bg-zinc-800 border border-black/5">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            strengthPercentage < 60 ? 'bg-red-500' : strengthPercentage < 100 ? 'bg-gold' : 'bg-green-600'
                          }`}
                          style={{ width: `${strengthPercentage}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {passwordRequirements.map(req => (
                          <div key={req.key} className="flex items-center gap-3">
                            <div className={`w-5 h-5 border flex items-center justify-center transition-all ${
                              req.met ? 'bg-maroon dark:bg-gold border-maroon dark:border-gold' : 'border-gray-200 dark:border-zinc-700'
                            }`}>
                              {req.met && <i className="fas fa-check text-[10px] text-white dark:text-black"></i>}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${
                              req.met ? 'text-black dark:text-white' : 'text-gray-300'
                            }`}>
                              {req.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleChangePassword}
                  disabled={!isNewPasswordValid || isChangingPass}
                  className="w-full py-6 bg-maroon text-gold font-black border border-black uppercase tracking-[0.5em] text-[10px] transition-all btn-press disabled:opacity-30"
                >
                  {isChangingPass ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-shield-alt mr-3"></i>}
                  {t.changePassword}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {dashTab === 'payouts' && (
          <div className="lg:col-span-12 animate-fade-in">
            <div className="bg-white dark:bg-[#0A0A0A] border-premium p-10 md:p-16">
              <h4 className="text-2xl font-black uppercase tracking-tighter mb-12">Payout History</h4>
              <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-black/5 dark:border-gold/10">
                <i className="fas fa-receipt text-5xl text-gray-200 dark:text-zinc-800 mb-6"></i>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">No recent payout clearance found.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCreatorProfile = () => {
    if (!selectedCreator) return null;
    const isVerified = selectedCreator.verificationStatus === 'verified';

    return (
      <div className="animate-fade-in pb-32">
        <div className="relative h-64 md:h-96 w-full border-b border-black/10 dark:border-gold/20">
          <img 
            src={selectedCreator.coverImage} 
            alt={selectedCreator.name} 
            className="w-full h-full object-cover grayscale opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0F0F0F] to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-20 md:-mt-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-end mb-16">
            <div className="w-40 h-40 md:w-56 md:h-56 bg-white dark:bg-black border-premium p-1 shrink-0 overflow-hidden shadow-2xl">
              <img 
                src={selectedCreator.avatar} 
                alt={selectedCreator.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow pb-4">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{selectedCreator.name}</h1>
                {isVerified && <i className="fas fa-check-circle text-gold text-2xl"></i>}
              </div>
              <div className="flex flex-wrap gap-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Patrons</span>
                  <span className="text-xl font-black">{(selectedCreator.stats?.supporters || 0).toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Niche</span>
                  <span className="text-xl font-black uppercase tracking-tighter">{selectedCreator.niche}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleDonateStart}
              className="w-full md:w-auto px-12 py-6 bg-maroon text-gold font-black uppercase tracking-[0.4em] text-[10px] border border-black shadow-xl hover:scale-105 transition-all btn-press"
            >
              {t.supportNow}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8">
              <div className="flex border-b border-black/10 dark:border-gold/20 mb-12">
                {(['feed', 'about', 'tiers'] as const).map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setProfileTab(tab)}
                    className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all border-b-2 ${profileTab === tab ? 'border-maroon dark:border-gold text-maroon dark:text-gold' : 'border-transparent text-gray-400 hover:text-black dark:hover:text-gold'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {profileTab === 'feed' && (
                <div className="space-y-12 animate-fade-in">
                  {selectedCreator.feed?.map(item => (
                    <div key={item.id} className="bg-white dark:bg-[#0A0A0A] border-premium overflow-hidden">
                      {item.image && <img src={item.image} alt={item.title} className="w-full aspect-video object-cover grayscale hover:grayscale-0 transition-all duration-500" />}
                      <div className="p-10 md:p-14">
                        <div className="flex justify-between items-start mb-6">
                          <h3 className="text-2xl font-black uppercase tracking-tighter">{item.title}</h3>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tight leading-loose mb-10">
                          {item.content}
                        </p>
                        <div className="flex items-center gap-8 pt-8 border-t border-black/5 dark:border-gold/10">
                          <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:text-maroon dark:hover:text-gold transition-colors">
                            <i className="far fa-heart"></i> {item.likes}
                          </button>
                          <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:text-maroon dark:hover:text-gold transition-colors">
                            <i className="far fa-comment"></i> Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!selectedCreator.feed || selectedCreator.feed.length === 0) && (
                    <div className="py-24 text-center border-2 border-dashed border-black/5 dark:border-gold/10">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Nothing found in the transmission.</p>
                    </div>
                  )}
                </div>
              )}

              {profileTab === 'about' && (
                <div className="space-y-12 animate-fade-in">
                  <div className="p-12 bg-white dark:bg-[#0A0A0A] border-premium">
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 border-b-2 border-black/5 pb-6">Manifesto</h3>
                    <p className="text-base text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tight leading-relaxed">
                      {selectedCreator.bio}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                     <div className="p-10 bg-maroon text-gold border-premium">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4 block">Total Raised</span>
                        <div className="text-3xl font-black tracking-tighter">{selectedCreator.totalRaised.toLocaleString()} <span className="text-sm opacity-50">{selectedCreator.currency}</span></div>
                     </div>
                     <div className="p-10 bg-white dark:bg-black border-premium">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block">Supporters</span>
                        <div className="text-3xl font-black tracking-tighter">{selectedCreator.stats?.supporters.toLocaleString()}</div>
                     </div>
                  </div>
                </div>
              )}

              {profileTab === 'tiers' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
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
              )}
            </div>

            <div className="lg:col-span-4 space-y-10">
              {selectedCreator.activeGoal && (
                <GoalProgress 
                  goal={selectedCreator.activeGoal} 
                  currency={selectedCreator.currency} 
                  language={language} 
                />
              )}
              
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-10 border border-black/10 dark:border-gold/20">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8">Identity Clearance</h4>
                <div className="flex items-center gap-5 p-5 bg-white dark:bg-black border border-black/5">
                   <div className={`w-3 h-3 rounded-full ${isVerified ? 'bg-green-500' : 'bg-gold'}`}></div>
                   <span className="text-[9px] font-black uppercase tracking-widest">{isVerified ? 'Full Protocol Access' : 'Initial Trust Layer'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDonate = () => {
    if (!selectedCreator) return null;

    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32 animate-fade-in">
        <button 
          onClick={() => setView('creator-profile')}
          className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-black dark:hover:text-gold mb-16 transition-all flex items-center gap-3"
        >
          <i className="fas fa-arrow-left text-[8px]"></i> {t.backToProfile}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32">
          <div className="lg:col-span-7">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-16 leading-none break-words">Support <br/><span className="text-maroon dark:text-gold">{selectedCreator.name}</span></h1>
            
            <div className="space-y-16">
              <div>
                <div className="badge mb-8">{t.chooseTier}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
              </div>

              <div>
                <div className="badge mb-8">{t.customAmount}</div>
                <div className="relative">
                  <input 
                    type="number"
                    value={donationAmount}
                    onChange={(e) => { setDonationAmount(Number(e.target.value)); setSelectedTierId(null); setShowQR(false); }}
                    className="w-full pl-20 pr-8 py-10 bg-white dark:bg-[#0A0A0A] border-premium outline-none font-black text-4xl md:text-6xl tracking-tighter uppercase focus:border-maroon dark:focus:border-gold transition-all"
                  />
                  <span className="absolute left-10 top-1/2 -translate-y-1/2 font-black text-3xl md:text-4xl text-maroon dark:text-gold">{selectedCreator.currency}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                   <div className="badge mb-8">{t.donorDetails}</div>
                   {!user.isLoggedIn ? (
                     <div className="group">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Display Name</label>
                        <input 
                          type="text"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          placeholder="Anonymous"
                          className="w-full px-6 py-5 bg-white dark:bg-black border-premium outline-none font-black text-sm uppercase tracking-widest focus:border-maroon dark:focus:border-gold transition-all"
                        />
                     </div>
                   ) : (
                     <div className="p-8 bg-zinc-50 dark:bg-zinc-900 border border-black/5 flex items-center gap-6">
                        <div className="w-12 h-12 bg-maroon text-gold flex items-center justify-center font-black text-xs">{user.name[0].toUpperCase()}</div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest">Active Supporter</p>
                          <p className="text-[11px] font-bold text-gray-500 uppercase">{user.name}</p>
                        </div>
                     </div>
                   )}
                </div>
                <div>
                   <div className="badge mb-8">{t.paymentMethod}</div>
                   <div className="relative">
                      <select 
                        value={selectedProvider}
                        onChange={(e) => setSelectedProvider(e.target.value)}
                        className="w-full appearance-none px-8 py-6 bg-white dark:bg-black border-premium outline-none font-black text-[10px] uppercase tracking-[0.3em] cursor-pointer"
                      >
                        {PAYMENT_PROVIDERS.eWallets.map(p => <option key={p} value={p}>{p}</option>)}
                        {PAYMENT_PROVIDERS.banks.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <i className="fas fa-chevron-down absolute right-8 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none opacity-40"></i>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-24">
              {showQR ? (
                <div className="animate-fade-in space-y-10">
                  <QRGenerator 
                    value={`clearance-${selectedCreator.id}`} 
                    amount={donationAmount} 
                    currency={selectedCreator.currency} 
                    provider={selectedProvider} 
                    language={language}
                  />
                  
                  {thankYouMessage && (
                    <div className="p-10 bg-maroon text-gold border-premium animate-slide-up">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 opacity-60">Message from {selectedCreator.name}</h4>
                       <p className="text-sm font-bold uppercase leading-relaxed tracking-tight italic">
                         "{thankYouMessage}"
                       </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-[#0A0A0A] border-premium p-10 md:p-14 text-center">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mb-10">Donation Protocol</div>
                  <div className="text-4xl md:text-6xl font-black mb-12 tracking-tighter">
                    {donationAmount.toLocaleString()} <span className="text-maroon dark:text-gold">{selectedCreator.currency}</span>
                  </div>
                  <button 
                    onClick={handleGenerateQR}
                    disabled={isGenerating || donationAmount < 1}
                    className="w-full py-8 bg-black text-gold dark:bg-gold dark:text-black font-black uppercase tracking-[0.5em] text-[10px] border border-black hover:opacity-90 transition-all btn-press disabled:opacity-30"
                  >
                    {isGenerating ? <><i className="fas fa-spinner fa-spin mr-3"></i> Processing</> : <><i className="fas fa-qrcode mr-3"></i> {t.confirmPay}</>}
                  </button>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-10 leading-loose">
                    {t.fundingDisclaimer}
                  </p>
                </div>
              )}
            </div>
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
