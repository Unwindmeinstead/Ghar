'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiCreditCard, FiDollarSign, FiCalendar, FiActivity, FiPlus, FiChevronRight } from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';
import DashboardLayout from '@/components/DashboardLayout';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function Home() {
  const [showConnectBank, setShowConnectBank] = useState(false);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [subscriptionCount, setSubscriptionCount] = useState(0);
  const [monthlyBillsAmount, setMonthlyBillsAmount] = useState(0);
  const [insuranceCount, setInsuranceCount] = useState(0);
  const [upcomingBills, setUpcomingBills] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    // Load vehicles count
    const storedVehicles = localStorage.getItem('vehicles');
    if (storedVehicles) {
      try {
        const vehicles = JSON.parse(storedVehicles);
        setVehicleCount(vehicles.length);
      } catch (e) {
        console.error('Error parsing stored vehicles:', e);
      }
    }

    // Load subscriptions count
    const storedSubscriptions = localStorage.getItem('subscriptions');
    if (storedSubscriptions) {
      try {
        const subscriptions = JSON.parse(storedSubscriptions);
        setSubscriptionCount(subscriptions.length);
      } catch (e) {
        console.error('Error parsing stored subscriptions:', e);
      }
    }

    // Load bills and calculate monthly amount
    const storedBills = localStorage.getItem('bills');
    if (storedBills) {
      try {
        const bills = JSON.parse(storedBills);
        
        // Calculate monthly bills amount
        const monthlyTotal = bills.reduce((total, bill) => {
          if (bill.status !== 'paid') {
            if (bill.recurring) {
              if (bill.frequency === 'monthly') {
                return total + bill.amount;
              } else if (bill.frequency === 'quarterly') {
                return total + (bill.amount / 3);
              } else if (bill.frequency === 'annually') {
                return total + (bill.amount / 12);
              }
            }
            return total + bill.amount;
          }
          return total;
        }, 0);
        
        setMonthlyBillsAmount(monthlyTotal);

        // Get upcoming bills (due in the next 7 days)
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);
        
        const upcoming = bills
          .filter(bill => {
            const dueDate = new Date(bill.dueDate);
            return bill.status !== 'paid' && dueDate >= now && dueDate <= nextWeek;
          })
          .slice(0, 3) // Take only first 3 for display
          .map(bill => ({
            id: bill.id,
            name: bill.name,
            amount: bill.amount,
            dueDate: bill.dueDate
          }));
        
        setUpcomingBills(upcoming.length > 0 ? upcoming : []);
      } catch (e) {
        console.error('Error parsing stored bills:', e);
      }
    }

    // Load insurance policies count
    const storedPolicies = localStorage.getItem('insurancePolicies');
    if (storedPolicies) {
      try {
        const policies = JSON.parse(storedPolicies);
        setInsuranceCount(policies.length);
      } catch (e) {
        console.error('Error parsing stored insurance policies:', e);
      }
    }
  }, []);

  const summaryItems = [
    { id: 1, name: 'Vehicles', count: vehicleCount, icon: FaCar, color: 'bg-blue-500' },
    { id: 2, name: 'Subscriptions', count: subscriptionCount, icon: FiCreditCard, color: 'bg-purple-500' },
    { id: 3, name: 'Monthly Bills', amount: monthlyBillsAmount, icon: FiDollarSign, color: 'bg-green-500' },
    { id: 4, name: 'Insurances', count: insuranceCount, icon: FiActivity, color: 'bg-red-500' },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 pt-1">
        {summaryItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <Card key={item.id} className="flex items-center py-6 px-5">
              <div className={`${item.color} rounded-full p-3 mr-4 text-white`}>
                <Icon size={20} />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">{item.name}</h3>
                <p className="text-xl font-semibold text-gray-800">
                  {item.count !== undefined && item.count}
                  {item.amount !== undefined && `$${item.amount.toFixed(2)}`}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Integration Section */}
        <Card className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Integration</h2>
          
          {showConnectBank ? (
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold">CH</span>
                </div>
                <span className="text-gray-700">Chase Bank</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-red-600 font-semibold">BA</span>
                </div>
                <span className="text-gray-700">Bank of America</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-yellow-600 font-semibold">WF</span>
                </div>
                <span className="text-gray-700">Wells Fargo</span>
              </div>
              <Button 
                variant="ghost" 
                className="w-full mt-2"
                onClick={() => setShowConnectBank(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiDollarSign className="text-primary" size={24} />
              </div>
              <p className="text-gray-600 mb-4">Connect your bank account to automatically track expenses and bills</p>
              <Button 
                onClick={() => setShowConnectBank(true)}
                icon={<FiPlus />}
              >
                Connect Bank
              </Button>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                >
                  Manual Entry
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Upcoming Bills */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Bills</h2>
            <Button 
              variant="ghost" 
              icon={<FiChevronRight />}
              iconPosition="right"
              size="sm"
            >
              View All
            </Button>
          </div>
          
          {upcomingBills.length > 0 ? (
            <div className="space-y-4">
              {upcomingBills.map((bill) => {
                const dueDate = new Date(bill.dueDate);
                const isUpcoming = (new Date().getTime() + 3 * 24 * 60 * 60 * 1000) > dueDate.getTime();
                
                return (
                  <div key={bill.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <div className={`rounded-full p-2 mr-3 ${isUpcoming ? 'bg-red-100' : 'bg-green-100'}`}>
                        <FiCreditCard className={isUpcoming ? 'text-red-500' : 'text-green-500'} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{bill.name}</p>
                        <p className="text-sm text-gray-500">
                          Due {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">${bill.amount.toFixed(2)}</p>
                      {isUpcoming && (
                        <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded-full">
                          Soon
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <FiCalendar size={36} className="mx-auto mb-3 opacity-30" />
              <p>No upcoming bills in the next 7 days</p>
              <p className="text-sm mt-1">Add bills using the + button</p>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
} 