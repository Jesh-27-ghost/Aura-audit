import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '00:00', traffic: 400 },
  { time: '04:00', traffic: 300 },
  { time: '08:00', traffic: 700 },
  { time: '12:00', traffic: 500 },
  { time: '16:00', traffic: 900 },
  { time: '20:00', traffic: 600 },
  { time: '24:00', traffic: 800 },
];

const AnimatedChart = () => {
  return (
    <div className="glass-card slide-up" style={{ padding: '24px', height: '350px', animationDelay: '0.1s' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Network Traffic Analysis</h3>
      <div style={{ width: '100%', height: '260px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent2)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="var(--accent2)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(229, 231, 235, 0.1)" vertical={false} />
            <XAxis dataKey="time" stroke="rgba(229, 231, 235, 0.5)" tick={{fill: 'rgba(229, 231, 235, 0.5)', fontSize: 12}} tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(229, 231, 235, 0.5)" tick={{fill: 'rgba(229, 231, 235, 0.5)', fontSize: 12}} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ background: 'var(--card-bg)', border: '1px solid rgba(229, 231, 235, 0.1)', borderRadius: '8px', backdropFilter: 'blur(12px)' }}
              itemStyle={{ color: 'var(--accent2)' }}
            />
            <Area type="monotone" dataKey="traffic" stroke="var(--accent2)" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" animationDuration={1500} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnimatedChart;
