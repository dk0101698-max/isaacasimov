import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Download, Users, Package, History, Eye } from 'lucide-react';
import { dataService } from '../services/dataService';
import { excelService } from '../services/excelService';
import ExportPreviewModal from './admin/ExportPreviewModal';

const ExportData: React.FC = () => {
  const [showPreview, setShowPreview] = useState(false);

  const handleExportAll = () => {
    const data = dataService.getData();
    excelService.exportToExcel(data);
  };

  const handleExportIssuedComponents = () => {
    const issues = dataService.getComponentIssues();
    const csvContent = [
      ['Student Name', 'Roll Number', 'Mobile', 'Component', 'Quantity', 'Issue Date', 'Due Date', 'Status', 'Return Date', 'Purpose'],
      ...issues.map(issue => [
        issue.studentName,
        issue.rollNo,
        issue.mobile,
        issue.componentName,
        issue.quantity.toString(),
        new Date(issue.issueDate).toLocaleDateString(),
        new Date(issue.dueDate).toLocaleDateString(),
        issue.status,
        issue.returnDate ? new Date(issue.returnDate).toLocaleDateString() : '',
        issue.purpose
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `issued-components-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportInventory = () => {
    const components = dataService.getComponents();
    const csvContent = [
      ['Component ID', 'Name', 'Category', 'Total Quantity', 'Available Quantity', 'In Use', 'Description'],
      ...components.map(component => [
        component.id,
        component.name,
        component.category,
        component.totalQuantity.toString(),
        component.availableQuantity.toString(),
        (component.totalQuantity - component.availableQuantity).toString(),
        component.description || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-indigo-500/20 p-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
            <FileSpreadsheet className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Export Data</h2>
            <p className="text-indigo-200">Export inventory and student data in various formats</p>
          </div>
        </div>
      </motion.div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Professional Excel Report */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-800/50 backdrop-blur-xl rounded-2xl border border-peacock-500/20 p-6 hover:border-peacock-500/40 transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Professional Excel Report</h3>
              <p className="text-peacock-300 text-sm">Comprehensive report with multiple sheets</p>
            </div>
          </div>
          
          <p className="text-peacock-200 text-sm mb-4">
            Complete system report including inventory, issued components, history, and analytics in a professionally formatted Excel workbook.
          </p>
          
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowPreview(true)}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportAll}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
          </div>
        </motion.div>

        {/* Issued Components CSV */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-800/50 backdrop-blur-xl rounded-2xl border border-peacock-500/20 p-6 hover:border-peacock-500/40 transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Issued Components</h3>
              <p className="text-peacock-300 text-sm">CSV export of all issued components</p>
            </div>
          </div>
          
          <p className="text-peacock-200 text-sm mb-4">
            Export all components currently issued to students and their return history in CSV format.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportIssuedComponents}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </motion.button>
        </motion.div>

        {/* Inventory CSV */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-800/50 backdrop-blur-xl rounded-2xl border border-peacock-500/20 p-6 hover:border-peacock-500/40 transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Inventory Report</h3>
              <p className="text-peacock-300 text-sm">CSV export of current inventory</p>
            </div>
          </div>
          
          <p className="text-peacock-200 text-sm mb-4">
            Export current inventory status including available quantities and component details.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportInventory}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </motion.button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-dark-800/50 backdrop-blur-xl rounded-2xl border border-peacock-500/20 p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Quick Stats</h3>
              <p className="text-peacock-300 text-sm">Current system overview</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-peacock-300">Total Components:</span>
              <span className="text-white font-semibold">{dataService.getComponents().length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-peacock-300">Issued Components:</span>
              <span className="text-white font-semibold">{dataService.getComponentIssues().filter(i => i.status === 'issued').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-peacock-300">Total Transactions:</span>
              <span className="text-white font-semibold">{dataService.getComponentIssues().length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-peacock-300">Returned Items:</span>
              <span className="text-white font-semibold">{dataService.getComponentIssues().filter(i => i.status === 'returned').length}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Export Preview Modal */}
      <ExportPreviewModal 
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
};

export default ExportData;