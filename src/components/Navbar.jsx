import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import logo from '../assets/logo.svg';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for authenticated user
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Fetch user profile to get role
        const { data: profile } = await supabase
          .from('profiles')
          .select('type')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUserRole(profile.type);
        }
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('type')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUserRole(profile.type);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserRole(null);
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="MDC Hackathon Logo" className="h-8 w-auto" />
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link to="/schedule" className="text-gray-600 hover:text-blue-600 font-medium">
              Schedule
            </Link>
            
            {!user ? (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition"
                >
                  Register Now
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {(userRole === 'participant' || userRole === 'both') && (
                  <Link 
                    to="/participant/dashboard" 
                    className="text-gray-600 hover:text-blue-600 font-medium"
                  >
                    Participant Dashboard
                  </Link>
                )}
                {(userRole === 'volunteer' || userRole === 'both') && (
                  <Link 
                    to="/volunteer/dashboard" 
                    className="text-gray-600 hover:text-blue-600 font-medium"
                  >
                    Volunteer Dashboard
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 text-white px-4 py-2 rounded-full font-medium hover:bg-red-700 transition"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}