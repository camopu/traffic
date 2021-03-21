import React from 'react'
import { CSSTransitionGroup } from 'react-transition-group'

import '../../styles/error.css'

const Error = (props) => {

    const { msg } = props;

    return(
        <CSSTransitionGroup
            transitionName="example"
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>
            <div key={"error"} className={"error-container"}>
                <i className={"fas fa-exclamation"}></i>
                <div className={"error-container__inner"}>
                    {msg}
                </div>
            </div>
        </CSSTransitionGroup>
    );
}
export default Error