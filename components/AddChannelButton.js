import React from 'react'
import { Button } from '@/components/ui/button'
const AddChannelButton = ({onAddChannel}) => {
  return (
    <div>
      <Button onClick={onAddChannel}>Add Channel</Button>
    </div>
  )
}

export default AddChannelButton
