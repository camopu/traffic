import React from 'react'
import {observer} from 'mobx-react'
import { NavLink, withRouter } from 'react-router-dom'

const ListElementsAdmin = (props) => {

    return(
        <div className={"menu-container__personal"}>
            <div className={"menu-container__personal__title"}>
                ADMINISTRATIVE TOOLS
            </div>
            <ul>
                {props.isAdmin &&
                    <li>
                        <NavLink exact to={"/admin/users"} activeClassName={"active"}>
                            <i className={"fas fa-users-cog"}></i> Users management
                        </NavLink>
                    </li>
                }
                <li>
                    <NavLink exact to={"/admin/archive"} activeClassName={"active"}>
                        <i className={"fas fa-archive"}></i> Archive
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}

export default withRouter(observer(ListElementsAdmin));