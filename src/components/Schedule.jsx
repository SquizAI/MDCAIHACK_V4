import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScheduleAccordion = ({ day, isOpen, onToggle }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-colors"
      >
        <h3 className="text-xl font-semibold text-white">{day.title}</h3>
        <svg
          className={`w-6 h-6 transform transition-transform duration-200 text-white ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-white">
              {day.content.map((section, idx) => (
                <div key={idx} className="mb-8 last:mb-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 md:mb-0">
                      {section.title}
                    </h4>
                  </div>
                  
                  <div className="space-y-6">
                    {section.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                      >
                        <h5 className="text-md font-medium text-blue-800 mb-2">
                          {item.subtitle}
                        </h5>
                        <p className="text-gray-600 mb-3">{item.description}</p>
                        <ul className="space-y-2">
                          {item.details.map((detail, detailIdx) => (
                            <li
                              key={detailIdx}
                              className="flex items-start text-gray-600"
                            >
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                              <span className="flex-1">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Schedule() {
  const [openDays, setOpenDays] = useState(['day1']);

  const toggleDay = (dayId) => {
    setOpenDays((current) =>
      current.includes(dayId)
        ? current.filter((id) => id !== dayId)
        : [...current, dayId]
    );
  };

  const scheduleData = {
    day1: {
      title: "Day 1: December 6 - Kickoff & Ideation",
      content: [
        {
          title: "Registration & Setup (3:00 PM - 5:00 PM)",
          items: [
            {
              subtitle: "Check-in & Welcome",
              description: "Get your badges, swag bags, and find your workspace",
              details: [
                "Team registration confirmation",
                "Welcome packet distribution",
                "Workspace assignment"
              ]
            }
          ]
        },
        {
          title: "Design Thinking Course (5:00 PM - 6:00 PM)",
          items: [
            {
              subtitle: "Interactive Workshop",
              description: "Learn essential design thinking principles and methodologies",
              details: [
                "Problem identification techniques",
                "User-centered design approaches",
                "Rapid prototyping methods"
              ]
            }
          ]
        },
        {
          title: "Technical Diagramming (6:00 PM - 7:00 PM)",
          items: [
            {
              subtitle: "Technical Workshop",
              description: "Master the art of technical documentation and system design",
              details: [
                "System architecture design",
                "Database schema planning",
                "API documentation best practices"
              ]
            }
          ]
        },
        {
          title: "Team Working Session (7:00 PM - 9:00 PM)",
          items: [
            {
              subtitle: "Project Kickoff",
              description: "Begin your project with your team",
              details: [
                "Team strategy planning",
                "Initial project setup",
                "Mentor consultations available"
              ]
            }
          ]
        }
      ]
    },
    day2: {
      title: "Day 2: December 7 - Development & Implementation",
      content: [
        {
          title: "Full Day Hacking (9:00 AM - 9:00 PM)",
          items: [
            {
              subtitle: "Hacking with Professional Support",
              description: "Intensive development day with industry professionals",
              details: [
                "One-on-one mentoring sessions",
                "Technical workshops throughout the day",
                "Professional networking opportunities"
              ]
            },
            {
              subtitle: "Meals & Breaks",
              description: "Keep your energy up with provided meals",
              details: [
                "Breakfast (9:00 AM - 10:00 AM)",
                "Lunch (12:30 PM - 1:30 PM)",
                "Dinner (6:00 PM - 7:00 PM)",
                "Snacks available throughout the day"
              ]
            }
          ]
        }
      ]
    },
    day3: {
      title: "Day 3: December 8 - Finalization & Awards",
      content: [
        {
          title: "Morning Hacking (9:00 AM - 12:00 PM)",
          items: [
            {
              subtitle: "Final Development Sprint",
              description: "Last push with professional support",
              details: [
                "Project finalization",
                "Presentation preparation",
                "Technical documentation completion"
              ]
            }
          ]
        },
        {
          title: "Judging & Lunch (12:00 PM - 2:00 PM)",
          items: [
            {
              subtitle: "Project Evaluation",
              description: "Present your project to our panel of judges",
              details: [
                "Project demonstrations",
                "Technical Q&A sessions",
                "Catered lunch provided"
              ]
            }
          ]
        },
        {
          title: "Guest Speakers (2:00 PM - 3:00 PM)",
          items: [
            {
              subtitle: "Industry Insights",
              description: "Learn from industry leaders",
              details: [
                "Innovation in technology",
                "Career opportunities",
                "Future of AI and technology"
              ]
            }
          ]
        },
        {
          title: "Awards Ceremony (3:00 PM - 4:00 PM)",
          items: [
            {
              subtitle: "Celebration & Recognition",
              description: "Recognize outstanding achievements",
              details: [
                "Project awards presentation",
                "Special recognition categories",
                "Closing remarks and networking"
              ]
            }
          ]
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Event Schedule</h2>
          <p className="text-lg text-gray-600">
            All meals and refreshments are provided throughout the event at the AI Center
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {Object.entries(scheduleData).map(([dayId, day]) => (
            <ScheduleAccordion
              key={dayId}
              day={day}
              isOpen={openDays.includes(dayId)}
              onToggle={() => toggleDay(dayId)}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}