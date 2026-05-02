"use client";

import React from 'react';
import { Users, Info, TrendingDown, Clock } from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { useState } from 'react';
import CrowdReportModal from './CrowdReportModal';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export const getBarColor = (context: any) => {
  const val = context.raw as number;
  if (val > 70) return '#D2042D';
  if (val > 40) return '#FFB800';
  return '#4ade80';
};

export const getTooltipLabel = (context: any) => {
  const val = context.raw as number;
  if (val > 70) return 'High';
  if (val > 40) return 'Moderate';
  return 'Low';
};

const chartData = {
  labels: ['6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm'],
  datasets: [
    {
      label: 'Crowd Density',
      data: [15, 85, 45, 30, 20, 60, 95, 20],
      backgroundColor: getBarColor,
      borderRadius: 8,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      callbacks: {
        label: getTooltipLabel
      }
    }
  },
  scales: {
    y: { display: false, max: 100 },
    x: {
      grid: { display: false },
      ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10, weight: 'bold' as const } }
    }
  }
};

export default function PollStatusCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-5 md:p-6 rounded-[32px] border-white/10 shadow-premium h-full flex flex-col"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <Users size={20} />
          </div>
          <div>
            <h3 className="font-black text-lg">LIVE CROWD</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-ping" />
              <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Real-time status</span>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors opacity-40">
           <Info size={18} />
        </button>
      </div>

      <div className="bg-white/5 rounded-2xl p-4 mb-6 flex items-center justify-between border border-white/5">
        <div>
          <p className="text-xs font-bold opacity-40 uppercase tracking-wide mb-1">Current state</p>
          <div className="flex items-center gap-2">
             <span className="text-2xl font-black text-brand-secondary">MODERATE</span>
          </div>
        </div>
        <div className="text-right">
           <p className="text-xs font-bold opacity-40 uppercase tracking-wide mb-1">Wait Time</p>
           <p className="text-xl font-bold italic">~15 MINS</p>
        </div>
      </div>

      <div className="flex-grow min-h-[180px] mb-6">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="pt-6 border-t border-white/5 space-y-4">
        <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/20">
           <div className="flex items-center gap-2">
              <TrendingDown size={16} className="text-green-500" />
              <span className="text-xs font-bold text-green-500">BEST TIME TO VOTE</span>
           </div>
           <span className="text-xs font-black text-green-500 uppercase tracking-widest">2PM – 4PM</span>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold opacity-40 px-1">
           <Clock size={12} />
           <p>Last updated: 2 mins ago via user reports</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
        >
          REPORT CROWD STATUS
        </button>
      </div>

      <CrowdReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </motion.div>
    </>
  );
}
