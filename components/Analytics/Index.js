import React from 'react';
import { observer, inject } from 'mobx-react';
import { action, observable, reaction } from 'mobx';
import { withRouter } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group'

import Heart from './Heart';
import Loader from '../General/Loader';
import Search from '../General/Search';
import AnalyticsTable from './AnalyticsTable';

@inject('generalStore', 'userStore', 'saleStore')
@withRouter
@observer
export default class Analytics extends React.Component {

    @observable isLoading = true;
    @observable popupOpen = false;

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
        );
    }

    componentDidMount() {
        this.props.saleStore.getLastGoogleFetch();
        this.props.saleStore.getLastNapoleonFetch();
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


        return(
            <div className="main-view-container analytics">
                <CSSTransitionGroup
                    transitionName="example"
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    <div key={"analytics-container"} className={'main-view-container__card full dark-blue'}>
                        <div className={"main-view-container__title-container"}>
                            <h2>
                                Analytics
                            </h2>
                            {this.props.saleStore.google.loading === false &&
                                <Heart/>
                            }
                            {this.props.saleStore.google.loading === true &&
                                <Loader
                                    size={"small"}
                                />
                            }
                        </div>
                        <AnalyticsTable/>
                    </div>
                </CSSTransitionGroup>
            </div>
        );
    }
}
