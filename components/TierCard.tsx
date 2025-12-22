import React from 'react';
import { Tier } from '../types';

interface TierCardProps {
  tier: Tier;
  currency: string;
  selected: boolean;
  onSelect: (tier: Tier) => void;
}

const TierCard: React.FC<TierCardProps> = ({ tier, currency, selected, onSelect }) => {
  return (
    <div 
      className={`relative p-8 border-premium transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
        selected 
          ? 'bg-maroon text-gold shadow-none translate-x-1 translate-y-1' 
          : 'bg-white dark:bg-[#0A0A0A] text-black dark:text-white shadow-flat hover:shadow-flat-lg hover:-translate-y-1'
      }`}
      onClick={() => onSelect(tier)}
    >
      {tier.isPremium && (
        <div className={`absolute -top-3 right-4 px-3 py-1 text-[10px] font-black uppercase tracking-widest border-premium ${
          selected ? 'bg-gold text-maroon' : 'bg-black text-white dark:bg-gold dark:text-black'
        }`}>
          Premium
        </div>
      )}

      <div>
        <h4 className="font-black text-2xl mb-3 uppercase tracking-tighter leading-none">{tier.title}</h4>
        <div className={`flex items-baseline gap-2 mb-6 ${selected ? 'text-white' : 'text-maroon dark:text-gold'}`}>
          <span className="text-4xl font-black">{tier.amount.toLocaleString()}</span>
          <span className="text-xs font-bold uppercase">{currency}</span>
        </div>
        <p className={`text-sm leading-relaxed mb-8 font-medium ${selected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
          {tier.description}
        </p>
      </div>

      <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest pt-6 border-t-2 ${
        selected ? 'border-white/20' : 'border-black/10 dark:border-gold/20'
      }`}>
        <div className={`w-5 h-5 border-2 flex items-center justify-center transition-all ${
          selected ? 'border-gold bg-gold text-maroon' : 'border-black dark:border-gold'
        }`}>
          {selected && <i className="fas fa-check text-[10px]"></i>}
        </div>
        {selected ? 'Selection Active' : 'Join Membership'}
      </div>
    </div>
  );
};

export default TierCard;