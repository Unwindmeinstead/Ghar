import { useState, useEffect, memo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiCreditCard, FiWifi, FiLock, 
  FiDollarSign, FiBarChart2, FiSettings, 
  FiMenu, FiUser, FiLogOut, FiChevronLeft,
  FiFileText, FiShield
} from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';
import Image from 'next/image';

// Menu items organized by categories
const menuCategories = [
  {
    id: 'home',
    name: 'Home',
    items: [
      { id: 1, name: 'Dashboard', path: '/', icon: FiHome }
    ]
  },
  {
    id: 'assets',
    name: 'Assets',
    items: [
      { id: 2, name: 'Vehicles', path: '/vehicles', icon: FaCar }
    ]
  },
  {
    id: 'finances',
    name: 'Finances',
    items: [
      { id: 3, name: 'Subscriptions', path: '/subscriptions', icon: FiCreditCard },
      { id: 4, name: 'Bills', path: '/bills', icon: FiFileText },
      { id: 8, name: 'Savings & Budget', path: '/savings', icon: FiDollarSign }
    ]
  },
  {
    id: 'security',
    name: 'Security',
    items: [
      { id: 5, name: 'Passwords', path: '/passwords', icon: FiLock },
      { id: 6, name: 'WiFi Passwords', path: '/wifi', icon: FiWifi },
      { id: 7, name: 'Insurance', path: '/insurance', icon: FiShield }
    ]
  }
];

const bottomMenuItems = [
  { id: 9, name: 'Settings', path: '/settings', icon: FiSettings },
  { id: 10, name: 'Profile', path: '/profile', icon: FiUser },
  { id: 11, name: 'Logout', path: '/logout', icon: FiLogOut },
];

// Width presets
const COLLAPSED_WIDTH = 72;
const EXPANDED_WIDTH = 250;

const Sidebar = memo(() => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  // Ensure localStorage is only accessed on client-side
  useEffect(() => {
    setIsClient(true);
    const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsedState) {
      setIsCollapsed(savedCollapsedState === 'true');
    }
  }, []);

  // Handle mobile menu visibility based on screen size
  useEffect(() => {
    if (!isClient) return;
    
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const mobileMenu = document.getElementById('mobile-menu');
      if (isMobileMenuOpen && mobileMenu && !mobileMenu.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('keydown', handleEscKey);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen, isClient]);

  // Toggle sidebar state
  const toggleSidebar = useCallback(() => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    
    if (isClient) {
      localStorage.setItem('sidebarCollapsed', String(newState));
      
      // Notify layout about sidebar width change immediately
      const event = new CustomEvent('sidebarStateChange', { 
        detail: { 
          isCollapsed: newState,
          width: newState ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
          instant: true // Add flag to indicate instant transition
        } 
      });
      window.dispatchEvent(event);
    }
  }, [isCollapsed, isClient]);

  // Notify layout of sidebar width on mount with instant transition
  useEffect(() => {
    if (isClient) {
      const event = new CustomEvent('sidebarStateChange', { 
        detail: { 
          isCollapsed: isCollapsed,
          width: isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
          instant: true // Add flag to indicate instant transition
        } 
      });
      window.dispatchEvent(event);
    }
  }, [isClient, isCollapsed]);

  // Toggle mobile menu
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  // Prevent content shift during initial load
  if (!isClient) {
    return <div className="sidebar-placeholder" aria-hidden="true"></div>;
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleMobileMenu} 
          className="text-primary p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
          aria-label="Toggle menu"
        >
          <FiMenu size={22} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={toggleMobileMenu}
            ></div>
            <motion.div 
              id="mobile-menu"
              className="absolute left-0 top-0 h-full w-[280px] bg-white shadow-xl flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 relative mr-3">
                    <Image src="/logo.svg" alt="Logo" fill className="object-contain" />
                  </div>
                  <h1 className="text-lg font-bold">Ghar</h1>
                </div>
                <button 
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
                >
                  <FiChevronLeft size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {menuCategories.map((category) => (
                  <div key={category.id} className="mb-6">
                    <p className="text-xs uppercase text-gray-400 font-medium px-3 mb-2">
                      {category.name}
                    </p>
                    <nav>
                      <ul className="space-y-1">
                        {category.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = pathname === item.path;
                          
                          return (
                            <li key={item.id}>
                              <Link 
                                href={item.path}
                                className={`
                                  flex items-center py-2 px-3 rounded-lg transition-colors
                                  ${isActive 
                                    ? 'bg-primary text-white font-medium' 
                                    : 'text-gray-700 hover:bg-gray-100'}
                                `}
                                onClick={toggleMobileMenu}
                              >
                                <Icon size={18} className="min-w-[20px]" />
                                <span className="ml-3">{item.name}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </nav>
                  </div>
                ))}

                <div>
                  <p className="text-xs uppercase text-gray-400 font-medium px-3 mb-2">
                    User
                  </p>
                  <nav>
                    <ul className="space-y-1">
                      {bottomMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        
                        return (
                          <li key={item.id}>
                            <Link 
                              href={item.path}
                              className={`
                                flex items-center py-2 px-3 rounded-lg transition-colors
                                ${isActive 
                                  ? 'bg-primary text-white font-medium' 
                                  : 'text-gray-700 hover:bg-gray-100'}
                              `}
                              onClick={toggleMobileMenu}
                            >
                              <Icon size={18} className="min-w-[20px]" />
                              <span className="ml-3">{item.name}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div
        data-sidebar
        className="hidden lg:flex flex-col h-screen bg-white fixed top-0 left-0 z-20 border-r border-gray-100 shadow-sm"
        style={{ 
          width: isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
          transition: 'width 0s'  // Remove transition for width changes
        }}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-8 h-8 relative flex-shrink-0">
              <Image 
                src="/logo.svg" 
                alt="Logo" 
                fill 
                className="object-contain" 
                priority 
              />
            </div>
            {!isCollapsed && (
              <h1 className="text-lg font-bold ml-3 truncate">Ghar</h1>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded text-gray-500 hover:bg-gray-100 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <FiChevronLeft 
              size={18} 
              className={`transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
            />
          </button>
        </div>

        {/* Main Menu */}
        <div className="flex-1 overflow-y-auto p-2">
          {menuCategories.map((category) => (
            <div key={category.id} className="mb-6">
              {!isCollapsed && (
                <p className="text-xs uppercase text-gray-400 font-medium px-2 mb-2">
                  {category.name}
                </p>
              )}
              {isCollapsed && category.id !== 'home' && (
                <div className="h-px bg-gray-100 my-3 mx-2"></div>
              )}
              <nav>
                <ul className="space-y-1">
                  {category.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    
                    return (
                      <li key={item.id}>
                        <Link
                          href={item.path}
                          className={`
                            flex items-center py-2 px-3 rounded-lg transition-colors
                            ${isActive 
                              ? 'bg-primary text-white' 
                              : 'text-gray-700 hover:bg-gray-100'}
                            ${isCollapsed ? 'justify-center' : ''}
                          `}
                          title={isCollapsed ? item.name : ''}
                        >
                          <Icon size={18} />
                          {!isCollapsed && (
                            <span className="ml-3 truncate">{item.name}</span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-2 mt-auto border-t border-gray-100">
          {!isCollapsed && (
            <p className="text-xs uppercase text-gray-400 font-medium px-2 mb-2">
              User
            </p>
          )}
          <nav>
            <ul className="space-y-1">
              {bottomMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                
                return (
                  <li key={item.id}>
                    <Link
                      href={item.path}
                      className={`
                        flex items-center py-2 px-3 rounded-lg transition-colors
                        ${isActive 
                          ? 'bg-primary text-white' 
                          : 'text-gray-700 hover:bg-gray-100'}
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                      title={isCollapsed ? item.name : ''}
                    >
                      <Icon size={18} />
                      {!isCollapsed && (
                        <span className="ml-3 truncate">{item.name}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar; 