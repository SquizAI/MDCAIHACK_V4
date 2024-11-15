import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [volunteer, setVolunteer] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchVolunteerData();
    }
  }, [user]);

  const fetchVolunteerData = async () => {
    try {
      // Fetch volunteer profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setVolunteer(profileData);

      // Fetch volunteer tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('volunteer_tasks')
        .select(`
          id,
          task_id,
          tasks (
            name,
            description,
            time,
            location
          )
        `)
        .eq('registration_id', user.id);

      if (tasksError) throw tasksError;
      setTasks(tasksData.map(t => ({
        id: t.id,
        ...t.tasks
      })));

    } catch (error) {
      console.error('Failed to fetch volunteer data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Welcome Banner */}
        <motion.div
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Welcome back, {volunteer?.name}</h2>
          <p className="text-blue-200">Thank you for volunteering at BUILD THE FUTURE!</p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 text-white"
          >
            <h3 className="text-xl font-semibold mb-4">Your Profile</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-blue-200">Email</dt>
                <dd className="mt-1">{volunteer?.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-blue-200">Phone</dt>
                <dd className="mt-1">{volunteer?.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-blue-200">T-Shirt Size</dt>
                <dd className="mt-1">{volunteer?.tshirt}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-blue-200">Availability</dt>
                <dd className="mt-1">
                  {volunteer?.availability?.join(', ') || 'No availability set'}
                </dd>
              </div>
            </dl>
          </motion.div>

          {/* Tasks Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 text-white lg:col-span-2"
          >
            <h3 className="text-xl font-semibold mb-4">Your Tasks</h3>
            <div className="space-y-4">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-4"
                  >
                    <h4 className="text-lg font-medium mb-2">{task.name}</h4>
                    <p className="text-blue-200 mb-3">{task.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-500/20 rounded-full text-sm">
                        {task.time}
                      </span>
                      <span className="px-3 py-1 bg-purple-500/20 rounded-full text-sm">
                        {task.location}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-blue-200">No tasks assigned yet. Check back soon!</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Schedule Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 text-white lg:col-span-2"
          >
            <h3 className="text-xl font-semibold mb-4">Event Schedule</h3>
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
                <h4 className="text-lg font-medium mb-2">Day 1 - December 6</h4>
                <ul className="space-y-2 text-blue-200">
                  <li>2:00 PM - Volunteer Check-in</li>
                  <li>2:30 PM - Volunteer Briefing</li>
                  <li>3:00 PM - Participant Registration Begins</li>
                  <li>9:00 PM - Day 1 Wrap-up</li>
                </ul>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
                <h4 className="text-lg font-medium mb-2">Day 2 - December 7</h4>
                <ul className="space-y-2 text-blue-200">
                  <li>8:00 AM - Volunteer Check-in</li>
                  <li>8:30 AM - Morning Briefing</li>
                  <li>9:00 AM - Event Support</li>
                  <li>9:00 PM - Day 2 Wrap-up</li>
                </ul>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
                <h4 className="text-lg font-medium mb-2">Day 3 - December 8</h4>
                <ul className="space-y-2 text-blue-200">
                  <li>8:00 AM - Volunteer Check-in</li>
                  <li>8:30 AM - Final Day Briefing</li>
                  <li>9:00 AM - Event Support</li>
                  <li>4:00 PM - Event Conclusion</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Important Info Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 text-white"
          >
            <h3 className="text-xl font-semibold mb-4">Important Information</h3>
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
                <h4 className="font-medium mb-2">Volunteer Guidelines</h4>
                <ul className="space-y-2 text-blue-200">
                  <li>Arrive 15 minutes before your shift</li>
                  <li>Wear your volunteer T-shirt during shifts</li>
                  <li>Check in with coordinator upon arrival</li>
                  <li>Take required breaks as scheduled</li>
                </ul>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
                <h4 className="font-medium mb-2">Emergency Contacts</h4>
                <ul className="space-y-2 text-blue-200">
                  <li>Volunteer Coordinator: (305) 555-0123</li>
                  <li>Event Security: (305) 555-0124</li>
                  <li>Medical Support: (305) 555-0125</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}