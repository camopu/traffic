import React from 'react';
import { observer, inject } from 'mobx-react';
import { action, observable } from 'mobx';
import { withRouter } from 'react-router-dom'

import { CSSTransitionGroup } from 'react-transition-group'

import Loader from '../General/Loader';
import Profile from './ListProfile';
import ListElementsPersonal from './ListElementsPersonal';
import ListElementsAnalytics from './ListElementsAnalytics';
import ListElementsAdmin from './ListElementsAdmin';
import {reaction} from "mobx/lib/mobx";

@inject('userStore', 'authStore')
@withRouter
@observer
export default class ListContainer extends React.Component {

    @observable isLoading = true;

    constructor(props) {
        super(props)
        reaction(
            () => props.userStore.currentUser,
            user => {
                if(user) {
                    this.isLoading = false;
                } else {
                    this.isLoading = true;
                }
            }
        )
    }

    componentDidMount() {
        //this.props.userStore.getUser();
    }

    @action handleLogout = (e) => {
        e.preventDefault();
        this.props.authStore.logout();
    }

    render() {

        let path = window.location.pathname;
        let containerClass = 'regular';

        // Looking at overview
        if(path === '/analytics/overview') {
            containerClass = 'analytics';
        }


        if(this.isLoading) {
            return (
                <div className={"loader-container"}>
                    <Loader
                        size={"large"}
                    />
                </div>
            );
        }

        const {firstname, lastname, isAdmin} = this.props.userStore.currentUser;

        return(
            <CSSTransitionGroup
                transitionName="example"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}>
            <div className={`menu-container ${containerClass} ${this.props.isVisible ? 'active' : ''}`}>
                <Profile
                    name={firstname + ' ' + lastname}
                    logout={this.handleLogout}
                />
                <ListElementsAnalytics />
                <ListElementsAdmin
                    isAdmin={isAdmin}
                />
            </div>
            </CSSTransitionGroup>
        )
    }
}
