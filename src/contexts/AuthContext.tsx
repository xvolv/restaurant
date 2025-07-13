import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'waiter' | 'cashier' | 'kitchen' | 'delivery' | 'customer';
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  department?: string;
  address?: string;
  dateOfBirth?: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  updateProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users with credentials
const defaultUsers: User[] = [
  {
    id: '1',
    username: 'Admin123',
    password: 'Admin@123',
    name: 'System Administrator',
    email: 'admin@restaurant.com',
    phone: '+1 (555) 123-4567',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
    department: 'Management',
    address: '123 Restaurant St, Food City, FC 12345',
    dateOfBirth: '1985-01-15'
  },
  {
    id: '2',
    username: 'Waiter123',
    password: 'Waiter@123',
    name: 'John Smith',
    email: 'john.smith@restaurant.com',
    phone: '+1 (555) 234-5678',
    role: 'waiter',
    isActive: true,
    createdAt: new Date().toISOString(),
    department: 'Front of House',
    address: '456 Service Ave, Food City, FC 12345',
    dateOfBirth: '1992-03-22'
  },
  {
    id: '3',
    username: 'Cashier123',
    password: 'Cashier@123',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@restaurant.com',
    phone: '+1 (555) 345-6789',
    role: 'cashier',
    isActive: true,
    createdAt: new Date().toISOString(),
    department: 'Front of House',
    address: '789 Payment Blvd, Food City, FC 12345',
    dateOfBirth: '1990-07-18'
  },
  {
    id: '4',
    username: 'Kitchen123',
    password: 'Kitchen@123',
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@restaurant.com',
    phone: '+1 (555) 456-7890',
    role: 'kitchen',
    isActive: true,
    createdAt: new Date().toISOString(),
    department: 'Kitchen',
    address: '321 Chef Lane, Food City, FC 12345',
    dateOfBirth: '1988-11-05'
  },
  {
    id: '5',
    username: 'Delivery123',
    password: 'Delivery@123',
    name: 'David Wilson',
    email: 'david.wilson@restaurant.com',
    phone: '+1 (555) 567-8901',
    role: 'delivery',
    isActive: true,
    createdAt: new Date().toISOString(),
    department: 'Delivery',
    address: '654 Driver St, Food City, FC 12345',
    dateOfBirth: '1995-02-14'
  },
  {
    id: '6',
    username: 'Customer123',
    password: 'Customer@123',
    name: 'Emma Davis',
    email: 'emma.davis@email.com',
    phone: '+1 (555) 678-9012',
    role: 'customer',
    isActive: true,
    createdAt: new Date().toISOString(),
    department: 'Customer',
    address: '987 Customer Ave, Food City, FC 12345',
    dateOfBirth: '1993-09-30'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load users from localStorage or use defaults
    const savedUsers = localStorage.getItem('restaurant_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(defaultUsers);
      localStorage.setItem('restaurant_users', JSON.stringify(defaultUsers));
    }

    // Check for existing session
    const savedUser = localStorage.getItem('restaurant_current_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const foundUser = users.find(u => u.username === username && u.password === password && u.isActive);
    
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('restaurant_current_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('restaurant_current_user');
  };

  const createUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('restaurant_users', JSON.stringify(updatedUsers));
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    const updatedUsers = users.map(u => u.id === id ? { ...u, ...userData } : u);
    setUsers(updatedUsers);
    localStorage.setItem('restaurant_users', JSON.stringify(updatedUsers));
    
    // Update current user if it's the same user
    if (user && user.id === id) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('restaurant_current_user', JSON.stringify(updatedUser));
    }
  };

  const deleteUser = (id: string) => {
    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('restaurant_users', JSON.stringify(updatedUsers));
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      updateUser(user.id, userData);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
      login,
      logout,
      isAuthenticated,
      createUser,
      updateUser,
      deleteUser,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};