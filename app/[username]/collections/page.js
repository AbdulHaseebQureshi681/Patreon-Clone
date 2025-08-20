import React from 'react'
import DynamicUserMain from '@/components/DynamicUserMain'

const   collections = ({params}) => {
  return (
    <>
    <DynamicUserMain params={params} />
    <div>Collections</div>
    </>
  )
}

export default collections