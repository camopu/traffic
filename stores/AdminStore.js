import { observable, action, toJS } from 'mobx';

import agent from '../agent';
import filterStore from './FilterStore';

class AdminStore {

    @observable newUser = {
        countries: []
    };
    @observable updatedUser = {
        countries: []
    };
    @observable archivedProjects = [];
    @observable creationStatus = true
    @observable updateStatus = true
    @observable processing = false
    @observable loadingUsers = false
    @observable searchTerm = ''
    @observable archiveSearchTerm = ''

    @observable users = [];
    @observable currentPage = 1;
    @observable currentArchivePage = 1;
    @observable pages = 1;
    @observable archivePages = 1;
    @observable totalUsers = 0;
    @observable totalArchivedProjects = 0;
    @observable timestamp = 0;

    @action unarchiveProject = (projectId) => {
        let formData = new FormData();

        formData.append('project_id', projectId);
        formData.append('archive', 'no');

        agent.Requests.post('/analytics/archive', formData).then(resp => {
            if(resp.status === 400 || resp.status === 401) {
                this.error = 'Something went wrong when trying to archive the project. Refresh the view and try again.';
            }
        }).finally(() => {
            this.getArchivedProjects();
        });
    }

    @action getArchivedProjects = () => {
        this.processing = true;

        let countries = filterStore.countries.slice();
        let countryIds = [];

        countries.forEach((country) => {
            if(country.active === 'yes') {
                countryIds.push(country.id)
            }
        });

        agent.Requests.get(`/analytics/get-archive?page=${this.currentArchivePage}&search=${this.archiveSearchTerm}&countryIds=${countryIds}`).then(resp => {
            if(resp.data.length !== 0) {
                let time = new Date(resp.data.timestamp);

                this.archivedProjects = resp.data.projects;
                this.archivePages = resp.data.pages;
                this.totalArchivedProjects = resp.data.total;
                this.timestamp = time.getHours() + ':' + (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ':' + (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds());
            }
        }).finally(() => {
            this.processing = false;
        });
    }

    @action createUser() {

        this.processing = true;
        this.creationStatus = true;

        let formData = new FormData();

        formData.append('email', this.newUser.email);
        formData.append('password', this.newUser.password);
        formData.append('usertype', this.newUser.usertype);
        formData.append('countryIds', JSON.stringify(this.newUser.countries));

        return agent.Requests.post('/user/newUser', formData).finally(() => {
            this.newUser.email = '';
            this.newUser.password = '';
            this.newUser.usertype = 2;
            this.newUser.countries = [];
        });
    }

    @action getUsers = () => {
        this.loadingUsers = true;

        let countries = filterStore.countries.slice();
        let countryIds = [];

        countries.forEach((country) => {
            if(country.active === 'yes') {
                countryIds.push(country.id)
            }
        });

        agent.Requests.get(`/user/getUsers?page=${this.currentPage}&search=${this.searchTerm}&countryIds=${countryIds}`)
            .then(resp => {
                if(resp.data.length !== 0) {
                    let time = new Date(resp.data.timestamp);

                    this.users = resp.data.users;
                    this.pages = resp.data.pages;
                    this.totalUsers = resp.data.total;
                    this.timestamp = time.getHours() + ':' + (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ':' + (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds());
                }
            }).finally(action(() => {
            this.loadingUsers = false;
        }))
    }

    @action updateUser() {

        this.processing = true;
        this.updateStatus = true;

        let formData = new FormData();

        formData.append('id', this.updatedUser.id);
        formData.append('email', this.updatedUser.email);
        formData.append('usertype', this.updatedUser.usertype);
        formData.append('active', this.updatedUser.active);
        formData.append('countryIds', JSON.stringify(this.updatedUser.countries));

        // Check if new pw is set for user
        if(this.updatedUser.password !== false) {
            formData.append('password', this.updatedUser.password);
        }

        return agent.Requests.post('/user/update', formData);
    }

    /* Create */
    @action setNewUserEmail(email) {
        this.newUser.email = email;
    }

    @action setNewUserPassword(password) {
        this.newUser.password = password;
    }

    @action setNewUserUsertype(type) {
        this.newUser.usertype = type;
    }

    @action setNewUserCountry = (e) => {

        let countryIds = this.newUser.countries.slice();

        countryIds.forEach((id, index) => {
            if(id === e.target.dataset.id) {
                countryIds.splice(index, 1);
            }
        });

        if(e.target.checked) {
            countryIds.push(e.target.dataset.id);
        }

        this.newUser.countries = countryIds;
    }


    /* Update */

    @action setDefaultUserAccess(access) {

        this.updatedUser.countries = [];

        access.forEach((country) => {
            this.updatedUser.countries.push(country.id);
        });
    }

    @action updateUserCountry = (e) => {
        let countryIds = this.updatedUser.countries.slice();

        if(e.target.checked) {
            countryIds.push(e.target.dataset.id);
        } else {
            countryIds.forEach((id, index) => {
                if(id === e.target.dataset.id) {
                    countryIds.splice(index, 1);
                }
            });
        }
        this.updatedUser.countries = countryIds;
    }

    @action setUserId(id) {
        this.updatedUser.id = id;
    }

    @action updateUserEmail(email) {
        this.updatedUser.email = email;
    }

    @action updateUserPassword(password) {
        this.updatedUser.password = password;
    }

    @action updateUserActive(active) {
        this.updatedUser.active = active;
    }

    @action updateUserUsertype(usertype) {
        this.updatedUser.usertype = usertype;
    }

    /* Search */
    @action handleSearch = (e) => {
        this.currentPage = 1;
        this.searchTerm = e.target.value;
        this.getUsers()
    }

    /* Search */
    @action handleArchiveSearch = (e) => {
        this.currentPage = 1;
        this.archiveSearchTerm = e.target.value;
        this.getArchivedProjects()
    }

    /* Table page */
    @action setPage = (e) => {
        this.currentPage = e.target.value;
        this.getUsers()
    }

    /* Table page */
    @action setArchivePage = (e) => {
        this.currentArchivePage = e.target.value;
        this.getArchivedProjects()
    }
}

export default new AdminStore();