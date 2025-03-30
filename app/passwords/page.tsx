'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  FiEye, FiEyeOff, FiClipboard, FiCheck, 
  FiEdit2, FiTrash2, FiPlus, FiInfo, FiSearch, FiFilter 
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface Password {
  id: number;
  title: string;
  username: string;
  password: string;
  website?: string;
  notes?: string;
  category: 'personal' | 'work' | 'financial' | 'social' | 'other';
  lastUpdated: string;
}

export default function PasswordsPage() {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [selectedPassword, setSelectedPassword] = useState<Password | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Load passwords from localStorage on component mount
  useEffect(() => {
    const storedPasswords = localStorage.getItem('passwords');
    if (storedPasswords) {
      try {
        const parsed = JSON.parse(storedPasswords);
        setPasswords(parsed);
      } catch (e) {
        console.error('Error parsing stored passwords:', e);
      }
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

  // Handle password selection
  const handleSelectPassword = (password: Password) => {
    setSelectedPassword(password);
    setShowPassword(false);
  };

  // Copy text to clipboard
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
  };

  // Filter passwords based on search term and category
  const filteredPasswords = passwords.filter(password => {
    const matchesSearch = 
      password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (password.website && password.website.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter ? password.category === categoryFilter : true;
    
    return matchesSearch && matchesCategory;
  });

  // Get total number of passwords by category
  const getCountByCategory = (category: string) => {
    return passwords.filter(p => p.category === category).length;
  };

  return (
    <DashboardLayout title="Passwords">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Passwords List */}
        <div className="lg:col-span-1">
          <Card className="mb-4">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search passwords..."
                className="w-full py-2 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            <div className="flex mb-4 overflow-x-auto py-1 gap-2">
              <Button
                variant={categoryFilter === null ? "primary" : "outline"}
                className="text-xs whitespace-nowrap py-1 px-3"
                onClick={() => setCategoryFilter(null)}
              >
                All ({passwords.length})
              </Button>
              <Button
                variant={categoryFilter === 'personal' ? "primary" : "outline"}
                className="text-xs whitespace-nowrap py-1 px-3"
                onClick={() => setCategoryFilter('personal')}
              >
                Personal ({getCountByCategory('personal')})
              </Button>
              <Button
                variant={categoryFilter === 'work' ? "primary" : "outline"}
                className="text-xs whitespace-nowrap py-1 px-3"
                onClick={() => setCategoryFilter('work')}
              >
                Work ({getCountByCategory('work')})
              </Button>
              <Button
                variant={categoryFilter === 'financial' ? "primary" : "outline"}
                className="text-xs whitespace-nowrap py-1 px-3"
                onClick={() => setCategoryFilter('financial')}
              >
                Financial ({getCountByCategory('financial')})
              </Button>
              <Button
                variant={categoryFilter === 'social' ? "primary" : "outline"}
                className="text-xs whitespace-nowrap py-1 px-3"
                onClick={() => setCategoryFilter('social')}
              >
                Social ({getCountByCategory('social')})
              </Button>
            </div>

            {filteredPasswords.length > 0 ? (
              <div className="space-y-2">
                {filteredPasswords.map((password) => (
                  <motion.div
                    key={password.id}
                    className={`
                      p-3 rounded-lg cursor-pointer transition-all
                      ${selectedPassword?.id === password.id 
                        ? 'bg-primary bg-opacity-10 border border-primary' 
                        : 'bg-gray-50 hover:bg-gray-100 border border-transparent'}
                    `}
                    onClick={() => handleSelectPassword(password)}
                    whileHover={{ x: 3 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{password.title}</h3>
                        <p className="text-sm text-gray-500">{password.username}</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                        {password.category}
                      </span>
                    </div>
                    {password.website && (
                      <div className="mt-1 text-xs text-gray-400 truncate">
                        {password.website}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-gray-500">
                <FiInfo size={24} className="mx-auto mb-2 opacity-50" />
                <p>No passwords found.</p>
                <p className="text-sm">
                  {searchTerm || categoryFilter 
                    ? "Try changing your search or filter" 
                    : "Use the + button to add your first password."}
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Password Details */}
        <div className="lg:col-span-2">
          {selectedPassword ? (
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">{selectedPassword.title}</h2>
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

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Username</p>
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-800">{selectedPassword.username}</p>
                    <Button
                      variant="icon"
                      className="text-gray-500 hover:text-primary"
                      onClick={() => handleCopy(selectedPassword.username, 'username')}
                    >
                      {copiedField === 'username' ? <FiCheck size={18} className="text-green-500" /> : <FiClipboard size={18} />}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Password</p>
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-800">
                      {showPassword ? selectedPassword.password : '••••••••••••'}
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
                        onClick={() => handleCopy(selectedPassword.password, 'password')}
                      >
                        {copiedField === 'password' ? <FiCheck size={18} className="text-green-500" /> : <FiClipboard size={18} />}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {selectedPassword.website && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Website</p>
                    <div className="flex justify-between items-center">
                      <a 
                        href={selectedPassword.website.startsWith('http') ? selectedPassword.website : `https://${selectedPassword.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline truncate"
                      >
                        {selectedPassword.website}
                      </a>
                      <Button
                        variant="icon"
                        className="text-gray-500 hover:text-primary"
                        onClick={() => handleCopy(selectedPassword.website || '', 'website')}
                      >
                        {copiedField === 'website' ? <FiCheck size={18} className="text-green-500" /> : <FiClipboard size={18} />}
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Category</p>
                  <p className="font-medium text-gray-800 capitalize">{selectedPassword.category}</p>
                </div>
                
                {selectedPassword.notes && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Notes</p>
                    <p className="text-gray-800 whitespace-pre-line">{selectedPassword.notes}</p>
                  </div>
                )}
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Last Updated</p>
                  <p className="text-gray-800">{new Date(selectedPassword.lastUpdated).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center py-12">
              <div className="text-center text-gray-400 mb-4">
                <FiEye size={48} className="mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-medium mb-2">No Password Selected</h3>
                <p className="mb-6">Select a password to view its details or add a new one</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 