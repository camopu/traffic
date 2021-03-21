import React from 'react'

import Loader from '../General/Loader';

import { observer } from 'mobx-react'

import {toJS} from 'mobx'
import saleStore from "../../stores/SaleStore";



const TableArticleData = ({readersSold, noOfUrls, index, data, id, client, editingArticle, editArticleClick, removeArticle, openComments, updateArticleClick, updatingArticle}) => {

    if(updatingArticle === editingArticle && editingArticle === data['id']) {
        return (
            <tr>
                <td>
                    {index === 0 ? id : ''}
                </td>
                <td>
                    {index === 0 ? client : ''}
                </td>
                <td>
                    <input onChange={saleStore.updateArticleUrl} type={"text"} defaultValue={data['url']} />
                </td>
                {index === 0 &&
                    <td rowSpan={noOfUrls}>{readersSold}</td>
                }
                <td>
                    {data['readers_delivered']}
                </td>
                <td>
                    <input onChange={saleStore.updateArticleLaunch} type={"date"} defaultValue={data['launch_date']} />
                </td>
                <td>
                    <input onChange={saleStore.updateArticleEnd} type={"date"} defaultValue={data['end_date']} />
                </td>
                <td className={"approved"}>
                    <input onChange={saleStore.updateArticleApproved} type={"checkbox"} defaultChecked={data['approved'] === 'yes' ? 'checked' : false} />
                    {saleStore.processing &&
                        <Loader
                            size={"small"}
                        />
                    }
                    {!saleStore.processing &&
                        <i className={"fas fa-save save"} onClick={saleStore.updateArticle} data-id={data['id']}></i>
                    }
                </td>
            </tr>
        )
    } else {

        return (
            <tr>
                <td>
                    {index === 0 ? id : ''}
                </td>
                <td>
                    {index === 0 ? client : ''}
                </td>
                {Object.keys(data).map((datapoint, key) => {
                    if(datapoint === 'approved') {
                        return (
                            <td key={key}>
                                {data[datapoint]}
                                <i className={"fas fa-ellipsis-v menu"} onClick={editArticleClick} data-id={data['id']} data-saleid={id} data-client={client} data-url={data['url']}></i>
                                {editingArticle === data['id'] &&
                                <div className={"main-view-container__card__table__inner__usermenu"}>
                                    <ul>
                                        <li onClick={updateArticleClick} data-article={data['id']} ><i className={"fas fa-edit"}></i>Edit</li>
                                        <li className={"comments"} onClick={openComments} data-id={data['id']}><i className={"fas fa-comments"}></i>Comment <div>{data['comments'] > 0 ? data['comments'] : ''}</div></li>
                                        <li onClick={removeArticle} data-url={data['url']} data-id={data['id']} ><i className={"fas fa-trash"}></i>Remove article</li>
                                    </ul>
                                </div>
                                }
                            </td>
                        )

                    } else if(datapoint === 'url') {
                        return (
                            <td key={key}>
                                <a className={"animate"} href={`https://${data[datapoint]}`} target={"_blank"}>
                                    {data[datapoint]}
                                </a>
                            </td>
                        )

                    } else if(datapoint === 'id' || datapoint === 'comments') {
                        return null;
                    } else if (datapoint === 'readers_sold' && index === 0) {
                        return <td key={key} rowSpan={noOfUrls}>{readersSold}</td>;
                    } else if (datapoint === 'readers_sold' && index !== 0) {
                        return null;
                    }else {
                        return <td key={key}>{data[datapoint]}</td>
                    }
                })}
            </tr>
        )
    }
}

export default observer(TableArticleData)