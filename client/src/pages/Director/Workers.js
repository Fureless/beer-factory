import React, {useState, useContext, useEffect} from 'react'
import {AuthContext} from "../../context/AuthContext"
import {useMessage} from "../../hooks/message.hook"
import {useHttp} from "../../hooks/http.hook"
import M from 'materialize-css'

export const Workers = () => {
    const [workers, setWorkers] = useState(false)
    const [flag, setFlag] = useState(0)
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()
    const [workerOrders, setWorkerOrders] = useState(false)
    const [form, setForm] = useState({
        firstName: ' ',
        lastName: ' ',
        login: ' ',
        password: ' ',
        email: ' ',
        phone: ' ',
        salary: ' ',
        idWorker: '',
        idUser: ''
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
            } catch (e) {
            }
        }
        fetchData().then() // TODO WHAT?
    }, [request, auth.token])

    const changeHandler = event => {
        console.log(event.target.name)
        console.log(event.target.value)
        setForm({...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form})
            message(data.message)
        } catch (e) {
        }
    }


    const deleteHandler = async () => {
        try {
            const data = await request('/api/profile/', 'DELETE', {idWorker: form.idWorker}, {Authorization: `Bearer ${auth.token}`})
            message(data.message)
        } catch (e) {
        }
    }

    const editHandler = async () => {
        try {
            const data = await request('/api/profile/', 'POST', {...form}, {Authorization: `Bearer ${auth.token}`})
            message(data.message)
        } catch (e) {
        }
    }

    const getWorkerOrders = async id => {
        try {
            const data = await request('/api/workers/orders', 'POST', {idWorker: id}, {Authorization: `Bearer ${auth.token}`})
            // console.log(data)
            setWorkerOrders(data.result)
            if (data.result[0][0].value) {
                setWorkerOrders(data.result)
            }
            // message(data.message)

        } catch (e) {
        }
    }

    const setWorkerForm = idx => {
        setFlag(1)
        setForm({
            firstName: workers[idx][2].value.split(' ')[1],
            lastName: workers[idx][2].value.split(' ')[0],
            login: '',
            password: '',
            email: workers[idx][4].value,
            phone: workers[idx][3].value,
            salary: workers[idx][5].value,
            idWorker: workers[idx][0].value,
            idUser: workers[idx][1].value
        })
        M.updateTextFields()
    }

    useEffect(() => {
        M.updateTextFields()
    })

    const clearWorkerForm = () => {
        setFlag(0)
        setForm({
            firstName: '',
            lastName: '',
            login: '',
            password: '',
            email: '',
            phone: '',
            salary: '',
            idWorker: '',
            idUser: ''
        })
        M.updateTextFields()
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
                                            data-target="worker-modal"
                                            disabled={loading}
                                            style={{position: 'absolute', top: '50px', background: 'gray'}}
                                            onClick={() => setWorkerForm(index)}
                                        >
                                            <i className="material-icons">edit</i>
                                        </button>

                                        <button
                                            className="btn-floating modal-trigger halfway-fab waves-effect waves-light"
                                            data-target="orders-modal"
                                            disabled={loading}
                                            style={{
                                                position: 'absolute',
                                                top: '50px',
                                                left: '290px',
                                                background: 'gray'
                                            }}
                                            onClick={() => getWorkerOrders(worker[0].value)}
                                        >
                                            <i className="material-icons">list</i>
                                        </button>
                                    </div>

                                    <div className="card-content hoverable">
                                        <p>Name: <strong>{worker[2].value}</strong></p>
                                        <p>Phone: <strong>{worker[3].value}</strong></p>
                                        <p>Email: <strong>{worker[4].value}</strong></p>
                                        <p>Salary: <strong>{worker[5].value} RUB</strong></p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col s1"/>

                <div className="col s3 center-align">
                    <button className="btn-large modal-trigger waves-effect waves-light blue darken-1"
                            data-target="worker-modal"
                            type="submit"
                            name="action"
                            style={{marginTop: '5.5rem'}}
                            disabled={loading}
                            onClick={() => clearWorkerForm()}
                    >Register worker
                        <i className="material-icons right">person_add</i>
                    </button>
                </div>

                <div id="orders-modal" className="modal card">
                    <div className="modal-content">
                        <table>
                            <thead>
                            <tr>
                                <th>Beer</th>
                                <th>Amount</th>
                                <th>Time of order</th>
                                <th>Status</th>
                            </tr>
                            </thead>

                            <tbody>
                            {workerOrders && workerOrders.map((item, index) => (
                                <tr key={index}>
                                    <td>{item[0].value}</td>
                                    <td>{item[1].value}</td>
                                    <td>{item[2].value.split('T')[0] + ' ' + item[2].value.split('T')[1].slice(0, 8)}</td>
                                    <td>{item[3].value}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="worker-modal" className="modal card">
                    {
                        workers &&
                        <div className="modal-content">
                            <div className="row">
                                <form className="col s12">
                                    <div className="row">
                                        <div className="input-field col s6">
                                            <input id="first_name" type="text" name="firstName"
                                                   className="profile-input validate" value={form.firstName}
                                                   onChange={changeHandler}/>
                                            <label htmlFor="first_name">First Name</label>
                                        </div>
                                        <div className="input-field col s6">
                                            <input id="last_name" type="text" name="lastName"
                                                   className="profile-input validate" value={form.lastName}
                                                   onChange={changeHandler}/>
                                            <label htmlFor="last_name">Last Name</label>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input id="email" type="email" name="email"
                                                   className="profile-input validate" value={form.email}
                                                   onChange={changeHandler}/>
                                            <label htmlFor="email">Email</label>
                                        </div>
                                    </div>

                                    {
                                        !flag &&
                                        <>
                                            <div className="row">
                                                <div className="input-field col s12">
                                                    <input id="login" type="text" name="login"
                                                           className="profile-input validate" value={form.login}
                                                           onChange={changeHandler}/>
                                                    <label htmlFor="login">Login</label>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="input-field col s12">
                                                    <input id="password" type="password" name="password"
                                                           className="profile-input validate" value={form.password}
                                                           onChange={changeHandler}/>
                                                    <label htmlFor="password">Password</label>
                                                </div>
                                            </div>
                                        </>
                                    }

                                    <div className="row">
                                        <div className="input-field col s6">
                                            <input id="phone" type="tel" name="phone"
                                                   className="profile-input validate" value={form.phone}
                                                   onChange={changeHandler}/>
                                            <label htmlFor="phone">Phone</label>
                                        </div>

                                        <div className="input-field col s6">
                                            <input id="salary" type="text" name="salary"
                                                   className="profile-input validate" value={form.salary}
                                                   onChange={changeHandler}/>
                                            <label htmlFor="salary">Salary</label>
                                        </div>
                                    </div>
                                    {
                                        flag ?
                                            <>
                                                <button
                                                    className="btn waves-effect waves-light green darken-1"
                                                    disabled={loading}
                                                    onClick={editHandler}
                                                >Edit
                                                    <i className="material-icons right">edit</i>
                                                </button>
                                                <button className="btn waves-effect waves-light red darken-1"
                                                        type="submit" name="action"
                                                        style={{marginLeft: '1rem'}}
                                                        disabled={loading}
                                                        onClick={deleteHandler}
                                                >Delete
                                                    <i className="material-icons right">delete_forever</i>
                                                </button>
                                            </>
                                            :
                                            <button
                                                className="btn grey lighten-1 black-text"
                                                onClick={registerHandler}
                                                disabled={loading}
                                            >Register
                                            </button>
                                    }
                                    <a className="modal-close waves-effect waves-teal btn-flat">Close</a>
                                </form>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
