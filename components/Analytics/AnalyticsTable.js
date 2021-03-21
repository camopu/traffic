import React from 'react'
import { observable, action, reaction, toJS } from 'mobx'
import { observer, inject } from 'mobx-react'

import Headers from '../General/Table/Headers';
import Popup from '../General/Popup';
import TableBody from './TableBody';
import TableFilters from './TableFilters';
import Pagination from '../General/Table/Pagination';
import Export from './Export/Excel';
import Loader from '../General/Loader';
import ProjectList from './Mobile/ProjectList';

@inject('saleStore', 'userStore')
@observer
export default class AnalyticsTable extends React.Component {

    @observable isLoading = true;
    @observable activeRows = [];
    @observable editingRow = null;
    @observable editingArticle = {};
    @observable updateArticleId = null;
    @observable filterActive = false;
    @observable popupOpen = false;
    @observable toBeArchived = null;

    constructor(props) {
        super(props);

        reaction(
            () => props.saleStore.sales,
            sales => {
                this.editingArticle = {};
            }
        )
    }

    componentDidMount() {
        this.isLoading = false

        // Set country access
        let countries = this.props.userStore.currentUser.countries.slice();

        this.props.saleStore.countryAccess = countries;

        // Fetch sales from analytics store
        this.props.saleStore.getSales()
    }

    @action setRow = (e) => {

        let projectId = e.target.dataset.project;

        // If clicking alrdy active row, unset active row
        if(this.activeRows.includes(projectId)) {
            this.activeRows.splice(this.activeRows.indexOf(projectId), 1);
        } else {
            this.activeRows.push(projectId);
        }

        // Clear new article in store
        this.props.saleStore.newArticle = {};
    }

    @action editRow = (e) => {
        if(this.editingRow === e.target.dataset.project) {
            this.editingRow = null;
        } else {
            this.editingRow = e.target.dataset.project;
        }
    }

    @action editArticle = (e) => {
        if(this.editingArticle.articleId === e.target.dataset.id) {
            this.editingArticle = {};
        } else {
            this.editingArticle.articleId = e.target.dataset.id;
            this.editingArticle.client = e.target.dataset.client;
            this.editingArticle.saleId = e.target.dataset.saleid;
            this.editingArticle.url = e.target.dataset.url;
        }
        this.updateArticleId = null;
    }

    @action updateArticle = (e) => {
        let articleId = e.target.dataset.article;

        this.updateArticleId = articleId;
    }

    @action toggleFilter = () => {
        if(this.filterActive) {
            this.filterActive = false;
        } else {
            this.filterActive = true;
        }
    }

    @action archiveProject = (e) => {
        let projectId = e.target.dataset.project;
        this.toBeArchived = projectId;
        this.popupOpen = true;
    }

    @action submitArchive = () => {
        this.props.saleStore.archiveProject(this.toBeArchived);
        this.popupOpen = false;
    }

    @action globalToggle = () => {

        if(this.activeRows.length > 0) {
            this.activeRows = [];
        } else {

            this.props.saleStore.sales.map((project) => {
                this.activeRows.push(Object.keys(project)[0]);
            })
        }
    }

    render() {

        let noOfSales = Object.keys(this.props.saleStore.sales).map(() => {}).length;

        if(this.isLoading) {
            return (
                <div className={"loader-container"}>
                    <Loader
                        size={"large"}
                    />
                </div>
            )
        }

        return (
            <div className={"main-view-container__card__table__inner"}>

                <i onClick={this.globalToggle} className={this.activeRows.length === 0 ? "fas fa-angle-right main-view-container__card__table__inner__toggler" : "fas fa-angle-down main-view-container__card__table__inner__toggler"}></i>

                {this.popupOpen &&
                    <Popup
                        msg={'Project will be archived and will be removed from the view, articles connected to the project will no longer be tracked. Are you sure?'}
                        type={'options'}
                        clickHandler={this.submitArchive}
                        denyClickHandler={() => this.popupOpen = false}
                    />
                }

                <TableFilters
                    filterActive={this.filterActive}
                    toggleFilter={this.toggleFilter}
                />

                {this.props.saleStore.loadingSales &&
                    <div className={"loader-container"}>
                        <Loader
                            size={"large"}
                        />
                    </div>
                }

                {noOfSales <= 0 && !this.props.saleStore.loadingSales &&
                    <div className={"error"}>No sales found. Check filters and try again.</div>
                }

                {!this.props.saleStore.loadingSales && noOfSales > 0 &&
                    <div className={"analytics-view-mobile"}>
                        <ProjectList
                            projects={this.props.saleStore.sales}
                        />
                    </div>
                }

                {!this.props.saleStore.loadingSales && noOfSales > 0 &&
                    <table className={"analytics-table"}>
                        <Headers
                            activeColumn={this.props.saleStore.sorting.column}
                            activeOrder={this.props.saleStore.sorting.order}
                            headers={[
                                {
                                    text: 'Project',
                                    onclick: this.props.saleStore.setSorting,
                                    sortColumn: 'project_name'
                                },
                                {
                                    text: 'PM',
                                    onclick: this.props.saleStore.setSorting,
                                    sortColumn: 'sold_by'
                                },
                                {
                                    text: 'Number of Sales',
                                    onclick: this.props.saleStore.setSorting,
                                    sortColumn: 'no_of_sales'
                                },
                                {
                                    text: 'Launch date',
                                    onclick: this.props.saleStore.setSorting,
                                    sortColumn: 'launch_date'
                                },
                                {
                                    text: 'Guaranteed',
                                    onclick: this.props.saleStore.setSorting,
                                    sortColumn: 'project_sold'
                                },
                                {
                                    text: 'Delivered',
                                    onclick: this.props.saleStore.setSorting,
                                    sortColumn: 'project_delivered'
                                },
                                {
                                    text: 'Status'
                                },
                            ]}
                        />
                        {!this.props.saleStore.loadingSales &&
                        <TableBody
                            activeRows={this.activeRows}
                            clickHandler={this.setRow}
                            editingRow={this.editingRow}
                            editClick={this.editRow}
                            editingArticle={this.editingArticle}
                            editArticleClick={this.editArticle}
                            updatingArticle={this.updateArticleId}
                            updateArticleClick={this.updateArticle}
                            archiveProject={this.archiveProject}
                        />
                        }
                    </table>
                }

                <div className={"main-view-container__card__table__inner__bottom"}>
                    <div className={"main-view-container__card__table__inner__bottom__results"}>
                        <div title={"Between 8 and 50"}>Results count: </div>
                        <input title={"Between 8 and 50"} type={"number"} defaultValue={8} max={50} min={8} onChange={this.props.saleStore.setResultsCount} />
                    </div>
                    {!this.props.saleStore.loadingSales && noOfSales > 0 &&
                        <Pagination
                            page={this.props.saleStore.currentPage}
                            pages={this.props.saleStore.pages}
                            total={this.props.saleStore.totalSales}
                            pageClick={this.props.saleStore.setPage}
                            timestamp={this.props.saleStore.lastUpdate}
                        />
                    }
                </div>
                {!this.props.saleStore.loadingSales && noOfSales > 0 &&
                    <div className={"main-view-container__card__table__inner__export"}>
                        <div>
                            Export options:
                        </div>
                        <Export
                            data={this.props.saleStore.sales}
                        />
                    </div>
                }
            </div>
        )
    }

}