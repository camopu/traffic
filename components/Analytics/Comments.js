import React from 'react';
import Button from '../General/Button';
import commentStore from '../../stores/CommentStore';
import defaultProfileImage from '../../resources/images/image-default.svg';

import {toJS} from 'mobx';
import { observer, inject } from 'mobx-react';
import { action } from 'mobx';

import { CSSTransitionGroup } from 'react-transition-group';

import Loader from '../General/Loader';

import '../../styles/popup.css';

@inject('commentStore')
@observer
export default class Comments extends React.Component {

    @action postComment = () => {
        this.props.commentStore.postComment(this.props.articleId);
    }

    render() {
        return (
            <CSSTransitionGroup
                transitionName="example"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}>
                <div className={"popup-container"}>
                    <div className={"popup-container__inner comments"}>
                        <div className={"popup-container__inner__comments"}>
                            <div className={"popup-container__inner__comments__top"}>
                                <div className={"popup-container__inner__comments__top__client"}>
                                    {this.props.client}
                                </div>
                                <div className={"popup-container__inner__comments__top__meta"}>
                                    {this.props.sale} - {this.props.url}
                                </div>
                                <i onClick={this.props.onClose} className={"fas fa-times"} ></i>
                            </div>
                            <div className={this.props.commentStore.comments.length === 0 ? "popup-container__inner__comments__inner empty" : "popup-container__inner__comments__inner"}>

                                {this.props.commentStore.loadingComments === true &&
                                    <Loader
                                        size={"medium"}
                                    />
                                }

                                {this.props.commentStore.loadingComments === false && this.props.commentStore.comments.length > 0 &&
                                    this.props.commentStore.comments.map((commentData, key) => {
                                        return (
                                            <div key={key} className={"popup-container__inner__comments__inner__comment"}>
                                                <div className={"popup-container__inner__comments__inner__comment__top"}>
                                                    <div className={"popup-container__inner__comments__inner__comment__top__img"}>
                                                        {commentData.image &&
                                                            <img src={`https://napoleon.mediaplanet.com/images/employees/250x250/${commentData.image}`} />
                                                        }
                                                        {!commentData.image &&
                                                            <img src={defaultProfileImage} />
                                                        }
                                                    </div>
                                                    <div className={"popup-container__inner__comments__inner__comment__top__meta"}>
                                                        <div className={"popup-container__inner__comments__inner__comment__top__meta__name"}>
                                                            {commentData.name}
                                                        </div>
                                                        <div className={"popup-container__inner__comments__inner__comment__top__meta__time"}>
                                                            {commentData.timestamp}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={"popup-container__inner__comments__inner__comment__msg"}>
                                                    {commentData.comment}
                                                </div>
                                            </div>
                                        );

                                    })
                                }

                                {this.props.commentStore.loadingComments === false && this.props.commentStore.comments.length === 0 &&
                                    <div className={"popup-container__inner__comments__inner__comment empty"}>
                                        No comments posted for this article.
                                    </div>
                                }
                            </div>
                            <div className={"popup-container__inner__comments__new"}>
                                <textarea onChange={this.props.commentStore.setComment} placeholder={"Add comment"}></textarea>
                                <Button
                                    disabled={this.props.commentStore.canPost === true ? false : true}
                                    type={'add'}
                                    value={'Post'}
                                    clickHandler={this.postComment}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </CSSTransitionGroup>
        );
    }
}