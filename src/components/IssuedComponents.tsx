import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Package, User, Calendar, CheckCircle, Search, Filter } from 'lucide-react';
import { dataService } from '../services/dataService';
import { ComponentIssue } from '../types';

const IssuedComponents: React.FC = () => {
  const [issuedComponents, setIssuedComponents] = useState<ComponentIssue[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'issued' | 'returned'>('issued');

  useEffect(() => {
    loadIssuedComponents();
  }, []);

  const loadIssuedComponents = () => {
    const issues = dataService.getComponentIssues();
    setIssuedComponents(issues.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()));
  };

  const handleReturn = (issue: ComponentIssue) => {
    const components = dataService.getComponents();
    const component = components.find(c => c.id === issue.componentId);
    
    if (component) {
      component.availableQuantity += issue.quantity;
      dataService.updateComponent(component);
    }

    const updatedIssue = {
      ...issue,
      status: 'returned' as const,
      returnDate: new Date().toISOString(),
    };
    dataService.updateComponentIssue(updatedIssue);
    loadIssuedComponents();
  };

  const filteredComponents = issuedComponents.filter(issue => {
    const matchesSearch = issue.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.componentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'returned') return false;
    return new Date(dueDate) < new Date();
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Issued Components</h2>
            <p className="text-purple-200">Track components currently with students</p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-3 md:gap-4"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peacock-400 w-4 h-4 md:w-5 md:h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student, component, or roll no..."
            className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2.5 md:py-3 bg-dark-700/50 border border-dark-600 rounded-lg md:rounded-xl text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-200 text-sm md:text-base"
          />
        </div>
        
        <div className="flex gap-1 md:gap-2 bg-dark-800/30 p-1.5 md:p-2 rounded-lg md:rounded-xl overflow-x-auto">
          {[
            { key: 'all', label: 'All', count: issuedComponents.length },
            { key: 'issued', label: 'Currently Issued', count: issuedComponents.filter(i => i.status === 'issued').length },
            { key: 'returned', label: 'Returned', count: issuedComponents.filter(i => i.status === 'returned').length },
          ].map((filter) => (
            <motion.button
              key={filter.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStatusFilter(filter.key as any)}
              className={`flex-1 px-2 md:px-4 py-1.5 md:py-2 rounded-md md:rounded-lg font-medium transition-all duration-200 text-xs md:text-sm whitespace-nowrap ${
                statusFilter === filter.key
                  ? 'bg-peacock-500 text-white shadow-lg'
                  : 'text-peacock-300 hover:text-white hover:bg-dark-700/50'
              }`}
            >
              {filter.label} ({filter.count})
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Components List */}
      <div className="space-y-3 md:space-y-4">
        <AnimatePresence>
          {filteredComponents.map((issue, index) => {
            const overdue = isOverdue(issue.dueDate, issue.status);
            const daysRemaining = getDaysRemaining(issue.dueDate);
            
            return (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className={`relative overflow-hidden bg-dark-800/50 backdrop-blur-xl rounded-lg md:rounded-2xl border p-4 md:p-6 transition-all duration-300 ${
                  overdue && issue.status === 'issued'
                    ? 'border-red-500/30 bg-red-500/5' 
                    : issue.status === 'returned'
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-peacock-500/20 hover:border-peacock-500/40'
                }`}
              >
                {/* Status Indicator */}
                <div className={`absolute top-0 left-0 w-full h-1 ${
                  issue.status === 'returned' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                  overdue ? 'bg-gradient-to-r from-red-500 to-red-600' :
                  daysRemaining <= 3 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                  'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}></div>

                <div className="flex flex-col gap-4 md:gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="p-2 md:p-3 bg-peacock-500/20 rounded-lg md:rounded-xl">
                        <Package className="w-5 h-5 md:w-6 md:h-6 text-peacock-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg md:text-xl">{issue.componentName}</h3>
                        <p className="text-peacock-300 text-sm md:text-base">Quantity: {issue.quantity}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {issue.status === 'returned' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-green-500/20 border border-green-500/30 px-2 md:px-3 py-1 rounded-full text-green-400 text-xs md:text-sm font-medium"
                          >
                            ✅ Returned
                          </motion.div>
                        )}
                        {overdue && issue.status === 'issued' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-red-500/20 border border-red-500/30 px-2 md:px-3 py-1 rounded-full text-red-400 text-xs md:text-sm font-medium"
                          >
                            🚨 Overdue
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-xs md:text-sm">
                      <div className="flex items-center gap-3">
                        <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-peacock-400" />
                        <div>
                          <p className="text-peacock-300">Student</p>
                          <p className="text-white font-semibold text-xs md:text-sm">{issue.studentName}</p>
                          <p className="text-peacock-300 text-xs">Roll: {issue.rollNo}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-peacock-400" />
                        <div>
                          <p className="text-peacock-300">Issue Date</p>
                          <p className="text-white text-xs md:text-sm">{new Date(issue.issueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-peacock-400" />
                        <div>
                          <p className="text-peacock-300">Due Date</p>
                          <p className={`font-semibold text-xs md:text-sm ${overdue && issue.status === 'issued' ? 'text-red-400' : 'text-white'}`}>
                            {new Date(issue.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Package className="w-3.5 h-3.5 md:w-4 md:h-4 text-peacock-400" />
                        <div>
                          <p className="text-peacock-300">Purpose</p>
                          <p className="text-white text-xs line-clamp-1">{issue.purpose}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {issue.status === 'issued' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReturn(issue)}
                        className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                          Mark as Returned
                        </div>
                      </motion.button>
                    )}
                    
                    {issue.status === 'issued' && (
                      <div className="text-right text-xs md:text-sm">
                        <p className="text-peacock-300">Days Remaining</p>
                        <p className={`font-semibold ${
                          daysRemaining < 0 ? 'text-red-400' : 
                          daysRemaining <= 3 ? 'text-yellow-400' : 'text-white'
                        }`}>
                          {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : 
                           daysRemaining === 0 ? 'Due today' :
                           `${daysRemaining} days`}
                        </p>
                      </div>
                    )}

                    {issue.status === 'returned' && issue.returnDate && (
                      <div className="text-right text-xs md:text-sm">
                        <p className="text-peacock-300">Returned On</p>
                        <p className="text-green-400 font-semibold">
                          {new Date(issue.returnDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredComponents.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 md:py-16"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full mb-4 md:mb-6"
          >
            <Users className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
          </motion.div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">No Components Found</h3>
          <p className="text-peacock-300 text-sm md:text-lg">
            {searchTerm || statusFilter !== 'all' ? 'No components match your current filters.' : 'No components have been issued yet.'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default IssuedComponents;