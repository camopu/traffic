import generalStore from './stores/GeneralStore';
import authStore from './stores/AuthStore';
import {toJS} from 'mobx';
import { BrowserRouter } from 'react-router-dom'


const API_ROOT = process.env.REACT_APP_API_ROOT;

const encode = encodeURIComponent;

const handleErrors = resp => {
    if(resp.status && resp.status === 401) {
        authStore.logout();
    }
    return resp;
};

// Hold request methods
const Requests = {
    post: (url, body) => {
        return fetch(`${API_ROOT}${url}`, {
            method: 'POST',
            headers: (generalStore.token !== null ? {Authorization: `Bearer ${generalStore.token}`} : {}),
            body: body
        }).then(response => response.json())
        .then(handleErrors)
    },
    get: (url) => {
        return fetch(`${API_ROOT}${url}`, {
            method: 'GET',
            headers: (generalStore.token !== null ? {Authorization: `Bearer ${generalStore.token}`} : {})
        }).then(response => response.json())
        .then(handleErrors)
    }
}


const RequestsSaleStore = { 
    post: (url, body) => {
                return fetch(`${API_ROOT}${url}`, {
                    method: 'POST',
                    headers: (generalStore.token !== null ? {Authorization: `Bearer ${generalStore.token}`} : {}),
                    body: body
                }).then(response => response.json())
                .then(handleErrors)
    },
    get: (url) => {
        let controller = new AbortController();
        if (location.pathname === '/home') {
            setTimeout(() => controller.abort(), 0);
        }
        
        try {
            return fetch(`${API_ROOT}${url}`, {
                method: 'GET',
                headers: (generalStore.token !== null ? {Authorization: `Bearer ${generalStore.token}`} : {}),
                signal: controller.signal
                    }).then(response => response.json())

              .then(handleErrors)
        } 
        catch(err) {
            if (err.name == 'AbortError') { 
            } else {
              throw err;
            }
        }
        
    }
}




// const constantMock = window.fetch;
// window.fetch = function() {
//     console.log(arguments);

//     return new Promise((resolve, reject) => {
//         constantMock.apply(this, arguments)
//             .then((response) => {
//                 if(response.url.indexOf("/analytics/top-articles1") && window.location.pathname === '/home'){
//                     console.log('sales stop');
//                     // console.log(responce.referer);
                  
//                     // do something for specificconditions
//                 }
//                 resolve(response);
//             })
//             .catch((error) => {
//             })
//     });
//  }

 

const Auth = {

    getUser: () => {
        return Requests.get(`/user/current`)
    },

    login: (email, password) => {

        let formData = new FormData();

        formData.append('email', email);
        formData.append('password', password);

        // Return promise
        return Requests.post('/user/authorize', formData);
    }
};

export default {
    Requests,
    RequestsSaleStore,
    Auth,
};