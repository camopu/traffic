import React from 'react';
import { observer, inject } from 'mobx-react'
import { action, observable, toJS } from 'mobx'

import UserList from './Mobile/UserList';
import EditableRow from '../Admin/EditableRow'
import Loader from '../General/Loader';
import Popup from '../General/Popup';
import Pagination from '../General/Table/Pagination';
import Headers from '../General/Table/Headers';
import adminStore from "../../stores/AdminStore";

const UserMenu = (props) => {

    const { editRow, user } = props

    return (
        <div className={"main-view-container__card__table__inner__usermenu"}>
            <ul>
                <li onClick={() => editRow(user)} ><i className={"fas fa-user-edit"}></i>Edit user</li>
            </ul>
        </div>
    )
}

const Row = (props) => {

    const { rowData, menuToggle, editRow, editableUser, showUserMenu, updateUser } = props;

    // Usertype to user icon translation
    const typeToIcon = {
        admin: 'user-astronaut',
        regular: 'user'
    }

    const isEditable = (editableUser == rowData.id)

    if(isEditable) {
        return (
            <EditableRow
                id={rowData.id}
                email={rowData.email}
                usertypeId={rowData.type_id}
                active={rowData.active}
                access={rowData.access}
                onUpdate={updateUser}
            />
        )
    }

    return(
        <tr data-uid={rowData.id}>
            <td className={"email"}>{rowData.email}</td>
            <td className={"password"}><i className={"fas fa-key"}></i></td>
            <td className={"type"}><i className={`fas fa-${typeToIcon[rowData.type]}`}></i></td>
            <td>
                {rowData.access.length > 0 &&
                    <select>
                        {rowData.access.map((country, key) => {
                            return <option key={key}>{country.name}</option>
                        })}
                    </select>
                }
                {rowData.access.length <= 0 &&
                    <div>-</div>
                }
            </td>
            <td className={"status"}>
                {rowData.id === showUserMenu &&
                    <UserMenu
                        editRow={editRow}
                        user={showUserMenu}
                    />
                }
                {rowData.active}
                <i onClick={() => menuToggle(rowData.id)} className={"fas fa-ellipsis-v"}></i>
            </td>
        </tr>
    );
}

const Data = (props) => {

    const { data, menuToggle, editRow, editableUser, updateUser, showUserMenu } = props;

    // Add password to user data to later parse into table
    data.map((element) => {
        element.password = '';
    })

    return (
        <tbody>
        {data &&
        data.map((element, key) => {
            {
                return(
                    <Row
                        key={key}
                        menuToggle={menuToggle}
                        rowData={element}
                        editRow={editRow}
                        showUserMenu={showUserMenu}
                        editableUser={editableUser}
                        updateUser={updateUser}
                    />
                )
            }
        })
        }
        </tbody>
    );

}

@inject('adminStore', 'filterStore')
@observer
export default class UsersTable extends React.Component {

    @observable showUserMenu = false;
    @observable editableUser = false;
    //@observable isLoading = false;
    @observable popupOpen = false;
    @observable userToUpdate = 0;
    @observable mobileCountryMenuOpen = false;

    // Table mounted, populate with users
    componentDidMount() {
        this.props.adminStore.getUsers();
        this.props.filterStore.getCountries();
    }

    resetValues() {
        this.popupOpen = false
        this.editableUser = false
        this.showUserMenu = false
    }

    getUsers = () => {
        this.props.adminStore.getUsers()
        this.resetValues()
    }

    @action updateUser = () => {
        this.props.adminStore.updateUser()
            .then(this.props.handleResp)
            .finally(action(() => {
                this.popupOpen = true
                this.props.adminStore.processing = false;
            }))
    }

    @action toggleUserMenu = (uid) => {
        if(uid === this.showUserMenu) {
            this.showUserMenu = false;
        } else if (uid !== false) {
            this.showUserMenu = uid
        } else {
            this.showUserMenu = false
        }
    }

    @action userEditable = (uid) =>  {
        if(uid === this.editableUser) {
            this.editableUser = false;
        } else if (uid !== false) {
            this.editableUser = uid
        } else {
            this.editableUser = false
        }
    }

    @action setUserToUpdate = (user) => {

        if(user.id > 0) {
            this.userToUpdate = user.id;

            // Set default user values
            this.props.adminStore.updateUserActive(user.active)
            this.props.adminStore.updateUserEmail(user.email)
            this.props.adminStore.updateUserUsertype(user.type_id)
            this.props.adminStore.updateUserPassword(false)
            this.props.adminStore.setUserId(user.id)
            this.props.adminStore.setDefaultUserAccess(user.access)

        } else {
            this.userToUpdate = 0;
        }
    }

    @action handleActiveChange = () => {
        if(this.props.adminStore.updatedUser.active === 'yes') {
            this.props.adminStore.updateUserActive('no')
        } else {
            this.props.adminStore.updateUserActive('yes')
        }
    }


    @action toggleMobileCountryAccess = () => {
        if(this.mobileCountryMenuOpen) {
            this.mobileCountryMenuOpen = false;
        } else {
            this.mobileCountryMenuOpen = true;
        }
    }

    render() {

        const { headers, respMsg } = this.props;

        if(this.props.adminStore.loadingUsers) {
            return (
                <div className={"main-view-container__card__table__inner"}>
                    <div className={"loader-container"}>
                        <Loader
                            size={'large'}
                        />
                    </div>
                </div>
            )
        }

        return(
            <div className={"main-view-container__card__table__inner"}>
                {this.popupOpen &&
                    <Popup
                        msg={respMsg}
                        type={this.props.adminStore.creationStatus === 200 ? 'success' : 'error'}
                        clickHandler={this.getUsers}
                    />
                }

                {this.props.adminStore.users.length > 0 &&
                    <div className={"main-view-container__card__table__inner users-mobile"}>
                        <UserList
                            users={this.props.adminStore.users}
                            updateUser={this.setUserToUpdate}
                            saveUpdate={this.updateUser}
                            activeUser={this.userToUpdate}
                            toggleCountryMenu={this.toggleMobileCountryAccess}
                            countryMenuOpen={this.mobileCountryMenuOpen}
                            activeChange={this.handleActiveChange}
                        />
                    </div>
                }

                {this.props.adminStore.users.length > 0 &&
                    <table>
                        <Headers
                            headers={headers}
                        />
                        <Data
                            data={this.props.adminStore.users}
                            menuToggle={this.toggleUserMenu}
                            editRow={this.userEditable}
                            editableUser={this.editableUser}
                            updateUser={this.updateUser}
                            showUserMenu={this.showUserMenu}
                        />
                    </table>
                }
                {this.props.adminStore.users.length <= 0 &&
                    <div className={"error"}>
                        No users found!
                    </div>
                }
                <div className={"main-view-container__card__table__inner__bottom"}>
                    <Pagination
                        page={this.props.adminStore.currentPage}
                        pages={this.props.adminStore.pages}
                        total={this.props.adminStore.totalUsers}
                        pageClick={this.props.adminStore.setPage}
                        timestamp={this.props.adminStore.timestamp}
                    />
                </div>
            </div>
        )
    }
}