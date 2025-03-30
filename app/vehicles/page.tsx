'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  FiPlus, FiTrash2, FiEdit2, FiCalendar, FiDollarSign, 
  FiTool, FiInfo, FiFilter, FiChevronDown, FiAlertCircle,
  FiCheckCircle, FiArrowDown, FiArrowUp, FiList
} from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import Card from '@/components/Card';
import Button from '@/components/Button';

// Define type for vehicle data
interface MaintenanceRecord {
  id: number;
  date: string;
  description: string;
  cost: number;
}

interface Insurance {
  provider: string;
  policyNumber: string;
  expiryDate: string;
  premium: number;
}

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  insurance: Insurance;
  maintenanceRecords: MaintenanceRecord[];
}

export default function VehiclesPage() {
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showMaintenanceDetails, setShowMaintenanceDetails] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'make'>('newest');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Load vehicles from localStorage on component mount
  useEffect(() => {
    const storedVehicles = localStorage.getItem('vehicles');
    if (storedVehicles) {
      try {
        const parsed = JSON.parse(storedVehicles);
        setVehicles(parsed);
      } catch (e) {
        console.error('Error parsing stored vehicles:', e);
      }
    }
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSortOptions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle vehicle selection
  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowMaintenanceDetails(false);
  };

  // Toggle maintenance details view
  const handleShowMaintenanceDetails = () => {
    setShowMaintenanceDetails(!showMaintenanceDetails);
  };

  // Calculate total maintenance costs
  const calculateTotalMaintenanceCosts = () => {
    return vehicles.reduce((total, vehicle) => {
      return total + vehicle.maintenanceRecords.reduce((sum, record) => sum + record.cost, 0);
    }, 0);
  };

  // Count vehicles with expiring insurance (next 30 days)
  const countExpiringInsurance = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    return vehicles.filter(vehicle => {
      const expiryDate = new Date(vehicle.insurance.expiryDate);
      return expiryDate >= today && expiryDate <= thirtyDaysFromNow;
    }).length;
  };

  // Get most recent maintenance date for a vehicle
  const getLastMaintenanceDate = (vehicle: Vehicle) => {
    if (vehicle.maintenanceRecords.length === 0) return null;
    
    const sortedRecords = [...vehicle.maintenanceRecords].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return new Date(sortedRecords[0].date);
  };

  // Check if insurance is expiring soon (within 30 days)
  const isInsuranceExpiringSoon = (vehicle: Vehicle) => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    const expiryDate = new Date(vehicle.insurance.expiryDate);
    return expiryDate >= today && expiryDate <= thirtyDaysFromNow;
  };

  // Check if insurance has expired
  const hasInsuranceExpired = (vehicle: Vehicle) => {
    const today = new Date();
    const expiryDate = new Date(vehicle.insurance.expiryDate);
    return expiryDate < today;
  };

  // Sort vehicles based on selected sort option
  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (sortBy === 'newest') {
      return b.year - a.year;
    } else if (sortBy === 'oldest') {
      return a.year - b.year;
    } else {
      return a.make.localeCompare(b.make);
    }
  });

  return (
    <DashboardLayout title="Vehicles">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pt-1">
        <Card className="flex items-center">
          <div className="bg-blue-500 rounded-full p-3 mr-4 text-white">
            <FaCar size={20} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Total Vehicles</h3>
            <p className="text-xl font-semibold text-gray-800">{vehicles.length}</p>
          </div>
        </Card>
        
        <Card className="flex items-center">
          <div className="bg-green-500 rounded-full p-3 mr-4 text-white">
            <FiDollarSign size={20} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Maintenance Costs</h3>
            <p className="text-xl font-semibold text-gray-800">${calculateTotalMaintenanceCosts().toLocaleString()}</p>
          </div>
        </Card>
        
        <Card className="flex items-center">
          <div className="bg-yellow-500 rounded-full p-3 mr-4 text-white">
            <FiCalendar size={20} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Expiring Insurance</h3>
            <p className="text-xl font-semibold text-gray-800">{countExpiringInsurance()}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicles List */}
        <div className="lg:col-span-1">
          <Card className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Your Vehicles</h2>
              
              {/* Enhanced Sort Dropdown */}
              <div className="relative" ref={sortDropdownRef}>
                <Button 
                  variant="outline"
                  className={`text-xs px-2 py-0.5 ${showSortOptions ? 'bg-gray-100' : ''}`}
                  onClick={() => setShowSortOptions(!showSortOptions)}
                  icon={<FiFilter size={12} />}
                >
                  {sortBy === 'newest' && 'Newest First'}
                  {sortBy === 'oldest' && 'Oldest First'}
                  {sortBy === 'make' && 'By Make'}
                  <FiChevronDown 
                    size={12} 
                    className={`ml-1 transition-transform duration-200 ${showSortOptions ? 'transform rotate-180' : ''}`} 
                  />
                </Button>
                
                <AnimatePresence>
                  {showSortOptions && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                    >
                      <ul className="py-0.5">
                        <li 
                          className={`px-2 py-1.5 text-xs cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between ${sortBy === 'newest' ? 'text-primary font-medium bg-primary bg-opacity-5' : 'text-gray-700'}`}
                          onClick={() => {
                            setSortBy('newest');
                            setShowSortOptions(false);
                          }}
                        >
                          <div className="flex items-center">
                            <FiArrowDown className="mr-1.5" size={12} />
                            <span>Newest First</span>
                          </div>
                          {sortBy === 'newest' && <FiCheckCircle size={12} className="text-primary" />}
                        </li>
                        <li 
                          className={`px-2 py-1.5 text-xs cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between ${sortBy === 'oldest' ? 'text-primary font-medium bg-primary bg-opacity-5' : 'text-gray-700'}`}
                          onClick={() => {
                            setSortBy('oldest');
                            setShowSortOptions(false);
                          }}
                        >
                          <div className="flex items-center">
                            <FiArrowUp className="mr-1.5" size={12} />
                            <span>Oldest First</span>
                          </div>
                          {sortBy === 'oldest' && <FiCheckCircle size={12} className="text-primary" />}
                        </li>
                        <li 
                          className={`px-2 py-1.5 text-xs cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between ${sortBy === 'make' ? 'text-primary font-medium bg-primary bg-opacity-5' : 'text-gray-700'}`}
                          onClick={() => {
                            setSortBy('make');
                            setShowSortOptions(false);
                          }}
                        >
                          <div className="flex items-center">
                            <FiList className="mr-1.5" size={12} />
                            <span>By Make</span>
                          </div>
                          {sortBy === 'make' && <FiCheckCircle size={12} className="text-primary" />}
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {vehicles.length > 0 ? (
              <div className="space-y-4">
                {sortedVehicles.map((vehicle) => {
                  const lastMaintenance = getLastMaintenanceDate(vehicle);
                  const isExpiringSoon = isInsuranceExpiringSoon(vehicle);
                  const isExpired = hasInsuranceExpired(vehicle);

                  // Get appropriate icon or image based on vehicle make
                  const getVehicleIcon = () => {
                    const make = vehicle.make.toLowerCase();
                    if (make.includes('toyota')) return '🚙';
                    if (make.includes('honda')) return '🚗';
                    if (make.includes('ford')) return '🚘';
                    if (make.includes('bmw') || make.includes('mercedes')) return '🏎️';
                    if (make.includes('truck') || make.includes('pickup')) return '🛻';
                    return '🚗';
                  };
                  
                  return (
                    <motion.div
                      key={vehicle.id}
                      className={`rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden ${
                        selectedVehicle?.id === vehicle.id
                          ? 'ring-2 ring-primary'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => handleSelectVehicle(vehicle)}
                      whileHover={{ y: -2 }}
                    >
                      <div className="relative">
                        {/* Top color strip based on insurance status */}
                        <div className={`h-1 w-full ${
                          isExpired ? 'bg-red-500' : 
                          isExpiringSoon ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`}></div>
                        
                        <div className="p-4">
                          <div className="flex">
                            {/* Left: Icon/Image section */}
                            <div className="flex-shrink-0 mr-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl
                                ${selectedVehicle?.id === vehicle.id 
                                  ? 'bg-primary bg-opacity-10 text-primary' 
                                  : 'bg-gray-100 text-gray-600'}`
                              }>
                                <span role="img" aria-label="Vehicle icon">{getVehicleIcon()}</span>
                              </div>
                            </div>
                            
                            {/* Right: Content section */}
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-bold text-gray-800 text-base">
                                    {vehicle.year} {vehicle.make} {vehicle.model}
                                  </h3>
                                  <p className="text-xs text-gray-500 mt-0.5 font-medium">
                                    {vehicle.licensePlate}
                                  </p>
                                </div>
                                
                                {/* Status badge */}
                                {isExpired ? (
                                  <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full flex items-center font-medium">
                                    <FiAlertCircle size={10} className="mr-1" />
                                    Expired
                                  </span>
                                ) : isExpiringSoon ? (
                                  <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full flex items-center font-medium">
                                    <FiAlertCircle size={10} className="mr-1" />
                                    Expiring
                                  </span>
                                ) : (
                                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full flex items-center font-medium">
                                    <FiCheckCircle size={10} className="mr-1" />
                                    Insured
                                  </span>
                                )}
                              </div>
                              
                              {/* Progress bar for insurance time remaining */}
                              <div className="mt-3 mb-2">
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className={`h-1.5 rounded-full ${
                                      isExpired ? 'bg-red-500' : 
                                      isExpiringSoon ? 'bg-yellow-500' : 
                                      'bg-green-500'
                                    }`} 
                                    style={{ 
                                      width: isExpired ? '0%' : 
                                        isExpiringSoon ? '25%' : 
                                          '75%' 
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Info footer */}
                          <div className="flex justify-between mt-3 pt-2 border-t border-gray-100 text-xs text-gray-500">
                            <div className="flex items-center">
                              <FiTool size={10} className="mr-1" />
                              <span>
                                {lastMaintenance
                                  ? `Last service: ${lastMaintenance.toLocaleDateString()}`
                                  : 'No service records'}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <FiCalendar size={10} className="mr-1" />
                              <span>Renewal: {new Date(vehicle.insurance.expiryDate).toLocaleDateString()}</span>
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
                <FaCar size={40} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-400 mb-1">No vehicles yet</h3>
                <p className="text-sm mb-4">Add your first vehicle to get started</p>
                <Button
                  variant="outline"
                  icon={<FiPlus />}
                  className="mx-auto"
                >
                  Add Vehicle
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Vehicle Details */}
        <div className="lg:col-span-2">
          {selectedVehicle ? (
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">
                  {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                </h2>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">License Plate</p>
                  <p className="font-medium">{selectedVehicle.licensePlate}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Insurance Provider</p>
                  <p className="font-medium">{selectedVehicle.insurance.provider}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Policy Number</p>
                  <p className="font-medium">{selectedVehicle.insurance.policyNumber}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Policy Expiry</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiCalendar className="text-gray-400 mr-1" size={14} />
                      <p className="font-medium">{new Date(selectedVehicle.insurance.expiryDate).toLocaleDateString()}</p>
                    </div>
                    {hasInsuranceExpired(selectedVehicle) ? (
                      <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full">Expired</span>
                    ) : isInsuranceExpiringSoon(selectedVehicle) ? (
                      <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">Expiring Soon</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Active</span>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Premium</p>
                  <div className="flex items-center">
                    <FiDollarSign className="text-gray-400 mr-1" size={14} />
                    <p className="font-medium">${selectedVehicle.insurance.premium.toLocaleString()}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Total Maintenance Cost</p>
                  <div className="flex items-center">
                    <FiDollarSign className="text-gray-400 mr-1" size={14} />
                    <p className="font-medium">
                      ${selectedVehicle.maintenanceRecords.reduce((sum, record) => sum + record.cost, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {!showMaintenanceDetails ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-gray-400 text-sm">Maintenance Records</h3>
                    <div className="flex space-x-2">
                      <Button 
                        variant="primary" 
                        icon={<FiPlus />} 
                        className="text-sm px-3 py-1"
                      >
                        Add Record
                      </Button>
                      <Button 
                        variant="outline" 
                        icon={<FiTool />} 
                        className="text-sm px-3 py-1"
                        onClick={handleShowMaintenanceDetails}
                      >
                        View All
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {selectedVehicle.maintenanceRecords.length > 0 ? (
                      selectedVehicle.maintenanceRecords.slice(0, 3).map((record) => (
                        <div key={record.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <p className="font-medium">{record.description}</p>
                            <p className="text-sm text-primary font-semibold">${record.cost.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <FiCalendar size={12} className="mr-1" />
                            <span>{new Date(record.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-4">
                        <p>No maintenance records yet.</p>
                        <p className="text-sm mt-1">Click "Add Record" to add your first maintenance record.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-gray-400 text-sm">All Maintenance Records</h3>
                    <div className="flex space-x-2">
                      <Button 
                        variant="primary" 
                        icon={<FiPlus />} 
                        className="text-sm px-3 py-1 mr-2"
                      >
                        Add Record
                      </Button>
                      <Button 
                        variant="outline" 
                        className="text-sm px-3 py-1"
                        onClick={handleShowMaintenanceDetails}
                      >
                        Back
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {selectedVehicle.maintenanceRecords.length > 0 ? (
                      selectedVehicle.maintenanceRecords.map((record) => (
                        <div key={record.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <p className="font-medium">{record.description}</p>
                            <p className="text-sm text-primary font-semibold">${record.cost.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <FiCalendar size={12} className="mr-1" />
                            <span>{new Date(record.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-4">
                        <p>No maintenance records found.</p>
                        <p className="text-sm mt-1">Click "Add Record" to add your first maintenance record.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center py-12">
              <div className="text-center text-gray-400 mb-4">
                <FaCar size={48} className="mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-medium mb-2">No Vehicle Selected</h3>
                <p className="mb-6">Select a vehicle to view its details or add a new one</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 