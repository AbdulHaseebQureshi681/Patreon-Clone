import React from 'react'
import DynamicUserMain from '@/components/DynamicUserMain'

const about = ({params}) => {
  return (
    <>
    <DynamicUserMain params={params} />
    <div>About</div>
    </>
  )
}

export default about