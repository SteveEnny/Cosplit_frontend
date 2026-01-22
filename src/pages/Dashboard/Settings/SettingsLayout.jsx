import { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search,Users,Bell,Shield,Lock,Headphones } from "lucide-react";
import SettingsSidebar from "./Sidebar"; // Your imported component
import LogoutModal from "../../../components/Settings/LogoutModal";
import DeleteAccountModal from "../../../components/Settings/DeleteAccount";




export default function DashboardSettingsLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Check if we're on the root settings page or a specific setting
  const isRootSettings = location.pathname === "/dashboard/settings";
  const isSpecificSetting = location.pathname !== "/dashboard/settings";



  // Add position relative to container when modal is open
  useEffect(() => {
    const container = document.getElementById('settings-container');
    if (container) {
      container.style.position = 'relative';
    }
  }, [isLogoutModalOpen, isDeleteModalOpen]);



  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("is_authenticated");
    localStorage.removeItem("current_Users");
    setIsLogoutModalOpen(false);
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    localStorage.clear();
    setIsDeleteModalOpen(false);
    navigate("/login");
  };

  return (
    <div id="settings-container" className="h-full bg-gray-50 flex">
      
      {/* Sidebar - Settings List */}
      <div
        className={`
          ${isSpecificSetting ? "hidden lg:flex" : "flex"}
          w-full lg:w-96 bg-white border-r border-gray-200 flex-col
        `}
      >


        {/* Settings List - Using imported SettingsSidebar */}
        <div className="flex-1 overflow-y-auto py-2">
          <SettingsSidebar 
            onLogout={() => setIsLogoutModalOpen(true)}
            onDelete={() => setIsDeleteModalOpen(true)}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`
          ${isRootSettings ? "hidden lg:flex" : "flex"}
          flex-1 flex-col bg-gray-50
        `}
      >
        {/* Content Header - Only show on mobile when in a specific setting */}
        {activeSetting && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-b border-gray-200 p-6 flex items-center justify-between flex-shrink-0 lg:hidden"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard/settings')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h2 className="text-xl font-bold text-gray-800">{activeSetting.label}</h2>
            </div>
          </motion.div>
        )}

        {/* Outlet renders the actual setting component */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modals - Now scoped to settings container */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute inset-0 bg-[#1A051D]/80 transition-opacity duration-200 ${
          isLogoutModalOpen || isDeleteModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`} />
        
        <LogoutModal
          open={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleLogout}
        />

        <DeleteAccountModal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteAccount}
        />
      </div>
    </div>
  );
}