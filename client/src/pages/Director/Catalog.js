import React, {useEffect, useContext, useState} from 'react'
import {AuthContext} from "../../context/AuthContext"
import {useMessage} from "../../hooks/message.hook"
import {useHttp} from "../../hooks/http.hook"

import beerImage1 from '../../assets/images/beer1.jpg'

export const Catalog = () => {
    const [catalog, setCatalog] = useState(false)
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()

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
            const data = await request('/api/catalog', 'GET', null, {Authorization: `Bearer ${auth.token}`})
            setCatalog(data.result)
        } catch (e) {
        }
    }, [])

    const changeCatalog = idBeer => {
        console.log('Change catalog', idBeer)
    }

    // ДОБАВИТЬ Loader
    if (catalog) {
        const renderCatalog = catalog.map((item, index) => (
            <div key={index} className="col s4">
                <div className="card" style={{marginTop: '3rem'}}>
                    <div className="card-image">
                        <img src={beerImage1} alt='beer' height='250px' width='200px'/>
                        <span className="card-title" style={{color: 'black'}}><strong>{item[1].value}</strong></span>
                        <button className="btn-floating halfway-fab waves-effect waves-light red darken-1"
                                disabled={loading}
                                onClick={() => changeCatalog(item[0].value)}><i
                            className="material-icons">edit</i></button>
                    </div>

                    <button data-target="modal1" className="btn modal-trigger">Modal</button>
                    <a className="waves-effect waves-light btn modal-trigger" href="#modal1">Modal</a>
                    <div className="card-content">
                        <p>Id {item[0].value}</p>
                        <p>Color {item[2].value}</p>
                        <p>Price {item[3].value}</p>
                        <p>Degree {item[4].value}</p>
                        <p>IsFiltration {item[5].value}</p>
                    </div>
                </div>
            </div>
        ))
        return (
            <>
                <div>
                    <div className="row" style={{marginTop: '5rem'}}>
                        <div className="col s8">
                            <div className="row">
                                {renderCatalog}
                            </div>
                        </div>
                        <div className="col s1" style={{backgroundColor: 'blue'}}>1-columns</div>
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


                <div id="modal1" className="modal">
                    <div className="modal-content">
                        <h4>Modal Header</h4>
                        <p>A bunch of text</p>
                    </div>
                    <div className="modal-footer">
                        <a href="#!" className="modal-close waves-effect waves-green btn-flat">Agree</a>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <div>LOADING...</div>
        )
    }
}
