import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function Register() {
  const navigate = useNavigate();
  const [registrationType, setRegistrationType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    team: '',
    teamStatus: '',
    experience: '',
    skills: '',
    dietary: '',
    tshirt: '',
    expectations: '',
    availability: [],
    selectedTasks: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!registrationType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Register for BUILD THE FUTURE</h2>
            <p className="text-lg sm:text-xl text-blue-200 mb-8">Join us for an amazing hackathon experience!</p>
          </div>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRegistrationType('participant')}
              className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl text-white font-medium transition-all"
            >
              Participate in the Hackathon
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRegistrationType('volunteer')}
              className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl text-white font-medium transition-all"
            >
              Volunteer at the Event
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRegistrationType('both')}
              className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl text-white font-medium transition-all"
            >
              Both Participate and Volunteer
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate passwords
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            name: formData.name,
            type: registrationType
          }
        }
      });

      if (signUpError) {
        // More user-friendly error message
        if (signUpError.message.includes('Email domain is not authorized')) {
          throw new Error('This email domain is not authorized. Please use a different email address.');
        }
        throw signUpError;
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            type: registrationType,
            experience: formData.experience,
            skills: formData.skills,
            dietary: formData.dietary,
            tshirt: formData.tshirt,
            expectations: formData.expectations
          }
        ]);

      if (profileError) throw profileError;

      // Handle team creation/joining
      if (formData.teamStatus === 'create' && formData.team) {
        const { error: teamError } = await supabase
          .from('teams')
          .insert([
            {
              name: formData.team,
              created_by: authData.user.id
            }
          ]);

        if (teamError) throw teamError;
      }

      // Handle volunteer availability
      if (registrationType !== 'participant' && formData.availability.length > 0) {
        const availabilityData = formData.availability.map(day => ({
          user_id: authData.user.id,
          day: day
        }));

        const { error: availabilityError } = await supabase
          .from('volunteer_availability')
          .insert(availabilityData);

        if (availabilityError) throw availabilityError;
      }

      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
            {registrationType === 'participant' ? 'Participant Registration' :
             registrationType === 'volunteer' ? 'Volunteer Registration' :
             'Participant & Volunteer Registration'}
          </h2>

          {error && (
            <div className="mb-6 bg-red-500/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              {(registrationType === 'participant' || registrationType === 'both') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Team Status
                    </label>
                    <select
                      value={formData.teamStatus}
                      onChange={(e) => setFormData({ ...formData, teamStatus: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    >
                      <option value="">Select option</option>
                      <option value="create">Create a team</option>
                      <option value="join">Join a team</option>
                      <option value="none">No team yet</option>
                    </select>
                  </div>

                  {formData.teamStatus === 'create' && (
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">
                        Team Name
                      </label>
                      <input
                        type="text"
                        value={formData.team}
                        onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Experience Level
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    >
                      <option value="">Select level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </>
              )}

              {(registrationType === 'volunteer' || registrationType === 'both') && (
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Availability
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {['Setup Day', 'Day 1', 'Day 2', 'Day 3', 'Cleanup Day'].map(day => (
                      <label key={day} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.availability.includes(day)}
                          onChange={(e) => {
                            const newAvailability = e.target.checked
                              ? [...formData.availability, day]
                              : formData.availability.filter(d => d !== day);
                            setFormData({ ...formData, availability: newAvailability });
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-white">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Technical Skills
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g., Python, Machine Learning, Web Development"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  T-Shirt Size
                </label>
                <select
                  value={formData.tshirt}
                  onChange={(e) => setFormData({ ...formData, tshirt: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                >
                  <option value="">Select size</option>
                  <option value="S">Small</option>
                  <option value="M">Medium</option>
                  <option value="L">Large</option>
                  <option value="XL">X-Large</option>
                  <option value="2XL">2X-Large</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Dietary Restrictions
                </label>
                <input
                  type="text"
                  value={formData.dietary}
                  onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                  placeholder="Any dietary restrictions?"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  What do you hope to learn or achieve?
                </label>
                <textarea
                  value={formData.expectations}
                  onChange={(e) => setFormData({ ...formData, expectations: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm resize-none"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? 'Registering...' : 'Register'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}