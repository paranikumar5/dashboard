import React from 'react';
import { 
  BarChart, LineChart, PieChart, AreaChart, 
  Table, CreditCard, Layout, Plus, Trash2, Settings,
  Activity, TrendingUp, Users, DollarSign, ShoppingCart,
  LayoutDashboard, List, LogOut
} from 'lucide-react';
import { WidgetType } from '../types';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  onAddWidget: (type: WidgetType) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  viewMode: 'edit' | 'preview';
}

const WIDGET_TEMPLATES = [
  { section: 'Charts', items: [
    { type: 'bar' as WidgetType, label: 'Bar Chart', icon: BarChart },
    { type: 'line' as WidgetType, label: 'Line Chart', icon: LineChart },
    { type: 'pie' as WidgetType, label: 'Pie Chart', icon: PieChart },
    { type: 'area' as WidgetType, label: 'Area Chart', icon: AreaChart },
  ]},
  { section: 'Tables', items: [
    { type: 'table' as WidgetType, label: 'Table Widget', icon: Table },
  ]},
  { section: 'KPIs', items: [
    { type: 'kpi' as WidgetType, label: 'KPI Value', icon: CreditCard },
  ]}
];

export const Sidebar: React.FC<SidebarProps> = ({ onAddWidget, activeTab, setActiveTab, viewMode }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2 text-emerald-600 mb-1">
          <Layout size={24} className="text-emerald-500" />
          <h1 className="font-bold text-xl text-gray-900 tracking-tight">FlexiDash</h1>
        </div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em]">Enterprise Analytics</p>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <div className="px-4 mb-10">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-5 px-3">Navigation</h3>
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                activeTab === 'dashboard' 
                  ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                activeTab === 'table' 
                  ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <List size={20} />
              <span>Table View</span>
            </button>
          </nav>
        </div>

        {viewMode === 'edit' && activeTab === 'dashboard' && (
          <div className="px-4">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-5 px-3">Components</h3>
            <div className="space-y-8">
              {WIDGET_TEMPLATES.map((section) => (
                <div key={section.section}>
                  <p className="text-[10px] font-bold text-slate-400 mb-3 px-3 uppercase tracking-wider">{section.section}</p>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <button
                        key={item.type}
                        onClick={() => onAddWidget(item.type)}
                        className="w-full flex items-center gap-3.5 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all group"
                      >
                        <item.icon size={18} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
                        <span>{item.label}</span>
                        <Plus size={14} className="ml-auto opacity-0 group-hover:opacity-100 text-primary-500 transition-all transform group-hover:scale-110" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-5 border-t border-slate-100 space-y-2">
        <div className="flex items-center gap-3.5 px-4 py-3 text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl cursor-pointer transition-all">
          <Settings size={20} />
          <span>Settings</span>
        </div>
        <div 
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer transition-all"
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </div>
      </div>
    </aside>
  );
};
