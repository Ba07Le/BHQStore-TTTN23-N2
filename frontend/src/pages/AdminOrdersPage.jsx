import React from 'react'
import { AdminOrders } from '../features/admin/components/AdminOrders'
import {Navbar} from '../features/navigation/components/Navbar'
import { Footer } from '../features/footer/Footer'

export const AdminOrdersPage = () => {
  return (
    <>
    <Navbar/>
    <AdminOrders/>
    <Footer/>
    </>
  )
}
