import React from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import SuccessIcon from './SuccessIcon';

import '../../styles/success.css'

const Success = (props) => {

    const { msg } = props;

    return(
        <CSSTransitionGroup
            transitionName="example"
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>
            <div key={"success"} className={"success-container"}>
                <SuccessIcon/>
                <div className={"success-container__inner"}>
                    {msg}
                </div>
            </div>
        </CSSTransitionGroup>
    );
}
export default Success