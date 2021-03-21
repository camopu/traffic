import React from 'react'
import { observer } from 'mobx-react'
import { NavLink, withRouter } from 'react-router-dom'

@withRouter
@observer
export default class ListElementsAnalytics extends React.Component {

    render() {
        return(
            <div className={"menu-container__personal"}>
                <div className={"menu-container__personal__title"}>
                    ANALYTICS
                </div>
                <ul>
                    <li>
                        <NavLink exact to={"/analytics/overview"} activeClassName={"active"}>
                            <i className={"fas fa-chart-bar"}></i> Overview
                        </NavLink>
                    </li>
                </ul>
            </div>
        )
    }
}