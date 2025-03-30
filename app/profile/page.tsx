'use client';

import { useState } from 'react';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, 
  FiEdit2, FiUpload 
} from 'react-icons/fi';
import DashboardLayout from '@/components/DashboardLayout';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const profileData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Anytown, CA 94568',
    birthdate: '1990-05-15',
    bio: 'I am a homeowner passionate about organizing my household expenses and keeping everything in one place. Home Ghar helps me track all my subscriptions, bills, and passwords.',
    joinDate: '2023-01-10',
    avatar: '/placeholder-avatar.jpg'
  };

  const activityLog = [
    { action: 'Updated WiFi password', date: '2023-04-20' },
    { action: 'Added new subscription', date: '2023-04-15' },
    { action: 'Updated profile information', date: '2023-04-10' },
    { action: 'Added new vehicle', date: '2023-03-28' },
    { action: 'Paid electricity bill', date: '2023-03-22' }
  ];

  return (
    <DashboardLayout title="Profile">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto overflow-hidden">
                <img 
                  src={profileData.avatar} 
                  alt="Profile Avatar" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150';
                  }}
                />
              </div>
              <button 
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors"
                title="Upload new photo"
              >
                <FiUpload size={16} />
              </button>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800">{profileData.name}</h2>
            <p className="text-gray-500 mt-1">{profileData.email}</p>
            
            <div className="mt-6 border-t border-gray-100 pt-6">
              <div className="flex items-center justify-center">
                <div className="px-4">
                  <div className="font-semibold text-gray-800">5</div>
                  <div className="text-sm text-gray-500">Vehicles</div>
                </div>
                <div className="px-4 border-l border-gray-100">
                  <div className="font-semibold text-gray-800">12</div>
                  <div className="text-sm text-gray-500">Subscriptions</div>
                </div>
                <div className="px-4 border-l border-gray-100">
                  <div className="font-semibold text-gray-800">8</div>
                  <div className="text-sm text-gray-500">Passwords</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                variant="outline" 
                className="w-full"
                icon={<FiEdit2 />}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </div>
          </Card>
          
          <Card className="mt-6">
            <h3 className="font-medium text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {activityLog.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 mr-3"></div>
                  <div>
                    <p className="text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
              {!isEditing && (
                <Button 
                  variant="ghost" 
                  icon={<FiEdit2 />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={profileData.name}
                      className="w-full p-2 rounded-lg bg-white text-gray-800 border border-gray-200 focus:border-primary focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={profileData.email}
                      className="w-full p-2 rounded-lg bg-white text-gray-800 border border-gray-200 focus:border-primary focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      defaultValue={profileData.phone}
                      className="w-full p-2 rounded-lg bg-white text-gray-800 border border-gray-200 focus:border-primary focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Birth Date</label>
                    <input 
                      type="date" 
                      defaultValue={profileData.birthdate}
                      className="w-full p-2 rounded-lg bg-white text-gray-800 border border-gray-200 focus:border-primary focus:outline-none"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-2">Address</label>
                    <input 
                      type="text" 
                      defaultValue={profileData.address}
                      className="w-full p-2 rounded-lg bg-white text-gray-800 border border-gray-200 focus:border-primary focus:outline-none"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-2">Bio</label>
                    <textarea 
                      defaultValue={profileData.bio}
                      rows={4}
                      className="w-full p-2 rounded-lg bg-white text-gray-800 border border-gray-200 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center mb-4">
                      <FiUser className="text-primary mr-3" size={18} />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-800">{profileData.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <FiMail className="text-primary mr-3" size={18} />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-800">{profileData.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FiPhone className="text-primary mr-3" size={18} />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-gray-800">{profileData.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-4">
                      <FiMapPin className="text-primary mr-3" size={18} />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium text-gray-800">{profileData.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <FiCalendar className="text-primary mr-3" size={18} />
                      <div>
                        <p className="text-sm text-gray-500">Birth Date</p>
                        <p className="font-medium text-gray-800">
                          {new Date(profileData.birthdate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FiCalendar className="text-primary mr-3" size={18} />
                      <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="font-medium text-gray-800">
                          {new Date(profileData.joinDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="font-medium text-gray-800 mb-2">Bio</h3>
                  <p className="text-gray-600">{profileData.bio}</p>
                </div>
              </div>
            )}
          </Card>
          
          <Card className="mt-6">
            <h3 className="font-medium text-gray-800 mb-4">Account Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="sr-only peer"
                    onChange={() => {}}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    onChange={() => {}}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Data Export</p>
                  <p className="text-sm text-gray-500">Export all your data in CSV format</p>
                </div>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-red-500">Delete Account</p>
                  <p className="text-sm text-gray-500">Once deleted, you cannot recover your account</p>
                </div>
                <Button variant="outline" size="sm" className="text-red-500 border-red-500 hover:bg-red-50">
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 