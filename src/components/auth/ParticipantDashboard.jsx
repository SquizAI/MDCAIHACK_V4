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

export default function ParticipantDashboard() {
  const { user } = useAuth();
  const [participant, setParticipant] = useState(null);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchParticipantData(user.id);
    }
  }, [user]);

  const fetchParticipantData = async (userId) => {
    try {
      // Fetch participant profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setParticipant(profileData);

      // Fetch team data
      const { data: teamMemberData, error: teamError } = await supabase
        .from('team_members')
        .select(`
          teams (
            id,
            name,
            created_by,
            max_members
          ),
          profiles (
            name,
            email
          )
        `)
        .eq('registration_id', userId)
        .single();

      if (!teamError && teamMemberData) {
        const { data: teamMembersData } = await supabase
          .from('team_members')
          .select(`
            profiles (
              name,
              email
            )
          `)
          .eq('team_id', teamMemberData.teams.id);

        setTeam({
          ...teamMemberData.teams,
          members: teamMembersData.map(tm => tm.profiles)
        });
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
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
          <h2 className="text-3xl font-bold mb-4">Welcome back, {participant?.name}</h2>
          <p className="text-blue-200">Your next hackathon adventure awaits!</p>
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
                <dd className="mt-1">{participant?.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-blue-200">Phone</dt>
                <dd className="mt-1">{participant?.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-blue-200">Experience Level</dt>
                <dd className="mt-1">{participant?.experience}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-blue-200">Skills</dt>
                <dd className="mt-1">{participant?.skills}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-blue-200">T-Shirt Size</dt>
                <dd className="mt-1">{participant?.tshirt}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-blue-200">Dietary Restrictions</dt>
                <dd className="mt-1">{participant?.dietary || 'None'}</dd>
              </div>
            </dl>
          </motion.div>

          {/* Team Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 text-white lg:col-span-2"
          >
            <h3 className="text-xl font-semibold mb-4">Your Team</h3>
            {team ? (
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="text-lg font-medium mb-2">{team.name}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {team.members.map((member) => (
                      <div
                        key={member.email}
                        className="bg-white/5 rounded-lg p-3 backdrop-blur-sm"
                      >
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-blue-200">{member.email}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-blue-200">No team assigned yet. Create or join a team to get started!</p>
              </div>
            )}
          </motion.div>

          {/* Schedule Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 text-white lg:col-span-2"
          >
            <h3 className="text-xl font-semibold mb-4">Event Schedule</h3>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-lg font-medium mb-2">Day 1 - December 6</h4>
                <ul className="space-y-2 text-blue-200">
                  <li>3:00 PM - Check-in & Registration</li>
                  <li>5:00 PM - Design Thinking Workshop</li>
                  <li>6:00 PM - Technical Workshop</li>
                  <li>7:00 PM - Team Formation</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-lg font-medium mb-2">Day 2 - December 7</h4>
                <ul className="space-y-2 text-blue-200">
                  <li>9:00 AM - Breakfast</li>
                  <li>10:00 AM - Hacking Begins</li>
                  <li>12:30 PM - Lunch Break</li>
                  <li>6:00 PM - Dinner</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-lg font-medium mb-2">Day 3 - December 8</h4>
                <ul className="space-y-2 text-blue-200">
                  <li>9:00 AM - Final Sprint</li>
                  <li>12:00 PM - Project Submission</li>
                  <li>2:00 PM - Presentations</li>
                  <li>3:00 PM - Awards Ceremony</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Resources Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 text-white"
          >
            <h3 className="text-xl font-semibold mb-4">Resources</h3>
            <div className="space-y-3">
              <a
                href="#"
                className="block p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <h4 className="font-medium">API Documentation</h4>
                <p className="text-sm text-blue-200">Access technical resources</p>
              </a>
              <a
                href="#"
                className="block p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <h4 className="font-medium">Workshop Materials</h4>
                <p className="text-sm text-blue-200">Download presentation slides</p>
              </a>
              <a
                href="#"
                className="block p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <h4 className="font-medium">Help Desk</h4>
                <p className="text-sm text-blue-200">Get technical support</p>
              </a>
              <a
                href="#"
                className="block p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <h4 className="font-medium">Rules & Guidelines</h4>
                <p className="text-sm text-blue-200">Review competition rules</p>
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}