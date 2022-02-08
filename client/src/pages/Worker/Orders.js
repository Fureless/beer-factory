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
import bImg10 from '../../assets/images/beer10.jpg'

export const Orders = () => {
    const [orders, setOrders] = useState(false)
    const [statuses, setStatuses] = useState(false)
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()

    const images = [bImg1, bImg2, bImg3, bImg4, bImg5, bImg6, bImg7, bImg8, bImg9, bImg10]

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    useEffect(async () => {
        try {
            const data = await request('/api/orders', 'GET', null, {Authorization: `Bearer ${auth.token}`})
            setOrders(data.result)

            const statusesData = await request('/api/statuses', 'GET', null, {Authorization: `Bearer ${auth.token}`})
            setStatuses(statusesData.result)
        } catch (e) {
        }
    }, [])

    const changeStatus = async (idOrder, idStatus) => {
        const data = await request('/api/orders/status', 'POST', {idOrder: idOrder, idStatus: idStatus}, {Authorization: `Bearer ${auth.token}`})
        message(data.message)
    }

    // useEffect(() => {
    //     M.FormSelect.init(document.querySelectorAll('select'), {}) // 1
    //     //M.AutoInit() // 2
    // }, [])

    // return (
    //     <div className="row">
    //         {statuses && orders && orders.map((item, index) => (
    //             <div key={index} className='show-container'>
    //                 <div className="row card valign-wrapper">
    //                     <div className='col s4'>
    //                         {/*-----------------------------------------*/}
    //                         <div className="input-field">
    //                             <select>
    //                                 <option value="" disabled selected>Choose your option</option>
    //                                 {statuses.map((sts, i) => (
    //                                     <option value={sts[0].value} key={i}>{sts[1].value}</option>
    //                                 ))}
    //                             </select>
    //                             <label>Status selection</label>
    //                         </div>
    //                         {/*-----------------------------------------*/}
    //                     </div>
    //                 </div>
    //             </div>
    //         ))}
    //     </div>
    // )

    // if (statuses && orders) {
    //     //let elems = document.querySelectorAll('select')
    //     //let instances = M.FormSelect.init(elems,{});
    //     M.AutoInit();
    // }
    //let elems = document.querySelectorAll('select')
    //let instances = M.FormSelect.init(elems,{});
    //M.AutoInit();

    // TODO СДЕЛАТЬ СОРТИРОВКУ ПО НОВИЗНЕ ИЛИ ПО ДЕЙСТВУЮЩИМ ЗАКАЗАМ
    return (
        <div>
            <div className="row" style={{marginTop: '3rem'}}>
                <div className="col s8">
                    <div className="row">
                        {statuses && orders && orders.map((item, index) => (
                            <div key={index} className='show-container'>
                                {/*<span className="card-title"*/}
                                {/*      style={{color: 'black'}}><strong>Order {index}</strong></span>*/}
                                <div className="row card valign-wrapper" style={{marginTop: '3rem'}}>
                                    <div className='col s3'>
                                        <div className="card-image">
                                            <img src={images[index]} alt='beer' height='180px' width='140px'/>
                                        </div>
                                    </div>

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
                                        <h6>Order <strong>№{index}</strong></h6>
                                        <p>Amount: <strong>{item[4].value}</strong></p>
                                        <p>Total price: <strong>{item[5].value} RUB</strong></p>
                                        {statuses.map((status, idx) => (
                                            <div key={idx}>
                                                {status[0].value === item[6].value ?
                                                    <p>Status: <strong>{status[1].value}</strong></p> : null}
                                            </div>

                                        ))}
                                        {/*TODO SHOW TIME*/}
                                        <p>Time of order: <strong>{item[7].value.slice(0, 10)}</strong></p>
                                    </div>
                                    <div className='col s4'>
                                        {/* TODO RENDER FROM STATUSES */}
                                        <div className="input-field">
                                            <select>
                                                <option value="" disabled selected>Choose your option</option>
                                                {statuses.map((sts, i) => (
                                                    <option value={sts[0].value} key={i}>{sts[1].value}</option>
                                                ))}
                                            </select>
                                            <label>Status selection</label>
                                        </div>
                                        {/*<i className="material-icons right">delete_forever</i>*/}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col s1" style={{backgroundColor: 'lightGray'}}>1-columns</div>
                <div className="col s3">
                    <div className="row">
                        <div className="col s12">
                            <div className="row">
                                <div className="input-field col s12">
                                    <i className="material-icons prefix">textsms</i>
                                    <input type="text" id="autocomplete-input" className="autocomplete"/>
                                    <label htmlFor="autocomplete-input">Autocomplete</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p>
                        <label>
                            <input type="checkbox" className="filled-in"/>
                            <span>IsFiltration</span>
                        </label>
                    </p>
                </div>
            </div>
        </div>

    )
}
