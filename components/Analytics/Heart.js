import React from 'react'
import { observer, inject } from 'mobx-react';
import { action, observable, reaction } from 'mobx';

import Moment from 'react-moment';
import HeartIcon from '../../resources/images/heart.svg';

@inject('saleStore')
@observer
export default class Heart extends React.Component {

    @observable today = null;
    @observable loading = true;

    constructor(props) {
        super(props);

        this.today = this.getISO();

        reaction(
            () => setInterval(this.getISO, 1000),
            iso => {
                this.today = iso;
            }
        )
    }

    // Get current datetime in UTC
    @action getISO = () => {
        let iso = new Date().toISOString();
        return iso;
    }

    render() {
        return (
            <div className={"main-view-container__title-container__heart"}>
                <div className={"main-view-container__title-container__heart__status"}>
                    <div className={"main-view-container__title-container__heart__status__inner"}>
                        <strong>Data retrieval status</strong>
                        <div className={"main-view-container__title-container__heart__status__inner__times"}>
                            <ul>
                                <li>Napoleon<img src={HeartIcon} /></li>
                                {this.props.saleStore.napoleon.status === 'ongoing' &&
                                    <li>Fetching new data...</li>
                                }
                                {this.props.saleStore.napoleon.status !== 'ongoing' &&
                                    <li title={"Last Napoleon update"}>
                                        <i className="far fa-clock"></i>
                                        <Moment fromNow>{this.props.saleStore.napoleon.lastFetch}</Moment>
                                    </li>
                                }
                                {this.props.saleStore.napoleon.status !== 'ongoing' &&
                                    <li title={"Time remaining to next Napoleon update"}>
                                        <i className="fas fa-hourglass-half"></i>
                                        <Moment to={this.props.saleStore.napoleon.nextFetch}>{this.today}</Moment>
                                    </li>
                                }
                            </ul>
                            <ul>
                                <li>Google analytics<img src={HeartIcon} /></li>
                                {this.props.saleStore.google.status === 'ongoing' &&
                                    <li>Fetching new data...</li>
                                }
                                {this.props.saleStore.google.status !== 'ongoing' &&
                                <li title={"Last Google analytics update"}>
                                    <i className="far fa-clock"></i>
                                    <Moment fromNow>{this.props.saleStore.google.lastFetch}</Moment>
                                </li>
                                }
                                {this.props.saleStore.google.status !== 'ongoing' &&
                                <li title={"Time remaining to next Google analytics update"}>
                                    <i className="fas fa-hourglass-half"></i>
                                    <Moment to={this.props.saleStore.google.nextFetch}>{this.today}</Moment>
                                </li>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};