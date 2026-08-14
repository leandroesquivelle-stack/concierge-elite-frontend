import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X } from 'lucide-react';

const FILTERS = ['All', 'Beach', 'Culture', 'Adventure'];

const DESTINATIONS = [
  {
    name: 'Santorini',
    country: 'Greece',
    tag: 'Culture',
    description: 'Iconic whitewashed architecture and breathtaking sunsets over the Aegean Sea.',
    // Approximate % position on the map image
    x: 52,
    y: 32,
  },
  {
    name: 'Swiss Alps',
    country: 'Switzerland',
    tag: 'Adventure',
    description: 'World-class skiing, dramatic peaks, and pristine alpine villages.',
    x: 48,
    y: 27,
  },
  {
    name: 'Dubai',
    country: 'UAE',
    tag: 'Culture',
    description: 'A dazzling blend of ultramodern architecture and rich Arabian heritage.',
    x: 60,
    y: 38,
  },
  {
    name: 'Maldives',
    country: 'Indian Ocean',
    tag: 'Beach',
    description: 'Overwater bungalows, crystal-clear lagoons, and coral reefs teeming with life.',
    x: 65,
    y: 46,
  },
  {
    name: 'Patagonia',
    country: 'Argentina & Chile',
    tag: 'Adventure',
    description: 'Remote glaciers, soaring granite towers, and untouched wilderness at the end of the world.',
    x: 28,
    y: 78,
  },
  {
    name: 'Amalfi Coast',
    country: 'Italy',
    tag: 'Beach',
    description: 'Dramatic cliffside villages, turquoise waters, and the finest Italian cuisine.',
    x: 50,
    y: 30,
  },
  {
    name: 'Kyoto',
    country: 'Japan',
    tag: 'Culture',
    description: 'Ancient temples, serene bamboo groves, and the sublime beauty of cherry blossom season.',
    x: 80,
    y: 33,
  },
  {
    name: 'Bora Bora',
    country: 'French Polynesia',
    tag: 'Beach',
    description: 'Emerald lagoons, lush volcanic peaks, and the most luxurious overwater villas on Earth.',
    x: 10,
    y: 55,
  },
];

const tagColors = {
  Beach: 'text-cyan-400 border-cyan-400/50 bg-cyan-400/10',
  Culture: 'text-amber-400 border-amber-400/50 bg-amber-400/10',
  Adventure: 'text-emerald-400 border-emerald-400/50 bg-emerald-400/10',
};

const pinColors = {
  Beach: '#22d3ee',
  Culture: '#fbbf24',
  Adventure: '#34d399',
};

export default function DestinationMap() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = DESTINATIONS.filter(d => activeFilter === 'All' || d.tag === activeFilter);

  return (
    <div className="w-full">
      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => { setActiveFilter(f); setSelected(null); }}
            className={`px-5 py-2 text-xs uppercase tracking-[0.18em] font-medium rounded-sm border transition-all duration-300 ${
              activeFilter === f
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-border/40" style={{ paddingBottom: '50%' }}>
        {/* World map SVG background */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/2560px-World_map_-_low_resolution.svg.png"
          alt="World Map"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          style={{ filter: 'brightness(0.5) sepia(0.3)' }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/70" />

        {/* Pins */}
        {DESTINATIONS.map(dest => {
          const isVisible = activeFilter === 'All' || dest.tag === activeFilter;
          const isSelected = selected?.name === dest.name;
          return (
            <motion.button
              key={dest.name}
              initial={false}
              animate={{ opacity: isVisible ? 1 : 0.15, scale: isSelected ? 1.3 : 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelected(isSelected ? null : dest)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${dest.x}%`, top: `${dest.y}%` }}
            >
              <div className="relative flex flex-col items-center">
                {/* Pulse ring */}
                {isVisible && (
                  <span
                    className="absolute w-6 h-6 rounded-full animate-ping opacity-30"
                    style={{ backgroundColor: pinColors[dest.tag] }}
                  />
                )}
                <MapPin
                  className="w-5 h-5 drop-shadow-lg transition-transform group-hover:scale-125"
                  style={{ color: pinColors[dest.tag] }}
                  fill={`${pinColors[dest.tag]}33`}
                />
                {/* Label on hover */}
                <span className="absolute bottom-full mb-1 whitespace-nowrap text-[10px] font-medium text-white bg-black/70 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {dest.name}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selected destination detail card */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 glass rounded-xl p-5 flex items-start justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-display text-xl font-semibold">{selected.name}</h3>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border font-medium ${tagColors[selected.tag]}`}>
                  {selected.tag}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">{selected.country}</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{selected.description}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 mt-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-5">
        {Object.entries(tagColors).map(([tag]) => (
          <div key={tag} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pinColors[tag] }} />
            <span className="text-xs text-muted-foreground">{tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}