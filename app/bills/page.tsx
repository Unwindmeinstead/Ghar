'use client';

import { useState, useEffect } from 'react';
import { 
  FiPlus, FiTrash2, FiEdit2, FiCalendar, 
  FiDollarSign, FiClock, FiInfo 
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface Bill {
  id: number;
  name: string;
  category: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  recurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'annually';
}

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  // Load bills from localStorage on component mount
  useEffect(() => {
    const storedBills = localStorage.getItem('bills');
    if (storedBills) {
      try {
        const parsed = JSON.parse(storedBills);
        setBills(parsed);
      } catch (e) {
        console.error('Error parsing stored bills:', e);
      }
    }
  }, []);

  // Handle bill selection
  const handleSelectBill = (bill: Bill) => {
    setSelectedBill(bill);
  };

  // Calculate total due amount for all pending and overdue bills
  const calculateTotalDue = () => {
    return bills
      .filter(bill => bill.status !== 'paid')
      .reduce((total, bill) => total + bill.amount, 0);
  };

  // Calculate total upcoming bills (due in the next 7 days)
  const calculateUpcomingBills = () => {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    
    return bills.filter(bill => {
      const dueDate = new Date(bill.dueDate);
      return dueDate >= now && dueDate <= nextWeek && bill.status !== 'paid';
    }).length;
  };

  // Calculate number of overdue bills
  const calculateOverdueBills = () => {
    const now = new Date();
    
    return bills.filter(bill => {
      const dueDate = new Date(bill.dueDate);
      return dueDate < now && bill.status !== 'paid';
    }).length;
  };

  return (
    <DashboardLayout title="Bills">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pt-1">
        <Card className="flex items-center">
          <div className="bg-primary rounded-full p-3 mr-4 text-white">
            <FiDollarSign size={20} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Total Due</h3>
            <p className="text-xl font-semibold text-gray-800">${calculateTotalDue().toFixed(2)}</p>
          </div>
        </Card>
        
        <Card className="flex items-center">
          <div className="bg-blue-500 rounded-full p-3 mr-4 text-white">
            <FiCalendar size={20} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Upcoming Bills</h3>
            <p className="text-xl font-semibold text-gray-800">{calculateUpcomingBills()}</p>
          </div>
        </Card>
        
        <Card className="flex items-center">
          <div className="bg-red-500 rounded-full p-3 mr-4 text-white">
            <FiClock size={20} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Overdue Bills</h3>
            <p className="text-xl font-semibold text-gray-800">{calculateOverdueBills()}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bills List */}
        <div className="lg:col-span-1">
          <Card className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Your Bills</h2>
            </div>

            {bills.length > 0 ? (
              <div className="space-y-3">
                {bills.map((bill) => (
                  <motion.div
                    key={bill.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedBill?.id === bill.id
                        ? 'bg-primary bg-opacity-10 border border-primary'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => handleSelectBill(bill)}
                    whileHover={{ x: 3 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{bill.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{bill.category}</p>
                      </div>
                      <p className="font-medium text-primary">${bill.amount.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between mt-2 items-center">
                      <div className="flex items-center text-xs text-gray-500">
                        <FiCalendar size={12} className="mr-1" />
                        <span>{new Date(bill.dueDate).toLocaleDateString()}</span>
                      </div>
                      <span className={`
                        text-xs px-2 py-0.5 rounded-full capitalize
                        ${bill.status === 'paid' ? 'bg-green-100 text-green-800' : 
                          bill.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}
                      `}>
                        {bill.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-gray-500">
                <FiInfo size={24} className="mx-auto mb-2 opacity-50" />
                <p>No bills yet.</p>
                <p className="text-sm">Use the + button to add your first bill.</p>
              </div>
            )}
          </Card>
        </div>

        {/* Bill Details */}
        <div className="lg:col-span-2">
          {selectedBill ? (
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">{selectedBill.name}</h2>
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
                  <p className="text-xs text-gray-400 mb-1">Amount</p>
                  <div className="flex items-center">
                    <FiDollarSign className="text-gray-400 mr-1" size={14} />
                    <p className="font-medium">{selectedBill.amount.toFixed(2)}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Due Date</p>
                  <div className="flex items-center">
                    <FiCalendar className="text-gray-400 mr-1" size={14} />
                    <p className="font-medium">{new Date(selectedBill.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Category</p>
                  <p className="font-medium capitalize">{selectedBill.category}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <p className={`
                    font-medium capitalize
                    ${selectedBill.status === 'paid' ? 'text-green-600' : 
                      selectedBill.status === 'pending' ? 'text-yellow-600' : 
                      'text-red-600'}
                  `}>
                    {selectedBill.status}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Recurring</p>
                  <p className="font-medium">{selectedBill.recurring ? 'Yes' : 'No'}</p>
                </div>
                {selectedBill.recurring && selectedBill.frequency && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Frequency</p>
                    <p className="font-medium capitalize">{selectedBill.frequency}</p>
                  </div>
                )}
              </div>
              
              {selectedBill.status !== 'paid' && (
                <div className="border-t border-gray-100 pt-4 flex justify-end">
                  <Button 
                    variant="primary"
                    icon={<FiDollarSign />}
                  >
                    Mark as Paid
                  </Button>
                </div>
              )}
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center py-12">
              <div className="text-center text-gray-400 mb-4">
                <FiDollarSign size={48} className="mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-medium mb-2">No Bill Selected</h3>
                <p className="mb-6">Select a bill to view its details or add a new one</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 