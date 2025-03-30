'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiCalendar, FiDollarSign, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface Subscription {
  id: number;
  name: string;
  description: string;
  amount: number;
  billingCycle: 'monthly' | 'quarterly' | 'annually';
  nextBillingDate: string;
  category: string;
  paymentMethod: string;
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  // Load subscriptions from localStorage on component mount
  useEffect(() => {
    const storedSubscriptions = localStorage.getItem('subscriptions');
    if (storedSubscriptions) {
      try {
        const parsed = JSON.parse(storedSubscriptions);
        setSubscriptions(parsed);
      } catch (e) {
        console.error('Error parsing stored subscriptions:', e);
      }
    }
  }, []);

  // Select subscription handler
  const handleSelectSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
  };

  // Calculate total monthly expense
  const calculateMonthlyTotal = () => {
    return subscriptions.reduce((total, sub) => {
      let monthlyAmount = sub.amount;
      
      if (sub.billingCycle === 'quarterly') {
        monthlyAmount = sub.amount / 3;
      } else if (sub.billingCycle === 'annually') {
        monthlyAmount = sub.amount / 12;
      }
      
      return total + monthlyAmount;
    }, 0);
  };

  return (
    <DashboardLayout title="Subscriptions">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pt-1">
        <Card className="flex items-center">
          <div className="bg-primary rounded-full p-3 mr-4 text-white">
            <FiDollarSign size={20} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Monthly Total</h3>
            <p className="text-xl font-semibold text-gray-800">
              ${calculateMonthlyTotal().toFixed(2)}
            </p>
          </div>
        </Card>
        
        <Card className="flex items-center">
          <div className="bg-blue-500 rounded-full p-3 mr-4 text-white">
            <FiCalendar size={20} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Active Subscriptions</h3>
            <p className="text-xl font-semibold text-gray-800">{subscriptions.length}</p>
          </div>
        </Card>
        
        <Card className="flex items-center">
          <div className="bg-green-500 rounded-full p-3 mr-4 text-white">
            <FiDollarSign size={20} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Avg. Subscription</h3>
            <p className="text-xl font-semibold text-gray-800">
              ${subscriptions.length ? (calculateMonthlyTotal() / subscriptions.length).toFixed(2) : "0.00"}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscriptions List */}
        <div className="lg:col-span-1">
          <Card className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Your Subscriptions</h2>
            </div>

            {subscriptions.length > 0 ? (
              <div className="space-y-3">
                {subscriptions.map((subscription) => (
                  <motion.div
                    key={subscription.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedSubscription?.id === subscription.id
                        ? 'bg-primary bg-opacity-10 border border-primary'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => handleSelectSubscription(subscription)}
                    whileHover={{ x: 3 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{subscription.name}</h3>
                        <p className="text-sm text-gray-500">{subscription.description}</p>
                      </div>
                      <p className="font-medium text-primary">${subscription.amount}</p>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>
                        {subscription.billingCycle.charAt(0).toUpperCase() + subscription.billingCycle.slice(1)}
                      </span>
                      <span>Next: {new Date(subscription.nextBillingDate).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-gray-500">
                <FiInfo size={24} className="mx-auto mb-2 opacity-50" />
                <p>No subscriptions yet.</p>
                <p className="text-sm">Use the + button to add your first subscription.</p>
              </div>
            )}
          </Card>
        </div>

        {/* Subscription Details */}
        <div className="lg:col-span-2">
          {selectedSubscription ? (
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">{selectedSubscription.name}</h2>
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
                  <p className="text-xs text-gray-400 mb-1">Description</p>
                  <p className="font-medium">{selectedSubscription.description}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Amount</p>
                  <div className="flex items-center">
                    <FiDollarSign className="text-gray-400 mr-1" size={14} />
                    <p className="font-medium">{selectedSubscription.amount.toFixed(2)}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Billing Cycle</p>
                  <p className="font-medium capitalize">{selectedSubscription.billingCycle}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Next Billing Date</p>
                  <div className="flex items-center">
                    <FiCalendar className="text-gray-400 mr-1" size={14} />
                    <p className="font-medium">{new Date(selectedSubscription.nextBillingDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Category</p>
                  <p className="font-medium">{selectedSubscription.category}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Payment Method</p>
                  <p className="font-medium">{selectedSubscription.paymentMethod}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-gray-400 text-sm mb-3">Yearly Cost Breakdown</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  {(() => {
                    const monthlyCost = 
                      selectedSubscription.billingCycle === 'monthly' 
                        ? selectedSubscription.amount 
                        : selectedSubscription.billingCycle === 'quarterly'
                          ? selectedSubscription.amount / 3
                          : selectedSubscription.amount / 12;
                    
                    const yearlyCost = monthlyCost * 12;
                    
                    return (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monthly Cost:</span>
                          <span className="font-medium">${monthlyCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Yearly Cost:</span>
                          <span className="font-medium">${yearlyCost.toFixed(2)}</span>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center py-12">
              <div className="text-center text-gray-400 mb-4">
                <FiInfo size={48} className="mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-medium mb-2">No Subscription Selected</h3>
                <p className="mb-6">Select a subscription to view its details or add a new one</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 