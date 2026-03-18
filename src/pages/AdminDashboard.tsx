import React, { useEffect, useState } from 'react';
// @ts-ignore
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Plus, Save, RefreshCw, Layout, Settings2, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Widget, WidgetType } from '../types';
import { WidgetRenderer } from '../components/WidgetRenderer';
import { fetchWithRetry } from '../utils/api';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export const AdminDashboard: React.FC = () => {
  const { token, isAdmin } = useAuth();
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);

  useEffect(() => {
    fetchData();
    fetchConfig();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetchWithRetry('/api/dashboard/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.error || 'Failed to fetch analytics';
        if (errorMsg.includes('SERVER_STARTING')) {
          setError('The server is taking a bit longer to start. Please try again in a moment.');
        } else {
          setError(errorMsg);
        }
        return;
      }
      setAnalyticsData(data);
    } catch (err: any) {
      console.error('Failed to fetch analytics', err);
      const msg = err.message || String(err);
      if (msg.includes('SERVER_STARTING')) {
        setError('The server is taking a bit longer to start. Please try again in a moment.');
      } else {
        setError('Network error or database disconnected');
      }
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await fetchWithRetry('/api/dashboard/config', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.error || 'Failed to fetch config';
        if (errorMsg.includes('SERVER_STARTING')) {
          setError('The server is taking a bit longer to start. Please try again in a moment.');
        } else {
          setError(errorMsg);
        }
        setLoading(false);
        return;
      }
      setWidgets(data.widgets || []);
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to fetch config', err);
      const msg = err.message || String(err);
      if (msg.includes('SERVER_STARTING')) {
        setError('The server is taking a bit longer to start. Please try again in a moment.');
      } else {
        setError('Network error or database disconnected');
      }
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      await fetchWithRetry('/api/dashboard/config', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ widgets })
      });
    } catch (err) {
      console.error('Failed to save config', err);
    } finally {
      setSaving(false);
    }
  };

  const onLayoutChange = (currentLayout: any) => {
    setWidgets(prev => prev.map(widget => {
      const layoutItem = currentLayout.find((l: any) => l.i === widget.id);
      if (layoutItem) {
        return {
          ...widget,
          x: layoutItem.x,
          y: layoutItem.y,
          w: layoutItem.w,
          h: layoutItem.h
        };
      }
      return widget;
    }));
  };

  const addWidget = (type: WidgetType) => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type,
      title: `New ${type.toUpperCase()} Widget`,
      x: 0,
      y: Infinity,
      w: type === 'kpi' ? 3 : 6,
      h: type === 'kpi' ? 2 : 4,
      config: {
        dataSource: type === 'kpi' ? 'totalRevenue' : 
                   type === 'table' ? 'recentOrders' : 
                   type === 'pie' ? 'statusDistribution' : 'monthlyRevenue',
        xAxis: type === 'pie' ? 'name' : 'month',
        yAxis: type === 'pie' ? 'value' : 'amount',
        icon: 'DollarSign'
      }
    };
    setWidgets([...widgets, newWidget]);
    setShowAddModal(false);
  };

  const deleteWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  const updateWidget = (updatedWidget: Widget) => {
    setWidgets(widgets.map(w => w.id === updatedWidget.id ? updatedWidget : w));
    setEditingWidget(null);
  };

  if (!isAdmin) return <div className="p-20 text-center">Access Denied.</div>;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-red-100 text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <X size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Connection Error</h2>
          <p className="text-gray-500">{error}</p>
          <button 
            onClick={() => { setError(null); setLoading(true); fetchData(); fetchConfig(); }}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading || !analyticsData) return <div className="p-20 text-center">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-indigo-600 text-white rounded-xl">
              <Layout size={24} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900">Analytics Builder</h1>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Admin Control Center</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => fetchData()}
              className="p-3 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={20} />
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-3 rounded-xl font-bold hover:bg-indigo-100 transition-all"
            >
              <Plus size={20} />
              <span>Add Widget</span>
            </button>
            <button 
              onClick={handleSaveConfig}
              disabled={saving}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
              {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
              <span>{saving ? 'Saving...' : 'Save Layout'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: widgets.map(w => ({ i: w.id, x: w.x, y: w.y, w: w.w, h: w.h })) }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={100}
          draggableHandle=".cursor-move"
          onLayoutChange={onLayoutChange}
        >
          {widgets.map(widget => (
            <div key={widget.id}>
              <WidgetRenderer 
                widget={widget} 
                data={analyticsData} 
                onDelete={deleteWidget}
                onEdit={setEditingWidget}
              />
            </div>
          ))}
        </ResponsiveGridLayout>
      </main>

      {/* Add Widget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings2 className="text-indigo-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Add New Widget</h2>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[
                { type: 'kpi', label: 'KPI Card', desc: 'Single metric display' },
                { type: 'bar', label: 'Bar Chart', desc: 'Comparison data' },
                { type: 'line', label: 'Line Chart', desc: 'Trends over time' },
                { type: 'area', label: 'Area Chart', desc: 'Volume trends' },
                { type: 'pie', label: 'Pie Chart', desc: 'Distribution' },
                { type: 'table', label: 'Data Table', desc: 'Detailed lists' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => addWidget(item.type as WidgetType)}
                  className="flex flex-col items-center text-center p-6 rounded-3xl border-2 border-gray-50 hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                    <Plus size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.label}</h3>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Widget Modal */}
      {editingWidget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Widget Settings</h2>
              <button onClick={() => setEditingWidget(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Widget Title</label>
                <input 
                  type="text" 
                  value={editingWidget.title}
                  onChange={(e) => setEditingWidget({...editingWidget, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Data Source</label>
                <select 
                  value={editingWidget.config.dataSource}
                  onChange={(e) => setEditingWidget({
                    ...editingWidget, 
                    config: { ...editingWidget.config, dataSource: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  {editingWidget.type === 'kpi' ? (
                    <>
                      <option value="totalOrders">Total Orders</option>
                      <option value="totalRevenue">Total Revenue</option>
                      <option value="totalCustomers">Total Customers</option>
                      <option value="totalSoldQuantity">Total Sold Quantity</option>
                    </>
                  ) : editingWidget.type === 'table' ? (
                    <option value="recentOrders">Recent Orders</option>
                  ) : (
                    <>
                      <option value="monthlyRevenue">Monthly Revenue</option>
                      <option value="statusDistribution">Status Distribution</option>
                    </>
                  )}
                </select>
              </div>
              <button 
                onClick={() => updateWidget(editingWidget)}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
