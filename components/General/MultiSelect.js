import React from 'react';

import {observer} from 'mobx-react';
import {toJS} from 'mobx';

import filterStore from '../../stores/FilterStore';

import '../../styles/multiselect.css';

const MultiSelect = ({data, onChangeHandler, toggleHandler, isExpanded, title}) => {

    let css = '';

    if(isExpanded) {
        css = 'active';
    }

    return(
        <div className={"multiselect-container"}>
            <div onClick={toggleHandler} className={`multiselect-container__title ${css}`}>
                {title}
                <i className={`fas fa-angle-down`}></i>
            </div>
            {isExpanded &&
                <div className={"multiselect-container__inner"}>
                    {filterStore.countries.map((country, key) => {
                        let checked = false;
                        if(data) {
                            data.forEach((userCountry) => {
                                if(userCountry.id === country.id) {
                                    checked = true;
                                }
                            });
                        }

                        return (
                            <div key={key} className={"multiselect-container__inner__element"}>
                                <input onChange={onChangeHandler} type={"checkbox"} data-id={country.id} defaultChecked={checked}/>
                                <div>{country.name}</div>
                            </div>
                        );
                    })}
                </div>
            }
        </div>
    )
}

export default observer(MultiSelect);