import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { logError, logInfo } from '../utils/logger';

const FILE = 'useAuth.js';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [userName, setUserName] = useState(''); // userEmail ki jagah userName

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        // Email se name nikalo (admin@test.com se "admin" nikal lega)
        const extractedName = session.user.user_metadata?.full_name || session.user.email.split('@')[0];
        setUserName(extractedName);
        logInfo(FILE, 'session', 'Found', extractedName);
      }
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault(); setLoginError(''); setLoginLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { logError(FILE, 'login', 'Failed', error); setLoginError(error.message || 'Invalid credentials'); }
      else { 
        logInfo(FILE, 'login', 'Success'); 
        setIsLoggedIn(true); 
        // Yahan bhi name nikalo
        const extractedName = data.user.user_metadata?.full_name || data.user.email.split('@')[0];
        setUserName(extractedName);
      }
    } catch (err) { logError(FILE, 'login', 'Unexpected', err); setLoginError('Something went wrong.'); }
    finally { setLoginLoading(false); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false); setEmail(''); setPassword(''); setUserName('');
  };

  
  return { isLoggedIn, email, password, loginError, loginLoading, userName, setEmail, setPassword, handleLogin, handleLogout };
}