import React from 'react'
import { observable, action, toJS } from 'mobx';

import agent from '../agent';

class SaleStore {
    @observable loadingSales = true;
    @observable processing = false;
    @observable sales = {};
    @observable newArticle = {};
    @observable updateArticleData = {};
    @observable error = '';
    @observable countryAccess = [];

    @observable currentPage = 1;
    @observable pages = 1;
    @observable totalSales = 0;
    @observable pageLimit = 8;

    @observable onlyWithoutUrls = false;
    @observable searchTerm = '';
    @observable lastUpdate = '';
    @observable launchDateFilter = {
        start: '',
        end: ''
    };
    @observable statusFilter = '';
    @observable napoleon = {
        nextFetch: '',
        lastFetch: '',
        status: '',
        loading: true,
    };
    @observable google = {
        nextFetch: '',
        lastFetch: '',
        status: '',
        loading: true,
    };

    @observable sorting = {
        order: 'ASC',
        column: ''
    };

    @action getLastGoogleFetch = () => {

        // If ongoing we're waiting for cron to finish
        if(this.google.status !== 'ongoing') {
            this.google.loading = true;
        }

        agent.RequestsSaleStore.get(`/analytics/google`)
            .then(resp => {
                if(resp.data.length !== 0) {
                    this.google.status = resp.data.status;
                    this.google.nextFetch = resp.data.timestamps.next;

                    // Get when last google fetch was made, UTC to local
                    this.google.lastFetch = new Date(resp.data.timestamps.done_time);
                }
        }).finally(() => {

            // cron still running, go again
            if(this.google.status === 'ongoing') {
                setTimeout(() => this.getLastGoogleFetch(), 5000);
            }

            this.google.loading = false;
        });
    }

    @action getLastNapoleonFetch = () => {
        // If ongoing we're waiting for cron to finish
        if(this.napoleon.status !== 'ongoing') {
            this.napoleon.loading = true;
        }

        agent.RequestsSaleStore.get(`/analytics/napoleon`)
            .then(resp => {
                if(resp.data.length !== 0) {
                    this.napoleon.status = resp.data.status;
                    this.napoleon.nextFetch = resp.data.timestamps.next;

                    // Get when last google fetch was made, UTC to local
                    this.napoleon.lastFetch = new Date(resp.data.timestamps.done_time);
                }
            }).finally(() => {

            // cron still running, go again
            if(this.napoleon.status === 'ongoing') {
                setTimeout(() => this.getLastNapoleonFetch(), 5000);
            }

            this.napoleon.loading = false;
        });
    }

    @action getSales = () => {
        this.loadingSales = true

        let countryIds = [];

        if(this.countryAccess.length > 0) {
            this.countryAccess.forEach((country) => {
                if(country.active === 'yes') {
                    countryIds.push(country.id);
                }
            });
        }

    //    if(window.location.pathname === '/analytics/overview') {
    //         agent.RequestsSaleStore.get(encodeURI(`/user/current`));
    //     }

            agent.RequestsSaleStore.get(encodeURI(`/analytics/sales?countryId=${countryIds}&launchStart=${this.launchDateFilter.start}&launchEnd=${this.launchDateFilter.end}&search=${this.searchTerm}&page=${this.currentPage}&status=${this.statusFilter}&withoutUrls=${this.onlyWithoutUrls}&sortBy=${this.sorting.column}&sortOrder=${this.sorting.order}&limit=${this.pageLimit}`))
                .then(resp => {
                    if(resp.data.length !== 0) {
                        let time = new Date(resp.data.timestamp);

                        this.sales = resp.data.projects;

                        this.lastUpdate = time.getHours() + ':' + (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ':' + (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds());
                        this.pages = resp.data.pages;
                        this.totalSales = resp.data.total;
                    }

                }).finally(action(() => {
                this.loadingSales = false;
            }));
        
        
    }

    @action submitArticle = () => {

        this.processing = true;
        let formData = new FormData();

        if(parseInt(this.newArticle.guaranteed) > parseInt(this.newArticle.maxReaders)) {
            this.error = `This sale is for ${this.newArticle.maxReaders} readers, you're trying to guarantee more than that (${this.newArticle.guaranteed}).`;
            this.processing = false;
        } else if (this.newArticle.url.length <= 5) {
            this.error = `Invalid url "${this.newArticle.url}", please fix it and try again.`;
            this.processing = false;
        } else {
            formData.append('sale_id', this.newArticle.saleId);
            formData.append('url', this.newArticle.url);
            formData.append('guaranteed', this.newArticle.guaranteed);
            formData.append('launch_date', this.newArticle.launchDate);
            formData.append('end_date', this.newArticle.endDate);
            formData.append('approved', (this.newArticle.approved ? this.newArticle.approved : 'off'));

            agent.Requests.post('/article/new', formData).then(resp => {
                if(resp.status === 400 || resp.status === 401) {
                    this.error = 'Something went wrong when trying to create the article. Have a look at the article settings and try again.';
                }
            }).finally(() => {
                this.newArticle = {};
                this.processing = false;
                this.getSales();
            });
        }
    }

    @action setUrlFilter = (e) => {

        this.onlyWithoutUrls = false;

        if(e.target.checked) {
            this.onlyWithoutUrls = true;
        }
    }

    @action setStatus = (e) => {
        this.statusFilter = e.target.value;
    }

    @action setPage = (e) => {
        this.currentPage = e.target.value;
        this.getSales();
    }

    @action setSearch = (e) => {
        this.searchTerm = e.target.value;
    }

    @action setLaunchStart = (e) => {
        this.launchDateFilter.start = e.target.value;
    }

    @action setLaunchEnd = (e) => {
        this.launchDateFilter.end = e.target.value;
    }

    @action datePick = (e) => {
        let type = e.target.value;

        let today = new Date();

         switch(type) {
             case 'week':

                 let first = today.getDate() - today.getDay();
                 first = first + 1;
                 let last = first + 6;

                 let monday = new Date(today.setDate(first));
                 let sunday = new Date(today.setDate(last));

                 // Get month starts at 0
                 let startMonth = monday.getMonth() + 1;

                 if(startMonth < 10) {
                     startMonth = '0' + startMonth;
                 }

                 let startDay = monday.getDate();

                 if(startDay < 10) {
                     startDay = '0' + startDay;
                 }

                 // Get month starts at 0
                 let endMonth = sunday.getMonth() + 1;

                 if(endMonth < 10) {
                     endMonth = '0' + endMonth;
                 }

                 let endDay = sunday.getDate();

                 if(endDay < 10) {
                     endDay = '0' + endDay;
                 }

                 // Set start and end dates
                 this.launchDateFilter.start = `${monday.getFullYear()}-${startMonth}-${startDay}`;
                 this.launchDateFilter.end = `${sunday.getFullYear()}-${endMonth}-${endDay}`;

                 break;
             case 'month':

                 // Get month starts at 0
                 let month = today.getMonth() + 1;

                 if(month < 10) {
                     month = '0' + month;
                 }

                 endDay = new Date(today.getFullYear(), month, 0).getDate();

                 // Set start and end dates
                 this.launchDateFilter.start = `${today.getFullYear()}-${month}-01`;
                 this.launchDateFilter.end = `${today.getFullYear()}-${month}-${endDay}`;

                 break;
             case 'quarter':

                 today = new Date();
                 let quarter = Math.floor((today.getMonth() + 3) / 3);

                 switch(quarter) {
                     case 1:
                         startDay = `${today.getFullYear()}-01-01`;
                         endDay = `${today.getFullYear()}-03-${new Date(today.getFullYear(), 3, 0).getDate()}`;
                         break;
                     case 2:
                         startDay = `${today.getFullYear()}-04-01`;
                         endDay = `${today.getFullYear()}-06-${new Date(today.getFullYear(), 6, 0).getDate()}`;
                         break;
                     case 3:
                         startDay = `${today.getFullYear()}-07-01`;
                         endDay = `${today.getFullYear()}-09-${new Date(today.getFullYear(), 9, 0).getDate()}`;
                         break;
                     case 4:
                         startDay = `${today.getFullYear()}-10-01`;
                         endDay = `${today.getFullYear()}-12-${new Date(today.getFullYear(), 12, 0).getDate()}`;
                         break;
                     default:
                         break;
                 }

                 this.launchDateFilter.start = `${startDay}`;
                 this.launchDateFilter.end = `${endDay}`;

                 break;
             default:
                 this.launchDateFilter.start = '';
                 this.launchDateFilter.end = '';
                 break;
         }
    }

    @action archiveProject = (projectId) => {

        let formData = new FormData();

        formData.append('project_id', projectId);

        agent.Requests.post('/analytics/archive', formData).then(resp => {
            if(resp.status === 400 || resp.status === 401) {
                this.error = 'Something went wrong when trying to archive the project. Refresh the view and try again.';
            }
        }).finally(() => {
            this.getSales();
        });
    }

    @action updateArticle = (e) => {

        this.processing = true;

        let articleId = e.target.dataset.id;

        let formData = new FormData();

        if(this.updateArticleData.url) {
            formData.append('url', this.updateArticleData.url);
        }
        if(this.updateArticleData.guaranteed) {
            formData.append('guaranteed', this.updateArticleData.guaranteed);
        }
        if(this.updateArticleData.launchDate) {
            formData.append('launch_date', this.updateArticleData.launchDate);
        }
        if(this.updateArticleData.endDate) {
            formData.append('end_date', this.updateArticleData.endDate);
        }

        if(this.updateArticleData.approved != undefined) {
            formData.append('approved', (this.updateArticleData.approved === true ? 'yes' : 'no'));
        }

        formData.append('id', articleId);

        agent.Requests.post('/article/update', formData).then(resp => {
            if(resp.status === 400 || resp.status === 401) {
                this.error = 'Something went wrong when trying to update the article. Have a look at the article settings and try again.';
            }
        }).finally(() => {
            this.updateArticleData = {};
            this.processing = false;
            this.getSales();
        });

    }

    @action removeArticle = (articleId) => {
        let formData = new FormData();

        formData.append('article_id', articleId);

        return agent.Requests.post('/article/remove', formData).then(resp => {
            if(resp.status === 400 || resp.status === 401) {
                this.error = 'Something went wrong when trying to remove the article.'
            }
        }).finally(() => {
            this.getSales();
        });
    }

    @action setNewArticleDefaults = (saleId, url, readers, launch, end, approved) => {
        this.newArticle.saleId = saleId
        this.newArticle.url = url
        this.newArticle.guaranteed = readers
        this.newArticle.launchDate = launch
        this.newArticle.endDate = end
        this.newArticle.approved = approved
        this.newArticle.maxReaders = readers
    }

    @action updateArticleUrl = (e) => {
        this.updateArticleData.url = e.target.value
    }

    @action updateArticleGuaranteed = (e) => {
        this.updateArticleData.guaranteed = e.target.value
    }

    @action updateArticleLaunch = (e) => {
        this.updateArticleData.launchDate = e.target.value
    }

    @action updateArticleEnd = (e) =>  {
        this.updateArticleData.endDate = e.target.value
    }

    @action updateArticleApproved = (e) => {
        this.updateArticleData.approved = e.target.checked;
    }

    @action setNewArticleSale = (e) => {
        this.newArticle.saleId = e.target.dataset.meta
    }

    @action setNewArticleUrl = (e) => {
        this.newArticle.url = e.target.value
    }

    @action setNewArticleGuaranteed = (e) => {
        this.newArticle.guaranteed = e.target.value
    }

    @action setNewArticleLaunch = (e) => {
        this.newArticle.launchDate = e.target.value
    }

    @action setNewArticleEnd = (e) => {
        this.newArticle.endDate = e.target.value
    }

    @action setNewArticleApproved = (e) => {
        this.newArticle.approved = e.target.value
    }

    @action setSorting = (e) => {
        if(this.sorting.order === 'ASC') {
        this.sorting.order = 'DESC';
    } else {
        this.sorting.order = 'ASC';
    }

        // If clicking an element within the table header(th) that holds the dataset we have to fall back to the th.
        if(e.target.dataset.col === undefined) {
        this.sorting.column = e.target.parentNode.dataset.col;
    } else {
        this.sorting.column = e.target.dataset.col;
    }

        // Reload view
        this.getSales();
    }

    @action setResultsCount = (e) =>  {

        // Valid span
        if(e.target.value >= 8 && e.target.value <= 50) {
            this.pageLimit = e.target.value;
            this.getSales();
        }
    }


}

export default new SaleStore()