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
    <div className="bg-white dark:bg-[#0A0A0A] border-premium shadow-flat p-10">
      <div className={`flex justify-between items-start mb-10 ${t.isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="max-w-[70%]">
          <span className="badge mb-4">
            {t.activeGoal}
          </span>
          <h3 className="text-3xl font-black uppercase tracking-tighter leading-[0.9]">{goal.title}</h3>
        </div>
        <div className="text-right">
          <span className="text-5xl font-black text-maroon dark:text-gold italic leading-none">{Math.round(progress)}%</span>
        </div>
      </div>
      
      <div className="w-full h-6 bg-gray-100 dark:bg-black border-premium mb-10 overflow-hidden relative">
        <div 
          className="h-full bg-gold border-r-2 border-black transition-all duration-1000 ease-out shadow-[4px_0px_10px_rgba(0,0,0,0.1)]"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="grid grid-cols-2 gap-px bg-black dark:bg-gold border-premium">
        <div className="p-6 bg-white dark:bg-[#0A0A0A]">
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2">Impact Funded</span>
          <span className="text-2xl font-black text-maroon dark:text-gold tracking-tight">{goal.currentAmount.toLocaleString()} <span className="text-xs uppercase ml-1">{currency}</span></span>
        </div>
        <div className="p-6 bg-white dark:bg-[#0A0A0A] text-right">
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2">Final Milestone</span>
          <span className="text-2xl font-black tracking-tight">{goal.targetAmount.toLocaleString()} <span className="text-xs uppercase ml-1">{currency}</span></span>
        </div>
      </div>
      
      {goal.description && (
        <div className="mt-10 p-6 bg-gray-50 dark:bg-black border-l-4 border-maroon dark:border-gold italic font-medium text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          "{goal.description}"
        </div>
      )}
    </div>
  );
};

export default GoalProgress;