import React, { useState, useEffect, memo, useRef } from 'react';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiSearch, FiUser, FiSettings } from 'react-icons/fi';
import FloatingActionButton from './FloatingActionButton';
import Modal from './Modal';
import DynamicForm from './DynamicForm';
import { FormProvider, useFormContext } from '@/contexts/FormContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

// Smooth transition for animations
const smoothTransition = {
  type: "tween",
  duration: 0.3,
  ease: "easeInOut"
};

// Inner component that uses the form context
const DashboardLayoutInner: React.FC<DashboardLayoutProps> = memo(({ children, title }) => {
  const [sidebarWidth, setSidebarWidth] = useState<number>(280); // Default expanded width
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [instantTransition, setInstantTransition] = useState<boolean>(true); // Default to instant transitions
  const { isModalOpen, openModal, closeModal, currentFormType } = useFormContext();
  
  // Set isClient after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Listen for sidebar width changes
  useEffect(() => {
    if (!isClient) return;
    
    const handleSidebarStateChange = (event: CustomEvent) => {
      if (event.detail && typeof event.detail.width === 'number') {
        setSidebarWidth(event.detail.width);
        // Check if instant transition flag is set
        if (event.detail.instant !== undefined) {
          setInstantTransition(event.detail.instant);
        }
      }
    };
    
    window.addEventListener('sidebarStateChange', handleSidebarStateChange as EventListener);
    
    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarStateChange as EventListener);
    };
  }, [isClient]);

  // Scroll handling with throttling
  useEffect(() => {
    if (!isClient) return;
    
    let ticking = false;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentScrollY > lastScrollY && currentScrollY > 50) {
            setIsHeaderVisible(false);
          } else {
            setIsHeaderVisible(true);
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY, isClient]);

  // Get modal title based on form type
  const getModalTitle = () => {
    switch (currentFormType) {
      case 'vehicle': return 'Add New Vehicle';
      case 'subscription': return 'Add New Subscription';
      case 'bill': return 'Add New Bill';
      case 'password': return 'Add New Password';
      case 'wifi': return 'Add New WiFi Network';
      case 'insurance': return 'Add New Insurance Policy';
      case 'savings': return 'Add New Savings Goal';
      default: return 'Add New Item';
    }
  };

  // Render placeholder if not client-side yet
  if (!isClient) {
    return <div className="min-h-screen bg-gray-50 animate-pulse"></div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div 
        className={`flex-1 ${!instantTransition ? 'transition-all duration-300 ease-in-out' : ''}`}
        style={{ 
          marginLeft: `${sidebarWidth}px`,
          width: `calc(100% - ${sidebarWidth}px)`,
          transition: instantTransition ? 'none' : undefined
        }}
      >
        <header 
          className={`
            bg-white border-b border-gray-100 sticky top-0 z-20 px-4 sm:px-6 py-4 shadow-sm
            transition-transform duration-300
            ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}
          `}
        >
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">{title}</h1>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search - Hidden on mobile */}
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-100 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white w-48 lg:w-64 transition-all"
                />
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                <FiBell size={20} />
                <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
              </button>
              
              {/* User Profile */}
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white overflow-hidden">
                  <FiUser size={16} />
                </div>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors hidden sm:flex">
                  <FiSettings size={18} />
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-4 sm:p-6 relative z-10 flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      
      {/* Floating Action Button */}
      <FloatingActionButton onClick={openModal} />
      
      {/* Dynamic Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={getModalTitle()}
        size="md"
      >
        <DynamicForm />
      </Modal>
    </div>
  );
});

DashboardLayoutInner.displayName = 'DashboardLayoutInner';

// Wrapper component that provides the FormContext
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  return (
    <FormProvider>
      <DashboardLayoutInner title={title}>
        {children}
      </DashboardLayoutInner>
    </FormProvider>
  );
};

export default DashboardLayout; 