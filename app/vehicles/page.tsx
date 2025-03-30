'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  FiPlus, FiTrash2, FiEdit2, FiCalendar, FiDollarSign, 
  FiTool, FiInfo, FiFilter, FiChevronDown, FiAlertCircle,
  FiCheckCircle, FiArrowDown, FiArrowUp, FiList, FiX, FiSave
} from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';

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
  
  // New state variables for edit and delete functionality
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditVehicle, setShowEditVehicle] = useState(false);
  const [editFormData, setEditFormData] = useState<Vehicle | null>(null);
  
  // Maintenance record state
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [currentMaintenanceRecord, setCurrentMaintenanceRecord] = useState<MaintenanceRecord | null>(null);
  const [maintenanceFormData, setMaintenanceFormData] = useState<Partial<MaintenanceRecord>>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    cost: 0
  });

  const [newVehicleData, setNewVehicleData] = useState<Partial<Vehicle>>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    insurance: {
      provider: '',
      policyNumber: '',
      expiryDate: new Date().toISOString().split('T')[0],
      premium: 0
    },
    maintenanceRecords: []
  });

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

  // Save vehicles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

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

  // Handle vehicle deletion
  const handleDeleteVehicle = () => {
    if (selectedVehicle) {
      // Filter out the selected vehicle from the vehicles array
      const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== selectedVehicle.id);
      setVehicles(updatedVehicles);
      
      // Reset selected vehicle and close modal
      setSelectedVehicle(null);
      setShowDeleteConfirmation(false);
    }
  };
  
  // Initialize edit form
  const handleEditClick = () => {
    if (selectedVehicle) {
      setEditFormData({...selectedVehicle});
      setShowEditVehicle(true);
    }
  };
  
  // Handle form input changes for editing
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    
    if (!editFormData) return;
    
    if (id.includes('insurance.')) {
      // Handle nested insurance properties
      const insuranceField = id.split('.')[1];
      setEditFormData({
        ...editFormData,
        insurance: {
          ...editFormData.insurance,
          [insuranceField]: insuranceField === 'premium' ? parseFloat(value) : value
        }
      });
    } else {
      // Handle top-level properties
      setEditFormData({
        ...editFormData,
        [id]: id === 'year' ? parseInt(value, 10) : value
      });
    }
  };
  
  // Submit edit form
  const handleSaveEdit = () => {
    if (!editFormData) return;
    
    // Update the vehicle in the vehicles array
    const updatedVehicles = vehicles.map(vehicle => 
      vehicle.id === editFormData.id ? editFormData : vehicle
    );
    
    setVehicles(updatedVehicles);
    setSelectedVehicle(editFormData);
    setShowEditVehicle(false);
  };
  
  // Add a new maintenance record
  const handleAddMaintenanceRecord = () => {
    // Reset form data
    setMaintenanceFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      cost: 0
    });
    setCurrentMaintenanceRecord(null);
    setShowMaintenanceForm(true);
  };
  
  // Edit existing maintenance record
  const handleEditMaintenanceRecord = (record: MaintenanceRecord) => {
    setMaintenanceFormData({
      date: record.date.split('T')[0],
      description: record.description,
      cost: record.cost
    });
    setCurrentMaintenanceRecord(record);
    setShowMaintenanceForm(true);
  };
  
  // Delete maintenance record
  const handleDeleteMaintenanceRecord = (recordId: number) => {
    if (!selectedVehicle) return;
    
    // Filter out the record
    const updatedRecords = selectedVehicle.maintenanceRecords.filter(
      record => record.id !== recordId
    );
    
    // Update the vehicle
    const updatedVehicle = {
      ...selectedVehicle,
      maintenanceRecords: updatedRecords
    };
    
    // Update vehicles array
    const updatedVehicles = vehicles.map(vehicle => 
      vehicle.id === selectedVehicle.id ? updatedVehicle : vehicle
    );
    
    setVehicles(updatedVehicles);
    setSelectedVehicle(updatedVehicle);
  };
  
  // Handle maintenance form input changes
  const handleMaintenanceFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    setMaintenanceFormData(prev => ({
      ...prev,
      [id]: id === 'cost' ? parseFloat(value) : value
    }));
  };
  
  // Save maintenance record
  const handleSaveMaintenanceRecord = () => {
    if (!selectedVehicle || !maintenanceFormData.description) return;
    
    const updatedVehicle = { ...selectedVehicle };
    
    if (currentMaintenanceRecord) {
      // Editing existing record
      updatedVehicle.maintenanceRecords = updatedVehicle.maintenanceRecords.map(record => 
        record.id === currentMaintenanceRecord.id 
          ? { 
              ...record, 
              date: maintenanceFormData.date || record.date,
              description: maintenanceFormData.description || record.description,
              cost: maintenanceFormData.cost !== undefined ? maintenanceFormData.cost : record.cost
            } 
          : record
      );
    } else {
      // Adding new record
      const newRecord: MaintenanceRecord = {
        id: Date.now(),
        date: maintenanceFormData.date || new Date().toISOString().split('T')[0],
        description: maintenanceFormData.description || 'Maintenance',
        cost: maintenanceFormData.cost || 0
      };
      
      updatedVehicle.maintenanceRecords = [
        ...updatedVehicle.maintenanceRecords,
        newRecord
      ];
    }
    
    // Update vehicles array
    const updatedVehicles = vehicles.map(vehicle => 
      vehicle.id === selectedVehicle.id ? updatedVehicle : vehicle
    );
    
    setVehicles(updatedVehicles);
    setSelectedVehicle(updatedVehicle);
    setShowMaintenanceForm(false);
  };

  // Handle new vehicle form change
  const handleNewVehicleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    
    if (id.includes('insurance.')) {
      // Handle nested insurance properties
      const insuranceField = id.split('.')[1];
      setNewVehicleData(prev => ({
        ...prev,
        insurance: {
          ...prev.insurance!,
          [insuranceField]: insuranceField === 'premium' ? parseFloat(value) : value
        }
      }));
    } else {
      // Handle top-level properties
      setNewVehicleData(prev => ({
        ...prev,
        [id]: id === 'year' ? parseInt(value, 10) : value
      }));
    }
  };
  
  // Save new vehicle
  const handleSaveNewVehicle = () => {
    // Validate required fields
    if (!newVehicleData.make || !newVehicleData.model || !newVehicleData.licensePlate) {
      return; // Don't save if required fields are missing
    }
    
    // Create new vehicle with unique ID
    const newVehicle: Vehicle = {
      id: Date.now(),
      make: newVehicleData.make || '',
      model: newVehicleData.model || '',
      year: newVehicleData.year || new Date().getFullYear(),
      licensePlate: newVehicleData.licensePlate || '',
      insurance: {
        provider: newVehicleData.insurance?.provider || '',
        policyNumber: newVehicleData.insurance?.policyNumber || '',
        expiryDate: newVehicleData.insurance?.expiryDate || new Date().toISOString().split('T')[0],
        premium: newVehicleData.insurance?.premium || 0
      },
      maintenanceRecords: []
    };
    
    // Add to vehicles array
    const updatedVehicles = [...vehicles, newVehicle];
    setVehicles(updatedVehicles);
    
    // Select the new vehicle and close modal
    setSelectedVehicle(newVehicle);
    setShowAddVehicle(false);
    
    // Reset form
    setNewVehicleData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      insurance: {
        provider: '',
        policyNumber: '',
        expiryDate: new Date().toISOString().split('T')[0],
        premium: 0
      },
      maintenanceRecords: []
    });
  };

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
              
              {/* Add Button */}
              <Button 
                variant="primary"
                size="sm"
                onClick={() => setShowAddVehicle(true)}
                className="p-2 h-8 w-8 rounded-full"
                aria-label="Add vehicle"
              >
                <FiPlus size={14} />
              </Button>
              
              {/* Enhanced Sort Dropdown */}
              <div className="relative" ref={sortDropdownRef}>
                <Button 
                  variant="outline"
                  size="sm"
                  className={`p-2 h-8 w-8 rounded-full ${showSortOptions ? 'bg-gray-100' : ''}`}
                  onClick={() => setShowSortOptions(!showSortOptions)}
                  aria-label="Sort vehicles"
                >
                  <FiFilter size={14} />
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
                  onClick={() => setShowAddVehicle(true)}
                  className="mx-auto flex items-center space-x-2"
                >
                  <FiPlus size={14} />
                  <span>Add Vehicle</span>
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
                    size="sm"
                    onClick={handleEditClick}
                    className="p-2 h-8 w-8 rounded-full"
                    aria-label="Edit vehicle"
                  >
                    <FiEdit2 size={14} />
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirmation(true)}
                    className="p-2 h-8 w-8 rounded-full text-red-500 border-red-200 hover:bg-red-50"
                    aria-label="Delete vehicle"
                  >
                    <FiTrash2 size={14} />
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
                        size="sm"
                        onClick={handleAddMaintenanceRecord}
                        className="p-2 h-8 w-8 rounded-full"
                        aria-label="Add maintenance record"
                      >
                        <FiPlus size={14} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleShowMaintenanceDetails}
                        className="p-2 h-8 w-8 rounded-full"
                        aria-label="View all maintenance records"
                      >
                        <FiTool size={14} />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {selectedVehicle.maintenanceRecords.length > 0 ? (
                      selectedVehicle.maintenanceRecords.slice(0, 3).map((record) => (
                        <div key={record.id} className="bg-gray-50 p-3 rounded-lg relative group">
                          <div className="absolute right-3 top-3 hidden group-hover:flex space-x-1">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditMaintenanceRecord(record);
                              }}
                              className="p-1.5 text-gray-500 hover:text-primary bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm"
                              aria-label="Edit maintenance record"
                            >
                              <FiEdit2 size={12} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMaintenanceRecord(record.id);
                              }}
                              className="p-1.5 text-gray-500 hover:text-red-500 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm"
                              aria-label="Delete maintenance record"
                            >
                              <FiTrash2 size={12} />
                            </button>
                          </div>
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
                        size="sm"
                        onClick={handleAddMaintenanceRecord}
                        className="p-2 h-8 w-8 rounded-full mr-1"
                        aria-label="Add maintenance record"
                      >
                        <FiPlus size={14} />
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm" 
                        onClick={handleShowMaintenanceDetails}
                        className="p-2 h-8 w-8 rounded-full"
                        aria-label="Back to summary view"
                      >
                        <FiArrowUp size={14} />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {selectedVehicle.maintenanceRecords.length > 0 ? (
                      selectedVehicle.maintenanceRecords.map((record) => (
                        <div key={record.id} className="bg-gray-50 p-3 rounded-lg relative group">
                          <div className="absolute right-3 top-3 hidden group-hover:flex space-x-1">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditMaintenanceRecord(record);
                              }}
                              className="p-1.5 text-gray-500 hover:text-primary bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm"
                              aria-label="Edit maintenance record"
                            >
                              <FiEdit2 size={12} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMaintenanceRecord(record.id);
                              }}
                              className="p-1.5 text-gray-500 hover:text-red-500 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm"
                              aria-label="Delete maintenance record"
                            >
                              <FiTrash2 size={12} />
                            </button>
                          </div>
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
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && selectedVehicle && (
        <Modal 
          title="Confirm Deletion" 
          onClose={() => setShowDeleteConfirmation(false)}
          isOpen={showDeleteConfirmation}
        >
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="bg-red-100 text-red-500 rounded-full p-3 inline-block mb-4">
                <FiTrash2 size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}?
              </h3>
              <p className="text-sm text-gray-500">
                This action cannot be undone. All data including maintenance records will be permanently deleted.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteVehicle}
                className="px-4 py-2"
              >
                Delete Vehicle
              </Button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Edit Vehicle Modal */}
      {showEditVehicle && editFormData && (
        <Modal 
          title="Edit Vehicle" 
          onClose={() => setShowEditVehicle(false)}
          isOpen={showEditVehicle}
        >
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                <input
                  type="text"
                  id="make"
                  value={editFormData.make}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <input
                  type="text"
                  id="model"
                  value={editFormData.model}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                  type="number"
                  id="year"
                  value={editFormData.year}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                <input
                  type="text"
                  id="licensePlate"
                  value={editFormData.licensePlate}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            <h4 className="font-medium text-gray-700 mb-3">Insurance Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="insurance.provider" className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <input
                  type="text"
                  id="insurance.provider"
                  value={editFormData.insurance.provider}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="insurance.policyNumber" className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
                <input
                  type="text"
                  id="insurance.policyNumber"
                  value={editFormData.insurance.policyNumber}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="insurance.expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  id="insurance.expiryDate"
                  value={editFormData.insurance.expiryDate.split('T')[0]}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="insurance.premium" className="block text-sm font-medium text-gray-700 mb-1">Premium</label>
                <input
                  type="number"
                  id="insurance.premium"
                  value={editFormData.insurance.premium}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEditVehicle(false)}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveEdit}
                className="px-4 py-2"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Add Vehicle Modal */}
      {showAddVehicle && (
        <Modal 
          title="Add New Vehicle" 
          onClose={() => setShowAddVehicle(false)}
          isOpen={showAddVehicle}
        >
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">Make*</label>
                <input
                  type="text"
                  id="make"
                  value={newVehicleData.make}
                  onChange={handleNewVehicleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Toyota, Honda, etc."
                  required
                />
              </div>
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">Model*</label>
                <input
                  type="text"
                  id="model"
                  value={newVehicleData.model}
                  onChange={handleNewVehicleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Camry, Civic, etc."
                  required
                />
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year*</label>
                <input
                  type="number"
                  id="year"
                  value={newVehicleData.year}
                  onChange={handleNewVehicleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="2023"
                  required
                />
              </div>
              <div>
                <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-1">License Plate*</label>
                <input
                  type="text"
                  id="licensePlate"
                  value={newVehicleData.licensePlate}
                  onChange={handleNewVehicleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="ABC-1234"
                  required
                />
              </div>
            </div>
            
            <h4 className="font-medium text-gray-700 mb-3">Insurance Information (Optional)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="insurance.provider" className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <input
                  type="text"
                  id="insurance.provider"
                  value={newVehicleData.insurance?.provider}
                  onChange={handleNewVehicleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Insurance company"
                />
              </div>
              <div>
                <label htmlFor="insurance.policyNumber" className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
                <input
                  type="text"
                  id="insurance.policyNumber"
                  value={newVehicleData.insurance?.policyNumber}
                  onChange={handleNewVehicleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Policy number"
                />
              </div>
              <div>
                <label htmlFor="insurance.expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  id="insurance.expiryDate"
                  value={newVehicleData.insurance?.expiryDate?.split('T')[0]}
                  onChange={handleNewVehicleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="insurance.premium" className="block text-sm font-medium text-gray-700 mb-1">Premium ($)</label>
                <input
                  type="number"
                  id="insurance.premium"
                  value={newVehicleData.insurance?.premium}
                  onChange={handleNewVehicleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddVehicle(false)}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveNewVehicle}
                className="px-4 py-2"
              >
                Add Vehicle
              </Button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Maintenance Record Form Modal */}
      {showMaintenanceForm && selectedVehicle && (
        <Modal 
          title={currentMaintenanceRecord ? "Edit Maintenance Record" : "Add Maintenance Record"} 
          onClose={() => setShowMaintenanceForm(false)}
          isOpen={showMaintenanceForm}
        >
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  id="date"
                  value={maintenanceFormData.date}
                  onChange={handleMaintenanceFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  id="description"
                  value={maintenanceFormData.description}
                  onChange={handleMaintenanceFormChange}
                  placeholder="Oil change, tire rotation, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                <input
                  type="number"
                  id="cost"
                  value={maintenanceFormData.cost}
                  onChange={handleMaintenanceFormChange}
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMaintenanceForm(false)}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveMaintenanceRecord}
                className="px-4 py-2"
              >
                Save Record
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
} 