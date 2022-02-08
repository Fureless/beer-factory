import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'

// Common
import {AuthPage} from './pages/AuthPage'
import {RegistrationPage} from './pages/RegistrationPage'

// Director
import {Workers} from './pages/Director/Workers'

// User
import {Catalog} from './pages/User/Catalog'
import {Orders} from './pages/User/Orders'
import {Profile} from './pages/User/Profile'

// TODO УБРАТЬ РАЗДЕЛЕНИЕ ПО ДОЛЖНОСТЯМ
export const useRoutes = (isAuthenticated, pos) => {
    if (isAuthenticated && pos === 'director') { // Можно оставить только position
        return (
            <Routes>
                <Route path="/catalog" element={<Catalog/>}/>
                <Route path="/orders" element={<Orders/>}/>
                <Route path="/workers" element={<Workers/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route
                    path="*"
                    element={<Navigate to="/catalog"/>}
                />
            </Routes>
        )
    } else if (isAuthenticated && pos === 'customer') {
        return (
            <Routes>
                <Route path="/catalog" element={<Catalog/>}/>
                <Route path="/orders" element={<Orders/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route
                    path="*"
                    element={<Navigate to="/catalog"/>}
                />
            </Routes>
        )
    } else if (isAuthenticated && pos === 'worker') {
        return (
            <Routes>
                <Route path="/catalog" element={<Catalog/>}/>
                <Route path="/orders" element={<Orders/>}/>
                <Route path="/profile" element={<Profile/>}/>
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
