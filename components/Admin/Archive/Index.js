import React from 'react';
import { observer, inject } from 'mobx-react';
import { action, observable } from 'mobx';
import { withRouter } from 'react-router-dom';

import { CSSTransitionGroup } from 'react-transition-group'
import ArchiveTable from './ArchiveTable';
import Button from '../../General/Button';
import Loader from '../../General/Loader';
import Popup from '../../General/Popup';
import CreateUser from './../CreateUser';
import agent from '../../../agent';
import Search from '../../General/Search';
import UserSearch from './../Search';
import Filters from './Filters';

import NoAccess from '../../General/NoAccess';

import '../../../styles/main_view.css';
import '../../../styles/admin_view.css';
import {reaction} from "mobx/lib/mobx";

//TODO refactor, bloated component
@inject('generalStore', 'adminStore', 'userStore', 'filterStore')
@withRouter
@observer
export default class Archive extends React.Component {

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

    componentDidMount() {
        this.props.filterStore.getCountries();
        this.props.adminStore.getArchivedProjects();
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

        return (
            <div className="main-view-container archive">
                <CSSTransitionGroup
                    transitionName="example"
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    <div key={"admin-users"} className={'main-view-container__card full dark-blue'}>
                        <h2>
                            Archived projects
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
                                onSearch={this.props.adminStore.handleArchiveSearch}
                                toggleFilter={this.props.filterStore.toggleFilter}
                                filtersVisible={this.props.filterStore.visible}
                            />
                            <ArchiveTable
                                headers={[
                                    {
                                        text: 'Project'
                                    },
                                    {
                                        text: 'PM'
                                    }
                                ]}
                            />
                        </div>
                    </div>
                </CSSTransitionGroup>
            </div>
        );
    }
}
