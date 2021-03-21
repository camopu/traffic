import React from 'react'
import MultiSelect from '../../General/MultiSelect';
import '../../../styles/users_mobile.css';

import ProfileDefault from '../../../resources/images/image-default.svg';
import adminStore from '../../../stores/AdminStore';

const UserList = ({users, updateUser, saveUpdate, activeUser, toggleCountryMenu, countryMenuOpen, activeChange}) => {

    return(
        users.map((element, key) => {
            return (
                <div key={key} className={"users-mobile__user"}>
                    <div className={"users-mobile__user__top"}>
                        <div className={"users-mobile__user__top__image"}>
                            {element.image !== null &&
                            <img src={`https://napoleon.mediaplanet.com/images/employees/250x250/${element.image}`} />
                            }
                            {element.image === null &&
                            <img src={ProfileDefault} />
                            }
                        </div>
                        <div className={"users-mobile__user__middle"}>
                            <div className={`users-mobile__user__middle__email ${activeUser === element.id ? 'active' : ''}`}>
                                {element.email}
                            </div>

                            {activeUser === element.id &&
                                <div className={"users-mobile__user__middle__editables"}>
                                    <MultiSelect
                                        data={element.access}
                                        title={"Countries"}
                                        isExpanded={countryMenuOpen}
                                        toggleHandler={toggleCountryMenu}
                                        onChangeHandler={adminStore.updateUserCountry}
                                    />
                                    <div className={"users-mobile__user__middle__editables usertype"}>
                                        <select defaultValue={element.type_id} onChange={(e) => adminStore.updateUserUsertype(e.target.value)}>
                                            <option value={"1"}>Admin</option>
                                            <option value={"2"}>User</option>
                                        </select>
                                    </div>
                                    <div className={"users-mobile__user__middle__editables password"}>
                                        <input type={"password"} placeholder={"Password"} onChange={(e) => adminStore.updateUserPassword(e.target.value)} />
                                    </div>
                                    <div className={"users-mobile__user__middle__editables active"}>
                                        Active:&nbsp;<input type={"checkbox"} defaultChecked={element.active === 'yes' ? 'checked' : ''} onChange={activeChange} />
                                    </div>
                                </div>
                            }

                        </div>
                        <div className={"users-mobile__user__bottom"}>
                            {activeUser !== element.id &&
                                <button className={"edit"} onClick={() => updateUser(element)}>
                                    Edit <i onClick={() => updateUser(element)} className="fas fa-edit"></i>
                                </button>
                            }

                            {activeUser === element.id &&
                                <button className={"save"} data-id={element.id} onClick={saveUpdate}>
                                    Save <i data-id={element.id} onClick={saveUpdate} className="fas fa-save"></i>
                                </button>
                            }

                        </div>
                    </div>
                </div>
            );
        })
    )
}
export default UserList;