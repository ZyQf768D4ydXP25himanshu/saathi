import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, onAuthStateChanged, User, signInWithPopup, googleProvider, db, getDoc, doc, setDoc, Timestamp } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isAdminAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  verifyAdminPassword: (password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const adminEmails = ["shuklashankarnath009@gmail.com"];
        const isEmailAdmin = adminEmails.includes(user.email || "");
        
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            // Create initial user profile
            const newUserProfile = {
              uid: user.uid,
              displayName: user.displayName || 'Anonymous',
              email: user.email || '',
              photoURL: user.photoURL || '',
              role: isEmailAdmin ? 'admin' : 'user',
              isVerified: false,
              trustScore: 50,
              createdAt: Timestamp.now(),
            };
            await setDoc(userDocRef, newUserProfile);
            setIsAdmin(isEmailAdmin);
          } else {
            const userData = userDoc.data();
            setIsAdmin(isEmailAdmin || userData?.role === 'admin');
          }
        } catch (error) {
          console.error('Error checking/creating user profile:', error);
          setIsAdmin(isEmailAdmin);
        }
      } else {
        setIsAdmin(false);
        setIsAdminAuthenticated(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const verifyAdminPassword = (password: string) => {
    if (password === 'saathi706792') {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setIsAdminAuthenticated(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isAdminAuthenticated, signIn, signOut, verifyAdminPassword }}>
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
