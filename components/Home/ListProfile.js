import React from 'react'
import {observer} from 'mobx-react'
import { NavLink, withRouter } from 'react-router-dom'

import MpLogo from '../../resources/images/mp-logo-small.svg';
import ProfileDefault from '../../resources/images/image-default.svg';
import userStore from '../../stores/UserStore';
import Loader from '../General/Loader';

const ListProfile = (props) => {

    const {name, logout} = props;

    return(
        <div className={"menu-container__user"}>
            <div className={"menu-container__user__company"}>
                <img src={MpLogo} />
            </div>
            {userStore.userLoaded === false &&
                <Loader
                    size={"medium"}
                />
            }
            {userStore.userLoaded === true &&
            <div>
                <div className={"menu-container__user__img"}>
                    {userStore.currentUser.image &&
                        <img src={`https://napoleon.mediaplanet.com/images/employees/250x250/${userStore.currentUser.image}`} />
                    }
                    {!userStore.currentUser.image &&
                        <img src={ProfileDefault} />
                    }
                </div>
                <div className={"menu-container__user__name"}>
                    {name}
                </div>
                <div className={"menu-container__user__icons"}>
                    <NavLink exact to={"/home"} activeClassName={"active"}>
                        <i title={"Home"} className={"fas fa-home"}></i>
                    </NavLink>
                    <NavLink exact to={"/settings"} activeClassName={"active"}>
                        <i  title={"Settings"} className={"fas fa-cog"}></i>
                    </NavLink>
                    <a href={"#"} title={"Log out"} onClick={logout}>
                        <i className={"fas fa-sign-out-alt"}></i>
                    </a>
                </div>
            </div>
            }

        </div>
    );
}

export default withRouter(observer(ListProfile));