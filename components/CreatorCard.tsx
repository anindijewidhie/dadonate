
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
      text: `Empowering ${creator.name}'s journey. Support them on dadonate!`,
      url: shareUrl,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      });
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Profile link copied to clipboard!');
      }).catch(console.error);
    }
  };

  return (
    <div 
      className="bg-white dark:bg-[#0A0A0A] border-premium transition-all duration-300 cursor-pointer group flex flex-col h-full overflow-hidden hover:border-maroon dark:hover:border-gold"
      onClick={() => onClick(creator)}
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-black/10 dark:border-gold/20">
        <img 
          src={creator.coverImage} 
          alt={creator.name} 
          className="w-full h-full object-cover grayscale opacity-80 transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
        />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="badge">
            {creator.niche}
          </span>
        </div>

        {/* Floating Share Button */}
        <button 
          onClick={handleShare}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-black/90 border border-black/20 dark:border-gold/20 flex items-center justify-center text-maroon dark:text-gold hover:bg-maroon hover:text-gold dark:hover:bg-gold dark:hover:text-black transition-all z-10"
          title="Share Profile"
        >
          <i className="fas fa-share-nodes text-sm"></i>
        </button>
      </div>
      
      <div className="p-8 md:p-10 flex flex-col flex-grow">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-16 h-16 border border-black/10 dark:border-gold/30 bg-white dark:bg-black overflow-hidden flex-shrink-0 transition-all group-hover:border-maroon dark:group-hover:border-gold">
            <img 
              src={creator.avatar} 
              alt={creator.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-xl uppercase leading-none tracking-tight group-hover:text-maroon dark:group-hover:text-gold transition-colors truncate">
                {creator.name}
              </h3>
              {isVerified && <i className="fas fa-check-circle text-gold text-xs shrink-0"></i>}
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 truncate">@{creator.username}</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 font-bold mb-10 h-10 leading-relaxed uppercase tracking-tight line-clamp-2">
          {creator.bio}
        </p>
        
        <div className="mt-auto pt-8 border-t border-black/5 dark:border-gold/10 flex flex-col sm:flex-row gap-6 justify-between items-center">
          <div className="flex gap-8 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Patrons</span>
              <span className="text-sm font-black">{(creator.stats?.supporters || 0).toLocaleString()}</span>
            </div>
            
            {/* Primary Share Action */}
            <button 
              onClick={handleShare}
              className="flex items-center gap-3 text-[10px] font-black text-gray-400 hover:text-maroon dark:hover:text-gold transition-colors uppercase tracking-[0.2em]"
              title="Share to Social Media"
            >
              <i className="fas fa-share-alt text-xs"></i> 
              <span>Share Profile</span>
            </button>
          </div>
          
          <button className="text-[10px] font-black text-maroon dark:text-gold uppercase tracking-[0.3em] group-hover:translate-x-2 transition-transform whitespace-nowrap">
            Support Now →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorCard;
