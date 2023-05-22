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
import M from "materialize-css"

export const Catalog = () => {
    const [catalog, setCatalog] = useState(false)
    const [amount, setAmount] = useState(0)
    const [bestProductsView, setBestProductsView] = useState(false)
    const [flag, setFlag] = useState(0)
    const [form, setForm] = useState({
        name: ' ',
        color: ' ',
        price: ' ',
        degree: ' ',
        isFiltration: ' ',
        idBeer: ''
    })
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()

    const images = [bImg1, bImg2, bImg3, bImg4, bImg5, bImg6, bImg7, bImg8, bImg9]

    // МОЖНО ВЫВОДИТЬ КОНКРЕТНУЮ ОШИБКУ
    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    // А нужен ли пустой массив зависимостей? Почитать про хук
    useEffect(() => {
        const fetchData = async () => {
            try {
                // TODO Effect callbacks are synchronous to prevent race conditions. Put the async function inside
                // TODO React Hook useEffect has missing dependencies: 'auth.token' and 'request'. Either include them or
                // TODO remove the dependency array
                const catalogData = await request('/api/catalog', 'GET', null, {Authorization: `Bearer ${auth.token}`})
                setCatalog(catalogData.result)
                // TODO проверить есть ли вообще каталог
            } catch (e) {
            }
        }
        fetchData().then() // TODO WHAT???
    }, [request, auth.token])

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const createOrder = async idBeer => {
        try {
            const data = await request('/api/orders/create', 'POST', {
                idBeer: idBeer,
                idUser: auth.userId,
                quantity: amount
            }, {Authorization: `Bearer ${auth.token}`})
            message(data.message)
        } catch (e) {
        }
    }
    // TODO мб увеличить скорость "роста" карточек?

    const createProduct = async () => {
        try {
            const data = await request('/api/catalog/create', 'POST', {...form}, {Authorization: `Bearer ${auth.token}`})
            message(data.message)
        } catch (e) {
        }
    }

    const editHandler = async () => {
        try {
            const data = await request('/api/catalog/edit', 'POST', {...form}, {Authorization: `Bearer ${auth.token}`})
            message(data.message)
        } catch (e) {
        }
    }

    const deleteHandler = async () => {
        try {
            const data = await request('/api/catalog/', 'DELETE', {idBeer: form.idBeer}, {Authorization: `Bearer ${auth.token}`})
            message(data.message)
        } catch (e) {
        }
    }

    const setProductForm = idx => {
        setFlag(1)
        setForm({
            name: catalog[idx][1].value,
            color: catalog[idx][2].value,
            price: catalog[idx][3].value,
            degree: catalog[idx][4].value,
            isFiltration: catalog[idx][5].value,
            idBeer: catalog[idx][0].value
        })
        M.updateTextFields()
    }

    useEffect(() => {
        M.updateTextFields()
    })

    const clearProductForm = () => {
        setFlag(0)
        setForm({
            name: '',
            color: '',
            price: '',
            degree: '',
            isFiltration: '',
            idBeer: ''
        })
        M.updateTextFields()
    }

    const getBestProductsView = async () => {
        try {
            const data = await request('/api/catalog/best', 'GET', null, {Authorization: `Bearer ${auth.token}`})
            if (data.result[0][0].value) {
                setBestProductsView(data.result)
            }
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

    // У каждого инпута должен быть свой айди
    // При вызове фунции онКлик на кнопке это значение должно передаваться в функцию
    // все
    // TODO КОЛИЧЕСТВО ДОЛЖНО БЫТЬ БОЛЬШЕ НУЛЯ, ЧТОБЫ СДЕЛАТЬ ЗАКАЗ
    return (
        <div className="row" style={{marginTop: '4rem'}}>
            <div className="col s8">
                <div className="row">
                    {catalog && catalog.map((item, index) => (
                        <div key={index} className="col s4 show-container">
                            <div className="card hoverable" style={{marginTop: '4rem'}}>
                                <div className="card-image">
                                    <img src={images[index]} alt='beer' height='250px' width='200px'/>
                                    <span className="card-title"
                                          style={{color: 'black'}}><strong>{item[1].value}</strong></span>
                                    {
                                        auth.userPosition === 'customer' &&
                                        <button
                                            className="btn-floating halfway-fab waves-effect waves-light green darken-1"
                                            disabled={loading}
                                            onClick={() => createOrder(item[0].value)}>
                                            <i className="material-icons">shopping_basket</i>
                                        </button>
                                    }
                                    {
                                        auth.userPosition === 'director' &&
                                        <button
                                            className="btn-floating modal-trigger halfway-fab waves-effect waves-light blue darken-1"
                                            data-target="product-modal"
                                            disabled={loading}
                                            onClick={() => setProductForm(index)}>
                                            <i className="material-icons">edit</i>
                                        </button>
                                    }
                                </div>

                                <div className="card-content">
                                    <p>Color: <strong>{item[2].value}</strong></p>
                                    <p>Price: <strong>{item[3].value} RUB</strong></p>
                                    <p>Degree: <strong>{item[4].value}'</strong></p>
                                    <p>Filtration: <strong>{item[5].value ? 'yes' : 'no'}</strong></p>
                                    {
                                        auth.userPosition === 'customer' &&
                                        <div className="valign-wrapper">
                                            <p>Amount: </p>
                                            <input id="amount" type="number" style={{width: '50px'}} onChange={e => setAmount(e.target.value)}/>
                                        </div>
                                    }
                                </div>

                                {/*{*/}
                                {/*    auth.userPosition === 'customer' &&*/}
                                {/*    <>*/}
                                {/*        <div style={{display: 'flex'}}>*/}
                                {/*            /!*<button onClick={() => {*!/*/}
                                {/*            /!*    setAmount({id: index, amount: ++amount[index]})*!/*/}
                                {/*            /!*}}>-*!/*/}
                                {/*            /!*</button>*!/*/}
                                {/*            /!*<div>{amount[index]}</div>*!/*/}
                                {/*            /!*<button onClick={() => {*!/*/}
                                {/*            /!*    setAmount(amount[index] + 1)*!/*/}
                                {/*            /!*}}>+*!/*/}
                                {/*            /!*</button>*!/*/}
                                {/*        </div>*/}
                                {/*        /!*<button>print</button>*!/*/}
                                {/*        /!*<input id="amount" type="text" style={{width: '50px'}}/>*!/*/}
                                {/*    </>*/}
                                {/*}*/}
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            <div className="col s1"/>

            <div className="col s3">
                {/*<div className="input-field">*/}
                {/*    <i className="material-icons prefix">textsms</i>*/}
                {/*    <input type="text" id="autocomplete-input" className="autocomplete"/>*/}
                {/*    <label htmlFor="autocomplete-input">Autocomplete</label>*/}
                {/*</div>*/}

                {/*<label>*/}
                {/*    <input type="checkbox" className="filled-in"/>*/}
                {/*    <span>IsFiltration</span>*/}
                {/*</label>*/}

                {
                    auth.userPosition === 'director' &&
                    <>
                        <button
                            className="btn-large modal-trigger waves-effect waves-light blue darken-1"
                            data-target="product-modal"
                            type="submit"
                            name="action"
                            style={{marginTop: '5rem', width: '220px'}}
                            onClick={() => clearProductForm()}
                            disabled={loading}
                        >New product
                            <i className="material-icons right">add</i>
                        </button>

                        <button
                            className="btn-large modal-trigger waves-effect waves-light grey"
                            data-target="catalog-modal"
                            style={{
                                marginTop: '2rem',
                                width: '220px'
                            }}
                            onClick={() => getBestProductsView()}
                            disabled={loading}
                        >Best products
                            <i className="material-icons right">list</i>
                        </button>
                    </>
                }
            </div>

            <div id="catalog-modal" className="modal card">
                <div className="modal-content">
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Color</th>
                            <th>Degree</th>
                            <th>Price</th>
                            <th>OverallQuantity</th>
                        </tr>
                        </thead>

                        <tbody>
                        {bestProductsView && bestProductsView.map((item, index) => (
                            <tr key={index}>
                                <td>{item[0].value}</td>
                                <td>{item[1].value}</td>
                                <td>{item[3].value}</td>
                                <td>{item[4].value}</td>
                                <td>{item[5].value}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/*COLOR*/}
            <div id="product-modal" className="modal card">
                <div className="modal-content">
                    <div className="row">
                        <div className="col s6 offset-s3">
                            <div className="row">
                                <form className="col s12">
                                    <div className="row">
                                        <div className="input-field col s6">
                                            <input id="name" type="text" name="name"
                                                   className="profile-input validate" value={form.name}
                                                   onChange={changeHandler}/>
                                            <label htmlFor="name">Name</label>
                                        </div>
                                        <div className="input-field col s6">
                                            <input id="color" type="text" name="color"
                                                   className="profile-input validate" value={form.color}
                                                   onChange={changeHandler}/>
                                            <label htmlFor="color">Color</label>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input id="price" type="text" name="price"
                                                   className="profile-input validate" value={form.price}
                                                   onChange={changeHandler}/>
                                            <label htmlFor="price">Price</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input id="degree" type="text" name="degree"
                                                   className="profile-input validate" value={form.degree}
                                                   onChange={changeHandler}/>
                                            <label htmlFor="degree">Degree</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input id="isFiltration" type="text" name="isFiltration"
                                                   className="profile-input validate" value={form.isFiltration}
                                                   onChange={changeHandler}/>
                                            <label htmlFor="isFiltration">isFiltration</label>
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
                                                        // type="submit" name="action"
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
                                                onClick={createProduct}
                                                disabled={loading}
                                            >Create
                                            </button>
                                    }
                                    <a className="modal-close waves-effect waves-teal btn-flat">Close</a>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
