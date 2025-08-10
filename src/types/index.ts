export interface User {
  id: string;
  name: string;
  email: string;
  role: 'staff';
  registeredAt: string;
  lastLoginAt?: string;
  loginCount?: number;
  isActive?: boolean;
}

export interface Component {
  id: string;
  name: string;
  totalQuantity: number;
  availableQuantity: number;
  category: string;
  description?: string;
}

export interface ComponentIssue {
  id: string;
  studentName: string;
  rollNo: string;
  mobile: string;
  componentId: string;
  componentName: string;
  quantity: number;
  issueDate: string;
  dueDate: string;
  status: 'issued' | 'returned';
  returnDate?: string;
  purpose: string;
  issuedBy: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface LoginSession {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userRole: 'staff';
  loginTime: string;
  logoutTime?: string;
  ipAddress?: string;
  userAgent?: string;
  deviceInfo?: string;
  sessionDuration?: number;
  isActive: boolean;
}

export interface SystemData {
  users: User[];
  components: Component[];
  componentIssues: ComponentIssue[];
  notifications: Notification[];
  loginSessions: LoginSession[];
}

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalLogins: number;
  onlineUsers: number;
  totalComponents: number;
  issuedComponents: number;
  returnedComponents: number;
  overdueItems: number;
}

// Legacy types for backward compatibility
export interface BorrowRequest extends ComponentIssue {}