import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';

import generalStore from './stores/GeneralStore';
import authStore from './stores/AuthStore';
import userStore from './stores/UserStore';
import adminStore from './stores/AdminStore';
import saleStore from './stores/SaleStore';
import commentStore from './stores/CommentStore';
import filterStore from './stores/FilterStore';
import articleDeliveryStore from './stores/ArticleDeliveryStore';
import App from './components/App';

const stores = {
    generalStore,
    authStore,
    userStore,
    adminStore,
    saleStore,
    commentStore,
    filterStore,
    articleDeliveryStore
};

ReactDOM.render(
    <Provider {...stores}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
