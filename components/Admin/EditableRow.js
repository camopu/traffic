import React from 'react'
import Loader from '../General/Loader';
import { observer, inject } from 'mobx-react';
import { action, observable } from 'mobx';
import MultiSelect from '../General/MultiSelect';

@inject('adminStore')
@observer
export default class EditableRow extends React.Component {

    constructor(props) {
        super(props)

        // Set default user values
        this.props.adminStore.updateUserActive(props.active)
        this.props.adminStore.updateUserEmail(props.email)
        this.props.adminStore.updateUserUsertype(props.usertypeId)
        this.props.adminStore.updateUserPassword(false)
        this.props.adminStore.setUserId(props.id)
        this.props.adminStore.setDefaultUserAccess(props.access)
    }

    @observable countryAccessVisible = false;

    @action toggleCountryAccess = () => {
        if(this.countryAccessVisible) {
            this.countryAccessVisible = false;
        } else {
            this.countryAccessVisible = true;
        }
    }

    @action handleEmailChange = (e) => {
        this.props.adminStore.updateUserEmail(e.target.value)
    }

    @action handlePasswordChange = (e) => {
        this.props.adminStore.updateUserPassword(e.target.value)
    }

    @action handleActiveChange = (e) => {
        if(this.props.adminStore.updatedUser.active === 'yes') {
            this.props.adminStore.updateUserActive('no')
        } else {
            this.props.adminStore.updateUserActive('yes')
        }
    }

    @action handleUsertypeChange = (e) => {
        this.props.adminStore.updateUserUsertype(e.target.value)
    }
    
    render() {

        const { onUpdate } = this.props

        return (
            <tr>
                <td className={"email"}><input value={this.props.adminStore.updatedUser.email} onChange={this.handleEmailChange} type={"text"} /></td>
                <td className={"password"}><input onChange={this.handlePasswordChange} type={"password"} /></td>
                <td className={"type"}>
                    <select defaultValue={this.props.adminStore.updatedUser.usertype} onChange={this.handleUsertypeChange}>
                        <option value={"2"}>Regular</option>
                        <option value={"1"}>Admin</option>
                    </select>
                </td>
                <td>
                    <MultiSelect
                        data={this.props.access}
                        title={"Countries"}
                        isExpanded={this.countryAccessVisible}
                        toggleHandler={this.toggleCountryAccess}
                        onChangeHandler={this.props.adminStore.updateUserCountry}
                    />
                </td>
                <td className={"status"}>
                    <input type={"checkbox"} checked={this.props.adminStore.updatedUser.active === 'yes' ? 'checked' : ''} onChange={this.handleActiveChange} />
                    {this.props.adminStore.processing &&
                        <Loader
                            size={"small"}
                        />
                    }
                    {!this.props.adminStore.processing &&
                        <i onClick={onUpdate} className={"fas fa-save"}></i>
                    }
                </td>
            </tr>
        )
    }

}