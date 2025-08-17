import React from 'react'

const Welcome = ({params}) => {
  return (
    <div className='text-white'>Welcome {params.username.replaceAll("%20", " ")}</div>
  )
}

export default Welcome