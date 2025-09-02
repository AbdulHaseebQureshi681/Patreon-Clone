"use client"
import React from 'react'
import AddChannelForm from '@/components/AddChannelForm'

const page = () => {
  const handleChannelSubmit = (data) => {
    console.log('Channel data received:', data);
    // Handle the form submission here
  }

  return (
    <div>
      <AddChannelForm onSubmit={handleChannelSubmit} />
    </div>
  )
}

export default page
