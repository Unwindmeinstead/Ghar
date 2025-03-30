'use client';

import { useState, useEffect } from 'react';
import { 
  FiPlus, FiTrash2, FiEdit2, FiEye, FiEyeOff, 
  FiCopy, FiWifi, FiSearch, FiFilter, FiMapPin
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface WiFiNetwork {
  id: number;
  name: string;
  password: string;
  location: string;
  securityType: 'WPA2' | 'WPA3' | 'WEP' | 'OPEN';
  notes?: string;
  lastUsed: string;
}

export default function WiFiPasswordsPage() {
  const [showAddNetwork, setShowAddNetwork] = useState(false);
  const [filterLocation, setFilterLocation] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<number[]>([]);
  const [wifiNetworks, setWifiNetworks] = useState<WiFiNetwork[]>([]);

  // Load wifi networks from localStorage on component mount
  useEffect(() => {
    const storedWifiNetworks = localStorage.getItem('wifiNetworks');
    if (storedWifiNetworks) {
      try {
        const parsed = JSON.parse(storedWifiNetworks);
        setWifiNetworks(parsed);
      } catch (e) {
        console.error('Error parsing stored wifi networks:', e);
        // Initialize with empty array if there's an error
        setWifiNetworks([]);
        localStorage.setItem('wifiNetworks', JSON.stringify([]));
      }
    } else {
      // Initialize with empty array if no data exists
      setWifiNetworks([]);
      localStorage.setItem('wifiNetworks', JSON.stringify([]));
    }
  }, []);

  const locations = Array.from(new Set(wifiNetworks.map(network => network.location)));

  const filteredNetworks = wifiNetworks
    .filter(network => filterLocation ? network.location === filterLocation : true)
    .filter(network => {
      if (!search) return true;
      const searchLower = search.toLowerCase();
      return (
        network.name.toLowerCase().includes(searchLower) ||
        network.location.toLowerCase().includes(searchLower)
      );
    });

  const togglePasswordVisibility = (id: number) => {
    setVisiblePasswords(prev => 
      prev.includes(id) 
        ? prev.filter(netId => netId !== id) 
        : [...prev, id]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <DashboardLayout title="WiFi Passwords">
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Your WiFi Networks</h2>
          
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" size={16} />
              </div>
              <input
                type="text"
                placeholder="Search networks..."
                className="pl-10 pr-4 py-2 w-full md:w-60 rounded-lg border border-gray-200 focus:border-primary focus:outline-none bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <select
                className="appearance-none bg-gray-50 text-gray-800 px-4 py-2 pr-8 rounded-lg border border-gray-200 focus:border-primary focus:outline-none cursor-pointer"
                value={filterLocation || ''}
                onChange={(e) => setFilterLocation(e.target.value || null)}
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <FiFilter size={16} />
              </div>
            </div>
            
            <Button
              variant="premium"
              onClick={() => setShowAddNetwork(!showAddNetwork)}
              icon={<FiPlus />}
            >
              Add Network
            </Button>
          </div>
        </div>

        {/* Add Network Form */}
        {showAddNetwork && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 rounded-lg p-4 mb-6"
          >
            <h3 className="font-medium mb-4 text-gray-800">Add New WiFi Network</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              
              const newNetwork: WiFiNetwork = {
                id: Date.now(),
                name: formData.get('name') as string,
                password: formData.get('password') as string,
                location: formData.get('location') as string,
                securityType: formData.get('securityType') as 'WPA2' | 'WPA3' | 'WEP' | 'OPEN',
                lastUsed: new Date().toISOString().split('T')[0],
                notes: formData.get('notes') as string || undefined
              };
              
              const updatedNetworks = [...wifiNetworks, newNetwork];
              setWifiNetworks(updatedNetworks);
              localStorage.setItem('wifiNetworks', JSON.stringify(updatedNetworks));
              setShowAddNetwork(false);
              form.reset();
            }}>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Network Name (SSID)</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  className="w-full p-2 rounded-lg bg-white text-gray-800 border border-gray-200 focus:border-primary focus:outline-none"
                  placeholder="e.g. Home_WiFi"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Location</label>
                <input 
                  type="text" 
                  name="location"
                  required
                  className="w-full p-2 rounded-lg bg-white text-gray-800 border border-gray-200 focus:border-primary focus:outline-none"
                  placeholder="e.g. Home, Office"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    name="password"
                    required
                    className="w-full p-2 rounded-lg bg-white text-gray-800 border border-gray-200 focus:border-primary focus:outline-none pr-10"
                    placeholder="WiFi password"
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <FiEye size={18} />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Security Type</label>
                <select
                  name="securityType"
                  required
                  className="w-full p-2 rounded-lg bg-white text-gray-800 border border-gray-200 focus:border-primary focus:outline-none"
                >
                  <option value="WPA3">WPA3</option>
                  <option value="WPA2">WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="OPEN">Open (No Security)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Notes (Optional)</label>
                <textarea 
                  name="notes"
                  className="w-full p-2 rounded-lg bg-white text-gray-800 border border-gray-200 focus:border-primary focus:outline-none"
                  rows={2}
                  placeholder="Additional information about this network"
                />
              </div>
              <div className="md:col-span-2 flex justify-end space-x-3 mt-2">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setShowAddNetwork(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Network
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {filteredNetworks.length > 0 ? (
          <div className="space-y-4">
            {filteredNetworks.map((network) => (
              <motion.div 
                key={network.id} 
                className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex items-start md:items-center mb-3 md:mb-0">
                    <div className="bg-blue-500 bg-opacity-10 rounded-full p-2.5 mr-3">
                      <FiWifi className="text-blue-500" size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{network.name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <FiMapPin size={14} className="mr-1" />
                        {network.location} • {network.securityType}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Last used: {new Date(network.lastUsed).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Password:</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2 text-gray-800 font-mono">
                        {visiblePasswords.includes(network.id) ? network.password : '••••••••'}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(network.id)}
                        className="text-gray-400 hover:text-blue-500 mr-2"
                      >
                        {visiblePasswords.includes(network.id) ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(network.password)}
                        className="text-gray-400 hover:text-blue-500"
                      >
                        <FiCopy size={16} />
                      </button>
                    </div>
                  </div>
                  {network.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {network.notes}
                    </div>
                  )}
                </div>
                
                <div className="mt-3 flex justify-end space-x-2">
                  <button className="text-blue-500 hover:text-blue-700 p-1">
                    <FiEdit2 size={16} />
                  </button>
                  <button 
                    className="text-red-500 hover:text-red-700 p-1"
                    onClick={() => {
                      const updatedNetworks = wifiNetworks.filter(n => n.id !== network.id);
                      setWifiNetworks(updatedNetworks);
                      localStorage.setItem('wifiNetworks', JSON.stringify(updatedNetworks));
                    }}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <FiWifi size={40} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-400 mb-1">No WiFi networks saved</h3>
            <p className="text-sm mb-4">
              {search || filterLocation ? 
                'No networks match your search criteria.' : 
                'Add your first WiFi network to get started.'}
            </p>
            <Button
              variant="outline"
              icon={<FiPlus />}
              className="mx-auto"
              onClick={() => {
                setSearch('');
                setFilterLocation(null);
                setShowAddNetwork(true);
              }}
            >
              Add Network
            </Button>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
} 