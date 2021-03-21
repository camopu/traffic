import { observable, action } from 'mobx';
import generalStore from './GeneralStore';
import userStore from './UserStore';

import agent from "../agent";

class AuthStore {

    @observable inProgress = false;
    @observable loginError = {
        email: false,
        password: false
    };
    @observable parameters = {
        email: '',
        password: ''
    };

    @action setPassword(password) {
        this.parameters.password = password;
    }

    @action setEmail(email) {
        this.parameters.email = email;
    }

    @action login() {
        this.inProgress = true;

        // Reset errors
        for(let key in this.loginError) {
            this.loginError[key] = false;
        }

        agent.Auth.login(this.parameters.email, this.parameters.password)
            .then(resp => {
                if(resp.data.err) {
                    resp.data.err.forEach((err) => {
                        if(err.type === "email") {
                            this.loginError.email = true;
                        }
                        if(err.type === "password") {
                            this.loginError.password = true;
                        }
                    });
                } else if (resp.data.authorized === true) {
                    generalStore.setToken(resp.data.token);
                }
            })
            .catch(error => console.log(error))
            .finally(action(() => {
                this.inProgress = false;
            }));
    }

    @action logout() {
        generalStore.setToken(null);
        userStore.forgetUser();
    }

}

export default new AuthStore();