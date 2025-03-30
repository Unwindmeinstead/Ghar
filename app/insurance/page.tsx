'use client';

import { useState, useEffect } from 'react';
import { 
  FiShield, FiCalendar, FiDollarSign, 
  FiFile, FiInfo, FiEdit2, FiTrash2
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface Insurance {
  id: number;
  provider: string;
  type: 'Home' | 'Auto' | 'Health' | 'Life' | 'Travel' | 'Other';
  policyNumber: string;
  coverage: number;
  premium: number;
  renewalDate: string;
  startDate: string;
  beneficiaries?: string;
  notes?: string;
  documents?: string[];
  contactInfo?: string;
}

export default function InsurancePage() {
  const [insurancePolicies, setInsurancePolicies] = useState<Insurance[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<Insurance | null>(null);

  // Load insurance policies from localStorage on component mount
  useEffect(() => {
    const storedPolicies = localStorage.getItem('insurancePolicies');
    if (storedPolicies) {
      try {
        const parsed = JSON.parse(storedPolicies);
        setInsurancePolicies(parsed);
      } catch (e) {
        console.error('Error parsing stored insurance policies:', e);
      }
    }
  }, []);

  // Handle insurance policy selection
  const handleSelectPolicy = (policy: Insurance) => {
    setSelectedPolicy(policy);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate days until renewal
  const calculateDaysUntilRenewal = (renewalDate: string) => {
    const today = new Date();
    const renewal = new Date(renewalDate);
    const differenceInTime = renewal.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  // Calculate total annual premiums
  const calculateTotalPremiums = () => {
    return insurancePolicies.reduce((total, policy) => total + policy.premium, 0);
  };

  // Get policies by type
  const getPoliciesByType = (type: string) => {
    return insurancePolicies.filter(policy => policy.type === type);
  };

  return (
    <DashboardLayout title="Insurance">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pt-1">
        <Card className="flex items-center">
          <div className="bg-primary rounded-full p-3 mr-4 text-white">
            <FiShield size={20} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Total Annual Premiums</h3>
            <p className="text-xl font-semibold text-gray-800">{formatCurrency(calculateTotalPremiums())}</p>
          </div>
        </Card>
        
        <Card className="flex items-center">
          <div className="bg-blue-500 rounded-full p-3 mr-4 text-white">
            <FiCalendar size={20} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Active Policies</h3>
            <p className="text-xl font-semibold text-gray-800">{insurancePolicies.length}</p>
          </div>
        </Card>
        
        <Card className="flex items-center">
          <div className="bg-green-500 rounded-full p-3 mr-4 text-white">
            <FiDollarSign size={20} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Total Coverage</h3>
            <p className="text-xl font-semibold text-gray-800">
              {formatCurrency(insurancePolicies.reduce((total, policy) => total + policy.coverage, 0))}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insurance Policies List */}
        <div className="lg:col-span-1">
          <Card className="mb-4">
            <h2 className="text-lg font-semibold mb-4">Your Insurance Policies</h2>
            
            {insurancePolicies.length > 0 ? (
              <div className="space-y-3">
                {insurancePolicies.map((policy) => (
                  <motion.div
                    key={policy.id}
                    className={`
                      p-3 rounded-lg cursor-pointer transition-all
                      ${selectedPolicy?.id === policy.id 
                        ? 'bg-primary bg-opacity-10 border border-primary' 
                        : 'bg-gray-50 hover:bg-gray-100 border border-transparent'}
                    `}
                    onClick={() => handleSelectPolicy(policy)}
                    whileHover={{ x: 3 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{policy.provider}</h3>
                        <p className="text-sm text-gray-500">{policy.type} Insurance</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {policy.policyNumber}
                      </span>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <FiDollarSign size={12} className="mr-1" />
                        <span>{formatCurrency(policy.premium)}/year</span>
                      </div>
                      <div className="flex items-center">
                        <FiCalendar size={12} className="mr-1" />
                        <span>Renews: {new Date(policy.renewalDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-gray-500">
                <FiInfo size={24} className="mx-auto mb-2 opacity-50" />
                <p>No insurance policies yet.</p>
                <p className="text-sm">Use the + button to add your first policy.</p>
              </div>
            )}
          </Card>
          
          {/* Insurance Types Summary */}
          <Card>
            <h2 className="text-md font-semibold mb-4">Insurance by Type</h2>
            
            <div className="space-y-3">
              {['Home', 'Auto', 'Health', 'Life', 'Travel', 'Other'].map((type) => (
                <div 
                  key={type} 
                  className="flex justify-between items-center p-2 rounded-lg bg-gray-50"
                >
                  <span className="text-gray-700">{type}</span>
                  <span className="text-gray-500 text-sm">
                    {getPoliciesByType(type).length} {getPoliciesByType(type).length === 1 ? 'policy' : 'policies'}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Insurance Policy Details */}
        <div className="lg:col-span-2">
          {selectedPolicy ? (
            <Card>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold">{selectedPolicy.provider}</h2>
                  <p className="text-gray-500">{selectedPolicy.type} Insurance</p>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Policy Number</p>
                  <p className="font-medium">{selectedPolicy.policyNumber}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Coverage Amount</p>
                  <p className="font-medium">{formatCurrency(selectedPolicy.coverage)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Annual Premium</p>
                  <p className="font-medium">{formatCurrency(selectedPolicy.premium)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Renewal Date</p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{new Date(selectedPolicy.renewalDate).toLocaleDateString()}</p>
                    <span className={`
                      text-xs px-2 py-0.5 rounded-full
                      ${calculateDaysUntilRenewal(selectedPolicy.renewalDate) < 30 
                        ? 'bg-red-100 text-red-800' 
                        : calculateDaysUntilRenewal(selectedPolicy.renewalDate) < 90 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'}
                    `}>
                      {calculateDaysUntilRenewal(selectedPolicy.renewalDate)} days left
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Start Date</p>
                  <p className="font-medium">{new Date(selectedPolicy.startDate).toLocaleDateString()}</p>
                </div>
                
                {selectedPolicy.beneficiaries && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Beneficiaries</p>
                    <p className="font-medium">{selectedPolicy.beneficiaries}</p>
                  </div>
                )}
                
                {selectedPolicy.contactInfo && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Contact Information</p>
                    <p className="font-medium">{selectedPolicy.contactInfo}</p>
                  </div>
                )}
              </div>
              
              {selectedPolicy.notes && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Notes</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-line">{selectedPolicy.notes}</p>
                  </div>
                </div>
              )}
              
              {selectedPolicy.documents && selectedPolicy.documents.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Documents</h3>
                  <div className="space-y-2">
                    {selectedPolicy.documents.map((document, index) => (
                      <div 
                        key={index} 
                        className="flex items-center p-2 bg-gray-50 rounded-lg"
                      >
                        <FiFile className="text-gray-400 mr-2" size={16} />
                        <span className="text-sm text-primary">{document}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center py-12">
              <div className="text-center text-gray-400 mb-4">
                <FiShield size={48} className="mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-medium mb-2">No Policy Selected</h3>
                <p className="mb-6">Select a policy to view its details or add a new one</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 