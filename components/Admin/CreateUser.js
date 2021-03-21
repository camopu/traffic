import React from 'react'
import { observer } from 'mobx-react'
import { inject } from 'mobx'
import { CSSTransitionGroup } from 'react-transition-group'

import Button from '../General/Button';
import MultiSelect from '../General/MultiSelect';
import Loader from '../General/Loader';
import adminStore from '../../stores/AdminStore';
import filterStore from '../../stores/FilterStore';

const CreateUser = (props) => {

    const { inputStatuses, inputsValid, showPassword, newUserUsertype, newUserPassword, togglePassword, newUserEmail, newUser, toggleAccess, countryAccessVisible} = props

    return (
        <CSSTransitionGroup
            transitionName="example"
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>
            <div className={"new-user-container"}>
                <div className={"new-user-container__inner"}>
                    <div className={"new-user-container__inner__input"}>
                        <div className={"new-user-container__inner__input__label"}>Email: </div>
                        <input type={"text"} placeholder={"MP email"} onChange={newUserEmail} />
                        {inputStatuses.email !== null &&
                        <i className={inputStatuses.email === true ? 'fas fa-thumbs-up' : 'fas fa-thumbs-down'}></i>
                        }
                    </div>
                    <div className={"new-user-container__inner__input"}>
                        <div className={"new-user-container__inner__input__label"}>Password: </div>
                        <input type={showPassword === true ? 'text' : 'password'} className={"password"} placeholder={"password"} onChange={newUserPassword} />
                        <i onClick={togglePassword} className={showPassword === true ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                        {inputStatuses.password !== null &&
                        <i icon={inputStatuses.password === true ? 'fas fa-thumbs-up' : 'fas fa-thumbs-down'}></i>
                        }
                    </div>

                    <div className={"new-user-container__inner__input"}>
                        <div className={"new-user-container__inner__input__label"}>Usertype: </div>
                        <select onChange={newUserUsertype}>
                            <option value={"2"}>Regular</option>
                            <option value={"1"}>Admin</option>
                        </select>
                    </div>

                    <div className={"new-user-container__inner__input"}>
                        {!filterStore.processing &&
                            <MultiSelect
                                onChangeHandler={adminStore.setNewUserCountry}
                                title={"Access"}
                                toggleHandler={toggleAccess}
                                isExpanded={countryAccessVisible}
                            />
                        }
                    </div>
                </div>
                {adminStore.processing &&
                    <div className={"new-user-container__loader"}>
                        <Loader
                            size={"small"}
                        />
                    </div>
                }
                {!adminStore.processing &&
                    <Button
                        disabled={inputsValid === true ? false : true}
                        type={'add'}
                        value={'Submit'}
                        clickHandler={newUser}
                    />
                }
            </div>
        </CSSTransitionGroup>
    )
}

export default observer(CreateUser)