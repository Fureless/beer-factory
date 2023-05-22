import React from 'react'
import {NavLink} from 'react-router-dom'

export const Navbar = props => {
    if (props.position === 'director') {
        return (
            <div className="navbar-fixed">
                <nav className="grey darken-4">
                    <div className="nav-wrapper grey darken-4 container" style={{padding: '0 2 rem'}}>
                        <span className="brand-logo logo">BeerFactory</span>
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            <li><NavLink to="/catalog" className='pulse'><i className="material-icons">shopping_cart</i></NavLink></li>
                            <li><NavLink to="/orders" className='pulse'><i className="material-icons">assignment</i></NavLink></li>
                            <li><NavLink to="/workers" className='pulse'><i className="material-icons">people</i></NavLink></li>
                            <li><NavLink to="/profile" className='pulse'><i className="material-icons">account_circle</i></NavLink></li>
                        </ul>
                    </div>
                </nav>
            </div>
        )
    } else if (props.position === 'customer') {
        return (
            <div className="navbar-fixed">
                <nav className="grey darken-4">
                    <div className="nav-wrapper grey darken-4 container" style={{padding: '0 2 rem'}}>
                        <span className="brand-logo logo">BeerFactory</span>
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            <li><NavLink to="/catalog" className='pulse'><i className="material-icons">shopping_cart</i></NavLink></li>
                            <li><NavLink to="/orders" className='pulse'><i className="material-icons">assignment</i></NavLink></li>
                            <li><NavLink to="/profile" className='pulse'><i className="material-icons">account_circle</i></NavLink></li>
                        </ul>
                    </div>
                </nav>
            </div>
        )
    } else {
        return (
            <div className="navbar-fixed">
                <nav className="grey darken-4">
                    <div className="nav-wrapper grey darken-4 container" style={{padding: '0 2 rem'}}>
                        <span className="brand-logo logo">BeerFactory</span>
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            <li><NavLink to="/catalog" className='pulse'><i className="material-icons">shopping_cart</i></NavLink></li>
                            <li><NavLink to="/orders" className='pulse'><i className="material-icons">assignment</i></NavLink></li>
                            <li><NavLink to="/profile" className='pulse'><i className="material-icons">account_circle</i></NavLink></li>
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}
