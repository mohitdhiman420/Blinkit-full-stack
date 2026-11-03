import React from 'react'
import { useSelector } from 'react-redux'

function AdminPermission({children}) {

     const user = useSelector(state => state.user)

  return (
    <>
        {
            user.role == "admin" ?  children : <p className='text-red-600 bg-red-100 p-4'>Do not have permission</p>
        }
    </>
  )
}

export default AdminPermission
