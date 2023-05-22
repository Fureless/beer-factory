import React, {useState, useEffect} from 'react'
import {useMessage} from '../hooks/message.hook'
import {useHttp} from '../hooks/http.hook'

export const RegistrationPage = () => {
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        login: '',
        password: '',
        email: '',
        phone: '',
        date: ''
    })

    // МОЖНО ВЫВОДИТЬ КОНКРЕТНУЮ ОШИБКУ
    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    // ПОЧЕМУ ТОЛЬКО ИМЯ
    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form})
            message(data.message)
        } catch (e) {
        }
    }

    // TODO Сделать двухэтапную  регистрацию
    // Сначала пользователь вводит логин и пароль, а потом уже остальное
    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1 className='logo'>BeerFactory</h1>
                <div className="card grey darken-4">
                    <div className="card-content white-text">
                        <span className="card-title">Registration</span>


                        <div className="row">
                            <form className="col s12">
                                <div className="row">
                                    <div className="input-field col s6">
                                        <input id="first_name" type="text" name="firstName" className="auth-input validate" value={form.firstName} onChange={changeHandler}/>
                                        <label htmlFor="first_name">First Name</label>
                                    </div>
                                    <div className="input-field col s6">
                                        <input id="last_name" type="text" name="lastName" className="auth-input validate" value={form.lastName} onChange={changeHandler}/>
                                        <label htmlFor="last_name">Last Name</label>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="input-field col s12">
                                        <input id="login" type="text" name="login" className="auth-input validate" value={form.login} onChange={changeHandler}/>
                                        <label htmlFor="login">Login</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input id="password" type="password" name="password" className="auth-input validate" value={form.password} onChange={changeHandler}/>
                                        <label htmlFor="password">Password</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input id="email" type="email" name="email" className="auth-input validate" value={form.email} onChange={changeHandler}/>
                                        <label htmlFor="email">Email</label>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="input-field col s6">
                                        <input id="phone" type="text" name="phone" className="auth-input validate" value={form.phone} onChange={changeHandler}/>
                                        <label htmlFor="phone">Phone</label>
                                    </div>
                                    <div className="input-field col s6">
                                        <input id="date" type="date" name="date" className="auth-input validate" value={form.date} onChange={changeHandler}/>
                                        <label htmlFor="date">Age</label>
                                    </div>
                                </div>

                                <button
                                    className="btn yellow darken-4"
                                    onClick={registerHandler}
                                    disabled={loading}
                                >Register
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
