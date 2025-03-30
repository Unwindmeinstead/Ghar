'use client';

import { useState, useEffect } from 'react';
import { 
  FiDollarSign, FiTrendingUp, FiClock, 
  FiPieChart, FiCheck, FiTarget, FiInfo,
  FiEdit2, FiTrash2
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  category: 'Emergency' | 'Retirement' | 'Education' | 'Travel' | 'House' | 'Car' | 'Other';
  notes?: string;
  createdAt: string;
  priority: 'Low' | 'Medium' | 'High';
  color?: string;
}

export default function SavingsPage() {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);

  // Load savings goals from localStorage on component mount
  useEffect(() => {
    const storedGoals = localStorage.getItem('savingsGoals');
    if (storedGoals) {
      try {
        const parsed = JSON.parse(storedGoals);
        setSavingsGoals(parsed);
      } catch (e) {
        console.error('Error parsing stored savings goals:', e);
      }
    }
  }, []);

  // Handle goal selection
  const handleSelectGoal = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
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

  // Calculate progress percentage
  const calculateProgress = (goal: SavingsGoal) => {
    return Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
  };

  // Calculate total savings
  const calculateTotalSavings = () => {
    return savingsGoals.reduce((total, goal) => total + goal.currentAmount, 0);
  };

  // Calculate total target
  const calculateTotalTarget = () => {
    return savingsGoals.reduce((total, goal) => total + goal.targetAmount, 0);
  };

  // Get color based on progress
  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Get color based on priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate days remaining (if deadline exists)
  const calculateDaysRemaining = (deadline?: string) => {
    if (!deadline) return null;

    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <DashboardLayout title="Savings Goals">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="flex items-center">
          <div className="bg-primary rounded-full p-3 mr-4 text-white">
            <FiDollarSign size={20} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Total Saved</h3>
            <p className="text-xl font-semibold text-gray-800">{formatCurrency(calculateTotalSavings())}</p>
          </div>
        </Card>
        
        <Card className="flex items-center">
          <div className="bg-blue-500 rounded-full p-3 mr-4 text-white">
            <FiTarget size={20} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Total Target</h3>
            <p className="text-xl font-semibold text-gray-800">{formatCurrency(calculateTotalTarget())}</p>
          </div>
        </Card>
        
        <Card className="flex items-center">
          <div className="bg-green-500 rounded-full p-3 mr-4 text-white">
            <FiTrendingUp size={20} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Overall Progress</h3>
            <p className="text-xl font-semibold text-gray-800">
              {calculateTotalTarget() > 0 
                ? Math.round((calculateTotalSavings() / calculateTotalTarget()) * 100) 
                : 0}%
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goals List */}
        <div className="lg:col-span-1">
          <Card className="mb-4">
            <h2 className="text-lg font-semibold mb-4">Your Savings Goals</h2>
            
            {savingsGoals.length > 0 ? (
              <div className="space-y-3">
                {savingsGoals.map((goal) => (
                  <motion.div
                    key={goal.id}
                    className={`
                      p-3 rounded-lg cursor-pointer transition-all
                      ${selectedGoal?.id === goal.id 
                        ? 'bg-primary bg-opacity-10 border border-primary' 
                        : 'bg-gray-50 hover:bg-gray-100 border border-transparent'}
                    `}
                    onClick={() => handleSelectGoal(goal)}
                    whileHover={{ x: 3 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{goal.name}</h3>
                        <p className="text-sm text-gray-500">{goal.category}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(goal.priority)}`}>
                        {goal.priority}
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}</span>
                        <span>{calculateProgress(goal)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${getProgressColor(calculateProgress(goal))} h-2 rounded-full`} 
                          style={{ width: `${calculateProgress(goal)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {goal.deadline && (
                      <div className="mt-2 text-xs text-gray-500 flex items-center">
                        <FiClock size={12} className="mr-1" />
                        <span>
                          {calculateDaysRemaining(goal.deadline)} days left
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-gray-500">
                <FiInfo size={24} className="mx-auto mb-2 opacity-50" />
                <p>No savings goals yet.</p>
                <p className="text-sm">Use the + button to add your first goal.</p>
              </div>
            )}
          </Card>
        </div>

        {/* Goal Details */}
        <div className="lg:col-span-2">
          {selectedGoal ? (
            <Card>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold">{selectedGoal.name}</h2>
                  <p className="text-gray-500">{selectedGoal.category}</p>
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

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-sm font-medium">Progress</h3>
                    <p className="text-gray-500 text-sm">
                      {formatCurrency(selectedGoal.currentAmount)} of {formatCurrency(selectedGoal.targetAmount)}
                    </p>
                  </div>
                  <span className="text-xl font-bold">
                    {calculateProgress(selectedGoal)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`${getProgressColor(calculateProgress(selectedGoal))} h-3 rounded-full`} 
                    style={{ width: `${calculateProgress(selectedGoal)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Target Amount</p>
                  <p className="font-medium text-gray-800">{formatCurrency(selectedGoal.targetAmount)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Current Amount</p>
                  <p className="font-medium text-gray-800">{formatCurrency(selectedGoal.currentAmount)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Remaining</p>
                  <p className="font-medium text-gray-800">
                    {formatCurrency(Math.max(selectedGoal.targetAmount - selectedGoal.currentAmount, 0))}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Priority</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(selectedGoal.priority)}`}>
                    {selectedGoal.priority}
                  </span>
                </div>
                {selectedGoal.deadline && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Deadline</p>
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-800">{new Date(selectedGoal.deadline).toLocaleDateString()}</p>
                      <span className={`
                        text-xs px-2 py-0.5 rounded-full
                        ${calculateDaysRemaining(selectedGoal.deadline)! < 30 
                          ? 'bg-red-100 text-red-800' 
                          : calculateDaysRemaining(selectedGoal.deadline)! < 90 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'}
                      `}>
                        {calculateDaysRemaining(selectedGoal.deadline)} days left
                      </span>
                    </div>
                  </div>
                )}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Created</p>
                  <p className="font-medium text-gray-800">{new Date(selectedGoal.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              {selectedGoal.notes && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Notes</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-line">{selectedGoal.notes}</p>
                  </div>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="border-t border-gray-100 pt-4 flex flex-wrap gap-3">
                <Button 
                  variant="primary" 
                  icon={<FiDollarSign />}
                >
                  Add Deposit
                </Button>
                {calculateProgress(selectedGoal) === 100 && (
                  <Button 
                    variant="outline" 
                    className="text-green-500 border-green-500 hover:bg-green-50"
                    icon={<FiCheck />}
                  >
                    Mark as Complete
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center py-12">
              <div className="text-center text-gray-400 mb-4">
                <FiTarget size={48} className="mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-medium mb-2">No Goal Selected</h3>
                <p className="mb-6">Select a savings goal to view its details or add a new one</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 