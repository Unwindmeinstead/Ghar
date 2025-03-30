'use client';

import { useState, useEffect } from 'react';
import { 
  FiWifi, FiEye, FiEyeOff, FiClipboard, 
  FiCheck, FiEdit2, FiTrash2, FiInfo,
  FiCopy, FiLock, FiUnlock, FiHome, FiCalendar,
  FiPlus
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import QRCode from 'react-qr-code';

interface WifiPassword {
  id: number;
  name: string;
  ssid: string;
  password: string;
  securityType: 'WPA2' | 'WPA3' | 'WPA' | 'WEP' | 'Open';
  notes?: string;
  lastUpdated: string;
  frequency?: '2.4 GHz' | '5 GHz' | 'Both';
  location?: string;
}

export default function WifiPasswordsPage() {
  const [wifiPasswords, setWifiPasswords] = useState<WifiPassword[]>([]);
  const [selectedWifi, setSelectedWifi] = useState<WifiPassword | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Load wifi passwords from localStorage on component mount
  useEffect(() => {
    const storedWifiPasswords = localStorage.getItem('wifiPasswords');
    if (storedWifiPasswords) {
      try {
        const parsed = JSON.parse(storedWifiPasswords);
        setWifiPasswords(parsed);
      } catch (e) {
        console.error('Error parsing stored wifi passwords:', e);
        // Initialize with empty array if there's an error
        setWifiPasswords([]);
        localStorage.setItem('wifiPasswords', JSON.stringify([]));
      }
    } else {
      // Initialize with empty array if no data exists
      setWifiPasswords([]);
      localStorage.setItem('wifiPasswords', JSON.stringify([]));
    }
  }, []);

  // Reset copied field status after 2 seconds
  useEffect(() => {
    if (copiedField) {
      const timer = setTimeout(() => {
        setCopiedField(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedField]);

  // Handle wifi selection
  const handleSelectWifi = (wifi: WifiPassword) => {
    setSelectedWifi(wifi);
    setShowPassword(false);
  };

  // Copy text to clipboard
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
  };

  // Get security level icon and color
  const getSecurityInfo = (type: string) => {
    switch(type) {
      case 'WPA3':
        return { icon: <FiLock size={12} />, color: 'bg-green-100 text-green-800', level: 'High' };
      case 'WPA2':
        return { icon: <FiLock size={12} />, color: 'bg-blue-100 text-blue-800', level: 'Good' };
      case 'WPA':
        return { icon: <FiLock size={12} />, color: 'bg-yellow-100 text-yellow-800', level: 'Fair' };
      case 'WEP':
        return { icon: <FiLock size={12} />, color: 'bg-orange-100 text-orange-800', level: 'Weak' };
      default:
        return { icon: <FiUnlock size={12} />, color: 'bg-red-100 text-red-800', level: 'None' };
    }
  };

  // Generate WiFi QR code text
  const generateWifiQRCode = (wifi: WifiPassword) => {
    // Standard format for WiFi QR codes
    const security = wifi.securityType === 'Open' ? 'nopass' : wifi.securityType;
    return `WIFI:S:${wifi.ssid};T:${security};P:${wifi.password};;`;
  };

  return (
    <DashboardLayout title="WiFi Passwords">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pt-1">
        <Card className="flex items-center">
          <div className="bg-blue-500 rounded-full p-3 mr-4 text-white">
            <FiWifi size={20} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Saved Networks</h3>
            <p className="text-xl font-semibold text-gray-800">{wifiPasswords.length}</p>
          </div>
        </Card>
        
        <Card className="flex items-center">
          <div className="bg-green-500 rounded-full p-3 mr-4 text-white">
            <FiLock size={20} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Secure Networks</h3>
            <p className="text-xl font-semibold text-gray-800">
              {wifiPasswords.filter(wifi => wifi.securityType !== 'Open').length}
            </p>
          </div>
        </Card>
        
        <Card className="flex items-center">
          <div className="bg-purple-500 rounded-full p-3 mr-4 text-white">
            <FiHome size={20} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Locations</h3>
            <p className="text-xl font-semibold text-gray-800">
              {new Set(wifiPasswords.map(wifi => wifi.location).filter(Boolean)).size}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* WiFi List */}
        <div className="lg:col-span-1">
          <Card className="mb-4">
            <h2 className="text-lg font-semibold mb-4">Your WiFi Networks</h2>
            
            {wifiPasswords.length > 0 ? (
              <div className="space-y-4">
                {wifiPasswords.map((wifi) => {
                  const security = getSecurityInfo(wifi.securityType);
                  
                  return (
                    <motion.div
                      key={wifi.id}
                      className={`rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden ${
                        selectedWifi?.id === wifi.id
                          ? 'ring-2 ring-primary'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => handleSelectWifi(wifi)}
                      whileHover={{ y: -2 }}
                    >
                      <div className="relative">
                        {/* Top color strip based on security type */}
                        <div className={`h-1 w-full ${
                          wifi.securityType === 'WPA3' ? 'bg-green-500' :
                          wifi.securityType === 'WPA2' ? 'bg-blue-500' :
                          wifi.securityType === 'WPA' ? 'bg-yellow-500' :
                          wifi.securityType === 'WEP' ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}></div>
                        
                        <div className="p-4">
                          <div className="flex">
                            {/* Left: Icon section */}
                            <div className="flex-shrink-0 mr-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center
                                ${selectedWifi?.id === wifi.id 
                                  ? 'bg-primary bg-opacity-10 text-primary' 
                                  : 'bg-blue-100 text-blue-600'}`
                              }>
                                <FiWifi size={24} />
                              </div>
                            </div>
                            
                            {/* Right: Content section */}
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-bold text-gray-800 text-base">
                                    {wifi.name}
                                  </h3>
                                  <p className="text-xs text-gray-500 mt-0.5 font-medium">
                                    {wifi.ssid}
                                  </p>
                                </div>
                                
                                {/* Security badge */}
                                <span className={`text-xs px-2 py-0.5 rounded-full flex items-center font-medium ${security.color}`}>
                                  {security.icon}
                                  <span className="ml-1">{security.level}</span>
                                </span>
                              </div>
                              
                              {/* Info footer */}
                              <div className="flex justify-between mt-3 pt-2 border-t border-gray-100 text-xs text-gray-500">
                                {wifi.location && (
                                  <div className="flex items-center">
                                    <FiHome size={10} className="mr-1" />
                                    <span>{wifi.location}</span>
                                  </div>
                                )}
                                {wifi.frequency && (
                                  <div className="flex items-center">
                                    <span>{wifi.frequency}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                <FiWifi size={40} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-400 mb-1">No WiFi networks saved</h3>
                <p className="text-sm mb-4">Add your first WiFi network to get started</p>
                <Button
                  variant="outline"
                  icon={<FiPlus />}
                  className="mx-auto"
                >
                  Add Network
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* WiFi Details */}
        <div className="lg:col-span-2">
          {selectedWifi ? (
            <Card>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold">{selectedWifi.name}</h2>
                  <p className="text-sm text-gray-500">{selectedWifi.ssid}</p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    icon={<FiEdit2 />}
                    className="text-sm px-3 py-1"
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    icon={<FiTrash2 />} 
                    className="text-sm px-3 py-1 text-red-500 border-red-500 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">SSID (Network Name)</p>
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-800">{selectedWifi.ssid}</p>
                      <Button
                        variant="icon"
                        className="text-gray-500 hover:text-primary"
                        onClick={() => handleCopy(selectedWifi.ssid, 'ssid')}
                      >
                        {copiedField === 'ssid' ? <FiCheck size={18} className="text-green-500" /> : <FiClipboard size={18} />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg relative">
                    <p className="text-xs text-gray-400 mb-1">Password</p>
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-800">
                        {showPassword ? selectedWifi.password : '••••••••••••'}
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          variant="icon"
                          className="text-gray-500 hover:text-primary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </Button>
                        <Button
                          variant="icon"
                          className="text-gray-500 hover:text-primary"
                          onClick={() => handleCopy(selectedWifi.password, 'password')}
                        >
                          {copiedField === 'password' ? <FiCheck size={18} className="text-green-500" /> : <FiClipboard size={18} />}
                        </Button>
                      </div>
                    </div>
                    {showPassword && 
                      <div className="absolute top-0 right-0 w-full h-full bg-yellow-50 bg-opacity-20 pointer-events-none"></div>
                    }
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Security Type</p>
                      <div className="flex items-center">
                        {getSecurityInfo(selectedWifi.securityType).icon}
                        <p className="font-medium text-gray-800 ml-2">{selectedWifi.securityType}</p>
                      </div>
                    </div>
                    
                    {selectedWifi.frequency && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Frequency</p>
                        <p className="font-medium text-gray-800">{selectedWifi.frequency}</p>
                      </div>
                    )}
                    
                    {selectedWifi.location && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Location</p>
                        <div className="flex items-center">
                          <FiHome className="text-gray-400 mr-2" size={14} />
                          <p className="font-medium text-gray-800">{selectedWifi.location}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Last Updated</p>
                      <div className="flex items-center">
                        <FiCalendar className="text-gray-400 mr-2" size={14} />
                        <p className="font-medium text-gray-800">{new Date(selectedWifi.lastUpdated).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedWifi.notes && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Notes</p>
                      <p className="text-gray-800 whitespace-pre-line">{selectedWifi.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-sm font-medium mb-4">QR Code for Easy Sharing</h3>
                  <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    {selectedWifi ? (
                      <div className="text-center">
                        <div className="p-2 bg-white inline-block">
                          {/* Assuming using react-qr-code or a similar library */}
                          <div className="p-4 border-8 border-white shadow-lg rounded">
                            <svg
                              className="w-48 h-48"
                              viewBox="0 0 29 29"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              {/* Simplified QR code visualization */}
                              <rect width="29" height="29" fill="white" />
                              <rect x="1" y="1" width="7" height="7" />
                              <rect x="21" y="1" width="7" height="7" />
                              <rect x="1" y="21" width="7" height="7" />
                              <rect x="10" y="4" width="3" height="3" />
                              <rect x="16" y="10" width="9" height="3" />
                              <rect x="13" y="16" width="3" height="3" />
                              <rect x="4" y="16" width="6" height="3" />
                              <rect x="10" y="19" width="6" height="3" />
                              <rect x="16" y="22" width="3" height="3" />
                            </svg>
                          </div>
                          <p className="text-sm mt-2">Scan to connect</p>
                          <Button 
                            variant="outline"
                            icon={<FiCopy />}
                            className="mt-2 text-xs"
                            onClick={() => handleCopy(generateWifiQRCode(selectedWifi), 'qrdata')}
                          >
                            {copiedField === 'qrdata' ? 'Copied!' : 'Copy QR Data'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <FiWifi size={48} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Select a network to generate QR</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center py-12">
              <div className="text-center text-gray-400 mb-4">
                <FiWifi size={48} className="mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-medium mb-2">No WiFi Network Selected</h3>
                <p className="mb-6">Select a network to view its details or add a new one</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 