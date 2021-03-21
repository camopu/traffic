import React from 'react'
import { observer } from 'mobx-react'

const Search = (props) => {

    return(
        <div className={"main-view-container__search"}>
            <i className={"fas fa-search"}></i>
            <input type={"text"} placeholder={"Search"} />
        </div>
    )

}

export default observer(Search)