import React from 'react'
import { observer, inject } from 'mobx-react'
import { action, observable, reaction } from 'mobx'

import Headers from '../General/Table/Headers';
import Comments from './Comments';
import TableRow from './TableRow';
import TableSaleData from './TableSaleData';
import TableArticleData from './TableArticleData';
import Popup from '../General/Popup';
import Button from '../General/Button'
import Loader from '../General/Loader';

import saleStore from "../../stores/SaleStore";

@inject('saleStore')
@inject('commentStore')
@observer
export default class TableBody extends React.Component {

    @observable errorOpen = false;
    @observable articleActionPopup = false;
    @observable articleActionMsg = '';
    @observable commentsOpen = false;

    constructor(props) {
        super(props);

        reaction(
            () => props.saleStore.error,
            error => {
                if(error.length > 0) {
                    this.errorOpen = true;
                } else {
                    this.errorOpen = false;
                }
            }
        )
    }

    @action closePopup = () => {
        this.props.saleStore.error = '';
        this.errorOpen = false;
    }

    @action removeArticle = (e) => {
        let articleUrl = e.target.dataset.url;
        let articleId = e.target.dataset.id;
        this.articleActionMsg = `This will remove the article "${articleUrl}", are you sure?`;
        this.articleActionPopup = articleId;
    }

    @action clearArticleAction = () => {
        this.articleActionPopup = false;
        this.articleActionMsg = '';
    }

    @action submitArticleRemoval = () => {
        this.props.saleStore.removeArticle(this.articleActionPopup).finally(() => {
            this.clearArticleAction();
        });
    }

    @action openComments = () => {
        this.props.commentStore.getComments(this.props.editingArticle.articleId)
        this.commentsOpen = true;
    }

    render() {

        return (
            this.props.saleStore.sales.map((element, key) => {

                let projectId = Object.keys(element)[0];

                return (
                    <tbody key={key}>
                        {this.errorOpen === true && key === 0 &&
                            <tr>
                                <td>
                                    <Popup
                                        msg={this.props.saleStore.error}
                                        type={'error'}
                                        clickHandler={this.closePopup}
                                    />
                                </td>
                            </tr>
                        }
                        {this.articleActionPopup > 0 && key === 0 &&
                            <tr>
                                <td>
                                    <Popup
                                        msg={this.articleActionMsg}
                                        type={'options'}
                                        clickHandler={this.submitArticleRemoval}
                                        denyClickHandler={this.clearArticleAction}
                                    />
                                </td>
                            </tr>
                        }
                        {this.commentsOpen && key === 0 &&
                            <tr>
                                <td>
                                    <Comments
                                        articleId={this.props.editingArticle.articleId}
                                        client={this.props.editingArticle.client}
                                        sale={this.props.editingArticle.saleId}
                                        url={this.props.editingArticle.url}
                                        onClose={() => {
                                                this.commentsOpen = false;
                                                this.props.saleStore.getSales();
                                            }
                                        }
                                    />
                                </td>
                            </tr>
                        }
                        <TableRow
                            id={projectId}
                            project={element}
                            activeProjects={this.props.activeRows}
                            clickHandler={this.props.clickHandler}
                            editingRow={this.props.editingRow}
                            editClick={this.props.editClick}
                            archiveProject={this.props.archiveProject}
                        />

                        {this.props.activeRows.includes(projectId) &&
                        <tr>
                            <td colSpan="7" className={"expanded-row"}>
                                <table className={"analytics-table__inner"}>
                                    <Headers
                                        headers={[
                                            {
                                                text: 'Sale ID',
                                            },
                                            {
                                                text: 'Client',
                                            },
                                            {
                                                text: 'Articles',
                                            },
                                            {
                                                text: 'Guaranteed',
                                            },
                                            {
                                                text: 'Delivered',
                                            },
                                            {
                                                text: 'Launch date',
                                            },
                                            {
                                                text: 'End date',
                                            },
                                            {
                                                text: 'Approved',
                                            }
                                        ]}
                                    />
                                        {
                                            Object.keys(element[projectId].sales).map((saleId, key) => {
                                                return (
                                                    <tbody key={key}>
                                                        {element[projectId].sales[saleId].articles.length <= 0 &&
                                                            <TableSaleData
                                                                project={element[projectId]}
                                                                data={element[projectId].sales[saleId]}
                                                                launch={element[projectId].launch_date}
                                                                end={element[projectId].end_date}
                                                            />
                                                        }

                                                        {element[projectId].sales[saleId].articles.length > 0 &&
                                                        element[projectId].sales[saleId].articles.map((articleData, key) => {
                                                                return (
                                                                    <TableArticleData
                                                                        key={key}
                                                                        index={key}
                                                                        id={saleId}
                                                                        noOfUrls={element[projectId].sales[saleId].articles.length}
                                                                        readersSold={element[projectId].sales[saleId].readers_sold}
                                                                        data={articleData}
                                                                        client={element[projectId].sales[saleId].client_name}
                                                                        editingArticle={this.props.editingArticle.articleId}
                                                                        editArticleClick={this.props.editArticleClick}
                                                                        removeArticle={this.removeArticle}
                                                                        openComments={this.openComments}
                                                                        updateArticleClick={this.props.updateArticleClick}
                                                                        updatingArticle={this.props.updatingArticle}
                                                                    />
                                                                )
                                                            })
                                                        }
                                                        {this.props.saleStore.newArticle.saleId === saleId && element[projectId].sales[saleId].articles.length > 0 &&
                                                            <tr className={"new-article-row"}>
                                                                <td></td>
                                                                <td></td>
                                                                <td>
                                                                    <input onChange={this.props.saleStore.setNewArticleUrl} type={"text"} />
                                                                </td>
                                                                <td></td>
                                                                <td className={"align-right"}>
                                                                    0
                                                                </td>
                                                                <td>
                                                                    <input defaultValue={element[projectId].launch_date} onChange={this.props.saleStore.setNewArticleLaunch} type={"date"} />
                                                                </td>
                                                                <td>
                                                                    <input defaultValue={element[projectId].end_date} onChange={this.props.saleStore.setNewArticleEnd} type={"date"} />
                                                                </td>
                                                                <td className={"status"}>
                                                                    <input onChange={this.props.saleStore.setNewArticleApproved} type={"checkbox"} />
                                                                    {saleStore.processing &&
                                                                        <Loader
                                                                            size={"small"}
                                                                        />
                                                                    }
                                                                    {!saleStore.processing &&
                                                                        <i onClick={this.props.saleStore.submitArticle} className={"save fas fa-save"}></i>
                                                                    }
                                                                </td>
                                                            </tr>
                                                        }
                                                        {element[projectId].sales[saleId].articles.length > 0 && this.props.saleStore.newArticle.saleId !== saleId &&
                                                            <tr className={"add-url-container"}>
                                                                <td></td>
                                                                <td></td>
                                                                <td className={"align-center"}>
                                                                    <Button
                                                                        disabled={false}
                                                                        type={'add'}
                                                                        value={'Add'}
                                                                        clickHandler={() => this.props.saleStore.setNewArticleDefaults(saleId, '', element[projectId].sales[saleId].readers_sold, element[projectId].launch_date, element[projectId].end_date, 'off')}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        }
                                                    </tbody>
                                                )
                                            })
                                        }
                                </table>
                            </td>
                        </tr>
                        }
                    </tbody>
                )
            })

        )
    }
}