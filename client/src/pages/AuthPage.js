import React, {useState, useEffect, useContext} from 'react'
import {NavLink} from "react-router-dom"
import {AuthContext} from '../context/AuthContext'
import {useMessage} from '../hooks/message.hook'
import {useHttp} from '../hooks/http.hook'

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()
    const [form, setForm] = useState({
        login: '',
        password: ''
    })

    // МОЖНО ВЫВОДИТЬ КОНКРЕТНУЮ ОШИБКУ
    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId, data.userPosition)
        } catch (e) {}
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1 className='logo'>BeerFactory</h1>
                <div className="card grey darken-4">
                    <div className="card-content white-text">
                        <span className="card-title">Authorization</span>
                        <div>

                            <div className="input-field">
                                <input
                                    id="login"
                                    type="text"
                                    name="login"
                                    className="auth-input validate"
                                    value={form.login}
                                    onChange={changeHandler}
                                />
                                <label htmlFor="login">Login</label>
                            </div>

                            <div className="input-field">
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    className="auth-input validate"
                                    value={form.password}
                                    onChange={changeHandler}
                                />
                                <label htmlFor="password">Password</label>
                            </div>

                        </div>
                    </div>
                    <div className="card-action">
                        {/*ПЕРЕНЕСТИ В CSS*/}
                        <button
                            className="btn yellow darken-4"
                            style={{marginRight: 10}}
                            onClick={loginHandler}
                            disabled={loading}
                        >Login</button>
                        {/*Мб вместо ссылки кнопку сделать?*/}
                        <NavLink to="/registration">Register</NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}
