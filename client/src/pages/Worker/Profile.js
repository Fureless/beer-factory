import React, {useContext, useState, useEffect} from 'react'
import {useNavigate} from "react-router-dom"
import {AuthContext} from "../../context/AuthContext"
import {useMessage} from "../../hooks/message.hook"
import {useHttp} from "../../hooks/http.hook"
import {Loader} from "../../components/Loader"

export const Profile = () => {
    const history = useNavigate()
    const auth = useContext(AuthContext)

    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        salary: ''
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

    // useEffect(() => {
    //     const getCustomerData = async idUser => {
    //         try {
    //             const data = await request(`/api/profile`, 'GET', null, {Authorization: `Bearer ${auth.token}`})
    //             setForm({
    //                 firstName: data.result[0][2].value.split(' ')[1],
    //                 lastName: data.result[0][2].value.split(' ')[0],
    //                 email: data.result[0][3].value,
    //                 phone: data.result[0][4].value,
    //                 date: data.result[0][5].value.slice(0, 10)
    //             })
    //         } catch (e) {
    //         }
    //     }
    //     // TODO Promise returned from getCustomerData is ignored
    //     getCustomerData(auth.userId)
    // }, [])
    useEffect(async () => {
        try {
            const data = await request(`/api/profile`, 'GET', null, {Authorization: `Bearer ${auth.token}`})
            setForm({
                firstName: data.result[0][2].value.split(' ')[1],
                lastName: data.result[0][2].value.split(' ')[0],
                email: data.result[0][4].value,
                phone: data.result[0][3].value,
                salary: data.result[0][5].value
            })
        } catch (e) {
        }
    }, [])

    const editUserProfile = async () => {
        const data = await request('/api/profile/edit', 'POST', {...form}, {Authorization: `Bearer ${auth.token}`})
        message(data.message)
    }

    const logoutHandler = event => {
        event.preventDefault()
        auth.logout()
        history('/auth')  // ???
    }

    if (form) {
        return (
            <div className="container" style={{marginTop: '3rem'}}>
                <div className="row">
                    <form className="col s12">
                        <div className="row">
                            <div className="input-field col s6">
                                <input id="first_name" type="text" name="firstName" placeholder="name"
                                       className="profile-input validate" value={form.firstName}
                                       onChange={changeHandler}/>
                                <label htmlFor="first_name">First Name</label>
                            </div>
                            <div className="input-field col s6">
                                <input id="last_name" type="text" name="lastName" placeholder="surname"
                                       className="profile-input validate" value={form.lastName}
                                       onChange={changeHandler}/>
                                <label htmlFor="last_name">Last Name</label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="input-field col s12">
                                <input id="email" type="email" name="email" placeholder="email"
                                       className="profile-input validate" value={form.email} onChange={changeHandler}/>
                                <label htmlFor="email">Email</label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="input-field col s6">
                                <input id="phone" type="tel" name="phone" placeholder="phone"
                                       className="profile-input validate" value={form.phone} onChange={changeHandler}/>
                                <label htmlFor="phone">Phone</label>
                            </div>
                            <div className="input-field col s6">
                                <input id="salary" type="number" name="salary" placeholder="salary"
                                       className="profile-input validate" value={form.salary} onChange={changeHandler}/>
                                <label htmlFor="date">Salary</label>
                            </div>
                        </div>

                        <button
                            className="btn waves-effect waves-light green darken-1"
                            disabled={loading}
                            onClick={editUserProfile}
                        >Edit
                            <i className="material-icons right">edit</i>
                        </button>

                        <button className="btn waves-effect waves-light red darken-1" type="submit" name="action"
                                style={{marginLeft: '1rem'}}
                                disabled={loading}
                                onClick={logoutHandler}
                        >Logout
                            <i className="material-icons right">exit_to_app</i>
                        </button>
                    </form>
                </div>
            </div>
        )
    } else {
        return <Loader/>
    }
}
