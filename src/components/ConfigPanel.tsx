import React from 'react';
import { Widget, WidgetConfig } from '../types';
import { X, Save, Trash2 } from 'lucide-react';

interface ConfigPanelProps {
  widget: Widget | null;
  onUpdate: (id: string, updates: Partial<Widget>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const DATA_SOURCES = ['orders', 'customers', 'revenue', 'products', 'status'];
const AGGREGATIONS = ['sum', 'average', 'count'];
const COLUMNS = ['id', 'customer', 'product', 'quantity', 'price', 'total', 'status', 'date'];

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ widget, onUpdate, onDelete, onClose }) => {
  if (!widget) return null;

  const handleConfigChange = (key: keyof WidgetConfig, value: any) => {
    onUpdate(widget.id, {
      config: { ...widget.config, [key]: value }
    });
  };

  return (
    <aside className="w-96 bg-white border-l border-slate-100 flex flex-col h-full overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.05)] relative z-20">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div>
          <h2 className="font-extrabold text-slate-900 text-lg tracking-tight font-display">Widget Settings</h2>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configuration Panel</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-900 p-2 hover:bg-slate-50 rounded-xl transition-all">
          <X size={20} />
        </button>
      </div>

      <div className="p-8 space-y-10">
        {/* General Settings */}
        <section className="space-y-6">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">General</h3>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">Widget Title</label>
              <input
                type="text"
                value={widget.title}
                onChange={(e) => onUpdate(widget.id, { title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">Description</label>
              <textarea
                value={widget.description || ''}
                onChange={(e) => onUpdate(widget.id, { description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 h-24 resize-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* Layout Settings */}
        <section className="space-y-6">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Layout</h3>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">Width</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={widget.w}
                  onChange={(e) => onUpdate(widget.id, { w: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">Cols</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">Height</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={widget.h}
                  onChange={(e) => onUpdate(widget.id, { h: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">Rows</span>
              </div>
            </div>
          </div>
        </section>

        {/* Data Settings */}
        <section className="space-y-6">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Data Engine</h3>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">Source</label>
              <select
                value={widget.config.dataSource}
                onChange={(e) => handleConfigChange('dataSource', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all appearance-none"
              >
                {DATA_SOURCES.map(ds => <option key={ds} value={ds}>{ds.charAt(0).toUpperCase() + ds.slice(1)}</option>)}
              </select>
            </div>

            {widget.type === 'kpi' && (
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 ml-1">Aggregation</label>
                <select
                  value={widget.config.aggregation}
                  onChange={(e) => handleConfigChange('aggregation', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all appearance-none"
                >
                  {AGGREGATIONS.map(agg => <option key={agg} value={agg}>{agg.charAt(0).toUpperCase() + agg.slice(1)}</option>)}
                </select>
              </div>
            )}

            {widget.type !== 'table' && widget.type !== 'kpi' && (
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 ml-1">X-Axis Mapping</label>
                  <input
                    type="text"
                    value={widget.config.xAxis || ''}
                    onChange={(e) => handleConfigChange('xAxis', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                    placeholder="e.g. month"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 ml-1">Y-Axis Mapping</label>
                  <input
                    type="text"
                    value={widget.config.yAxis || ''}
                    onChange={(e) => handleConfigChange('yAxis', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                    placeholder="e.g. amount"
                  />
                </div>
              </div>
            )}

            {widget.type === 'pie' && (
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <input
                  type="checkbox"
                  id="showLegend"
                  checked={widget.config.showLegend}
                  onChange={(e) => handleConfigChange('showLegend', e.target.checked)}
                  className="w-5 h-5 rounded-lg border-slate-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
                />
                <label htmlFor="showLegend" className="text-sm font-bold text-slate-700 cursor-pointer">Display Legend</label>
              </div>
            )}

            {widget.type === 'table' && (
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700 ml-1">Visible Columns</label>
                <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  {COLUMNS.map(col => (
                    <label key={col} className="flex items-center gap-2.5 text-xs font-bold text-slate-600 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={widget.config.columns?.includes(col)}
                        onChange={(e) => {
                          const current = widget.config.columns || [];
                          const next = e.target.checked 
                            ? [...current, col]
                            : current.filter(c => c !== col);
                          handleConfigChange('columns', next);
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 transition-all"
                      />
                      <span className="group-hover:text-slate-900 transition-colors">{col.charAt(0).toUpperCase() + col.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="mt-auto p-8 border-t border-slate-50 bg-slate-50/30">
        <button
          onClick={() => onDelete(widget.id)}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 text-sm font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-2xl transition-all active:scale-95"
        >
          <Trash2 size={20} />
          Remove Component
        </button>
      </div>
    </aside>
  );
};
