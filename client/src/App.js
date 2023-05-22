import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {AuthContext} from './context/AuthContext'
import {useRoutes} from './routes'
import {useAuth} from './hooks/auth.hook'
import {Navbar} from './components/Navbar'
import {Loader} from './components/Loader'
import 'materialize-css'

// TODO РАЗДЕЛИТЬ TEDIOUS
// TODO СДЕЛАТЬ ОДИНАКОВЫЙ ОТСТУП ОТ NAVBAR НА ВСЕХ СТРАНИЦАХ
// TODO ПОПРОБОВАТЬ ВЫДЕЛИТЬ ПОВТОРЯЮЩИЕСЯ КОМПОНЕНТЫ НА СТРАНИЦАХ И ВЫНЕСТИ ИХ
// TODO СДЕЛАТЬ ДРУГОЙ DATEPICKER
// TODO ПРОВЕРИТЬ ПРАВИЛЬНОСТЬ НАЗВАНИЙ ФАЙЛОВ
// TODO ДОБАВИТЬ ХЕШИРОВАНИЕ ПАРОЛЕЙ
// TODO ХРАНИТЬ ИЗОБРАЖЕНИЕ В БАЗЕ ДАННЫХ ИЛИ НА СЕРВЕРЕ
function App() {
    const {token, login, logout, userId, userPosition, ready} = useAuth()
    const isAuthenticated = !!token
    const routes = useRoutes(isAuthenticated, userPosition)

    if (!ready) {
        return <Loader/>
    }

    return ( // TODO ПРОВЕРИТЬ WARNING
        <AuthContext.Provider value={{
            token, login, logout, userId, isAuthenticated, userPosition
        }}>
            <Router>
                {isAuthenticated && <Navbar position={userPosition}/>}
                <div className="container">
                    {routes}
                </div>
            </Router>
        </AuthContext.Provider>
    )
}

export default App

// 09.02.2022
// Commit message
//
// 11.
// 12.
// 13.
// 14.
// 15.
