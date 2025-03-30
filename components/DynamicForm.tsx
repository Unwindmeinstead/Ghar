import React, { useState, FormEvent } from 'react';
import { useFormContext } from '@/contexts/FormContext';
import Button from './Button';
import { 
  FiSave, FiCreditCard, FiDollarSign, 
  FiLock, FiWifi, FiBarChart2, FiTarget,
  FiLoader, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';

const DynamicForm: React.FC = () => {
  const { 
    currentFormType, 
    saveFormData, 
    formSubmitting, 
    formSuccess, 
    formError 
  } = useFormContext();
  
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Transform form data based on form type
    const processedData = processFormData();
    
    // Save to localStorage via context
    await saveFormData(processedData);
  };

  // Process form data to handle special cases
  const processFormData = (): Record<string, any> => {
    const data = { ...formData };

    // Handle specifics based on form type
    switch (currentFormType) {
      case 'vehicle': {
        // Create insurance object
        if (data.provider || data.policyNumber || data.expiryDate || data.premium) {
          data.insurance = {
            provider: data.provider || '',
            policyNumber: data.policyNumber || '',
            expiryDate: data.expiryDate || '',
            premium: parseFloat(data.premium) || 0
          };
          
          // Remove fields that were moved to the insurance object
          delete data.provider;
          delete data.policyNumber;
          delete data.expiryDate;
          delete data.premium;
        } else {
          data.insurance = {
            provider: '',
            policyNumber: '',
            expiryDate: '',
            premium: 0
          };
        }
        
        // Initialize empty maintenance records
        data.maintenanceRecords = [];
        break;
      }
      
      case 'subscription': {
        // Convert amount to number
        if (data.amount) {
          data.amount = parseFloat(data.amount);
        }
        break;
      }
      
      case 'bill': {
        // Convert amount to number
        if (data.amount) {
          data.amount = parseFloat(data.amount);
        }
        
        // Set recurring to boolean
        data.recurring = !!data.recurring;
        break;
      }
      
      case 'savings': {
        // Convert amounts to numbers
        if (data.targetAmount) {
          data.targetAmount = parseFloat(data.targetAmount);
        }
        
        if (data.currentAmount) {
          data.currentAmount = parseFloat(data.currentAmount);
        }
        break;
      }
      
      case 'insurance': {
        // Convert premium to number
        if (data.premium) {
          data.premium = parseFloat(data.premium);
        }
        
        // Add coverage field if not present
        if (!data.coverage) {
          data.coverage = 0;
        } else {
          data.coverage = parseFloat(data.coverage);
        }
        break;
      }
    }
    
    return data;
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [id]: checked }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const renderFormFields = () => {
    switch (currentFormType) {
      case 'vehicle':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">Make</label>
              <input
                type="text"
                id="make"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Toyota, Honda, etc."
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <input
                type="text"
                id="model"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Camry, Civic, etc."
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="number"
                id="year"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="2023"
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
              <input
                type="text"
                id="licensePlate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="ABC-1234"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="pt-3 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-2">Insurance Information (Optional)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                  <input
                    type="text"
                    id="provider"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Insurance company"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="policyNumber" className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
                  <input
                    type="text"
                    id="policyNumber"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Policy number"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    id="expiryDate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="premium" className="block text-sm font-medium text-gray-700 mb-1">Premium ($)</label>
                  <input
                    type="number"
                    id="premium"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="0.00"
                    step="0.01"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'subscription':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Netflix, Spotify, etc."
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                id="description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Premium streaming plan"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
              <input
                type="number"
                id="amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="9.99"
                step="0.01"
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="billingCycle" className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
              <select
                id="billingCycle"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                onChange={handleInputChange}
                required
              >
                <option value="">Select billing cycle</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
            <div>
              <label htmlFor="nextBillingDate" className="block text-sm font-medium text-gray-700 mb-1">Next Billing Date</label>
              <input
                type="date"
                id="nextBillingDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        );

      case 'bill':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Bill Name</label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Electricity, Water, etc."
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                id="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                onChange={handleInputChange}
                required
              >
                <option value="">Select category</option>
                <option value="utility">Utility</option>
                <option value="rent">Rent/Mortgage</option>
                <option value="insurance">Insurance</option>
                <option value="internet">Internet/Phone</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
              <input
                type="number"
                id="amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="120.00"
                step="0.01"
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                id="dueDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                onChange={handleInputChange}
                required
              >
                <option value="">Select status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="recurring"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                onChange={handleInputChange}
              />
              <label htmlFor="recurring" className="ml-2 block text-sm text-gray-700">Recurring Bill</label>
            </div>
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">Frequency (if recurring)</label>
              <select
                id="frequency"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                onChange={handleInputChange}
                disabled={!formData.recurring}
              >
                <option value="">Select frequency</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
          </div>
        );

      case 'password':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website or Service</label>
              <input
                type="text"
                id="website"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="google.com"
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username/Email</label>
              <input
                type="text"
                id="username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="your_email@example.com"
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="••••••••••••"
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
              <textarea
                id="notes"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Additional notes or recovery information"
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>
        );

      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="networkName" className="block text-sm font-medium text-gray-700 mb-1">Network Name (SSID)</label>
              <input
                type="text"
                id="networkName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Home WiFi"
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="••••••••••••"
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="securityType" className="block text-sm font-medium text-gray-700 mb-1">Security Type</label>
              <select
                id="securityType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                onChange={handleInputChange}
                required
              >
                <option value="">Select security type</option>
                <option value="wpa2">WPA2</option>
                <option value="wpa3">WPA3</option>
                <option value="wpa">WPA</option>
                <option value="wep">WEP</option>
                <option value="none">None (Open)</option>
              </select>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                id="location"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Home, Office, etc."
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        );

      case 'insurance':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Insurance Type</label>
              <select
                id="type"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                onChange={handleInputChange}
                required
              >
                <option value="">Select type</option>
                <option value="auto">Auto</option>
                <option value="home">Home/Renter's</option>
                <option value="health">Health</option>
                <option value="life">Life</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
              <input
                type="text"
                id="provider"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Insurance company name"
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="policyNumber" className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
              <input
                type="text"
                id="policyNumber"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="POL-123456789"
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="premium" className="block text-sm font-medium text-gray-700 mb-1">Premium Amount ($)</label>
              <input
                type="number"
                id="premium"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="150.00"
                step="0.01"
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="coverage" className="block text-sm font-medium text-gray-700 mb-1">Coverage Amount ($)</label>
              <input
                type="number"
                id="coverage"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="100000.00"
                step="0.01"
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="renewalDate" className="block text-sm font-medium text-gray-700 mb-1">Renewal Date</label>
              <input
                type="date"
                id="renewalDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        );

      case 'savings':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="goalType" className="block text-sm font-medium text-gray-700 mb-1">Goal Type</label>
              <select
                id="goalType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                onChange={handleInputChange}
                required
              >
                <option value="">Select type</option>
                <option value="savings">Savings Goal</option>
                <option value="budget">Budget Category</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Emergency Fund, New Car, etc."
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-1">Target Amount ($)</label>
              <input
                type="number"
                id="targetAmount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="5000.00"
                step="0.01"
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700 mb-1">Current Amount ($)</label>
              <input
                type="number"
                id="currentAmount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="1000.00"
                step="0.01"
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">Target Date (Optional)</label>
              <input
                type="date"
                id="deadline"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                onChange={handleInputChange}
              />
            </div>
          </div>
        );

      // Default general form
      default:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Enter a name"
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Enter a description"
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                id="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Enter a category"
                onChange={handleInputChange}
              />
            </div>
          </div>
        );
    }
  };

  const getFormIcon = () => {
    if (formSubmitting) return <FiLoader className="animate-spin" />;
    if (formSuccess) return <FiCheckCircle />;
    if (formError) return <FiAlertCircle />;
    
    switch (currentFormType) {
      case 'vehicle': return <FaCar />;
      case 'subscription': return <FiCreditCard />;
      case 'bill': return <FiDollarSign />;
      case 'password': return <FiLock />;
      case 'wifi': return <FiWifi />;
      case 'insurance': return <FiBarChart2 />;
      case 'savings': return <FiTarget />;
      default: return <FiSave />;
    }
  };

  const getFormTitle = () => {
    if (formSubmitting) return 'Saving...';
    if (formSuccess) return 'Saved Successfully!';
    if (formError) return 'Error';
    
    switch (currentFormType) {
      case 'vehicle': return 'Vehicle';
      case 'subscription': return 'Subscription';
      case 'bill': return 'Bill';
      case 'password': return 'Password';
      case 'wifi': return 'WiFi Network';
      case 'insurance': return 'Insurance Policy';
      case 'savings': return 'Savings Goal';
      default: return 'Item';
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {renderFormFields()}
      
      {formError && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-center">
          <FiAlertCircle className="mr-2 flex-shrink-0" />
          {formError}
        </div>
      )}
      
      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <Button 
          type="submit" 
          variant={formSuccess ? "success" : formError ? "danger" : "primary"}
          icon={getFormIcon()}
          disabled={formSubmitting}
        >
          {formSubmitting ? 'Saving...' : `Save ${getFormTitle()}`}
        </Button>
      </div>
    </form>
  );
};

export default DynamicForm; 