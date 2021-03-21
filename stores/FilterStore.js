import { observable, action } from 'mobx';

import agent from '../agent';

class FilterStore {

    @observable processing = true;
    @observable countries = [];
    @observable visible = false;

    @action getCountries() {
        this.processing = true;
        agent.Requests.get('/country/all')
            .then(resp => {
                if(resp.data.length !== 0) {
                    this.countries = resp.data
                }
            }).finally(action(() => {
            this.processing = false;
        }));
    }

    @action toggleFilter = () => {
        if(this.visible) {
            this.visible = false;
        } else {
            this.visible = true;
        }
    }

    @action toggleCountry = (e) => {

        let countryIndex = e.target.dataset.index;

        let countryCopy = this.countries.slice();

        if(countryCopy[countryIndex].active === 'yes') {
            countryCopy[countryIndex].active = 'no';
        } else {
            countryCopy[countryIndex].active = 'yes';
        }

        this.countries = countryCopy;
    }
}

export default new FilterStore();