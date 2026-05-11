import React, { useState, useEffect } from 'react';
import LayoutDashboard from 'lucide-react/dist/esm/icons/layout-dashboard';
import Package from 'lucide-react/dist/esm/icons/package';
import MapIcon from 'lucide-react/dist/esm/icons/map';
import Bell from 'lucide-react/dist/esm/icons/bell';
import Settings from 'lucide-react/dist/esm/icons/settings';
import Search from 'lucide-react/dist/esm/icons/search';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Truck from 'lucide-react/dist/esm/icons/truck';
import Clock from 'lucide-react/dist/esm/icons/clock';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw';
import { motion, AnimatePresence } from 'framer-motion';
import OrderTable from './components/OrderTable';
import OrderForm from './components/OrderForm';
import RealTimeMap from './components/RealTimeMap';
import DashboardOverview from './components/DashboardOverview';
import { OrderService, NotificationService } from './services/api';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ activeTab, setActiveTab, onSettingsClick }) => {
  const { t } = useTranslation();
  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: t('nav.overview') },
    { id: 'orders', icon: Package, label: t('nav.orders') },
    { id: 'tracking', icon: MapIcon, label: t('nav.tracking') },
  ];

  return (
    <div className="w-64 h-screen bg-stealth-900 border-r border-stealth-700 flex flex-col p-6 fixed left-0 top-0 z-40">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-stealth-800 border border-stealth-600 flex items-center justify-center">
          <Truck className="text-zinc-100" size={20} />
        </div>
        <h1 className="text-xl font-display font-bold tracking-tight text-white uppercase tracking-widest">LOGICMD</h1>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
              activeTab === item.id 
                ? 'bg-stealth-700 text-white border-l-2 border-zinc-100' 
                : 'text-zinc-500 hover:bg-stealth-800 hover:text-zinc-300 border-l-2 border-transparent'
            }`}
          >
            <item.icon size={18} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-stealth-700">
        <button 
          onClick={onSettingsClick}
          className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-stealth-800 hover:text-zinc-300 transition-colors border-l-2 border-transparent"
        >
          <Settings size={18} />
          <span className="font-medium text-sm">{t('nav.settings')}</span>
        </button>
      </div>
    </div>
  );
};

const Header = ({ notifications, searchQuery, setSearchQuery }) => {
  const { t, i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const toggleLanguage = () => {
    const nextLng = i18n.language.startsWith('es') ? 'en' : 'es';
    i18n.changeLanguage(nextLng);
  };

  return (
  <header className="flex items-center justify-between mb-8 pb-6 border-b border-stealth-700 relative z-50">
    <div>
      <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wide">{t('header.title')}</h2>
      <p className="text-zinc-500 text-sm mt-1">System operational and tracking globally.</p>
    </div>
    <div className="flex items-center gap-4">
      <button onClick={toggleLanguage} className="bg-stealth-800 border border-stealth-600 px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white transition-all uppercase">
        {i18n.language.startsWith('es') ? 'ES' : 'EN'}
      </button>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
        <input 
          type="text" 
          placeholder={t('header.search')} 
          className="input-field pl-10 w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="relative">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-stealth-800 border border-stealth-600 p-2.5 text-zinc-400 hover:text-white transition-all relative"
        >
          <Bell size={18} />
          {notifications.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent-red text-white text-[9px] font-bold flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-80 bg-stealth-800 border border-stealth-600 shadow-2xl py-2 max-h-96 overflow-y-auto"
            >
              <div className="px-4 py-2 border-b border-stealth-700">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">System Notifications</h3>
              </div>
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-zinc-500 text-xs">
                  No active notifications.
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notif, idx) => (
                    <div key={idx} className="px-4 py-3 hover:bg-stealth-700 border-b border-stealth-700 last:border-0 transition-colors">
                      <p className="text-xs text-zinc-300">
                        <span className="font-bold text-accent-blue mr-1">Order #{notif.orderId}:</span>
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </header>
  );
};

const App = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingOrder, setEditingOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await OrderService.getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await NotificationService.getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchNotifications();
    const interval = setInterval(() => {
      fetchOrders();
      fetchNotifications();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateOrder = async (orderData) => {
    await OrderService.createOrder(orderData);
    fetchOrders();
    showToast("Shipment initiated successfully.");
  };

  const handleUpdateOrder = async (orderData) => {
    await OrderService.updateOrder(orderData.id, orderData);
    fetchOrders();
    showToast("Shipment updated successfully.");
    setEditingOrder(null);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await OrderService.deleteOrder(orderId);
      fetchOrders();
      showToast("Shipment deleted successfully.");
    } catch (error) {
      console.error("Error deleting order:", error);
      showToast("Failed to delete shipment.");
    }
  };

  const handleStatusChange = async (order, newStatus) => {
    try {
      await OrderService.updateOrder(order.id, { ...order, status: newStatus });
      fetchOrders();
      showToast(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      showToast("Failed to update status.");
    }
  };

  const handleViewMap = (order) => {
    setSelectedOrder(order);
    setActiveTab('tracking');
  };

  return (
    <div className="min-h-screen flex bg-stealth-900 overflow-x-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={(tab) => {
        if (tab === 'history') {
          showToast("History view locked.");
        } else {
          setActiveTab(tab);
        }
      }} onSettingsClick={() => showToast("Settings view locked.")} />
      
      <main className="flex-1 ml-64 p-10 max-w-[1600px] mx-auto w-full">
        <Header 
          notifications={notifications}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <AnimatePresence>
          {toast && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-stealth-800 px-6 py-3 border border-stealth-600 flex items-center gap-3 min-w-[300px] shadow-2xl"
            >
              <div className="w-6 h-6 bg-stealth-700 flex items-center justify-center text-zinc-100">
                <Bell size={14} />
              </div>
              <div>
                <p className="text-white font-bold text-xs uppercase tracking-wider">System Alert</p>
                <p className="text-zinc-400 text-xs mt-0.5">{toast}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {activeTab !== 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="panel-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-zinc-500">
                  <Package size={20} />
                </div>
              </div>
              <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{t('dashboard.active_missions')}</h3>
              <p className="text-2xl font-display font-bold text-white mt-1">{orders.length}</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="panel-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-zinc-500">
                  <CheckCircle2 size={20} />
                </div>
                <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></div>
              </div>
              <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{t('dashboard.mission_status')}</h3>
              <p className="text-2xl font-display font-bold text-white mt-1">Operational</p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="panel-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-zinc-500">
                  <Clock size={20} />
                </div>
              </div>
              <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Local Time</h3>
              <p className="text-2xl font-display font-bold text-white mt-1">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </motion.div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <DashboardOverview orders={orders} />
            </motion.div>
          ) : activeTab === 'orders' ? (
            <motion.div 
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="panel-card"
            >
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between border-b border-stealth-700 gap-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider">{t('orders.live_manifest')}</h3>
                  {loading && <RefreshCw className="animate-spin text-zinc-500" size={14} />}
                </div>
                
                <div className="flex items-center gap-1 bg-stealth-900 p-1 border border-stealth-700">
                  {[
                    { id: 'ALL', label: 'All' },
                    { id: 'COMPLETOS', label: 'Done' },
                    { id: 'INCOMPLETOS', label: 'Fail' },
                    { id: 'POR_COMPLETAR', label: 'Active' }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setStatusFilter(filter.id)}
                      className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                        statusFilter === filter.id 
                          ? 'bg-stealth-700 text-white' 
                          : 'text-zinc-500 hover:text-zinc-300 hover:bg-stealth-800'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setIsFormOpen(true)}
                  className="btn-primary"
                >
                  <Plus size={16} />
                  {t('orders.new_dispatch')}
                </button>
              </div>
              
              <OrderTable 
                orders={orders.filter(order => {
                  const id = order.id?.toString() || '';
                  const customerName = order.customerName?.toLowerCase() || '';
                  const packageDescription = order.packageDescription?.toLowerCase() || '';
                  const search = searchQuery.toLowerCase();

                  const matchesSearch = 
                    id.includes(searchQuery) ||
                    customerName.includes(search) ||
                    packageDescription.includes(search);
                  
                  if (!matchesSearch) return false;

                  if (statusFilter === 'ALL') return true;
                  if (statusFilter === 'COMPLETOS') return order.status === 'DELIVERED';
                  if (statusFilter === 'INCOMPLETOS') return order.status === 'CANCELLED';
                  if (statusFilter === 'POR_COMPLETAR') return ['CREATED', 'ASSIGNED', 'IN_TRANSIT'].includes(order.status);
                  
                  return true;
                })} 
                onEdit={(order) => {
                  setEditingOrder(order);
                  setIsFormOpen(true);
                }}
                onDelete={handleDeleteOrder}
                onStatusChange={handleStatusChange}
                onViewMap={handleViewMap}
              />
            </motion.div>
          ) : activeTab === 'tracking' ? (
            <motion.div 
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="panel-card p-6">
                <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-4">{t('map.title')}</h3>
                <RealTimeMap selectedOrder={selectedOrder} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      <OrderForm 
        isOpen={isFormOpen} 
        onClose={() => {
          setIsFormOpen(false);
          setEditingOrder(null);
        }} 
        onSubmit={editingOrder ? handleUpdateOrder : handleCreateOrder}
        initialData={editingOrder}
      />
    </div>
  );
};

export default App;
