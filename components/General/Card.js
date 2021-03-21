import React from 'react'
import { observer } from 'mobx-react'

const Card = (props) => {

    const { size, color, title, Components } = props;

    return (

        <div className={`main-view-container__card ${size} ${color}`}>
            <h2>
                {title}
            </h2>
            <Components/>
        </div>
    )
}

export default observer(Card)