import React, { useState, useRef } from 'react';
import { SearchForm } from './components/SearchForm';
import { RestaurantCard } from './components/RestaurantCard';
import { Loading } from './components/Loading';
import { searchRestaurantsWithGemini } from './services/geminiService';
import { Restaurant, SearchParams } from './types';
import { RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentParams, setCurrentParams] = useState<SearchParams | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (params: SearchParams, isLoadMore = false) => {
    if (!params.location) return; 
    
    setIsLoading(true);
    setCurrentParams(params);

    const existingNames = isLoadMore ? restaurants.map(r => r.name) : [];
    
    try {
      const newResults = await searchRestaurantsWithGemini(params, existingNames);
      setRestaurants(prev => isLoadMore ? [...prev, ...newResults] : newResults);

      if (!isLoadMore && newResults.length > 0) {
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch (error) {
      console.error("Search failed", error);
      alert("搜尋失敗，請稍後再試。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (currentParams) {
      handleSearch(currentParams, true);
    }
  };

  return (
    <div className="min-h-screen pb-24 relative selection:bg-primary/30">
      {/* Liquid Background Blobs */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <div className="bg-blob blob-3"></div>
      
      <Loading isVisible={isLoading} />

      <div className="container mx-auto px-4 pt-12 md:pt-20 flex flex-col items-center relative z-10">
        
        {/* Main Search Panel */}
        <div className="w-full max-w-4xl mb-16">
          <SearchForm onSearch={(params) => handleSearch(params)} isLoading={isLoading} />
        </div>

        {/* Results Grid */}
        <div ref={resultsRef} className="w-full max-w-[1400px] scroll-mt-20">
          {restaurants.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-2">
              {restaurants.map((restaurant) => (
                <div key={restaurant.id} className="h-full">
                  <RestaurantCard data={restaurant} />
                </div>
              ))}
            </div>
          )}

          {restaurants.length === 0 && !isLoading && currentParams && (
            <div className="text-center mt-20 p-12 liquid-glass rounded-3xl max-w-lg mx-auto">
               <p className="text-xl text-white/70 font-medium">找不到符合的餐廳，試試看其他條件？</p>
            </div>
          )}
        </div>
      </div>

      {/* Load More FAB - Glass Style */}
      {restaurants.length > 0 && !isLoading && (
        <button
          onClick={handleLoadMore}
          className="fixed bottom-10 right-10 w-16 h-16 rounded-2xl liquid-glass text-primary shadow-glass flex items-center justify-center z-50 group hover:scale-110 active:scale-95 transition-all duration-300 border-white/20"
          aria-label="Load More"
        >
          <RefreshCw size={28} className="group-hover:rotate-180 transition-transform duration-700" />
        </button>
      )}
    </div>
  );
};

export default App;