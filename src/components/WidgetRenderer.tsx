import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { ShoppingCart, DollarSign, Users, Package, Trash2, Settings2 } from 'lucide-react';
import { Widget, Order } from '../types';

interface WidgetRendererProps {
  widget: Widget;
  data: any;
  onDelete?: (id: string) => void;
  onEdit?: (widget: Widget) => void;
}

const COLORS = ['#6366f1', '#8b5cf6', '#3b82f6', '#0ea5e9', '#10b981'];

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ widget, data, onDelete, onEdit }) => {
  const renderChart = () => {
    const chartData = data.charts?.[widget.config.dataSource] || data[widget.config.dataSource] || [];

    switch (widget.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey={widget.config.xAxis} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey={widget.config.yAxis} fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey={widget.config.xAxis} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Line type="monotone" dataKey={widget.config.yAxis} stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey={widget.config.xAxis} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey={widget.config.yAxis} stroke="#6366f1" fillOpacity={1} fill="url(#colorArea)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey={widget.config.yAxis || 'value'}
                nameKey={widget.config.xAxis || 'name'}
              >
                {chartData.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              {widget.config.showLegend && <Legend verticalAlign="bottom" height={36}/>}
            </PieChart>
          </ResponsiveContainer>
        );
      case 'kpi':
        const Icon = {
          ShoppingCart, DollarSign, Users, Package
        }[widget.config.icon || 'ShoppingCart'] || ShoppingCart;
        
        const kpiValue = data.kpis?.[widget.config.dataSource] || 0;
        const isCurrency = widget.config.dataSource === 'totalRevenue';

        return (
          <div className="flex items-center gap-6 h-full">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Icon size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{widget.title}</p>
              <p className="text-3xl font-extrabold text-gray-900">
                {isCurrency ? `$${kpiValue.toLocaleString()}` : kpiValue.toLocaleString()}
              </p>
            </div>
          </div>
        );
      case 'table':
        const orders = data[widget.config.dataSource] || [];
        return (
          <div className="overflow-x-auto h-full">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Order ID</th>
                  <th className="pb-3 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Customer</th>
                  <th className="pb-3 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Total</th>
                  <th className="pb-3 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order: Order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-medium text-gray-900">#{order._id.slice(-6)}</td>
                    <td className="py-3 text-gray-600">{order.customerName}</td>
                    <td className="py-3 font-bold text-gray-900">${order.totalAmount.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'Completed' ? 'bg-green-50 text-green-600' :
                        order.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col group relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 truncate pr-16 cursor-move">{widget.title}</h3>
        <div className="absolute top-6 right-6 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
          {onEdit && (
            <button 
              onClick={() => onEdit(widget)}
              className="p-2 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            >
              <Settings2 size={18} />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(widget.id)}
              className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        {renderChart()}
      </div>
    </div>
  );
};
