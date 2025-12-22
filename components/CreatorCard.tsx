
import React from 'react';
import { Creator } from '../types';

interface CreatorCardProps {
  creator: Creator;
  onClick: (creator: Creator) => void;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator, onClick }) => {
  const isVerified = creator.verificationStatus === 'verified';

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}?creator=${creator.username}`;
    const shareData = {
      title: `Support ${creator.name} on dadonate`,
      text: `Empowering ${creator.name}'s journey as a ${creator.niche}. Support them today on dadonate!`,
      url: shareUrl,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => {
        console.error('Error sharing:', err);
      });
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Profile link copied to clipboard!');
      }).catch(err => {
        console.error('Could not copy text: ', err);
      });
    }
  };

  return (
    <div 
      className="bg-white dark:bg-[#0A0A0A] border-premium shadow-flat hover:shadow-flat-lg transition-all duration-300 cursor-pointer group flex flex-col h-full overflow-hidden"
      onClick={() => onClick(creator)}
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b-2 border-black dark:border-gold">
        <img 
          src={creator.coverImage} 
          alt={`${creator.name} cover`} 
          className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
        />
        
        {/* TOP LEFT BADGES */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="badge">
            {creator.niche}
          </span>
          {isVerified && (
            <div className="bg-gold text-maroon w-8 h-8 border-premium flex items-center justify-center text-sm shadow-flat">
              <i className="fas fa-check"></i>
            </div>
          )}
        </div>

        {/* SHARE BUTTON */}
        <button 
          onClick={handleShare}
          className="absolute top-4 right-4 w-10 h-10 bg-white dark:bg-black border-premium shadow-flat flex items-center justify-center text-maroon dark:text-gold hover:bg-maroon hover:text-gold dark:hover:bg-gold dark:hover:text-black transition-all z-10 btn-press"
          title="Share Profile"
        >
          <i className="fas fa-share-nodes"></i>
        </button>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-14 h-14 border-premium bg-white dark:bg-black overflow-hidden flex-shrink-0 group-hover:rotate-3 transition-transform">
            <img 
              src={creator.avatar} 
              alt={creator.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-xl uppercase leading-none tracking-tight group-hover:text-maroon dark:group-hover:text-gold transition-colors">
                {creator.name}
              </h3>
              {isVerified && (
                <i className="fas fa-check-circle text-gold text-sm"></i>
              )}
            </div>
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">@{creator.username}</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium line-clamp-2 mb-8 h-10 leading-snug">
          {creator.bio}
        </p>
        
        <div className="mt-auto pt-6 border-t-2 border-black/5 dark:border-gold/20 grid grid-cols-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Supporters</span>
            <span className="text-base font-black italic">{(creator.stats?.supporters || 0).toLocaleString()}</span>
          </div>
          <div className="flex flex-col text-right justify-center">
            <span className="text-xs font-black text-maroon dark:text-gold uppercase tracking-widest group-hover:mr-2 transition-all">Support →</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorCard;
