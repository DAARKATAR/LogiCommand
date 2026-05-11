import React, { useState, useEffect } from 'react';
import X from 'lucide-react/dist/esm/icons/x';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Navigation from 'lucide-react/dist/esm/icons/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Iconos para el mapa del formulario
const originIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/644/644468.png',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const destIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149059.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Componente para capturar clics en el mapa
function LocationMarker({ position, type, onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  if (!position) return null;
  return <Marker position={position} icon={type === 'origin' ? originIcon : destIcon} />;
}

const OrderForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    customerName: '',
    originAddress: '',
    destinationAddress: '',
    packageDescription: '',
    status: 'CREATED',
    originLat: 4.6097,
    originLng: -74.0817,
    destinationLat: 4.6767,
    destinationLng: -74.0483
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pickingType, setPickingType] = useState('origin'); // 'origin' or 'destination'

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ 
        customerName: '', 
        originAddress: '', 
        destinationAddress: '', 
        packageDescription: '', 
        status: 'CREATED',
        originLat: 4.6097,
        originLng: -74.0817,
        destinationLat: 4.6767,
        destinationLng: -74.0483
      });
    }
  }, [initialData, isOpen]);

  const handleLocationSelect = (lat, lng) => {
    if (pickingType === 'origin') {
      setFormData({ ...formData, originLat: lat, originLng: lng });
    } else {
      setFormData({ ...formData, destinationLat: lat, destinationLng: lng });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (!initialData) {
          onClose();
        }
      }, 1500);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stealth-900/95 z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-stealth-800 border-l border-stealth-600 z-50 flex flex-col"
          >
            <div className="p-8 border-b border-stealth-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">
                  {initialData ? t('form.update') : t('form.create')}
                </h2>
                <p className="text-zinc-500 text-sm mt-1">
                  {initialData ? `${t('form.editing')}${initialData.id}` : t('form.register')}
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-stealth-700 transition-colors text-zinc-500 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {success ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 border border-accent-emerald text-accent-emerald flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">ÉXITO</h3>
                  <p className="text-zinc-500 text-sm mt-2">Datos sincronizados con el centro de mando.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">{t('form.customer')}</label>
                      <input 
                        required
                        type="text" 
                        className="w-full input-field"
                        value={formData.customerName}
                        onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">ORIGEN (DIRECCIÓN)</label>
                      <div className="flex gap-2">
                        <input 
                          required
                          type="text" 
                          className={`flex-1 input-field ${pickingType === 'origin' ? 'border-accent-blue' : ''}`}
                          value={formData.originAddress}
                          onFocus={() => setPickingType('origin')}
                          onChange={(e) => setFormData({...formData, originAddress: e.target.value})}
                        />
                        <button 
                          type="button"
                          title="Ubicar en mapa"
                          onClick={() => setPickingType('origin')}
                          className="px-3 bg-stealth-700 border border-stealth-600 text-zinc-400 hover:text-white"
                        >
                          <Navigation size={14} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">DESTINO (DIRECCIÓN)</label>
                      <div className="flex gap-2">
                        <input 
                          required
                          type="text" 
                          className={`flex-1 input-field ${pickingType === 'destination' ? 'border-purple-500' : ''}`}
                          value={formData.destinationAddress}
                          onFocus={() => setPickingType('destination')}
                          onChange={(e) => setFormData({...formData, destinationAddress: e.target.value})}
                        />
                        <button 
                          type="button"
                          title="Ubicar en mapa"
                          onClick={() => setPickingType('destination')}
                          className="px-3 bg-stealth-700 border border-stealth-600 text-zinc-400 hover:text-white"
                        >
                          <Navigation size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* MINI MAPA PARA SELECCIÓN */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                        {pickingType === 'origin' ? <MapPin size={14} className="text-accent-blue" /> : <Navigation size={14} className="text-purple-500" />}
                        SELECCIONAR {pickingType.toUpperCase()} EN EL MAPA
                      </label>
                      <div className="flex gap-2">
                         <button type="button" onClick={() => setPickingType('origin')} className={`px-3 py-1 text-[10px] border ${pickingType === 'origin' ? 'bg-accent-blue text-white border-accent-blue' : 'border-stealth-600 text-zinc-500'}`}>ORIGEN</button>
                         <button type="button" onClick={() => setPickingType('destination')} className={`px-3 py-1 text-[10px] border ${pickingType === 'destination' ? 'bg-purple-500 text-white border-purple-500' : 'border-stealth-600 text-zinc-500'}`}>DESTINO</button>
                      </div>
                    </div>
                    <div className="h-64 border border-stealth-600 relative overflow-hidden grayscale invert hue-rotate-180">
                      <MapContainer 
                        center={[4.6097, -74.0817]} 
                        zoom={11} 
                        className="h-full w-full"
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationMarker 
                          position={[formData.originLat, formData.originLng]} 
                          type="origin"
                          onLocationSelect={handleLocationSelect}
                        />
                        <LocationMarker 
                          position={[formData.destinationLat, formData.destinationLng]} 
                          type="destination"
                          onLocationSelect={handleLocationSelect}
                        />
                      </MapContainer>
                      <div className="absolute top-2 right-2 z-[1000] bg-stealth-900/80 p-2 text-[10px] text-white border border-stealth-600 uppercase">
                        Clic para ubicar {pickingType === 'origin' ? 'Origen' : 'Destino'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">{t('form.package')}</label>
                    <textarea 
                      required
                      rows="2"
                      className="w-full input-field resize-none"
                      value={formData.packageDescription}
                      onChange={(e) => setFormData({...formData, packageDescription: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    disabled={loading}
                    className="w-full btn-primary py-4 text-sm uppercase tracking-wider font-bold"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (initialData ? 'ACTUALIZAR DESPACHO' : 'CREAR NUEVO DESPACHO')}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderForm;
