import React from 'react';
import { motion } from 'framer-motion';
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import Clock from 'lucide-react/dist/esm/icons/clock';
import Package from 'lucide-react/dist/esm/icons/package';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';

const StatCard = ({ title, value, icon: Icon, delay, trend }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay, duration: 0.2 }}
    className="panel-card p-6"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="text-zinc-500">
        <Icon size={20} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${trend > 0 ? 'border-accent-emerald text-accent-emerald' : 'border-accent-red text-accent-red'}`}>
          {trend > 0 ? <TrendingUp size={10} /> : <TrendingUp size={10} className="rotate-180" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{title}</h3>
    <motion.p 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: delay + 0.1 }}
      className="text-3xl font-display font-bold text-white mt-1"
    >
      {value}
    </motion.p>
  </motion.div>
);

const ProgressBar = ({ label, count, total }) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
        <span className="text-zinc-500">{label}</span>
        <span className="text-zinc-300">{count} ({percentage}%)</span>
      </div>
      <div className="h-1.5 bg-stealth-700 w-full">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="h-full bg-zinc-300"
        />
      </div>
    </div>
  );
};

const DashboardOverview = ({ orders }) => {
  const total = orders.length;
  const completed = orders.filter(o => o.status === 'DELIVERED').length;
  const inTransit = orders.filter(o => o.status === 'IN_TRANSIT').length;
  const assigned = orders.filter(o => o.status === 'ASSIGNED').length;
  const created = orders.filter(o => o.status === 'CREATED').length;
  const cancelled = orders.filter(o => o.status === 'CANCELLED').length;
  
  const complianceRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const destinations = orders.reduce((acc, order) => {
    if (order.destinationAddress) {
      acc[order.destinationAddress] = (acc[order.destinationAddress] || 0) + 1;
    }
    return acc;
  }, {});
  
  const topDestinations = Object.entries(destinations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Total Shipments" 
          value={total} 
          icon={Package} 
          delay={0}
          trend={12}
        />
        <StatCard 
          title="Active Transit" 
          value={inTransit + assigned} 
          icon={Clock} 
          delay={0.1}
          trend={5}
        />
        <StatCard 
          title="Delivered" 
          value={completed} 
          icon={CheckCircle2} 
          delay={0.2}
          trend={8}
        />
        <StatCard 
          title="Exceptions" 
          value={cancelled} 
          icon={AlertCircle} 
          delay={0.3}
          trend={-2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="panel-card p-8 lg:col-span-2"
        >
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="text-zinc-500" size={20} />
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Pipeline Distribution</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <ProgressBar label="Created (Awaiting Assign)" count={created} total={total} />
              <ProgressBar label="Assigned (Ready)" count={assigned} total={total} />
              <ProgressBar label="In Transit" count={inTransit} total={total} />
              <ProgressBar label="Delivered" count={completed} total={total} />
              <ProgressBar label="Cancelled" count={cancelled} total={total} />
            </div>
            
            <div className="flex flex-col justify-center items-center">
              <div className="w-32 h-32 rounded-full border-[8px] border-stealth-700 flex items-center justify-center relative mb-4">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <motion.circle 
                    cx="64" cy="64" r="56" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    strokeDasharray="351.8"
                    initial={{ strokeDashoffset: 351.8 }}
                    animate={{ strokeDashoffset: 351.8 - (351.8 * complianceRate) / 100 }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.4 }}
                    className="text-zinc-300"
                  />
                </svg>
                <div className="text-center">
                  <span className="text-3xl font-display font-bold text-white">{complianceRate}%</span>
                </div>
              </div>
              <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Success Rate</div>
            </div>
          </div>
        </motion.div>

        {/* Top Destinations */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="panel-card p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="text-zinc-500" size={20} />
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Top Destinations</h3>
          </div>
          
          <div className="space-y-3">
            {topDestinations.length === 0 ? (
              <p className="text-zinc-600 text-xs uppercase tracking-wider text-center py-8">No data available.</p>
            ) : (
              topDestinations.map(([address, count], idx) => (
                <motion.div 
                  key={address}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                  className="flex items-center justify-between p-3 border border-stealth-700 bg-stealth-900"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-stealth-800 flex items-center justify-center text-zinc-500 font-bold text-[10px]">
                      {idx + 1}
                    </div>
                    <span className="text-xs text-zinc-300 font-medium truncate max-w-[120px]" title={address}>
                      {address}
                    </span>
                  </div>
                  <span className="text-zinc-100 font-bold text-[10px] uppercase tracking-wider">
                    {count}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardOverview;
