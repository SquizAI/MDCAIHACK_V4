import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

const participantColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('team', {
    header: 'Team',
    cell: info => info.getValue() || '-',
  }),
  columnHelper.accessor('experience', {
    header: 'Experience',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('created_at', {
    header: 'Registration Date',
    cell: info => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor('actions', {
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <button
          onClick={() => handleEditParticipant(row.original)}
          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => handleDeleteParticipant(row.original.id)}
          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    ),
  }),
];

const volunteerColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('phone', {
    header: 'Phone',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('availability', {
    header: 'Availability',
    cell: info => info.getValue()?.join(', ') || '-',
  }),
  columnHelper.accessor('actions', {
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <button
          onClick={() => handleEditVolunteer(row.original)}
          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => handleAssignTasks(row.original)}
          className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
        >
          Assign Tasks
        </button>
        <button
          onClick={() => handleDeleteVolunteer(row.original.id)}
          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    ),
  }),
];

const taskColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: 'Task Name',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('time', {
    header: 'Time',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('location', {
    header: 'Location',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('assigned_to', {
    header: 'Assigned To',
    cell: info => info.getValue()?.name || 'Unassigned',
  }),
  columnHelper.accessor('actions', {
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <button
          onClick={() => handleEditTask(row.original)}
          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => handleDeleteTask(row.original.id)}
          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    ),
  }),
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('participants');
  const [participants, setParticipants] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        { data: participantsData },
        { data: volunteersData },
        { data: tasksData },
        { data: teamsData },
        { data: welcomeData }
      ] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('type', 'participant'),
        supabase
          .from('profiles')
          .select('*')
          .eq('type', 'volunteer'),
        supabase
          .from('volunteer_tasks')
          .select('*, profiles(name)'),
        supabase
          .from('teams')
          .select('*, profiles(name, email)'),
        supabase
          .from('welcome_message')
          .select('*')
          .single()
      ]);

      setParticipants(participantsData || []);
      setVolunteers(volunteersData || []);
      setTasks(tasksData || []);
      setTeams(teamsData || []);
      setWelcomeMessage(welcomeData?.message || '');
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditParticipant = (participant) => {
    setEditingItem(participant);
    setModalType('participant');
    setIsModalOpen(true);
  };

  const handleEditVolunteer = (volunteer) => {
    setEditingItem(volunteer);
    setModalType('volunteer');
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingItem(task);
    setModalType('task');
    setIsModalOpen(true);
  };

  const handleAssignTasks = (volunteer) => {
    setEditingItem(volunteer);
    setModalType('assignTasks');
    setIsModalOpen(true);
  };

  const handleDeleteParticipant = async (id) => {
    if (window.confirm('Are you sure you want to delete this participant?')) {
      try {
        await supabase
          .from('profiles')
          .delete()
          .eq('id', id);
        fetchData();
      } catch (error) {
        console.error('Error deleting participant:', error);
      }
    }
  };

  const handleDeleteVolunteer = async (id) => {
    if (window.confirm('Are you sure you want to delete this volunteer?')) {
      try {
        await supabase
          .from('profiles')
          .delete()
          .eq('id', id);
        fetchData();
      } catch (error) {
        console.error('Error deleting volunteer:', error);
      }
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await supabase
          .from('volunteer_tasks')
          .delete()
          .eq('id', id);
        fetchData();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const updateWelcomeMessage = async () => {
    try {
      await supabase
        .from('welcome_message')
        .upsert({ message: welcomeMessage });
      alert('Welcome message updated successfully!');
    } catch (error) {
      console.error('Error updating welcome message:', error);
      alert('Failed to update welcome message');
    }
  };

  const participantsTable = useReactTable({
    data: participants,
    columns: participantColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const volunteersTable = useReactTable({
    data: volunteers,
    columns: volunteerColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const tasksTable = useReactTable({
    data: tasks,
    columns: taskColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Message Editor */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Welcome Message</h3>
          <div className="space-y-4">
            <textarea
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              className="w-full h-32 p-2 border rounded-md"
              placeholder="Enter welcome message..."
            />
            <button
              onClick={updateWelcomeMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Message
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('participants')}
              className={`${
                activeTab === 'participants'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
            >
              Participants
            </button>
            <button
              onClick={() => setActiveTab('volunteers')}
              className={`${
                activeTab === 'volunteers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
            >
              Volunteers
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`${
                activeTab === 'teams'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
            >
              Teams
            </button>
          </nav>
        </div>

        {/* Content Panels */}
        {activeTab === 'participants' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Participants Management
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Total Participants: {participants.length}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setModalType('participant');
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Participant
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  {participantsTable.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participantsTable.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'volunteers' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Volunteers Management
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Total Volunteers: {volunteers.length}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setModalType('volunteer');
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Volunteer
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  {volunteersTable.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {volunteersTable.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Tasks Management
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Total Tasks: {tasks.length}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setModalType('task');
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Task
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  {tasksTable.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasksTable.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Teams Management
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Total Teams: {teams.length}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setModalType('team');
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Team
              </button>
            </div>
            <div className="border-t border-gray-200">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-4">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-medium text-gray-900">{team.name}</h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditTeam(team)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTeam(team.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Members: {team.profiles?.length || 0}</p>
                    <ul className="mt-2 space-y-1">
                      {team.profiles?.map((member) => (
                        <li key={member.email} className="text-sm text-gray-600">
                          {member.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <EditModal
          type={modalType}
          item={editingItem}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onSave={async (data) => {
            try {
              if (modalType === 'participant') {
                await handleSaveParticipant(data);
              } else if (modalType === 'volunteer') {
                await handleSaveVolunteer(data);
              } else if (modalType === 'task') {
                await handleSaveTask(data);
              } else if (modalType === 'team') {
                await handleSaveTeam(data);
              }
              setIsModalOpen(false);
              setEditingItem(null);
              fetchData();
            } catch (error) {
              console.error('Error saving:', error);
              alert('Failed to save changes');
            }
          }}
        />
      )}
    </div>
  );
}