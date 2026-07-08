import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings, 
  Search, 
  Bell, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  AlertTriangle,
  Play,
  Moon,
  Sun,
  User,
  Plus
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface DashboardPreviewProps {
  radius: number;
  shadow: number;
  spacing: number;
  typography: string;
  gradient: number;
  glass: boolean;
  neumorphism: boolean;
}

const mockData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

export default function DashboardPreview({
  radius,
  shadow,
  spacing,
  typography,
  gradient,
  glass,
  neumorphism
}: DashboardPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAlert, setShowAlert] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  // Set local state fonts
  const fontClass = typography === 'Outfit' ? 'font-sans' : 'font-serif';

  // Inline dynamic styles mapped to CSS variables
  const radiusStyle = `${8 * radius}px`;
  const spacingClass = spacing === 0.75 ? 'p-3' : spacing === 1.25 ? 'p-6' : 'p-4';
  
  // Custom glassmorphism or neumorphism styling
  const panelStyle: React.CSSProperties = neumorphism 
    ? {
        backgroundColor: 'var(--bg-surface)',
        borderRadius: radiusStyle,
        border: 'none',
        boxShadow: `inset 2px 2px 5px rgba(255,255,255,0.05), 5px 5px 15px rgba(0,0,0,0.4)`
      }
    : glass
    ? {
        backgroundColor: 'var(--bg-surface)',
        backdropFilter: 'blur(12px)',
        borderRadius: radiusStyle,
        border: '1px solid var(--border-color)',
        boxShadow: `0 ${8 * shadow}px ${24 * shadow}px rgba(0,0,0,0.2)`
      }
    : {
        backgroundColor: 'var(--bg-surface)',
        borderRadius: radiusStyle,
        border: '1px solid var(--border-color)',
      };

  return (
    <div className={`w-full h-full flex flex-col md:flex-row ${fontClass} bg-[var(--bg-main)] text-[var(--text-primary)] transition-all duration-300 relative`} style={{ minHeight: '580px' }}>
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-60 flex flex-col border-b md:border-b-0 md:border-r border-[var(--border-color)] bg-[var(--sidebar)] p-4 shrink-0">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ 
            background: gradient > 0 
              ? `linear-gradient(135deg, var(--primary), var(--accent))`
              : 'var(--primary)' 
          }}>
            <LayoutDashboard size={18} />
          </div>
          <span className="font-bold tracking-tight text-lg text-[var(--text-primary)]">Vision Analytics</span>
        </div>

        <nav className="flex-1 space-y-1.5">
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-white transition-all-custom" style={{ 
            backgroundColor: 'var(--primary)',
            borderRadius: radiusStyle
          }}>
            <LayoutDashboard size={16} />
            <span>Overview</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all-custom" style={{ borderRadius: radiusStyle }}>
            <Users size={16} />
            <span>Customers</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all-custom" style={{ borderRadius: radiusStyle }}>
            <BarChart3 size={16} />
            <span>Campaigns</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all-custom" style={{ borderRadius: radiusStyle }}>
            <Settings size={16} />
            <span>Settings</span>
          </a>
        </nav>

        <div className="mt-auto border-t border-[var(--border-color)] pt-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center">
              <User size={16} className="text-[var(--text-secondary)]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-primary)]">Sarah Jenkins</p>
              <p className="text-[10px] text-[var(--text-secondary)]">Owner</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* NAVBAR */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--border-color)] bg-[var(--navbar)]">
          <div className="relative w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={14} className="text-[var(--text-secondary)]" />
            </span>
            <input 
              type="text" 
              placeholder="Search dashboards..." 
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-[var(--bg-surface)] border border-[var(--border-color)] focus:outline-none focus:border-[var(--primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
              style={{ borderRadius: radiusStyle }}
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] relative">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
            </button>
            <button 
              onClick={() => setShowDialog(true)}
              className="px-3 py-1.5 text-xs font-medium text-white flex items-center gap-1.5 shadow transition-all-custom" 
              style={{ 
                background: gradient > 0 
                  ? `linear-gradient(135deg, var(--primary), var(--accent))`
                  : 'var(--primary)',
                borderRadius: radiusStyle
              }}
            >
              <Plus size={14} />
              <span>Create New</span>
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          
          {/* ALERT */}
          {showAlert && (
            <div className="flex items-start justify-between p-4 border border-[var(--border-color)] bg-[var(--bg-surface)] animate-fade-in relative overflow-hidden" style={{ borderRadius: radiusStyle }}>
              {/* Left Accent indicator */}
              <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: 'var(--accent)' }}></div>
              <div className="flex gap-3">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">System upgrade scheduled</h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">Database scaling operations will take place this Sunday at 02:00 UTC. Expect slight delays.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAlert(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold px-2"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* CARD 1 */}
            <div style={panelStyle} className={`${spacingClass} flex flex-col`}>
              <div className="flex justify-between items-center text-[var(--text-secondary)]">
                <span className="text-xs font-medium">Monthly Revenue</span>
                <DollarSign size={16} />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">$45,231.89</span>
                <span className="text-xs font-medium flex items-center text-emerald-500 gap-0.5">
                  <ArrowUpRight size={12} />
                  +20.1%
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-secondary)] mt-1">+$4,231.00 since last month</p>
            </div>

            {/* CARD 2 */}
            <div style={panelStyle} className={`${spacingClass} flex flex-col`}>
              <div className="flex justify-between items-center text-[var(--text-secondary)]">
                <span className="text-xs font-medium">Active Subscriptions</span>
                <Users size={16} />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">+2,350</span>
                <span className="text-xs font-medium flex items-center text-emerald-500 gap-0.5">
                  <ArrowUpRight size={12} />
                  +180.5%
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-secondary)] mt-1">+180 subscribers today</p>
            </div>

            {/* CARD 3 */}
            <div style={panelStyle} className={`${spacingClass} flex flex-col`}>
              <div className="flex justify-between items-center text-[var(--text-secondary)]">
                <span className="text-xs font-medium">Sales Target</span>
                <TrendingUp size={16} style={{ color: 'var(--accent)' }} />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">89.4%</span>
                <span className="text-xs font-medium flex items-center text-rose-500 gap-0.5">
                  <ArrowDownRight size={12} />
                  -4.2%
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-secondary)] mt-1">Remaining target: 10.6%</p>
            </div>

          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* CHART */}
            <div style={panelStyle} className={`${spacingClass} lg:col-span-2 flex flex-col`}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">Performance Analytics</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Historical growth trajectory</p>
                </div>
                <div className="flex items-center gap-1.5 bg-[var(--bg-main)] p-1 border border-[var(--border-color)]" style={{ borderRadius: '6px' }}>
                  <button className="px-2.5 py-1 text-[10px] font-medium bg-[var(--bg-surface)] text-white" style={{ borderRadius: '4px' }}>6M</button>
                  <button className="px-2.5 py-1 text-[10px] font-medium text-[var(--text-secondary)]">1Y</button>
                </div>
              </div>
              
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={10} />
                    <YAxis stroke="var(--text-secondary)" fontSize={10} />
                    <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: radiusStyle, color: 'var(--text-primary)' }} />
                    <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#chartColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* QUICK ACTIONS & BADGES */}
            <div style={panelStyle} className={`${spacingClass} flex flex-col`}>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Status Overview</h3>
              <p className="text-xs text-[var(--text-secondary)] mb-4">Real-time status flags</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 border border-[var(--border-color)] bg-[var(--bg-main)]" style={{ borderRadius: radiusStyle }}>
                  <span className="text-xs font-medium text-[var(--text-primary)]">Main API Node</span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10" style={{ borderRadius: '999px' }}>
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 border border-[var(--border-color)] bg-[var(--bg-main)]" style={{ borderRadius: radiusStyle }}>
                  <span className="text-xs font-medium text-[var(--text-primary)]">Task Runner</span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold text-rose-500 bg-rose-500/10" style={{ borderRadius: '999px' }}>
                    Critical
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 border border-[var(--border-color)] bg-[var(--bg-main)]" style={{ borderRadius: radiusStyle }}>
                  <span className="text-xs font-medium text-[var(--text-primary)]">Cron Services</span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold text-amber-500 bg-amber-500/10" style={{ borderRadius: '999px' }}>
                    Warning
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-[var(--border-color)]">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--text-secondary)]">Backup status</span>
                  <span className="text-xs font-semibold text-[var(--success)] flex items-center gap-1">
                    <ShieldCheck size={14} /> Verified
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* DATA TABLE */}
          <div style={panelStyle} className={`${spacingClass}`}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Operations</h3>
                <p className="text-xs text-[var(--text-secondary)]">Transaction and request logs</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-[var(--text-secondary)]">
                    <th className="pb-3 font-medium">Operation ID</th>
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  <tr>
                    <td className="py-3 font-medium text-[var(--text-primary)]">#OP-9281</td>
                    <td className="py-3 text-[var(--text-secondary)]">alex@company.com</td>
                    <td className="py-3 text-[var(--text-secondary)]">auth.refresh</td>
                    <td className="py-3">
                      <span className="text-[10px] font-semibold text-emerald-500">Success</span>
                    </td>
                    <td className="py-3 text-[var(--text-secondary)]">45ms</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-[var(--text-primary)]">#OP-1049</td>
                    <td className="py-3 text-[var(--text-secondary)]">jane@company.com</td>
                    <td className="py-3 text-[var(--text-secondary)]">billing.invoice</td>
                    <td className="py-3">
                      <span className="text-[10px] font-semibold text-[var(--success)]">Processed</span>
                    </td>
                    <td className="py-3 text-[var(--text-secondary)]">182ms</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-[var(--text-primary)]">#OP-3312</td>
                    <td className="py-3 text-[var(--text-secondary)]">sam@company.com</td>
                    <td className="py-3 text-[var(--text-secondary)]">data.export</td>
                    <td className="py-3">
                      <span className="text-[10px] font-semibold text-amber-500">Pending</span>
                    </td>
                    <td className="py-3 text-[var(--text-secondary)]">--</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)] mt-4">
              <span className="text-[10px] text-[var(--text-secondary)]">Showing 3 of 12 logs</span>
              <div className="flex gap-1">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-2.5 py-1 text-[10px] font-medium border border-[var(--border-color)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)]" 
                  style={{ borderRadius: radiusStyle }}
                >
                  Previous
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-2.5 py-1 text-[10px] font-medium border border-[var(--border-color)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)]"
                  style={{ borderRadius: radiusStyle }}
                >
                  Next
                </button>
              </div>
            </div>

          </div>

        </main>
      </div>

      {/* DIALOG BACKDROP & DIALOG */}
      {showDialog && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm border border-[var(--border-color)] p-6 animate-fade-in shadow-2xl" style={panelStyle}>
            <h3 className="text-base font-bold text-[var(--text-primary)]">Create Project Node</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Define metadata parameters for launching a new database cluster partition.</p>
            
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Cluster Name</label>
                <input 
                  type="text" 
                  placeholder="us-east-cluster" 
                  className="w-full mt-1 p-2 text-xs bg-[var(--bg-main)] border border-[var(--border-color)] focus:outline-none focus:border-[var(--primary)] text-[var(--text-primary)]"
                  style={{ borderRadius: radiusStyle }}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Region</label>
                <select 
                  className="w-full mt-1 p-2 text-xs bg-[var(--bg-main)] border border-[var(--border-color)] focus:outline-none focus:border-[var(--primary)] text-[var(--text-primary)]"
                  style={{ borderRadius: radiusStyle }}
                >
                  <option>N. Virginia (us-east-1)</option>
                  <option>Frankfurt (eu-central-1)</option>
                  <option>Singapore (ap-southeast-1)</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 text-xs">
              <button 
                onClick={() => setShowDialog(false)}
                className="px-3 py-1.5 border border-[var(--border-color)] hover:bg-[var(--bg-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]" 
                style={{ borderRadius: radiusStyle }}
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowDialog(false)}
                className="px-3 py-1.5 text-white font-medium" 
                style={{ 
                  background: 'var(--primary)',
                  borderRadius: radiusStyle
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
