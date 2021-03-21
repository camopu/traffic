import { observable, action, reaction } from 'mobx';

class GeneralStore {

    @observable appLoaded = false;
    @observable loadingView = true;
    @observable token = window.localStorage.getItem('jwt');

    constructor() {
        reaction(
            () => this.token,
            token => {
                if(token) {
                    window.localStorage.setItem('jwt', token)
                } else {
                    window.localStorage.removeItem('jwt');
                }
            }
        )
    }

    @action setAppLoaded(value) {
        this.appLoaded = value;
    }

    @action setToken(token) {
        this.token = token;
    }
}

export default new GeneralStore();