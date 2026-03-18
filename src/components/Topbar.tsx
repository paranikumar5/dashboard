import React from 'react';
import { Calendar, Filter, Save, Play, ChevronDown, Share2 } from 'lucide-react';

interface TopbarProps {
  onSave: () => void;
  onPreview: () => void;
  timeRange: string;
  setTimeRange: (range: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onSave, onPreview, timeRange, setTimeRange }) => {
  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0 relative z-10">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shadow-sm transition-all hover:bg-slate-100/50">
          <Calendar size={18} className="text-slate-400" />
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer appearance-none pr-6"
          >
            <option value="all">All Time</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="3m">Last 3 Months</option>
          </select>
          <div className="absolute right-4 pointer-events-none">
            <ChevronDown size={14} className="text-slate-400" />
          </div>
        </div>
        
        <div className="h-8 w-px bg-slate-100" />
        
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <Filter size={14} />
            <span>Active Filters</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-lg text-xs font-bold ring-1 ring-primary-100">Region: All</span>
            <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-lg text-xs font-bold ring-1 ring-primary-100">Category: All</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all active:scale-95">
          <Share2 size={20} className="text-slate-400" />
          Share
        </button>
        <button 
          onClick={onPreview}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all active:scale-95"
        >
          <Play size={20} className="text-slate-400" />
          Preview
        </button>
        <button 
          onClick={onSave}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-95"
        >
          <Save size={20} />
          Save Changes
        </button>
      </div>
    </header>
  );
};
