'use client';

import { useState } from 'react';
import { FiUser, FiLock, FiBell, FiGlobe, FiDollarSign, FiSave } from 'react-icons/fi';
import DashboardLayout from '@/components/DashboardLayout';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  
  return (
    <DashboardLayout title="Settings">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Settings</h2>
            <nav>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab('general')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                      activeTab === 'general'
                        ? 'bg-primary text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FiUser className="inline-block mr-2" size={16} />
                    General
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                      activeTab === 'security'
                        ? 'bg-primary text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FiLock className="inline-block mr-2" size={16} />
                    Security
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                      activeTab === 'notifications'
                        ? 'bg-primary text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FiBell className="inline-block mr-2" size={16} />
                    Notifications
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('preferences')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                      activeTab === 'preferences'
                        ? 'bg-primary text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FiGlobe className="inline-block mr-2" size={16} />
                    Preferences
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('billing')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                      activeTab === 'billing'
                        ? 'bg-primary text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FiDollarSign className="inline-block mr-2" size={16} />
                    Billing
                  </button>
                </li>
              </ul>
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            {/* General Settings */}
            {activeTab === 'general' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">General Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue="John Doe"
                      className="w-full p-2 rounded-lg bg-white text-gray-800 border border-gray-200 focus:border-primary focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue="john.doe@example.com"
                      className="w-full p-2 rounded-lg bg-white text-gray-800 border border-gray-200 focus:border-primary focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      defaultValue="+1 (555) 123-4567"
                      className="w-full p-2 rounded-lg bg-white text-gray-800 border border-gray-200 focus:border-primary focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Default Currency</label>
                    <select className="w-full p-2 rounded-lg bg-white text-gray-800 border border-gray-200 focus:border-primary focus:outline-none">
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button icon={<FiSave />}>Save Changes</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-700 mb-3">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Current Password</label>
                        <input 
                          type="password" 
                          className="w-full p-2 rounded-lg bg-white text-gray-800 border border-gray-200 focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">New Password</label>
                        <input 
                          type="password" 
                          className="w-full p-2 rounded-lg bg-white text-gray-800 border border-gray-200 focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Confirm New Password</label>
                        <input 
                          type="password" 
                          className="w-full p-2 rounded-lg bg-white text-gray-800 border border-gray-200 focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-md font-medium text-gray-700 mb-3">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">Protect your account with 2FA</p>
                        <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button icon={<FiSave />}>Save Changes</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Notification Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-700 mb-3">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">Bill Reminders</p>
                          <p className="text-sm text-gray-500">Get notified when a bill is due</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">Subscription Renewals</p>
                          <p className="text-sm text-gray-500">Get notified before a subscription renews</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">Budget Alerts</p>
                          <p className="text-sm text-gray-500">Get notified when you exceed your budget</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-md font-medium text-gray-700 mb-3">Push Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">Enable Push Notifications</p>
                          <p className="text-sm text-gray-500">Receive notifications on your device</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button icon={<FiSave />}>Save Changes</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Language</label>
                    <select className="w-full p-2 rounded-lg bg-white text-gray-800 border border-gray-200 focus:border-primary focus:outline-none">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Date Format</label>
                    <select className="w-full p-2 rounded-lg bg-white text-gray-800 border border-gray-200 focus:border-primary focus:outline-none">
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Time Format</label>
                    <select className="w-full p-2 rounded-lg bg-white text-gray-800 border border-gray-200 focus:border-primary focus:outline-none">
                      <option value="12">12-hour (AM/PM)</option>
                      <option value="24">24-hour</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      id="darkMode" 
                      type="checkbox" 
                      className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="darkMode" className="ml-2 text-sm font-medium text-gray-700">Enable Dark Mode</label>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button icon={<FiSave />}>Save Changes</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Billing */}
            {activeTab === 'billing' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Billing</h2>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-gray-800">Free Plan</h3>
                      <p className="text-sm text-gray-500">You are currently on the free plan</p>
                    </div>
                    <Button variant="premium">Upgrade</Button>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>Free plan includes:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Up to 5 saved passwords</li>
                      <li>Basic budget tracking</li>
                      <li>Limited storage</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-3">Upgrade to Premium</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-medium text-gray-800 mb-2">Monthly</h4>
                      <p className="text-2xl font-bold text-primary mb-2">$9.99<span className="text-sm font-normal text-gray-500">/month</span></p>
                      <ul className="text-sm text-gray-600 space-y-2 mb-4">
                        <li>✅ Unlimited passwords</li>
                        <li>✅ Advanced budget tools</li>
                        <li>✅ Premium support</li>
                        <li>✅ 10GB storage</li>
                      </ul>
                      <Button variant="outline" className="w-full">Select Plan</Button>
                    </div>
                    
                    <div className="border-2 border-primary rounded-lg p-4 relative overflow-hidden hover:shadow-md transition-shadow">
                      <div className="absolute top-0 right-0 bg-primary text-white text-xs py-1 px-3 rounded-bl-lg">
                        BEST VALUE
                      </div>
                      <h4 className="font-medium text-gray-800 mb-2">Annual</h4>
                      <p className="text-2xl font-bold text-primary mb-2">$7.99<span className="text-sm font-normal text-gray-500">/month</span></p>
                      <p className="text-sm text-green-600 mb-2">Save $24 per year</p>
                      <ul className="text-sm text-gray-600 space-y-2 mb-4">
                        <li>✅ Unlimited passwords</li>
                        <li>✅ Advanced budget tools</li>
                        <li>✅ Priority support</li>
                        <li>✅ 20GB storage</li>
                        <li>✅ Advanced reporting</li>
                      </ul>
                      <Button className="w-full">Select Plan</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 