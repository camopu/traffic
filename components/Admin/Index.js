import React from 'react';
import { observer, inject } from 'mobx-react';
import { action, observable } from 'mobx';
import { withRouter } from 'react-router-dom';

import { CSSTransitionGroup } from 'react-transition-group'
import UsersTable from './UsersTable';
import Button from '../General/Button';
import Loader from '../General/Loader';
import Popup from '../General/Popup';
import CreateUser from './CreateUser';
import agent from '../../agent';
import Search from '../General/Search';
import UserSearch from './Search';
import Filters from './Filters';

import NoAccess from '../General/NoAccess'

import '../../styles/main_view.css';
import '../../styles/admin_view.css';
import {reaction} from "mobx/lib/mobx";

//TODO refactor, bloated component
@inject('generalStore', 'adminStore', 'userStore', 'filterStore')
@withRouter
@observer
export default class Admin extends React.Component {

    @observable isLoading = true;
    @observable showForm = false;
    @observable inputStatuses = {
        password: null,
        email: null,
    }
    @observable inputsValid = false;
    @observable showPassword = false;
    @observable popupOpen = false;
    @observable respMsg = '';
    @observable newUserCountriesVisible = true;

    constructor(props) {
        super(props)

        if(props.userStore.currentUser) {
            this.isLoading = false;
        }

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

    @action handleResp = (resp) => {
        this.props.adminStore.creationStatus = resp.status
        this.respMsg = (resp.message.length > 0 ? resp.message : '')
    }

    resetValues() {
        this.showForm = false
        this.showPassword = false
        this.inputStatuses.password = null
        this.inputStatuses.email = null
        this.popupOpen = false
    }
    
    @action newUser = () => {

        // If usertype left to default value (2) we need to set it manually, 2 = regular user
        if(!this.props.adminStore.newUser.usertype) {
            this.props.adminStore.setNewUserUsertype(2);
        }

        this.props.adminStore.createUser()
            .then(this.handleResp)
            .finally(action(() => {
                this.popupOpen = true;
                this.props.adminStore.processing = false;
        }))
    }

    @action showUserForm = () => {
        this.showForm = true;
    }

    @action newUserPassword = (e) => {

        this.inputStatuses.password = false;
        let includesNumber = false;
        let includesUppercase = false;

        let character = '';
        let i = 0;

        // Parse string for requirements
        while (i <= e.target.value.length){
            character = e.target.value.charAt(i);
            if (!isNaN(parseInt(character) * 1)){
                includesNumber = true;
            } else if (character.toLowerCase() && character === character.toUpperCase()) {
                includesUppercase = true;
            }
            i++;
        }

        // Min length of 6 in pw length
        if(e.target.value.length >= 6 && includesNumber === true && includesUppercase === true) {
            this.props.adminStore.setNewUserPassword(e.target.value);
            this.inputStatuses.password = true;
        }

        this.handleClickable();
    };

    @action newUserEmail = (e) => {

        this.inputStatuses.email = false;

        // Check length and mp email
        if(e.target.value.includes('@mediaplanet.com') && !e.target.value.includes(' ') && e.target.value.length >= 20) {
            this.props.adminStore.setNewUserEmail(e.target.value);
            this.inputStatuses.email = true;
        }

        this.handleClickable();
    };

    @action newUserUsertype = (e) => {
        this.props.adminStore.setNewUserUsertype(e.target.value);
    };

    @action togglePassword = () => {
        if(this.showPassword === false) {
            this.showPassword = true;
        } else {
            this.showPassword = false;
        }
    }

    @action handleClickable() {

        this.inputsValid = false;

        if(this.inputStatuses.password === true && this.inputStatuses.email === true) {
            this.inputsValid = true;
        }
    }

    @action reloadTable = () => {
        this.props.adminStore.getUsers()
        this.resetValues()
    }

    @action toggleCountryAccess = () => {
        if(this.newUserCountriesVisible) {
            this.newUserCountriesVisible = false;
        } else {
            this.props.adminStore.newUser.countries = [];
            this.newUserCountriesVisible = true;
        }
    }

    render() {

        if(this.isLoading) {
            return (
                <div className={"loader-container"}>
                    <Loader
                        size={"large"}
                    />
                </div>
            );
        }

        if(this.props.userStore.currentUser.isAdmin === false) {
            return(
                <NoAccess
                    msg={"You don't have access to view this page"}
                />
            )
        }

        return (
            <div className="main-view-container users">
                <CSSTransitionGroup
                    transitionName="example"
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    <div key={"admin-users"} className={'main-view-container__card full dark-blue'}>
                        <h2>
                            Users
                        </h2>
                        {this.popupOpen &&
                            <Popup
                                msg={this.respMsg}
                                type={this.props.adminStore.creationStatus === 200 ? 'success' : 'error'}
                                clickHandler={this.reloadTable}
                            />
                        }
                        <div className={"main-view-container__card__table"}>
                            <Filters
                                onSearch={this.props.adminStore.handleSearch}
                                toggleFilter={this.props.filterStore.toggleFilter}
                                filtersVisible={this.props.filterStore.visible}
                            />
                            <UsersTable
                                headers={[
                                    {
                                        text: 'email'
                                    },
                                    {
                                        text: 'password'
                                    },
                                    {
                                        text: 'usertype'
                                    },
                                    {
                                        text: 'access'
                                    },
                                    {
                                        text: 'active'
                                    }
                                ]}
                                handleResp={this.handleResp}
                                respMsg={this.respMsg}
                                searchTerm={this.searchTerm}
                            />
                        </div>
                        <div className={"main-view-container__card__inner"}>
                            {this.showForm &&
                                <CreateUser
                                    inputStatuses={this.inputStatuses}
                                    showPassword={this.showPassword}
                                    inputsValid={this.inputsValid}
                                    newUser={this.newUser}
                                    newUserUsertype={this.newUserUsertype}
                                    newUserPassword={this.newUserPassword}
                                    newUserEmail={this.newUserEmail}
                                    togglePassword={this.togglePassword}
                                    toggleAccess={this.toggleCountryAccess}
                                    countryAccessVisible={this.newUserCountriesVisible}
                                />
                            }
                            {!this.showForm &&
                                <Button
                                    disabled={false}
                                    type={'add'}
                                    value={'New user'}
                                    clickHandler={this.showUserForm}
                                />
                            }
                        </div>
                    </div>
                </CSSTransitionGroup>
            </div>
        );
    }
}
