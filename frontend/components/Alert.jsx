import React from 'react'

function Alert({type, message}) {

    const TYPES = {
        success: 'text-green-500 border-green-300 bg-green-200',
        danger: 'text-red-500 border-red-300 bg-red-200',
    }

  return (
    <div className={`${TYPES[type]} p-2 w-full rounded-md`}>{message}</div>
  )
}

export default Alert