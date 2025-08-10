import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Package, User, Phone, Hash, Calendar, CheckCircle } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Component, ComponentIssue } from '../types';

const IssueComponent: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [formData, setFormData] = useState({
    studentName: '',
    rollNo: '',
    mobile: '',
    componentId: '',
    quantity: 1,
    dueDate: '',
    purpose: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadComponents();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadComponents = () => {
    setComponents(dataService.getComponents());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedComponent = components.find(c => c.id === formData.componentId);
      if (!selectedComponent) {
        throw new Error('Component not found');
      }

      if (formData.quantity > selectedComponent.availableQuantity) {
        throw new Error('Not enough components available');
      }

      // Create component issue record
      const issue: ComponentIssue = {
        id: `issue-${Date.now()}`,
        studentName: formData.studentName,
        rollNo: formData.rollNo,
        mobile: formData.mobile,
        componentId: selectedComponent.id,
        componentName: selectedComponent.name,
        quantity: formData.quantity,
        issueDate: new Date().toISOString(),
        dueDate: formData.dueDate,
        purpose: formData.purpose,
        status: 'issued',
        issuedBy: 'Staff',
      };

      // Update component availability
      selectedComponent.availableQuantity -= formData.quantity;
      dataService.updateComponent(selectedComponent);
      dataService.addComponentIssue(issue);

      setNotification({
        type: 'success',
        message: `Component issued successfully to ${formData.studentName}!`,
      });

      // Reset form
      setFormData({
        studentName: '',
        rollNo: '',
        mobile: '',
        componentId: '',
        quantity: 1,
        dueDate: '',
        purpose: '',
      });

      loadComponents();
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to issue component',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedComponent = components.find(c => c.id === formData.componentId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-2 md:px-0"
    >
      <div className="relative overflow-hidden bg-dark-800/50 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-peacock-500/20 p-4 md:p-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 md:mb-8"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl md:rounded-2xl mb-4 md:mb-6 shadow-lg animate-glow"
            >
              <UserPlus className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-peacock-200 bg-clip-text text-transparent mb-2 md:mb-3">
              Issue Component to Student
            </h2>
            <p className="text-peacock-300 text-sm md:text-lg">Directly issue lab components to students</p>
          </motion.div>

          {/* Notification */}
          {notification && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`mb-4 md:mb-6 p-3 md:p-4 rounded-lg md:rounded-xl border backdrop-blur-sm ${
                notification.type === 'success'
                  ? 'bg-green-500/10 border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              <div className="flex items-center gap-2 md:gap-3">
                {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
                <span className="font-medium text-sm md:text-base">{notification.message}</span>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Student Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
            >
              <div className="space-y-2">
                <label className="block text-peacock-300 text-xs md:text-sm font-semibold mb-2">
                  Student Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peacock-400 w-4 h-4 md:w-5 md:h-5 group-focus-within:text-peacock-300 transition-colors" />
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                    className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-3 md:py-4 bg-dark-700/50 border border-dark-600 rounded-lg md:rounded-xl text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 group-hover:border-dark-500 text-sm md:text-base"
                    placeholder="Enter student name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-peacock-300 text-xs md:text-sm font-semibold mb-2">
                  Roll Number
                </label>
                <div className="relative group">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peacock-400 w-4 h-4 md:w-5 md:h-5 group-focus-within:text-peacock-300 transition-colors" />
                  <input
                    type="text"
                    value={formData.rollNo}
                    onChange={(e) => setFormData(prev => ({ ...prev, rollNo: e.target.value }))}
                    className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-3 md:py-4 bg-dark-700/50 border border-dark-600 rounded-lg md:rounded-xl text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 group-hover:border-dark-500 text-sm md:text-base"
                    placeholder="Enter roll number"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-peacock-300 text-xs md:text-sm font-semibold mb-2">
                  Mobile Number
                </label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peacock-400 w-4 h-4 md:w-5 md:h-5 group-focus-within:text-peacock-300 transition-colors" />
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                    className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-3 md:py-4 bg-dark-700/50 border border-dark-600 rounded-lg md:rounded-xl text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 group-hover:border-dark-500 text-sm md:text-base"
                    placeholder="Enter mobile number"
                    required
                  />
                </div>
              </div>
            </motion.div>

            {/* Component Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <label className="block text-peacock-300 text-xs md:text-sm font-semibold mb-2">
                Component
              </label>
              <select
                value={formData.componentId}
                onChange={(e) => setFormData(prev => ({ ...prev, componentId: e.target.value }))}
                className="w-full px-3 md:px-4 py-3 md:py-4 bg-dark-700/50 border border-dark-600 rounded-lg md:rounded-xl text-white focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 hover:border-dark-500 text-sm md:text-base"
                required
              >
                <option value="">Select a component</option>
                {components.filter(c => c.availableQuantity > 0).map(component => (
                  <option key={component.id} value={component.id}>
                    {component.name} (Available: {component.availableQuantity})
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Component Details */}
            {selectedComponent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 md:p-6 rounded-lg md:rounded-xl border border-green-500/20"
              >
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="p-2 md:p-3 bg-green-500/20 rounded-lg md:rounded-xl">
                    <Package className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base md:text-lg">{selectedComponent.name}</h4>
                    <p className="text-peacock-300 text-sm md:text-base">{selectedComponent.category}</p>
                  </div>
                </div>
                <p className="text-peacock-200 text-xs md:text-sm mb-2 md:mb-3">{selectedComponent.description}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs md:text-sm">
                  <span className="text-green-400 font-semibold">
                    ✅ Available: {selectedComponent.availableQuantity} units
                  </span>
                  <span className="text-peacock-300">
                    Total: {selectedComponent.totalQuantity} units
                  </span>
                </div>
              </motion.div>
            )}

            {/* Quantity, Due Date, and Purpose */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
            >
              <div className="space-y-2">
                <label className="block text-peacock-300 text-xs md:text-sm font-semibold mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedComponent?.availableQuantity || 1}
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                  className="w-full px-3 md:px-4 py-3 md:py-4 bg-dark-700/50 border border-dark-600 rounded-lg md:rounded-xl text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 hover:border-dark-500 text-sm md:text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-peacock-300 text-xs md:text-sm font-semibold mb-2">
                  Due Date
                </label>
                <div className="relative group">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peacock-400 w-4 h-4 md:w-5 md:h-5 group-focus-within:text-peacock-300 transition-colors" />
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-3 md:py-4 bg-dark-700/50 border border-dark-600 rounded-lg md:rounded-xl text-white focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 group-hover:border-dark-500 text-sm md:text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-peacock-300 text-xs md:text-sm font-semibold mb-2">
                  Purpose
                </label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                  className="w-full px-3 md:px-4 py-3 md:py-4 bg-dark-700/50 border border-dark-600 rounded-lg md:rounded-xl text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 hover:border-dark-500 text-sm md:text-base"
                  placeholder="Project/Lab purpose"
                  required
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting || !formData.componentId}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 md:py-4 rounded-lg md:rounded-xl font-bold text-base md:text-lg shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center justify-center gap-2 md:gap-3">
                <UserPlus className="w-5 h-5 md:w-6 md:h-6 group-hover:animate-bounce" />
                {isSubmitting ? 'Issuing Component...' : 'Issue Component'}
              </div>
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default IssueComponent;