import { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps';
import './WorldMap.css';

// Using a lightweight TopoJSON for real-world political country boundaries
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

const CHART_COLORS = ['#7c3aed', '#06b6d4', '#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#f97316', '#6366f1', '#a78bfa', '#14b8a6', '#f87171', '#fbbf24'];

export default function WorldMap({ geoData }) {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const maxAttacks = useMemo(() => Math.max(...geoData.map(g => g.attacks)), [geoData]);

  return (
    <div className="world-map-wrapper">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 110, center: [0, 35] }}
        width={800}
        height={450}
        style={{ width: "100%", height: "auto" }}
      >
        {/* Glow filter definition for the real SVG */}
        <defs>
          <filter id="glowLargeMap" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Real-world Political Boundaries */}
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                className="real-country-path"
                style={{
                  default: { fill: "rgba(124,58,237,0.06)", outline: "none", stroke: "rgba(124,58,237,0.15)", strokeWidth: 0.5 },
                  hover: { fill: "rgba(124,58,237,0.15)", outline: "none", stroke: "rgba(124,58,237,0.3)", strokeWidth: 0.5 },
                  pressed: { fill: "rgba(124,58,237,0.2)", outline: "none", stroke: "rgba(124,58,237,0.4)", strokeWidth: 0.5 },
                }}
              />
            ))
          }
        </Geographies>

        {/* Connection lines between hotspots (subtle network effect) */}
        {geoData.slice(0, 6).map((loc1, i) => {
          return geoData.slice(i + 1, i + 3).map((loc2, j) => {
            return (
              <Line
                key={`line-${i}-${j}`}
                from={[loc1.lng, loc1.lat]}
                to={[loc2.lng, loc2.lat]}
                stroke="rgba(124,58,237,0.1)"
                strokeWidth={1}
                strokeDasharray="4 4"
                className="connection-line"
              />
            );
          });
        })}

        {/* Attack hotspot markers mapped to real coordinates */}
        {geoData.map((loc, i) => {
          const intensity = loc.attacks / maxAttacks;
          const dotR = 3 + intensity * 6;
          const color = CHART_COLORS[i % CHART_COLORS.length];
          const isHovered = hoveredCountry === loc.country;
          const glowR = 15 + intensity * 35;

          return (
            <Marker
              key={loc.country}
              coordinates={[loc.lng, loc.lat]}
              onMouseEnter={() => setHoveredCountry(loc.country)}
              onMouseLeave={() => setHoveredCountry(null)}
              className="hotspot-group"
            >
              <defs>
                <radialGradient id={`hotspotGlowRSM${i}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                  <stop offset="60%" stopColor={color} stopOpacity="0.1" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Large ambient glow behind the marker */}
              <circle cx={0} cy={0} r={glowR} fill={`url(#hotspotGlowRSM${i})`} className="hotspot-glow" style={{ pointerEvents: 'none' }} />

              {/* Outer pulse ring */}
              <circle cx={0} cy={0} r={dotR * 1.5} fill="none" stroke={color} strokeWidth="1" opacity="0.4" className="pulse-ring">
                <animate attributeName="r" values={`${dotR};${dotR * 3};${dotR}`} dur={`${2 + i * 0.2}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0;0.4" dur={`${2 + i * 0.2}s`} repeatCount="indefinite" />
              </circle>
              
              {/* Second pulse ring */}
              <circle cx={0} cy={0} r={dotR * 1.5} fill="none" stroke={color} strokeWidth="0.5" opacity="0.2">
                <animate attributeName="r" values={`${dotR * 2};${dotR * 4};${dotR * 2}`} dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0;0.2" dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>

              {/* Core interactive dot */}
              <circle
                cx={0} cy={0} r={isHovered ? dotR * 1.5 : dotR}
                fill={color}
                opacity={0.9}
                filter={isHovered ? "url(#glowLargeMap)" : "none"}
                className="hotspot-core"
                style={{ transition: 'r 0.3s ease' }}
              />
              
              {/* Bright inner dot center */}
              <circle cx={0} cy={0} r={dotR * 0.4} fill="#ffffff" opacity="0.8" style={{ pointerEvents: 'none' }} />

              {/* Tooltip on hover */}
              {isHovered && (
                <g className="map-tooltip-group" style={{ pointerEvents: 'none' }}>
                  <rect
                    x={8} y={-38}
                    width={Math.max(loc.country.length * 8 + 65, 125)} height="42"
                    rx="6"
                    fill="rgba(10,10,30,0.95)"
                    stroke={color}
                    strokeWidth="1"
                    strokeOpacity="0.6"
                  />
                  <text x={18} y={-20} fill="#f0f0ff" fontSize="11" fontFamily="'Space Grotesk', sans-serif" fontWeight="600">
                    {loc.country}
                  </text>
                  <text x={18} y={-5} fill={color} fontSize="12" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
                    {loc.attacks.toLocaleString()} attacks
                  </text>
                </g>
              )}
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
}
