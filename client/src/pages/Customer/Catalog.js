import React, {useEffect, useContext, useState} from 'react'
import {AuthContext} from "../../context/AuthContext"
import {useMessage} from "../../hooks/message.hook"
import {useHttp} from "../../hooks/http.hook"

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

export const Catalog = () => {
    const [catalog, setCatalog] = useState(false)
    // const [catalog, setCatalog] = useState({
    //     id: '',
    //     color: '',
    //     degree: '',
    //     price: '',
    //     isFiltration: ''
    // })
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()

    const images = [bImg1, bImg2, bImg3, bImg4, bImg5, bImg6, bImg7, bImg8, bImg9, bImg10]


    // МОЖНО ВЫВОДИТЬ КОНКРЕТНУЮ ОШИБКУ
    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    useEffect(async () => {
        try {
            // TODO Effect callbacks are synchronous to prevent race conditions. Put the async function inside
            // TODO React Hook useEffect has missing dependencies: 'auth.token' and 'request'. Either include them or
            // TODO remove the dependency array
            const data = await request('/api/catalog', 'GET', null, {Authorization: `Bearer ${auth.token}`})
            setCatalog(data.result)
            //console.log(data.result)
            // setCatalog({
            //     id: '',
            //     color: '',
            //     degree: '',
            //     price: '',
            //     isFiltration: ''
            // })
        } catch (e) {
        }
    }, [])

    const [amount, setAmount] = useState(1)

    const createOrder = async idBeer => {
        // Айди пива
        console.log('IdBeer', idBeer)
        // Айди юзера
        console.log('IdUser', auth.userId)
        // Количество
        console.log('Amount', amount)

        // ЗАПРОС
        const data = await request('/api/orders/create', 'POST', {
            idBeer: idBeer,
            idUser: auth.userId,
            quantity: amount
        }, {Authorization: `Bearer ${auth.token}`})
        message(data.message)
    }

    // У каждого инпута должен быть свой айди
    // При вызове фунции онКлик на кнопке это значение должно передаваться в функцию
    // все
    // TODO КОЛИЧЕСТВО ДОЛЖНО БЫТЬ БОЛЬШЕ НУЛЯ, ЧТОБЫ СДЕЛАТЬ ЗАКАЗ
    return (
        <div>
            <div className="row" style={{marginTop: '4rem'}}>
                <div className="col s8">
                    <div className="row">
                        {catalog && catalog.map((item, index) => (
                            <div key={index} className="col s4 show-container">
                                <div className="card" style={{marginTop: '4rem'}}>
                                    <div className="card-image">
                                        <img src={images[index]} alt='beer' height='250px' width='200px'/>
                                        <span className="card-title"
                                              style={{color: 'black'}}><strong>{item[1].value}</strong></span>
                                        <button
                                            className="btn-floating halfway-fab waves-effect waves-light green darken-1"
                                            disabled={loading}
                                            onClick={() => createOrder(item[0].value)}><i
                                            className="material-icons">shopping_basket</i></button>
                                    </div>

                                    <div className="card-content">
                                        {/*<p>Id {item[0].value}</p>*/}
                                        <p>Color {item[2].value}</p>
                                        <p>Price {item[3].value}</p>
                                        <p>Degree {item[4].value}</p>
                                        <p>IsFiltration {item[5].value}</p>
                                    </div>
                                    <div style={{display: 'flex'}}>
                                        <button onClick={() => {
                                            setAmount(amount - 1)
                                        }}>-
                                        </button>
                                        <div>{amount}</div>
                                        <button onClick={() => {
                                            setAmount(amount + 1)
                                        }}>+
                                        </button>
                                    </div>
                                    <input id="amount" type="number" onChange={e => setAmount(e.target.value)}/>
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
