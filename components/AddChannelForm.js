"use client"
import React, { useState , useEffect} from 'react'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/input'
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'

import {
    Command,
    CommandInput,
    CommandList,
    CommandItem,
    CommandSeparator,
} from "@/components/ui/command"
import { useChannelsStore } from '@/store/channels'

const AddChannelForm = ({className, onClose}) => {
  const { data: session } = useSession()
  const { users, getAllUsers, createChannel, error } = useChannelsStore()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [showMembersList, setShowMembersList] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState([]) // Array of selected user objects
  const [submitError, setSubmitError] = useState(null)
  
  const currentUserId = session?.user?.id || session?.user?._id
  
  const onSubmit = async (data) => {
    try {
      setSubmitError(null); // Clear any previous errors
      
      // Generate a valid channel ID - only letters, numbers, and "!-_" allowed
      const sanitizedName = data.channelName
        .toLowerCase()
        .replace(/[^a-z0-9\-_!]/g, '-') // Replace invalid chars with dash
        .replace(/-+/g, '-') // Replace multiple dashes with single dash
        .replace(/^-|-$/g, ''); // Remove leading/trailing dashes
      
      const channelId = `${sanitizedName}-${Date.now()}`;
      
      // Include selected member IDs + current user ID automatically
      const formDataWithMembers = {
        channelName: data.channelName,
        channelDescription: data.channelDescription,
        channelType: "team", // Use team type for better permissions
        channelId: channelId, // Use sanitized ID
        members: [currentUserId, ...selectedMembers.map(member => member._id)], // Include current user + selected members
        channelData: {
          description: data.channelDescription
        }
      };
      console.log('Form data with member IDs (including current user):', formDataWithMembers);
      console.log(formDataWithMembers);

      // Call the store function to create the channel
      await createChannel(formDataWithMembers);
      
      console.log('Channel created successfully!');

      reset();
      setSelectedMembers([]); // Clear selected members
      if (onClose) onClose(); // Close modal after submission
    } catch (error) {
      console.error('Error creating channel:', error);
      setSubmitError(error.message || 'Failed to create channel');
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  }

  const handleSelectMember = (user) => {
    console.log('Selecting user:', user); // Debug log
    // Check if user is already selected
    const isAlreadySelected = selectedMembers.some(member => member._id === user._id);
    
    if (!isAlreadySelected) {
      setSelectedMembers(prev => {
        const newSelected = [...prev, user];
        console.log('New selected members:', newSelected); // Debug log
        return newSelected;
      });
    }
    setSearchQuery(''); // Clear search after selection
    setShowMembersList(false); // Hide list after selection
  }

  const handleRemoveMember = (userId) => {
    setSelectedMembers(prev => prev.filter(member => member._id !== userId));
  }
  
useEffect(() => {
  fetchUsers();
}, []);

const fetchUsers = async () => {
  setLoading(true);
  try {
    await getAllUsers();
  } catch (error) {
    console.error('Failed to fetch users:', error);
  } finally {
    setLoading(false);
  }
};
  
  return (
    <div 
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${className}`}
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg mx-auto" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit(onSubmit)} className='bg-white shadow-2xl rounded-xl p-6 space-y-6'>
          {/* Close button */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Create New Channel</h2>
            <button 
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl leading-none p-1 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>
          
          <div className='space-y-2'>
            <Label htmlFor='channelName' className="text-sm font-medium text-gray-700">Channel Name</Label>
            <Input
              {...register('channelName', { required: 'Channel name is required' })}
              id='channelName'
              placeholder='Enter channel name'
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
            />
            {errors.channelName && (
              <p className='text-red-500 text-sm mt-1'>{errors.channelName.message}</p>
            )}
          </div>
          
          <div className='space-y-2'>
            <Label htmlFor='channelDescription' className="text-sm font-medium text-gray-700">Channel Description</Label>
            <Input
              {...register('channelDescription')}
              id='channelDescription'
              placeholder='Enter channel description (optional)'
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
            />
          </div>
          
          <div className='space-y-2 relative'>
            <Label htmlFor='members' className="text-sm font-medium text-gray-700">Select Members</Label>
            
            {/* Show selected members */}
            {selectedMembers.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedMembers.map(member => (
                  <div key={member._id} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm border border-blue-200">
                    {member.profileImage && (
                      <img src={member.profileImage} alt="" className="w-5 h-5 rounded-full" />
                    )}
                    <span className="font-medium">{member.name || member.username}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member._id)}
                      className="ml-1 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center text-xs transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Custom search input with dropdown */}
            <div className="relative">
              <Input
                placeholder="Search and select members..."
                value={searchQuery}
                onFocus={() => setShowMembersList(true)}
                onBlur={() => setTimeout(() => setShowMembersList(false), 300)}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                  setShowMembersList(value.length > 0);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
              />
              {showMembersList && searchQuery.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-20 max-h-48 overflow-y-auto mt-1">
                  {loading ? (
                    <div className="p-3 text-gray-500 text-center">Loading users...</div>
                  ) : (users || []).length === 0 ? (
                    <div className="p-3 text-gray-500 text-center">No users found</div>
                  ) : (
                    (users || [])
                      .filter(user => 
                        // Exclude current user from the list
                        user._id !== currentUserId &&
                        // Filter by search query
                        (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.username?.toLowerCase().includes(searchQuery.toLowerCase())) &&
                        // Exclude already selected users
                        !selectedMembers.some(selected => selected._id === user._id)
                      )
                      .map(user => (
                        <div
                          key={user._id}
                          onClick={() => handleSelectMember(user)}
                          onMouseDown={(e) => e.preventDefault()}
                          className="p-3 cursor-pointer hover:bg-blue-50 flex items-center gap-3 text-gray-800 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          {user.profileImage && (
                            <img src={user.profileImage} alt="" className="w-8 h-8 rounded-full border border-gray-200" />
                          )}
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{user.name || user.username}</span>
                            {user.email && (
                              <span className="text-xs text-gray-500">{user.email}</span>
                            )}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Error display */}
          {(submitError || error) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
              {submitError || error}
            </div>
          )}
          
          <div className='pt-4 border-t border-gray-100'>
            <Button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              Create Channel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddChannelForm
