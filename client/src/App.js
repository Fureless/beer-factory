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

// 08.02.2022
// Added showing director's orders; catalog and orders cards now have "grow" animation; catalog, orders, profile pages from all users merged into one; bug fixes
//
// 1. Теперь у директора показываются заказы всех пользователей
// 2. Теперь если у пользователя нет заказов страница не ломается
// 3. Страница каталога теперь одна для всех
//      (было 3 разных с небольшимими изменениями,
//      то есть теперь различия между пользователями определяются локально)
// 4. Страница заказов также теперь одна
// 5. И страница профиля аналогично
// 6. Добавлен эффект "подъёма" для карточек каталога и заказов

// 09.02.2022
// Now director can delete an order or select a worker who will do it; worker can change status of own orders; code improved
//
// 7. Добавлена возможность изменения статуса заказа работниками
// 8. Добавлена возможность назначения работника за конкретным заказом
// 9. Добавлена возможность удаления заказа
// 10. Исправлены warning

// Мб дать возможность наоборот назначать заказы работнику?
