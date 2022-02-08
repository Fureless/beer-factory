import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'

import {AuthPage} from './pages/AuthPage'
import {RegistrationPage} from './pages/RegistrationPage'

import {Catalog as DirectorCatalog} from './pages/Director/Catalog'
import {Orders as DirectorOrders} from './pages/Director/Orders'
import {Workers as DirectorWorkers} from './pages/Director/Workers'

import {Catalog as CustomerCatalog} from './pages/Customer/Catalog'
import {Orders as CustomerOrders } from './pages/Customer/Orders'
import {Profile as CustomerProfile} from './pages/Customer/Profile'

import {Catalog as WorkerCatalog} from './pages/Worker/Catalog'
import {Orders as WorkerOrders} from './pages/Worker/Orders'
import {Profile as WorkerProfile} from './pages/Worker/Profile'

export const useRoutes = (isAuthenticated, pos) => {
    if (isAuthenticated && pos === 'director') { // Можно оставить только position
        return (
            <Routes>
                <Route path="/catalog" element={<DirectorCatalog/>}/>
                <Route path="/orders" element={<DirectorOrders/>}/>
                <Route path="/workers" element={<DirectorWorkers/>}/>
                <Route path="/profile" element={<WorkerProfile/>}/>
                <Route
                    path="*"
                    element={<Navigate to="/catalog"/>}
                />
            </Routes>
        )
    } else if (isAuthenticated && pos === 'customer') {
        return (
            <Routes>
                <Route path="/catalog" element={<CustomerCatalog/>}/>
                <Route path="/orders" element={<CustomerOrders/>}/>
                <Route path="/profile" element={<CustomerProfile/>}/>
                <Route
                    path="*"
                    element={<Navigate to="/catalog"/>}
                />
            </Routes>
        )
    } else if (isAuthenticated && pos === 'worker') {
        return (
            <Routes>
                <Route path="/catalog" element={<WorkerCatalog/>}/>
                <Route path="/orders" element={<WorkerOrders/>}/>
                <Route path="/profile" element={<WorkerProfile/>}/>
                <Route
                    path="*"
                    element={<Navigate to="/catalog"/>}
                />
            </Routes>
        )
    }

    return (
        <Routes>
            <Route path="/auth" element={<AuthPage/>}/>
            <Route path="/registration" element={<RegistrationPage/>}/>
            <Route
                path="*"
                element={<Navigate to="/auth"/>}
            />
        </Routes>
    )
}
