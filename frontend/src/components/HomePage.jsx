import React from 'react'
import Sidebar from './Sidebar'
import MessageContainer from './MessageContainer'
import { useSelector } from 'react-redux'

const HomePage = () => {
  const { selectedUser } = useSelector(store => store.user);

  return (
    <div className='flex w-full h-screen md:h-[550px] md:rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
      {/* Sidebar: full screen on mobile when no user selected, always visible on md+ */}
      <div className={`${selectedUser ? 'hidden' : 'flex'} md:flex w-full md:w-auto flex-shrink-0`}>
        <Sidebar />
      </div>
      {/* MessageContainer: full screen on mobile when user selected, always visible on md+ */}
      <div className={`${selectedUser ? 'flex' : 'hidden'} md:flex flex-1 min-w-0`}>
        <MessageContainer />
      </div>
    </div>
  )
}

export default HomePage
