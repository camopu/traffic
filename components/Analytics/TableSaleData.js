import React from 'react'

import Button from '../General/Button'
import Loader from '../General/Loader';

import saleStore from '../../stores/SaleStore'

import {toJS} from 'mobx'

const TableSaleData = ({data, project, launch, end}) => {

    if(saleStore.newArticle.saleId === data.id) {
          return (
              <tr className={"new-article-row"}>
                  <td>
                      {data.id}
                  </td>
                  <td>
                      {data.client_name}
                  </td>
                  <td>
                      <input onChange={saleStore.setNewArticleUrl} type={"text"} />
                  </td>
                  <td>
                  </td>
                  <td>
                      0
                  </td>
                  <td>
                      <input defaultValue={launch} onChange={saleStore.setNewArticleLaunch} type={"date"} />
                  </td>
                  <td>
                      <input defaultValue={end} onChange={saleStore.setNewArticleEnd} type={"date"} />
                  </td>
                  <td className={"approved"}>
                      <input onChange={saleStore.setNewArticleApproved} type={"checkbox"} />
                      {saleStore.processing &&
                          <Loader
                              size={"small"}
                          />
                      }
                      {!saleStore.processing &&
                            <i onClick={saleStore.submitArticle} className={"save fas fa-save"}></i>
                      }
                  </td>
              </tr>
          )
    }


    return (
        <tr>
            <td>
                {data.id}
            </td>
            <td>
                {data.client_name}
            </td>
            <td>
                <Button
                    disabled={false}
                    type={'add'}
                    value={'Add'}
                    clickHandler={() => saleStore.setNewArticleDefaults(data.id, '', data.readers_sold, launch, end, 'off')}
                />
            </td>
            <td>
                {data.readers_sold}
            </td>
            <td>
                0
            </td>
            <td>
                {launch}
            </td>
            <td>
                {end}
            </td>
            <td></td>
        </tr>
    )
}

export default TableSaleData