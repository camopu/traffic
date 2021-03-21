import React from 'react';

import {observer} from 'mobx-react';
import Flag from '../General/Flag';
import Loader from '../General/Loader';
import filterStore from '../../stores/FilterStore';
import adminStore from '../../stores/AdminStore';

const Filters = ({toggleFilter, filtersVisible, onSearch}) => {

    let filtersActive = '';

    if(filtersVisible) {
        filtersActive = 'active';
    }

    return(
        <div className={"main-view-container__card__table__filters analytics"}>
            <div className={"main-view-container__card__table__filters__search"}>
                <i className={"fas fa-search"}></i>
                <input type={"text"} onChange={onSearch} placeholder={"Search"} />
            </div>

            <div className={`main-view-container__card__table__filters__inner ${filtersActive}`}>

                {filterStore.processing &&
                    <Loader
                        size={"small"}
                    />
                }

                {!filterStore.processing &&
                    <div className={"main-view-container__card__table__filters__country"}>

                        {filterStore.countries.map((country, key) => {
                            return (
                                <Flag
                                    key={key}
                                    index={key}
                                    country={country.name}
                                    isActive={country.active}
                                    toggleCountry={filterStore.toggleCountry}
                                />
                            );
                        })}
                    </div>
                }
            </div>
            <button onClick={adminStore.getUsers} className={`redo ${filtersActive}`}>
                Apply filters <i className={"fas fa-redo"}></i>
            </button>

            <button onClick={toggleFilter} className={`filter ${filtersActive}`}>
                <i className={"fas fa-filter"}></i>
            </button>
        </div>
    );
}

export default observer(Filters);