import React, {useState, useContext, useEffect} from 'react'
import {AuthContext} from "../../context/AuthContext"
import {useMessage} from "../../hooks/message.hook"
import {useHttp} from "../../hooks/http.hook"
import M from 'materialize-css'

import bImg1 from '../../assets/images/beer1.jpg'
import bImg2 from '../../assets/images/beer2.jpg'
import bImg3 from '../../assets/images/beer3.jpg'
import bImg4 from '../../assets/images/beer4.jpg'
import bImg5 from '../../assets/images/beer5.jpg'
import bImg6 from '../../assets/images/beer6.jpg'
import bImg7 from '../../assets/images/beer7.jpg'
import bImg8 from '../../assets/images/beer8.jpg'
import bImg9 from '../../assets/images/beer9.jpg'

export const Orders = () => {
    const [orders, setOrders] = useState(false)
    const [statuses, setStatuses] = useState(false)
    const [workers, setWorkers] = useState(false)
    const [ordersWorkers, setOrdersWorkers] = useState(false)
    const [newStatus, setNewStatus] = useState('')
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()

    const images = [bImg1, bImg2, bImg3, bImg4, bImg5, bImg6, bImg7, bImg8, bImg9]

    // TODO ВЫНЕСТИ ВСЕ ЗАПРОСЫ В ОТДЕЛЬНЫЙ ФАЙЛ

    // TODO ОБЪЁДИНИТЬ ВСЕ В ОДИН useState?
    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ordersData = await request('/api/orders', 'GET', null, {Authorization: `Bearer ${auth.token}`})
                if (ordersData.result[0][0].value) {
                    setOrders(ordersData.result)
                }

                const statusesData = await request('/api/statuses', 'GET', null, {Authorization: `Bearer ${auth.token}`})
                if (statusesData.result[0][0].value) {
                    setStatuses(statusesData.result)
                }

                const workersData = await request('/api/workers', 'GET', null, {Authorization: `Bearer ${auth.token}`})
                if (workersData.result[0][0].value) {
                    setWorkers(workersData.result)
                }

                const ordersWorkersData = await request('/api/orders/workers', 'GET', null, {Authorization: `Bearer ${auth.token}`})
                if (ordersWorkersData.result[0][0].value) {
                    setOrdersWorkers(ordersWorkersData.result)
                }
            } catch (e) {
            }
        }
        fetchData().then() // TODO WHAT?
    }, [request, auth.token])

    const changeStatus = async (idOrder, idStatus) => {
        if (!idStatus) {
            for (let status of statuses) {
                if (status[1].value === 'Отменен') {
                    idStatus = status[0].value
                    break
                }
            }
        }

        const data = await request('/api/orders/changeStatus', 'POST', {
            idOrder: idOrder,
            idStatus: idStatus
        }, {Authorization: `Bearer ${auth.token}`})
        message(data.message)
    }

    const changeWorker = async (idOrder, idWorker) => {
        const data = await request('/api/orders/changeWorker', 'POST', {
            idOrder: idOrder,
            idWorker: idWorker
        }, {Authorization: `Bearer ${auth.token}`})
        message(data.message)
    }

    const deleteOrder = async idOrder => {
        const data = await request('/api/orders/delete', 'POST', {
            idOrder: idOrder
        }, {Authorization: `Bearer ${auth.token}`})
        message(data.message)
    }

    const createNewStatus = async status => {
        const data = await request('/api/statuses/', 'POST', {
            status: status
        }, {Authorization: `Bearer ${auth.token}`})
        message(data.message)
    }

    useEffect(() => {
        const elems = document.querySelectorAll('select')
        M.FormSelect.init(elems, {})
        // M.AutoInit()
    })

    // TODO ЗАМЕНИТЬ
    // TODO А ДРУГОЕ? ЕСЛИ НЕТ ДРУГОГО
    if (!orders) {
        return <div>NOT ORDERS</div>
    }

    const identifyWorker = idOrder => {
        for (let i of ordersWorkers) {
            if (i[0].value === idOrder) {
                return i[1].value
            }
        }
        return 'default'
    }

    // TODO ИЗМЕНИТЬ СТИЛИ SELECT
    // TODO СДЕЛАТЬ СОРТИРОВКУ ПО НОВИЗНЕ ИЛИ ПО ДЕЙСТВУЮЩИМ ЗАКАЗАМ
    // TODO ПОКАЗЫВАТЬ НАЗВАНИЕ ПИВА
    return (
        <div>
            <div className="row" style={{marginTop: '3rem'}}>
                <div className="col s8">
                    <div className="row">
                        {/*TODO А ЕСЛИ ЧТО-ТО ОДНО НЕ ПРИДЕТ ТО ЧТО, ВСЕ?*/}
                        {workers && statuses && orders && orders.map((order, index) => (
                            <div key={index} className='show-container'>
                                {/*<span className="card-title"*/}
                                {/*      style={{color: 'black'}}><strong>Order {index}</strong></span>*/}
                                {/*grow*/}
                                <div className="row card hoverable valign-wrapper" style={{marginTop: '3rem'}}>
                                    <div className='col s3'>
                                        <div className="card-image">
                                            <img src={images[index]} alt='beer' height='180px' width='140px'/>
                                        </div>
                                    </div>

                                    {/*<button onClick={test}>Init</button>*/}

                                    {/*<button*/}
                                    {/*    className="btn-floating halfway-fab waves-effect waves-light red darken-1"*/}
                                    {/*    disabled={loading}*/}
                                    {/*    onClick={() => createOrder(item[0].value)}><i*/}
                                    {/*    className="material-icons">add</i></button>*/}

                                    <div className="col s5 card-content">
                                        {/*<p>IdOrder {item[0].value}</p>*/}
                                        {/*<p>IdBeer {item[1].value}</p>*/}
                                        {/*<p>IdCustomer {item[2].value}</p>*/}
                                        {/*<p>IdWorker {item[3].value}</p>*/}
                                        <h6>Order <strong>№{++index}</strong></h6>
                                        <p>Amount: <strong>{order[4].value}</strong></p>
                                        <p>Total price: <strong>{order[5].value} RUB</strong></p>
                                        {auth.userPosition === 'director' && <p>Customer: <strong>{order[8].value}</strong></p>}
                                        {auth.userPosition !== 'worker' && statuses.map((status, idx) => (
                                            <div key={idx}>
                                                {
                                                    status[0].value === order[6].value &&
                                                    <p>Status: <strong>{status[1].value}</strong></p>
                                                }
                                            </div>
                                        ))}
                                        {/*TODO SHOW TIME*/}
                                        {/*<p>Time of order: <strong>{order[7].value.slice(0, 10)}</strong></p>*/}
                                        <p>Time of
                                            order: <strong>{order[7].value.split('T')[0] + ' ' + order[7].value.split('T')[1].slice(0, 8)}</strong>
                                        </p>
                                    </div>
                                    <div className='col s4'>

                                        {
                                            auth.userPosition === 'customer' &&
                                            // TODO RENDER FROM STATUSES
                                            order[6].value === 1 &&
                                            <button className="btn-large waves-effect waves-light red darken-1"
                                                    type="submit"
                                                    name="action"
                                                    disabled={loading}
                                                    onClick={() => changeStatus(order[0].value)}
                                            >Cancel the order
                                                <i className="material-icons right">delete_forever</i>
                                            </button>
                                        }

                                        {
                                            auth.userPosition === 'worker' &&
                                            <div className="input-field">
                                                {/* <> */}
                                                <select defaultValue={order[6].value}
                                                        onChange={e => changeStatus(order[0].value, e.target.value)}>
                                                    <option value="" disabled>Choose status of the order</option>
                                                    {statuses.map((sts, i) => (
                                                        <option value={sts[0].value} key={i}>{sts[1].value}</option>
                                                    ))}
                                                </select>
                                                <label>current status</label>
                                                {/* </> */}
                                            </div>
                                        }

                                        {
                                            auth.userPosition === 'director' && ordersWorkers &&
                                            <>
                                                <div className="input-field">
                                                    {/*TODO СДЕЛАТЬ ТАК, ЧТО ЕСЛИ ЗАКАЗ УЖЕ ВЫПОЛНЕН/ОТМЕНЕН, ТО НЕЛЬЗЯ МЕНЯТЬ РАБОТНИКА ИЛИ САМ СТАТУС(ИЛИ НЕТ?)*/}
                                                    {/*TODO НЕ ПОКАЗЫВАТЬ МЕНЯ В СПИСКЕ*/}

                                                    <select defaultValue={identifyWorker(order[0].value)}
                                                            onChange={e => changeWorker(order[0].value, e.target.value)}>
                                                        <option value="default" disabled>Choose worker of the order
                                                        </option>
                                                        {workers.map((wrk, i) => (
                                                            <option value={wrk[0].value} key={i}>{wrk[2].value}</option>
                                                        ))}
                                                    </select>

                                                    <label>current worker</label>
                                                </div>

                                                <button className="btn-large waves-effect waves-light red darken-1"
                                                        type="submit"
                                                        name="action"
                                                        disabled={loading}
                                                        onClick={() => deleteOrder(order[0].value)}
                                                >Delete
                                                    <i className="material-icons right">delete_forever</i>
                                                </button>
                                            </>
                                        }

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col s1"/>
                <div className="col s3">
                    {
                        auth.userPosition === 'director' &&
                        <div className="valign-wrapper">
                            <input type="text" style={{width: '200px'}} onChange={event => setNewStatus(event.target.value)}/>
                            <button
                                className="btn modal-trigger waves-effect waves-light blue darken-1"
                                data-target="product-modal"
                                // type="submit"
                                // name="action"
                                onClick={() => createNewStatus(newStatus)}
                                style={{fontSize: '12px', marginLeft: '1rem', padding: '0 4px'}}
                                disabled={loading}
                            >status
                                <i className="material-icons right" style={{margin: 0}}>add</i>
                            </button>
                        </div>

                    }
                    {/*<div className="input-field">*/}
                    {/*    <i className="material-icons prefix">textsms</i>*/}
                    {/*    <input type="text" id="autocomplete-input" className="autocomplete"/>*/}
                    {/*    <label htmlFor="autocomplete-input">Autocomplete</label>*/}
                    {/*</div>*/}

                    {/*<label>*/}
                    {/*    <input type="checkbox" className="filled-in"/>*/}
                    {/*    <span>IsFiltration</span>*/}
                    {/*</label>*/}
                </div>
            </div>
        </div>
    )
}
