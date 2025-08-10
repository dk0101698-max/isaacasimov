import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Plus, 
  Users, 
  History,
  FileSpreadsheet,
  Search,
  UserPlus
} from 'lucide-react';
import InventoryManagement from './InventoryManagement';
import IssueComponent from './IssueComponent';
import IssuedComponents from './IssuedComponents';
import ComponentHistory from './ComponentHistory';
import ExportData from './ExportData';

const MainDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inventory');

  const tabs = [
    { id: 'inventory', label: 'Inventory', icon: Package, color: 'from-blue-500 to-cyan-500' },
    { id: 'issue', label: 'Issue Component', icon: UserPlus, color: 'from-green-500 to-emerald-500' },
    { id: 'issued', label: 'Issued Components', icon: Users, color: 'from-purple-500 to-pink-500' },
    { id: 'history', label: 'History', icon: History, color: 'from-orange-500 to-red-500' },
    { id: 'export', label: 'Export Data', icon: FileSpreadsheet, color: 'from-indigo-500 to-purple-500' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'inventory':
        return <InventoryManagement />;
      case 'issue':
        return <IssueComponent />;
      case 'issued':
        return <IssuedComponents />;
      case 'history':
        return <ComponentHistory />;
      case 'export':
        return <ExportData />;
      default:
        return <InventoryManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-peacock-900/50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-peacock-200 bg-clip-text text-transparent mb-2">
            Isaac Asimov Lab Inventory
          </h1>
          <p className="text-peacock-300 text-lg">Manage components, issue to students, and track inventory</p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3 bg-dark-800/50 p-3 rounded-2xl backdrop-blur-xl border border-dark-700">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative overflow-hidden flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                      : 'text-peacock-300 hover:text-white hover:bg-dark-700/70'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="hidden sm:inline relative z-10">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default MainDashboard;