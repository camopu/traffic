import React from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from "mobx";

import Loader from '../General/Loader';
import Button from '../General/Button';
import Popup from '../General/Popup';
import Search from '../General/Search';
import { CSSTransitionGroup } from 'react-transition-group'

@inject('generalStore', 'userStore')
@observer
export default class Settings extends React.Component {

    @observable isLoading = true;
    @observable deactiveAccount = false;
    @observable newPassword = false;
    @observable passwordVisible = false;

    @action deactivationPopup = () => {
        this.deactiveAccount = true;
    }

    @action togglePasswordVisibility = () => {
        if(this.passwordVisible === true) {
            this.passwordVisible = false;
        } else {
            this.passwordVisible = true;
        }
    }

    @action toggleUpdatePassword = () => {
        if(this.newPassword === true) {
            this.newPassword = false;
        } else {
            this.newPassword = true;
        }
    }

    render() {

        let cssClass = '';

        if(this.newPassword === true) {
            cssClass = 'active';
        }

        return (
            <div className="main-view-container">

                {this.deactiveAccount &&
                    <Popup
                        type={"options"}
                        msg={"This will deactivate your account and force you to log out, are you sure?"}
                        clickHandler={this.props.userStore.deactivate}
                        denyClickHandler={() => this.deactiveAccount = false}
                    />
                }

                {this.props.userStore.status.code === 200 &&
                    <Popup
                        type={"success"}
                        msg={this.props.userStore.status.msg}
                        clickHandler={this.props.userStore.clearStatus}
                    />
                }

                {this.props.userStore.status.code === 400 &&
                    <Popup
                        type={"error"}
                        msg={this.props.userStore.status.msg}
                        clickHandler={this.props.userStore.clearStatus}
                    />
                }

                <CSSTransitionGroup
                    transitionName="example"
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    <div className={"main-view-container__settings"}>
                        <div className={"main-view-container__settings__buttons"}>
                            <button onClick={this.toggleUpdatePassword} className={`main-view-container__card quarter dark-blue ${cssClass}`}>
                                <div>
                                    Change password
                                </div>
                                <i className={"fas fa-key"}></i>
                            </button>
                            <button onClick={this.deactivationPopup} className={`main-view-container__card quarter dark-blue`}>
                                <div>
                                    Deactivate account
                                </div>
                                <i className={"fas fa-user-slash"}></i>
                            </button>
                        </div>
                        {this.newPassword &&
                            <div className={"main-view-container__settings__expanded"}>
                                <div className={"main-view-container__settings__expanded__inner"}>
                                    <em>
                                        Should be at least 6 characters and include one number and one upper case character.
                                    </em>
                                    <div>
                                        New password: <input onChange={this.props.userStore.setPassword} type={this.passwordVisible === true ? 'text' : 'password'} placeholder={"X X X X X X X"} />
                                        <i onClick={this.togglePasswordVisibility} className={this.passwordVisible === true ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                                        {this.props.userStore.newPassword.length > 0 &&
                                            <i className={this.props.userStore.passwordStatus === true ? 'fas fa-thumbs-up' : 'fas fa-thumbs-down'}></i>
                                        }
                                    </div>

                                    {this.props.userStore.processing &&
                                        <Loader
                                            size={"medium"}
                                        />
                                    }
                                    {!this.props.userStore.processing &&
                                        <Button
                                            type={"add"}
                                            value={"Save"}
                                            disabled={this.props.userStore.passwordStatus === true ? false : true}
                                            clickHandler={this.props.userStore.updatePassword}
                                        />
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </CSSTransitionGroup>
            </div>
        );
    }
}
