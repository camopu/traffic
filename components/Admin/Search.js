import React from 'react'
import { observer } from 'mobx-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Search = ({handleSearch}) => {

    return(
        <div className={"main-view-container__card__table__filters__search"}>
            <i className={"fas fa-search"}></i>
            <input type={"text"} onChange={handleSearch} placeholder={"Search"} />
        </div>
    )

}

export default observer(Search)