import React, { PropsWithChildren } from 'react'

const layoutAttendant = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex items-center justify-center h-screen w-screen'>
      {children}
    </div>
  )
}

export default layoutAttendant
