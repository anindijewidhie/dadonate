
import React from 'react';
import { Tier, Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface TierCardProps {
  tier: Tier;
  currency: string;
  selected: boolean;
  onSelect: (tier: Tier) => void;
  language: Language;
}

const TierCard: React.FC<TierCardProps> = ({ tier, currency, selected, onSelect, language }) => {
  const t = TRANSLATIONS[language];
  return (
    <div 
      className={`relative p-10 border-premium transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
        selected 
          ? 'bg-maroon text-gold border-maroon' 
          : 'bg-white dark:bg-[#0A0A0A] text-black dark:text-white hover:border-maroon dark:hover:border-gold'
      }`}
      onClick={() => onSelect(tier)}
    >
      {tier.isPremium && (
        <div className={`absolute -top-3 right-6 px-4 py-1 text-[10px] font-black uppercase tracking-widest border border-current ${
          selected ? 'bg-gold text-maroon' : 'bg-black text-white dark:bg-gold dark:text-black'
        }`}>
          Premium
        </div>
      )}

      <div>
        <h4 className="font-black text-2xl mb-4 uppercase tracking-tighter leading-none">{tier.title}</h4>
        <div className={`flex items-baseline gap-2 mb-8 ${selected ? 'text-white' : 'text-maroon dark:text-gold'}`}>
          <span className="text-4xl font-black">{tier.amount.toLocaleString()}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{currency}</span>
        </div>
        <p className={`text-xs leading-loose mb-10 font-bold uppercase tracking-wide ${selected ? 'text-white/70' : 'text-gray-400'}`}>
          {tier.description}
        </p>
      </div>

      <div className={`flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] pt-8 border-t ${
        selected ? 'border-white/10' : 'border-black/5 dark:border-gold/10'
      }`}>
        <div className={`w-6 h-6 border flex items-center justify-center transition-all ${
          selected ? 'border-gold bg-gold text-maroon' : 'border-black/20 dark:border-gold/40'
        }`}>
          {selected && <i className="fas fa-check text-[10px]"></i>}
        </div>
        <span className="group-hover:opacity-100 opacity-70 transition-opacity uppercase">
          {selected ? t.selectionActive : t.joinedMembership}
        </span>
      </div>
    </div>
  );
};

export default TierCard;
