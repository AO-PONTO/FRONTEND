import React from 'react'

interface propsContainer {
  children: React.ReactNode
  size?: 'small' | 'medium' | 'big' | 'giant'
  padding?: 'minimaly' | 'small' | 'medium' | 'big' | 'giant' | 'none'
  border?: 'light' | 'normal' | 'bold' | 'none'
  shadow?: 'center' | 'classic' | 'expansive'
  rounded?: 'small' | 'medium' | 'big'
  scroll?: boolean
  fullHeight?: boolean
}

const Container = (props: propsContainer) => {
  return (
    <div
      className={`${
        props.size && props.size === 'small'
          ? 'w-small'
          : props.size === 'medium'
            ? 'w-medium'
            : props.size === 'big'
              ? 'w-big'
              : props.size === 'giant'
                ? 'w-giant'
                : 'w-full'
      } mx-4 max-w-[calc(100%-32px)] 
      ${props.fullHeight && 'h-full'}`}
    >
      <div
        className={`bg-white ${
          props.padding && props.padding === 'minimaly'
            ? 'p-2'
            : props.padding === 'small'
              ? 'p-4'
              : props.padding === 'medium'
                ? 'p-6'
                : props.padding === 'big'
                  ? 'p-10'
                  : props.padding === 'giant'
                    ? 'p-14'
                    : props.padding === 'none'
                      ? 'p-0'
                      : 'p-4'
        } ${
          props.border && props.border === 'light'
            ? 'border'
            : props.border === 'normal'
              ? 'border border-gray-300'
              : props.border === 'bold'
                ? 'border border-gray-800'
                : props.border === 'none'
                  ? 'border-none'
                  : 'border border-transparent'
        } ${
          props.shadow && props.shadow === 'center'
            ? 'shadow-center'
            : props.shadow === 'classic'
              ? 'shadow-classic'
              : props.shadow === 'expansive'
                ? 'shadow-expansive'
                : 'shadow-none'
        } ${
          props.rounded && props.rounded === 'small'
            ? 'rounded-lg'
            : props.rounded === 'medium'
              ? 'rounded-2xl'
              : props.rounded === 'big'
                ? 'rounded-3xl'
                : 'rounded-none'
        } w-full flex flex-wrap
        ${props.scroll ? 'max-h-[80vh] overflow-y-auto' : ''} 
        ${props.fullHeight && 'h-full'}`}
      >
        {props.children}
      </div>
    </div>
  )
}

export default Container
