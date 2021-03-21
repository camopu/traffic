import React from 'react'
import { observer, inject } from 'mobx-react';
import { observable, action, toJS } from 'mobx';

import Flag from '../General/Flag';
import Button from '../General/Button';

@inject('userStore', 'saleStore')
@observer
export default class TableFilters extends React.Component {

    @action toggleCountry = (e) => {
        let index = e.target.dataset.index;

        let access = this.props.saleStore.countryAccess.slice();

        if(access[index].active === 'yes') {
            access[index].active = 'no';
        } else {
            access[index].active = 'yes';
        }

        this.props.saleStore.countryAccess = access;
    }

    @action searchKeyPress = (e) => {

        // Enter key pressed, reload view
        if(e.keyCode === 13) {
            this.reloadSales();
        }
    }

    @action reloadSales = () => {
        this.props.saleStore.currentPage = 1;
        this.props.saleStore.getSales();
    }

    render() {
        let filtersActive = '';

        if(this.props.filterActive || this.props.saleStore.statusFilter || this.props.saleStore.onlyWithoutUrls || this.props.saleStore.launchDateFilter.start.length > 0 || this.props.saleStore.launchDateFilter.end.length > 0) {
            filtersActive = 'active';
        }

        return(
            <div className={"main-view-container__card__table__filters analytics"}>
                <div className={"main-view-container__card__table__filters__search"}>
                    <i className={"fas fa-search"}></i>
                    <input type={"text"} onChange={this.props.saleStore.setSearch} onKeyUp={this.searchKeyPress} placeholder={"Search"} />
                </div>

                <div className={`main-view-container__card__table__filters__inner ${filtersActive}`}>

                    <div className={"main-view-container__card__table__filters__inner__row"}>

                        <div className={"main-view-container__card__table__filters__launchdate"}>
                            <div><input onChange={this.props.saleStore.setLaunchStart} defaultValue={this.props.saleStore.launchDateFilter.start.length > 0 ? this.props.saleStore.launchDateFilter.start : ''} type={"date"} /></div>
                            <div> - <input onChange={this.props.saleStore.setLaunchEnd} defaultValue={this.props.saleStore.launchDateFilter.end.length > 0 ? this.props.saleStore.launchDateFilter.end : ''} type={"date"} /></div>
                            <select onChange={this.props.saleStore.datePick}>
                                <option value={""}>Launch date</option>
                                <option value={"week"}>This week</option>
                                <option value={"month"}>This month</option>
                                <option value={"quarter"}>This quarter</option>
                            </select>
                        </div>

                        <div className={"main-view-container__card__table__filters__status"}>
                            <select defaultValue={this.props.saleStore.statusFilter} onChange={this.props.saleStore.setStatus}>
                                <option value={""}>Status</option>
                                <option value={"done"}>Done</option>
                                <option value={"attention"}>Attention</option>
                                <option value={"on-track"}>On track</option>
                                <option value={"pre-launch"}>Not launched</option>
                            </select>
                        </div>
                        <div className={"main-view-container__card__table__filters__urls"}>
                            Missing urls:&nbsp;<input checked={this.props.saleStore.onlyWithoutUrls} type={"checkbox"} onChange={this.props.saleStore.setUrlFilter} />
                        </div>


                    </div>

                    <div className={"main-view-container__card__table__filters__country"}>

                        {this.props.saleStore.countryAccess.map((country, key) => {
                            return (
                                <Flag
                                    key={key}
                                    index={key}
                                    country={country.name}
                                    isActive={country.active}
                                    toggleCountry={this.toggleCountry}
                                />
                            );
                        })}
                    </div>
                </div>
                <button onClick={this.reloadSales} className={`redo ${filtersActive}`}>
                    Apply filters <i className={"fas fa-redo"}></i>
                </button>

                <button onClick={this.props.toggleFilter} className={`filter ${filtersActive}`}>
                    <i className={"fas fa-filter"}></i>
                </button>
            </div>
        )
    }
}