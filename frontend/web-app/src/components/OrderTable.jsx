import React, { useState, useEffect } from 'react';
import MoreVertical from 'lucide-react/dist/esm/icons/more-vertical';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import User from 'lucide-react/dist/esm/icons/user';
import Truck from 'lucide-react/dist/esm/icons/truck';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Edit2 from 'lucide-react/dist/esm/icons/edit-2';
import ShieldAlert from 'lucide-react/dist/esm/icons/shield-alert';
import Navigation from 'lucide-react/dist/esm/icons/navigation';
import { DispatchService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const DispatchInfo = ({ orderId }) => {
  const [dispatch, setDispatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDispatch = async () => {
      try {
        const response = await DispatchService.getDispatchByOrder(orderId);
        setDispatch(response.data);
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error(`Error fetching dispatch for order ${orderId}:`, error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDispatch();
  }, [orderId]);

  if (loading) return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded-full border-2 border-zinc-600 border-t-transparent animate-spin"></div>
      <span className="text-xs text-zinc-500 font-medium">CHECKING...</span>
    </div>
  );
  
  if (!dispatch) return (
    <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-stealth-800 w-fit px-2 py-1 border border-stealth-600">
      <ShieldAlert size={12} />
      <span className="uppercase tracking-wider font-bold text-[10px]">Pending</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 text-sm text-zinc-300 font-medium bg-stealth-900 w-fit px-2.5 py-1 border border-stealth-700">
        <User size={14} className="text-zinc-500" />
        {dispatch.driverName}
      </div>
      <div className="flex items-center gap-2 text-xs text-zinc-500 pl-1">
        <Truck size={12} className="text-zinc-600" />
        <span className="font-mono tracking-wider">{dispatch.vehiclePlate}</span>
      </div>
    </div>
  );
};

const OrderTable = ({ orders = [], onEdit, onDelete, onStatusChange, onViewMap }) => {
  const { t } = useTranslation();
  const getStatusStyle = (status) => {
    switch (status) {
      case 'CREATED': return 'text-zinc-400 border-zinc-600';
      case 'ASSIGNED': return 'text-accent-blue border-accent-blue';
      case 'IN_TRANSIT': return 'text-accent-amber border-accent-amber';
      case 'DELIVERED': return 'text-accent-emerald border-accent-emerald';
      case 'CANCELLED': return 'text-accent-red border-accent-red';
      default: return 'text-zinc-500 border-stealth-600';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
  };

  return (
    <div className="overflow-x-auto pb-4">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-zinc-500 text-[10px] uppercase tracking-widest border-b border-stealth-700 bg-stealth-900">
            <th className="px-6 py-4 font-bold">{t('orders.tracking_id')}</th>
            <th className="px-6 py-4 font-bold">{t('orders.route')}</th>
            <th className="px-6 py-4 font-bold">{t('orders.dispatch_unit')}</th>
            <th className="px-6 py-4 font-bold">{t('orders.status')}</th>
            <th className="px-6 py-4 font-bold text-right">{t('orders.actions')}</th>
          </tr>
        </thead>
        <motion.tbody 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="divide-y divide-stealth-700"
        >
          <AnimatePresence>
            {orders.length === 0 ? (
              <motion.tr 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
              >
                <td colSpan="5" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-zinc-500 gap-3">
                    <Truck size={32} className="text-stealth-600 mb-2" />
                    <p className="text-sm font-display uppercase tracking-widest font-bold">{t('orders.no_shipments')}</p>
                    <p className="text-xs text-zinc-600">{t('orders.adjust_filters')}</p>
                  </div>
                </td>
              </motion.tr>
            ) : (
              orders.map((order) => (
                <motion.tr 
                  key={order.id} 
                  variants={rowVariants}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  layout
                  className="hover:bg-stealth-700 transition-colors group relative"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-10 bg-stealth-600 group-hover:bg-zinc-400 transition-colors absolute left-0"></div>
                      <div>
                        <div className="font-mono text-zinc-100 font-bold text-sm tracking-wide">#{order.id.toString().padStart(6, '0')}</div>
                        <div className="text-xs text-zinc-500 mt-1 font-medium">{order.packageDescription}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                     <div className="text-zinc-300 font-bold mb-1">{order.customerName}</div>
                     <div className="text-[10px] text-zinc-500 truncate max-w-[200px] flex flex-col gap-1">
                       <div className="flex items-center gap-1.5"><div className="w-1 h-1 bg-zinc-600"></div>{order.originAddress || 'N/A'}</div>
                       <div className="flex items-center gap-1.5"><div className="w-1 h-1 bg-accent-emerald"></div>{order.destinationAddress}</div>
                     </div>
                  </td>
                  <td className="px-6 py-5">
                    <DispatchInfo orderId={order.id} />
                  </td>
                  <td className="px-6 py-5">
                    <select 
                      value={order.status}
                      onChange={(e) => onStatusChange(order, e.target.value)}
                      className={`px-2.5 py-1 outline-none cursor-pointer bg-transparent text-[10px] uppercase font-black tracking-wider border transition-colors hover:bg-stealth-800 ${getStatusStyle(order.status)}`}
                    >
                      <option className="bg-stealth-900 text-zinc-300" value="CREATED">CREATED</option>
                      <option className="bg-stealth-900 text-zinc-300" value="ASSIGNED">ASSIGNED</option>
                      <option className="bg-stealth-900 text-zinc-300" value="IN_TRANSIT">IN TRANSIT</option>
                      <option className="bg-stealth-900 text-zinc-300" value="DELIVERED">DELIVERED</option>
                      <option className="bg-stealth-900 text-zinc-300" value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onViewMap(order)}
                        className="p-2 text-zinc-500 hover:text-accent-blue hover:bg-stealth-600 transition-colors border border-transparent hover:border-stealth-500"
                        title="View on Map"
                      >
                        <Navigation size={14} />
                      </button>
                      <button 
                        onClick={() => onEdit(order)}
                        className="p-2 text-zinc-500 hover:text-white hover:bg-stealth-600 transition-colors border border-transparent hover:border-stealth-500"
                        title="Edit Shipment"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete order #${order.id}?`)) {
                            onDelete(order.id);
                          }
                        }}
                        className="p-2 text-zinc-500 hover:text-accent-red hover:bg-stealth-600 transition-colors border border-transparent hover:border-stealth-500"
                        title="Delete Shipment"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </motion.tbody>
      </table>
    </div>
  );
};

export default OrderTable;
