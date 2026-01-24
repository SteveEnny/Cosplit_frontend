// src/components/Dashboard/DashboardSidebar.jsx
import { useState, useEffect } from 'react';
import { NavLink, Link } from "react-router-dom";
import { Home, Share2, MessageSquare, Wallet, MapPin, BarChart3, Menu } from "lucide-react";
import logo from "../../assets/logo.svg";
import { getUserInfoEndpoint } from "../../services/endpoints/auth";


export default function DashboardSidebar({ isOpen, onClose }) {

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [navItems, setNavItems] = useState([
    { icon: Home, label: "Home", to: "/dashboard", count: 0 },
    { icon: Share2, label: "My Splits", to: "/dashboard/mysplitz", count: 0 },
    { icon: MessageSquare, label: "Messages", to: "/dashboard/messages", count: 0 },
    { icon: Wallet, label: "Wallet", to: "/dashboard/wallet", count: 0 },
    { icon: MapPin, label: "Nearby", to: "/dashboard/filter", count: 0 },
    { icon: BarChart3, label: "Analytics", to: "/dashboard/analytics", count: 0 },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await getUserInfoEndpoint(token);
        setUserData(data);
        
        // Update nav items with dynamic counts if available
        if (data.unreadCounts) {
          setNavItems(prev => prev.map(item => ({
            ...item,
            count: data.unreadCounts[item.label] || 0
          })));
        }
      } catch (err) {
        console.error("Sidebar data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <aside className="fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col h-full">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F8225]" />
        </div>
      </aside>
    );
  }

  return (
    <aside 
      className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300
        flex flex-col h-full
      `}>
      {/* Logo section */}
      <div className="flex items-center pl-7 py-4 gap-3 border-b border-gray-200">
        <img 
          src={logo} 
          alt="CleanPro Logo" 
          className="h-10 cursor-pointer" 
          onClick={onClose} 
        />
      </div>
      
      {/* Navigation menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center justify-between px-4 py-3 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-[#1F8225] text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {item.count > 0 && (
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {item.count}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Community standing card */}
        <div className="mt-6 p-4 bg-[#1F8225] rounded-xl text-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold">Community Standing</h3>
            <div className="flex gap-1">
              {[1,2,3,4].map(i => (
                <span 
                  key={i} 
                  className={`w-2 h-2 rounded-full ${
                    i <= (userData?.level || 1) ? "bg-white" : "bg-white/40"
                  }`} 
                />
              ))}
            </div>
          </div>
          <p className="text-sm font-bold">Level {userData?.level || 1}</p>
          <div className="text-sm space-y-1 mt-2">
            <p>{userData?.completedSplits || 0} Completed Splits</p>
            <p>Reliability Score: {userData?.reliabilityScore || 0}%</p>
          </div>
          <div className="h-2 bg-white/20 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500" 
              style={{ width: `${userData?.reliabilityScore || 0}%` }} 
            />
          </div>
        </div>
      </nav>

      {/* User profile footer */}
      <div className="p-4 border-t border-gray-100">
        <Link to="/dashboard/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
          <img
            src={userData?.avatar || "/default-avatar.png"}
            alt={`${userData?.firstName || 'User'} avatar`}
            className="w-10 h-10 rounded-full object-cover bg-gray-200"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {`${userData?.firstName || 'Firstname'}, ${userData?.lastName || 'Last-Name'}`}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {userData?.role || 'user'}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}