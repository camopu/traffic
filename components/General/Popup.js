import React from 'react';
import Success from '../General/Success';
import Error from '../General/Error';
import Button from '../General/Button';
import { CSSTransitionGroup } from 'react-transition-group'

import '../../styles/popup.css'

const Popup = ({type, msg, clickHandler, denyClickHandler}) => {

    if(type === 'success') {
        return (
            <CSSTransitionGroup
                transitionName="example"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}>
                <div className={"popup-container"}>
                    <div className={"popup-container__inner"}>
                        <Success
                            msg={msg}
                        />
                        <Button
                            type={"confirm"}
                            value={"OK"}
                            clickHandler={clickHandler}
                        />
                    </div>
                </div>
            </CSSTransitionGroup>
        );
    } else if(type === 'options') {
        return (
            <CSSTransitionGroup
                transitionName="example"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}>
                <div className={"popup-container"}>
                    <div className={"popup-container__inner"}>
                        <Error
                            msg={msg}
                        />
                        <div className={"popup-container__inner__buttons"}>
                            <Button
                                type={"confirm"}
                                value={"Yes"}
                                clickHandler={clickHandler}
                            />
                            <Button
                                type={"confirm"}
                                value={"No"}
                                clickHandler={denyClickHandler}
                            />
                        </div>
                    </div>
                </div>
            </CSSTransitionGroup>
        );
    } else {

        return (
            <CSSTransitionGroup
                transitionName="example"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}>
                <div className={"popup-container"}>
                    <div className={"popup-container__inner"}>
                        <Error
                            msg={msg}
                        />
                        <Button
                            type={"confirm"}
                            value={"OK"}
                            clickHandler={clickHandler}
                        />
                    </div>
                </div>
            </CSSTransitionGroup>
        );
    }
}

export default Popup;