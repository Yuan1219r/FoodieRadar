import React, { useState, useEffect } from 'react';
import { Restaurant } from '../types';
import { Star, Flame, MapPin, Clock, CircleDollarSign } from 'lucide-react';
import { getConsistentFallbackImage } from '../constants';

interface RestaurantCardProps {
  data: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ data }) => {
  const [imgSrc, setImgSrc] = useState(data.imageUrl);

  useEffect(() => {
    setImgSrc(data.imageUrl);
  }, [data.imageUrl]);

  const handleImageError = () => {
    const fallback = getConsistentFallbackImage(data.name);
    if (imgSrc !== fallback) setImgSrc(fallback);
  };

  const formatDistance = (dist?: string | number) => {
    if (!dist) return null;
    const dStr = String(dist).toLowerCase();
    return (dStr.includes('km') || dStr.includes('m')) ? String(dist) : `${dist} km`;
  };

  return (
    <a 
      href={data.googleMapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="sheen liquid-glass rounded-[32px] overflow-hidden hover:shadow-glass-hover hover:-translate-y-3 transition-all duration-500 block h-full flex flex-col group border-white/10"
    >
      {/* Visual Header */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img 
          src={imgSrc} 
          alt={data.name} 
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent"></div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className={`backdrop-blur-xl px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/20 ${data.isOpen ? 'bg-green-500/30 text-green-400' : 'bg-red-500/30 text-red-400'}`}>
            {data.isOpen ? 'Open Now' : 'Closed'}
          </div>
        </div>

        {formatDistance(data.distance) && (
          <div className="absolute top-4 right-4 bg-primary/20 backdrop-blur-xl border border-primary/40 text-primary font-black text-[10px] px-3 py-1.5 rounded-2xl flex items-center gap-1.5">
            <MapPin size={10} />
            {formatDistance(data.distance)}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {data.name}
        </h3>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <Star size={16} className="fill-primary text-primary" />
            <span className="font-black text-white">{data.rating.toFixed(1)}</span>
            <span className="text-white/30 text-xs font-medium">({data.reviewCount})</span>
          </div>
          
          {data.avgPrice > 0 && (
            <div className="text-primary/90 font-black text-sm flex items-center gap-1">
              <span className="text-[10px] opacity-60">NT$</span>
              {data.avgPrice.toLocaleString()}
            </div>
          )}
        </div>

        <p className="text-white/50 text-sm leading-relaxed mb-6 line-clamp-2 italic">
          "{data.summary}"
        </p>

        {/* Action / Popularity */}
        <div className="mt-auto flex items-center justify-between pt-5 border-t border-white/5">
           <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            <Flame size={12} className="text-orange-500 animate-pulse" />
            <span className="text-white/60 font-bold text-[10px] uppercase tracking-tighter">Hot {data.popularity}</span>
          </div>
          <CircleDollarSign size={18} className="text-white/20 group-hover:text-primary transition-colors" />
        </div>
      </div>
    </a>
  );
};