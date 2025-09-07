import {NavLink} from 'react-router';

export function Hero() {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 md:p-12 text-white shadow-xl md:flex-row md:items-center md:justify-between min-h-[500px] md:min-h-[600px]">

      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-background.png')",
          opacity: 0.3
        }}
      />

      {/* Content */}
      <div className="relative z-10 space-y-3 md:w-3/5">
        <h2 
          className="text-6xl leading-tight font-bold tracking-tight md:text-6xl lg:text-7xl xl:text-8xl"
          style={{ fontSize: 'clamp(3rem, 8vw, 8rem)' }}
        >
          Discover Your <span className="text-purple-400">Desire</span>
        </h2>
        <p 
          className="max-w-xl text-base text-gray-300 md:text-lg lg:text-xl"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}
        >
          Explore our premium collection of intimate products designed for your pleasure and satisfaction. 
          High-quality materials, discreet shipping, and exceptional customer service.
        </p>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:gap-4">
          <NavLink 
            to="/collections/all"
            className="rounded-md bg-purple-500 px-6 py-2 font-medium transition-all hover:bg-purple-600 text-center no-underline"
            style={{textDecoration: 'none', color: 'white'}}
          >
            Shop Now
          </NavLink>
          <NavLink 
            to="/collections/all"
            className="rounded-md border border-white/30 bg-transparent px-6 py-2 font-medium transition-all hover:bg-white/10 text-center no-underline"
            style={{textDecoration: 'none', color: 'white'}}
          >
            View Collection
          </NavLink>
        </div>
      </div>

      {/* Promo Code */}
      <div className="relative z-10 mt-6 h-60 w-full md:mt-0 md:h-80 md:w-2/5">
        <div className="absolute -top-4 -right-4 h-60 w-60 rounded-full bg-purple-500/30 blur-xl"></div>
        <div className="relative h-full w-full flex flex-col items-center justify-center text-center">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
            15% DISCOUNT
          </div>
          <div className="text-white/80 text-lg md:text-xl mb-4">
            With Promo Code
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-3 text-white text-xl md:text-2xl font-mono font-bold tracking-wider">
            WELCOME15
          </div>
        </div>
      </div>
    </div>
  );
}
