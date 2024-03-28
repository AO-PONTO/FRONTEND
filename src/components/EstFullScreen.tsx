import React from 'react'

interface propsFullScreen {
    children: React.ReactNode
}

const FullScreen = (props:propsFullScreen) => {
  return (
    <div className="flex justify-center items-center max-w-full max-h-full w-full h-screen overflow-hidden bg-bgApp">{props.children}</div>
  )
}

export default FullScreen