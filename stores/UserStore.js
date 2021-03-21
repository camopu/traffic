import { observable, action } from 'mobx';

import agent from '../agent';
import authStore from './AuthStore';

class UserStore {

    @observable userLoaded = false;
    @observable currentUser = null;
    @observable newPassword = '';
    @observable passwordStatus = false;
    @observable status = {};
    @observable processing = false;

    @action forgetUser() {
        this.currentUser = null;
    }

    @action updatePassword = () => {

        this.processing = true;

        let formData = new FormData();
        formData.append('password', this.newPassword);

        agent.Requests.post('/user/update', formData).then(resp => {
            if(resp.status === 400 || resp.status === 401) {
                this.status.code = 400;
                this.status.msg = 'Something went wrong, please try again';
            } else {
                this.status.code = 200;
                this.status.msg = 'Password change successful';
            }
        }).finally(() => {
            this.newPassword = '';
            this.passwordStatus = false;
            this.processing = false;
        });
    }

    @action setUserLoaded = () => {
        this.userLoaded = true;
    }

    @action clearStatus = () => {
        this.status = {};
    }

    @action setPassword = (e) => {

        this.newPassword = e.target.value;
        this.passwordStatus = false;
        let includesNumber = false;
        let includesUppercase = false;

        let character = '';
        let i = 0;

        // Parse string for requirements
        while (i <= this.newPassword.length){
            character = this.newPassword.charAt(i);
            if (!isNaN(parseInt(character) * 1)){
                includesNumber = true;
            } else if (character.toLowerCase() && character === character.toUpperCase()) {
                includesUppercase = true;
            }
            i++;
        }

        // Min length of 6 in pw length
        if(this.newPassword.length >= 6 && includesNumber === true && includesUppercase === true) {
            this.passwordStatus = true;
        }
    }

    @action deactivate() {
        agent.Requests.post('/user/deactivate').then(() => {
            authStore.logout();
        });
    }
}

export default new UserStore();