import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const categories = [
  {
    name: 'Pre-Event Setup',
    tasks: [
      { id: 1, name: 'Venue Setup - Tables & Chairs', slots: 4 },
      { id: 2, name: 'Technical Equipment Setup', slots: 3 },
      { id: 3, name: 'Registration Desk Setup', slots: 2 },
      { id: 4, name: 'Signage & Wayfinding Installation', slots: 2 }
    ]
  },
  {
    name: 'Event Support',
    tasks: [
      { id: 5, name: 'Registration Desk Staff', slots: 4 },
      { id: 6, name: 'Technical Support Team', slots: 3 },
      { id: 7, name: 'Workshop Assistant', slots: 4 },
      { id: 8, name: 'General Event Support', slots: 6 }
    ]
  },
  {
    name: 'Food & Refreshments',
    tasks: [
      { id: 9, name: 'Meal Distribution Coordination', slots: 4 },
      { id: 10, name: 'Snack Station Management', slots: 2 },
      { id: 11, name: 'Dietary Restrictions Support', slots: 2 }
    ]
  },
  {
    name: 'Post-Event',
    tasks: [
      { id: 12, name: 'Venue Cleanup', slots: 6 },
      { id: 13, name: 'Equipment Teardown', slots: 4 },
      { id: 14, name: 'Lost & Found Management', slots: 2 }
    ]
  }
];

export default function Volunteer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    availability: [],
    selectedTasks: []
  });

  const [volunteers, setVolunteers] = useState({});

  useEffect(() => {
    // In a real app, fetch current volunteer data
    // For now, using mock data
    const mockVolunteers = {};
    categories.forEach(category => {
      category.tasks.forEach(task => {
        mockVolunteers[task.id] = [];
      });
    });
    setVolunteers(mockVolunteers);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // In a real app, send to backend
    console.log('Volunteer signup:', formData);
    alert('Thank you for volunteering! We will contact you soon.');
  };

  const toggleTask = (taskId) => {
    setFormData(prev => ({
      ...prev,
      selectedTasks: prev.selectedTasks.includes(taskId)
        ? prev.selectedTasks.filter(id => id !== taskId)
        : [...prev.selectedTasks, taskId]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Volunteer Sign-up
          </h2>
          <p className="text-xl text-gray-600">
            Join our team and help make the hackathon a success!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Categories */}
          <div className="lg:col-span-2 space-y-6">
            {categories.map((category, idx) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                  <h3 className="text-xl font-semibold text-white">
                    {category.name}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {category.tasks.map(task => {
                      const signedUp = volunteers[task.id]?.length || 0;
                      const available = task.slots - signedUp;
                      
                      return (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <input
                              type="checkbox"
                              checked={formData.selectedTasks.includes(task.id)}
                              onChange={() => toggleTask(task.id)}
                              disabled={available === 0 && !formData.selectedTasks.includes(task.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{task.name}</p>
                              <p className="text-sm text-gray-500">
                                {available} spot{available !== 1 ? 's' : ''} available
                              </p>
                            </div>
                          </div>
                          <div className="text-sm font-medium text-gray-500">
                            {signedUp}/{task.slots} filled
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Signup Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold mb-6">Your Information</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Availability
                </label>
                <div className="mt-2 space-y-2">
                  {['Setup Day', 'Day 1', 'Day 2', 'Day 3', 'Cleanup Day'].map(day => (
                    <label key={day} className="inline-flex items-center mr-4">
                      <input
                        type="checkbox"
                        value={day}
                        checked={formData.availability.includes(day)}
                        onChange={(e) => {
                          const newAvailability = e.target.checked
                            ? [...formData.availability, day]
                            : formData.availability.filter(d => d !== day);
                          setFormData({ ...formData, availability: newAvailability });
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={formData.selectedTasks.length === 0}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Sign Up to Volunteer
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}