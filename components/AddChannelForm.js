"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import {
    Command,
    CommandInput,
    CommandList,
    CommandItem,
    CommandSeparator,
} from "@/components/ui/command"

const AddChannelForm = ({ onSubmit: onSubmitProp, className = '', onClose }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [showMembersList, setShowMembersList] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const onSubmit = (data) => {
    console.log('Form data:', data);
    if (onSubmitProp) {
      onSubmitProp(data);
    }
    reset();
    if (onClose) onClose(); // Close modal after submission
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  }
  
  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <Form onSubmit={handleSubmit(onSubmit)} className='bg-white shadow-lg rounded-lg px-8 pt-6 pb-8'>
          {/* Close button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Create New Channel</h2>
            <button 
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              ×
            </button>
          </div>
          
          <div className='mb-4'>
            <Label htmlFor='channelName'>Channel Name</Label>
            <Input
              {...register('channelName', { required: 'Channel name is required' })}
              id='channelName'
              placeholder='Enter channel name'
            />
            {errors.channelName && (
              <p className='text-red-500 text-sm mt-1'>{errors.channelName.message}</p>
            )}
          </div>
          <div className='mb-4'>
            <Label htmlFor='channelDescription'>Channel Description</Label>
            <Input
              {...register('channelDescription')}
              id='channelDescription'
              placeholder='Enter channel description (optional)'
            />
          </div>
          <div className='mb-6 relative'>
            <Label htmlFor='members'>Select Members</Label>
            <Command>
              <CommandInput 
                placeholder="Search members..." 
                {...register('members')}
                onFocus={() => setShowMembersList(true)}
                onBlur={() => setTimeout(() => setShowMembersList(false), 200)}
                onValueChange={(value) => {
                  setSearchQuery(value)
                  setShowMembersList(value.length > 0)
                }}
              />
              {showMembersList && searchQuery.length > 0 && (
                <CommandList className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-10">
                  <CommandItem value='text'>Text</CommandItem>
                  <CommandItem value='voice'>Voice</CommandItem>
                  <CommandItem value='video'>Video</CommandItem>
                </CommandList>
              )}
            </Command>
          </div>
          <div className='flex items-center justify-between'>
            <Button
              type='submit'
              className='w-full'
            >
              Create Channel
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default AddChannelForm
