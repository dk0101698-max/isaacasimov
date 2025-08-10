import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Lock, Cpu, Shield, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [buttonPosition, setButtonPosition] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showValidationMsg, setShowValidationMsg] = useState('');
  const { login } = useAuth();

  const positions = ['shift-left', 'shift-top', 'shift-right', 'shift-bottom'];

  const shiftButton = () => {
    const isEmpty = email === '' || password === '';
    
    if (isEmpty) {
      setShowValidationMsg('Please fill the input fields before proceeding');
      const currentIndex = positions.indexOf(buttonPosition);
      const nextIndex = (currentIndex + 1) % positions.length;
      setIsButtonDisabled(true);
    } else {
      setShowValidationMsg('Great! Now you can proceed');
      setIsButtonDisabled(false);
    }
  };

  const handleInputChange = () => {
    const isEmpty = email === '' || password === '';
    
    if (isEmpty) {
      setIsButtonDisabled(true);
    } else {
      setShowValidationMsg('Great! Now you can proceed');
      setIsButtonDisabled(false);
    }
  };

  React.useEffect(() => {
    handleInputChange();
  }, [email, password]);
  const handleNameChange = (name: string) => {
    // Auto-fill email domain for common usernames
    if (name === 'admin' || name === 'staff') {
      setEmail(`${name}@isaacasimov.in`);
    } else if (name.includes('@')) {
      setEmail(name);
    } else {
      setEmail(name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isEmpty = email === '' || password === '';
    if (isEmpty) {
      shiftButton();
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    const isEmpty = email === '' || password === '';
    if (isEmpty) {
      e.preventDefault();
      shiftButton();
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-peacock-900 flex items-center justify-center p-3 md:p-4 relative overflow-hidden">
      <style>{`
        .btn-container {
          position: relative;
          width: 100%;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
        }
        
        @media (min-width: 768px) {
          .btn-container {
            height: 80px;
          }
        }
        
        .login-button {
          position: absolute;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .shift-left {
          transform: translateX(-40px);
        }
        
        .shift-top {
          transform: translateY(-20px);
        }
        
        .shift-right {
          transform: translateX(40px);
        }
        
        .shift-bottom {
          transform: translateY(20px);
        }
        
        @media (min-width: 768px) {
          .shift-left {
            transform: translateX(-60px);
          }
          
          .shift-top {
            transform: translateY(-25px);
          }
          
          .shift-right {
            transform: translateX(60px);
          }
          
          .shift-bottom {
            transform: translateY(25px);
          }
        }
        
        .no-shift {
          transform: translateX(0) translateY(0);
        }
        
        .login-button:hover:not(.no-shift) {
          transform: scale(0.95) !important;
        }
        
        .validation-msg {
          text-align: center;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          min-height: 1.25rem;
          transition: color 0.3s ease;
          font-weight: 500;
        }
        
        @media (max-width: 767px) {
          .validation-msg {
            font-size: 0.75rem;
            margin-bottom: 0.75rem;
          }
        }
        
        .validation-msg.error {
          color: rgb(248 113 113);
        }
        
        .validation-msg.success {
          color: rgb(74 222 128);
        }
      `}</style>
      
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 md:-top-40 md:-right-40 w-40 h-40 md:w-80 md:h-80 bg-peacock-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 md:-bottom-40 md:-left-40 w-40 h-40 md:w-80 md:h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm md:max-w-md relative z-10"
      >
        <div className="bg-dark-800/70 backdrop-blur-2xl rounded-2xl md:rounded-3xl shadow-2xl border border-peacock-500/20 p-6 md:p-8 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-peacock-500 via-blue-500 to-purple-500"></div>
          
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-6 md:mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-peacock-500 to-blue-500 rounded-full mb-4 md:mb-6 shadow-lg animate-glow">
              <Cpu className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-peacock-200 bg-clip-text text-transparent mb-2">
              Isaac Asimov
            </h1>
            <p className="text-peacock-300 text-base md:text-lg font-medium">Inventory Management System</p>
            <div className="flex items-center justify-center gap-3 md:gap-4 mt-3 md:mt-4">
              <div className="flex items-center gap-1.5 md:gap-2 text-peacock-400 text-xs md:text-sm">
                <Shield className="w-3 h-3 md:w-4 md:h-4" />
                <span>Staff Access</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 text-peacock-400 text-xs md:text-sm">
                <Package className="w-3 h-3 md:w-4 md:h-4" />
                <span>Inventory</span>
              </div>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Validation Message */}
            <div className={`validation-msg ${showValidationMsg.includes('Please') ? 'error' : showValidationMsg.includes('Great') ? 'success' : ''}`}>
              {showValidationMsg}
            </div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label className="block text-peacock-300 text-xs md:text-sm font-semibold mb-2 md:mb-3">
                Staff Email
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peacock-400 w-4 h-4 md:w-5 md:h-5 group-focus-within:text-peacock-300 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-3 md:py-4 bg-dark-700/50 border border-dark-600 rounded-lg md:rounded-xl text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 group-hover:border-dark-500 text-sm md:text-base"
                  placeholder="staff-id"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label className="block text-peacock-300 text-xs md:text-sm font-semibold mb-2 md:mb-3">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peacock-400 w-4 h-4 md:w-5 md:h-5 group-focus-within:text-peacock-300 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 md:pl-10 pr-10 md:pr-12 py-3 md:py-4 bg-dark-700/50 border border-dark-600 rounded-lg md:rounded-xl text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 group-hover:border-dark-500 text-sm md:text-base"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-peacock-400 hover:text-peacock-300 transition-colors p-1 rounded"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                </button>
              </div>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg md:rounded-xl p-3 md:p-4 text-red-400 text-xs md:text-sm backdrop-blur-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  {error}
                </div>
              </motion.div>
            )}

            <div className="btn-container">
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0, 206, 209, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              onMouseEnter={handleButtonInteraction}
              onTouchStart={handleButtonInteraction}
              onClick={handleButtonInteraction}
                className={`login-button w-full group relative overflow-hidden bg-gradient-to-r from-peacock-500 to-blue-500 text-white py-3 md:py-4 rounded-lg md:rounded-xl font-bold text-base md:text-lg shadow-lg hover:shadow-2xl focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${buttonPosition}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-peacock-600 to-blue-600 opacity-0 ${buttonPosition === 'no-shift' ? 'group-hover:opacity-100' : ''} transition-opacity duration-300`}></div>
              <div className="relative z-10 flex items-center justify-center gap-2 md:gap-3">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 md:w-5 md:h-5" />
                    Sign In
                  </>
                )}
              </div>
            </motion.button>
            </div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6 md:mt-8"
          >
            <div className="text-center text-xs md:text-sm text-dark-400">
              <p>© 2024 Isaac Asimov Lab Inventory System. All rights reserved.</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
