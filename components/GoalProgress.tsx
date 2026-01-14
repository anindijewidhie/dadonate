
import React from 'react';
import { Goal, Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface GoalProgressProps {
  goal: Goal;
  currency: string;
  language: Language;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ goal, currency, language }) => {
  const t = TRANSLATIONS[language];
  const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
  
  return (
    <div className="bg-white dark:bg-[#0A0A0A] border-premium p-10">
      <div className={`flex justify-between items-start mb-10 ${t.isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="max-w-[75%]">
          <span className="badge mb-4">
            {t.activeGoal}
          </span>
          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">{goal.title}</h3>
        </div>
        <div className="text-right">
          <span className="text-4xl md:text-5xl font-black text-maroon dark:text-gold leading-none">{Math.round(progress)}%</span>
        </div>
      </div>
      
      <div className="w-full h-4 bg-gray-100 dark:bg-zinc-900 border border-black/10 dark:border-gold/20 mb-10 overflow-hidden">
        <div 
          className="h-full bg-gold transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="grid grid-cols-2 border border-black dark:border-gold">
        <div className="p-6 bg-white dark:bg-[#0A0A0A] border-r border-black dark:border-gold">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Funded</span>
          <span className="text-2xl font-black text-maroon dark:text-gold tracking-tight">{goal.currentAmount.toLocaleString()} <span className="text-[10px] uppercase ml-1 opacity-50">{currency}</span></span>
        </div>
        <div className="p-6 bg-white dark:bg-[#0A0A0A] text-right">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Target</span>
          <span className="text-2xl font-black tracking-tight">{goal.targetAmount.toLocaleString()} <span className="text-[10px] uppercase ml-1 opacity-50">{currency}</span></span>
        </div>
      </div>
      
      {goal.description && (
        <div className="mt-10 p-6 bg-zinc-50 dark:bg-zinc-900/40 border-l-2 border-maroon dark:border-gold font-medium text-xs leading-relaxed text-gray-500 uppercase tracking-wide">
          "{goal.description}"
        </div>
      )}
    </div>
  );
};

export default GoalProgress;
