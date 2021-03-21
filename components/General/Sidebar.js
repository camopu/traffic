import React from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action, reaction } from 'mobx';

import LoginContainer from '../Login/LoginContainer';
import ListContainer from '../Home/ListContainer';
import { withRouter } from 'react-router-dom';

import Burger from 'react-css-burger';

import MpLogo from '../../resources/images/mp-logo-big.png';

import '../../styles/sidebar.css';

const Login = (props) => {

    // Show login section in sidebar
    return (
        <LoginContainer
            handleLogin={props.handleLogin}
            handlePassword={props.handlePassword}
            handleEmail={props.handleEmail}
            isClickable={props.isClickable}
            error={props.error}
            processing={props.processing}
        />
    );
};

@inject('authStore', 'generalStore', 'userStore')
@withRouter
@observer
export default class Sidebar extends React.Component {

    // Sign in button clickable
    @observable isClickable = false;
    @observable mobMenuActive = false;
    @observable sidebarClass = 'home';

    constructor(props) {
        super(props);

        let width = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;



        if(width <= 1300) {
            this.mobMenuActive = true;
        } else {
            this.mobMenuActive = false;
        }
    }

    @action toggleMobMenu = () => {
        if(this.mobMenuActive) {
            this.mobMenuActive = false;
        } else {
            this.mobMenuActive = true;
        }
    }

    @action handleLogin = (e) => {
        e.preventDefault();
        this.props.authStore.login();
    };

    @action handlePassword = (e) => {
        this.props.authStore.setPassword(e.target.value);
        this.handleClickable();
    };

    @action handleEmail = (e) => {
        this.props.authStore.setEmail(e.target.value);
        this.handleClickable();
    };

    @action handleClickable() {

        this.isClickable = false;

        if(this.props.authStore.parameters.email.length > 0 && this.props.authStore.parameters.password.length) {
            this.isClickable = true;
        }
    }

    render() {
        let path = window.location.pathname;
        let className = 'home';
        if(path === '/analytics/overview') {
            className = 'analytics';
        }

        /*TODO Fix image path*/
        // Login sidebar
        if(!this.props.generalStore.token) {
            return (
                <div className={"login-container"}>
                    <div className="sidebar-container login-container__left">
                        <Login
                            handleLogin={this.handleLogin}
                            handlePassword={this.handlePassword}
                            handleEmail={this.handleEmail}
                            isClickable={this.isClickable}
                            error={this.props.authStore.loginError}
                            processing={this.props.authStore.inProgress}
                        />
                        <div className={"login-container__left__copyright"}>
                            &#169; {(new Date()).getFullYear()} Mediaplanet Group
                        </div>
                    </div>
                    <div className={"sidebar-container login-container__right"}>
                        <img src={MpLogo} />
                        <h2>
                            The <span className={"bold"}>Traffic Dashboard</span> is a web analytics service that provides statistics and analytical tools for analysis of Mediaplanet websites.
                            <br /><br /><br />
                            The service is available to members of Mediaplanet Group.
                        </h2>
                        <div className={"login-container__right__copyright"}>
                            &#169; {(new Date()).getFullYear()} Mediaplanet Group
                        </div>
                    </div>
                </div>
            );
        }

        // Regular sidebar
        return (
            <div className={`sidebar-container ${className}`}>
                <Burger
                    onClick={this.toggleMobMenu}
                    active={this.mobMenuActive}
                    burger="slider"
                    color="white"
                    hoverOpacity={0.8}
                    scale={0.8}
                />
                <ListContainer
                    isVisible={this.mobMenuActive}
                />
            </div>
        );

    }
}