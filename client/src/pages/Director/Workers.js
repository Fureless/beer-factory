import React, {useState, useContext, useEffect} from 'react'
import {AuthContext} from "../../context/AuthContext"
import {useMessage} from "../../hooks/message.hook"
import {useHttp} from "../../hooks/http.hook"
import M from 'materialize-css'

export const Workers = () => {
    const [workers, setWorkers] = useState(false)
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        login: '',
        password: '',
        email: '',
        phone: '',
        salary: ''
    })

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const workersData = await request('/api/workers', 'GET', null, {Authorization: `Bearer ${auth.token}`})
                setWorkers(workersData.result)
                // TODO А ЕСЛИ НЕТ РАБОТНИКОВ?
            } catch (e) {}
        }
        fetchData().then() // TODO WHAT?
    }, [request, auth.token])

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

    useEffect(() => {
        const elems = document.querySelectorAll('.modal')
        M.Modal.init(elems, {})
        // options : {startingTop: '70%'})
        // M.AutoInit()
    }, [])

    // TODO НЕ РЕНДЕРИТЬ ДИРЕКТОРА
    return (
        <div>
            <div className="row" style={{marginTop: '3rem'}}>
                <div className="col s8">
                    <div className="row">
                        {workers && workers.map((worker, index) => (
                            <div key={index} className='col s6 show-container'>
                                <div className="card grow" style={{marginTop: '3rem'}}>
                                    <div className="card-image">
                                        <button
                                            className="btn-floating modal-trigger halfway-fab waves-effect waves-light blue darken-1"
                                            data-target="worker-edit"
                                            disabled={loading}
                                            onClick={() => test(index)}
                                        >
                                            <i className="material-icons">edit</i>
                                        </button>
                                    </div>

                                    <div className="card-content hoverable">
                                        <p>Name: <strong>{worker[2].value}</strong></p>
                                        <p>Number: <strong>{worker[3].value}</strong></p>
                                        <p>Email: <strong>{worker[4].value}</strong></p>
                                        <p>Total price: <strong>{worker[5].value} RUB</strong></p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col s1"/>

                <div className="col s3">
                    <div className="input-field">
                        <i className="material-icons prefix">textsms</i>
                        <input type="text" id="autocomplete-input" className="autocomplete"/>
                        <label htmlFor="autocomplete-input">Autocomplete</label>
                    </div>

                    <label>
                        <input type="checkbox" className="filled-in"/>
                        <span>IsFiltration</span>
                    </label>

                    <button className="btn-large modal-trigger waves-effect waves-light blue darken-1"
                            data-target="registerWorker"
                            type="submit"
                            name="action"
                            style={{marginTop: '5rem'}}
                            disabled={loading}
                    >Register worker
                        <i className="material-icons right">person_add</i>
                    </button>
                </div>

                <div id="worker-edit" className="modal card">
                    <div className="modal-content">
                        {workers && <h1>Hello</h1>}
                    </div>
                </div>

                <div id="registerWorker" className="modal card grey darken-4">
                    <div className="modal-content">
                        <div className="row">
                            <div className="col s6 offset-s3">
                                <span className="card-title">Registration</span>
                                <div className="row">
                                    <form className="col s12">
                                        <div className="row">
                                            <div className="input-field col s6">
                                                <input id="first_name" type="text" name="firstName"
                                                       className="auth-input validate" value={form.firstName}
                                                       onChange={changeHandler}/>
                                                <label htmlFor="first_name">First Name</label>
                                            </div>
                                            <div className="input-field col s6">
                                                <input id="last_name" type="text" name="lastName"
                                                       className="auth-input validate" value={form.lastName}
                                                       onChange={changeHandler}/>
                                                <label htmlFor="last_name">Last Name</label>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="input-field col s12">
                                                <input id="login" type="text" name="login"
                                                       className="auth-input validate" value={form.login}
                                                       onChange={changeHandler}/>
                                                <label htmlFor="login">Login</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <input id="password" type="password" name="password"
                                                       className="auth-input validate" value={form.password}
                                                       onChange={changeHandler}/>
                                                <label htmlFor="password">Password</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <input id="email" type="email" name="email"
                                                       className="auth-input validate" value={form.email}
                                                       onChange={changeHandler}/>
                                                <label htmlFor="email">Email</label>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="input-field col s6">
                                                <input id="phone" type="text" name="phone"
                                                       className="auth-input validate" value={form.phone}
                                                       onChange={changeHandler}/>
                                                <label htmlFor="phone">Phone</label>
                                            </div>
                                            <div className="input-field col s6">
                                                <input id="salary" type="text" name="salary"
                                                       className="auth-input validate" value={form.salary}
                                                       onChange={changeHandler}/>
                                                <label htmlFor="salary">Salary</label>
                                            </div>
                                        </div>

                                        <button
                                            className="btn grey lighten-1 black-text"
                                            onClick={registerHandler}
                                            disabled={loading}
                                        >Register
                                        </button>
                                        {/*<a className="modal-close waves-effect waves-teal btn-flat">Close</a>*/}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
