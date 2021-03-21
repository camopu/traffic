import React from 'react'
import { observer } from 'mobx-react'

import '../../styles/button.css';

const Button = (props) => {

    const { clickHandler, type, value, disabled, meta } = props;

    return(
        <button data-meta={meta ? meta : ''} disabled={disabled === true ? 'disabled' : ''} onClick={clickHandler} className={type}>{value}</button>
    )
}

export default observer(Button)