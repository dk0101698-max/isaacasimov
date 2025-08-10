import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Package, Search, Trash2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Component } from '../types';

const InventoryManagement: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingComponent, setEditingComponent] = useState<Component | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    totalQuantity: 0,
    category: '',
    description: '',
  });

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = () => {
    setComponents(dataService.getComponents());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingComponent) {
      const updatedComponent: Component = {
        ...editingComponent,
        name: formData.name,
        totalQuantity: formData.totalQuantity,
        availableQuantity: editingComponent.availableQuantity + (formData.totalQuantity - editingComponent.totalQuantity),
        category: formData.category,
        description: formData.description,
      };
      dataService.updateComponent(updatedComponent);
    } else {
      const newComponent: Component = {
        id: `comp-${Date.now()}`,
        name: formData.name,
        totalQuantity: formData.totalQuantity,
        availableQuantity: formData.totalQuantity,
        category: formData.category,
        description: formData.description,
      };
      dataService.addComponent(newComponent);
    }

    resetForm();
    loadComponents();
  };

  const handleEdit = (component: Component) => {
    setEditingComponent(component);
    setFormData({
      name: component.name,
      totalQuantity: component.totalQuantity,
      category: component.category,
      description: component.description || '',
    });
    setShowAddForm(true);
  };

  const handleDelete = (component: Component) => {
    if (component.availableQuantity !== component.totalQuantity) {
      alert('Cannot delete component that is currently issued to students!');
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${component.name}?`)) {
      const data = dataService.getData();
      data.components = data.components.filter(c => c.id !== component.id);
      dataService.saveData(data);
      loadComponents();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      totalQuantity: 0,
      category: '',
      description: '',
    });
    setEditingComponent(null);
    setShowAddForm(false);
  };

  const filteredComponents = components.filter(component =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage === 0) return { color: 'text-red-400', bg: 'bg-red-500/10', text: 'Out of Stock' };
    if (percentage < 20) return { color: 'text-orange-400', bg: 'bg-orange-500/10', text: 'Low Stock' };
    if (percentage < 50) return { color: 'text-yellow-400', bg: 'bg-yellow-500/10', text: 'Medium Stock' };
    return { color: 'text-green-400', bg: 'bg-green-500/10', text: 'Good Stock' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Inventory Management</h2>
            <p className="text-blue-200">Manage lab components and stock levels</p>
          </div>
        </div>
      </motion.div>

      {/* Header Actions */}
      <div className="flex flex-col gap-3 md:gap-4 md:flex-row md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peacock-400 w-4 h-4 md:w-5 md:h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search components..."
            className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2.5 md:py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-200 text-sm md:text-base"
          />
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-peacock-500 to-blue-500 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium hover:from-peacock-600 hover:to-blue-600 transition-all duration-200 text-sm md:text-base"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          Add Component
        </motion.button>
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && resetForm()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-dark-800 rounded-xl md:rounded-2xl border border-peacock-500/20 p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg md:text-xl font-bold text-white mb-4">
                {editingComponent ? 'Edit Component' : 'Add New Component'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-peacock-300 text-xs md:text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-200 text-sm md:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-peacock-300 text-xs md:text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-200 text-sm md:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-peacock-300 text-xs md:text-sm font-medium mb-2">Total Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.totalQuantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalQuantity: parseInt(e.target.value) }))}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-200 text-sm md:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-peacock-300 text-xs md:text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-200 text-sm md:text-base resize-none"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-peacock-500 to-blue-500 text-white py-2.5 md:py-3 rounded-lg font-medium hover:from-peacock-600 hover:to-blue-600 transition-all duration-200 text-sm md:text-base"
                  >
                    {editingComponent ? 'Update' : 'Add'} Component
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 md:px-6 py-2.5 md:py-3 bg-dark-700 text-white rounded-lg font-medium hover:bg-dark-600 transition-all duration-200 text-sm md:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Components Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredComponents.map((component, index) => {
          const stockStatus = getStockStatus(component.availableQuantity, component.totalQuantity);
          
          return (
            <motion.div
              key={component.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-dark-800/50 backdrop-blur-xl rounded-lg md:rounded-xl border border-peacock-500/20 p-4 md:p-6 hover:border-peacock-500/40 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 md:p-2 bg-peacock-500/20 rounded-lg">
                    <Package className="w-5 h-5 md:w-6 md:h-6 text-peacock-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm md:text-base">{component.name}</h3>
                    <p className="text-peacock-300 text-xs md:text-sm">{component.category}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(component)}
                    className="p-1.5 md:p-2 text-peacock-400 hover:text-peacock-300 hover:bg-dark-700/50 rounded-lg transition-all duration-200"
                  >
                    <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(component)}
                    className="p-1.5 md:p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </motion.button>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-peacock-300">Available:</span>
                  <span className="text-white font-medium">{component.availableQuantity}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-peacock-300">Total:</span>
                  <span className="text-white font-medium">{component.totalQuantity}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-peacock-300">In Use:</span>
                  <span className="text-white font-medium">{component.totalQuantity - component.availableQuantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-peacock-300">In Use:</span>
                  <span className="text-white font-medium">{component.totalQuantity - component.availableQuantity}</span>
                </div>
                
                <div className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                  {stockStatus.text}
                </div>

                {component.description && (
                  <p className="text-dark-300 text-xs md:text-sm line-clamp-2">{component.description}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredComponents.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8 md:py-12"
        >
          <Package className="w-12 h-12 md:w-16 md:h-16 text-peacock-400 mx-auto mb-3 md:mb-4" />
          <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No Components Found</h3>
          <p className="text-peacock-300 text-sm md:text-base">
            {searchTerm ? 'No components match your search.' : 'Start by adding your first component.'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default InventoryManagement;