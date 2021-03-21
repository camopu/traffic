import React from 'react'
import {observer, router} from 'mobx-react'
import { NavLink } from 'react-router-dom'

const ListElementsPersonal = (props) => {

    return(
        <div className={"menu-container__personal"}>
            <div className={"menu-container__personal__title"}>
                PERSONAL
            </div>
            <ul>
                <li className={"inactive"}>
                    <NavLink exact to={"/personal/dashboard"} activeClassName={"active"}>
                        <i className={"fas fa-tachometer-alt"}></i> Dashboard
                    </NavLink>
                </li>
                <li className={"inactive"}>
                    <NavLink exact to={"/personal/shared-dashboards"} activeClassName={"active"}>
                        <i className={"fas fa-share-alt"}></i> Shared dashboards
                    </NavLink>
                </li>
                <li className={"inactive"}>
                    <NavLink exact to={"/personal/watchlist"} activeClassName={"active"}>
                        <i className={"fas fa-eye"}></i> Watchlist
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}

export default observer(ListElementsPersonal);