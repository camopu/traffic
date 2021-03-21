import { observable, action } from 'mobx';

import agent from '../agent';

class CommentStore {

    @observable loadingComments = true;
    @observable comments = [];
    @observable newComment = '';
    @observable canPost = false;

    @action getComments(articleId) {
        this.loadingComments = true;
        agent.Requests.get(`/comment/sales?articleId=${articleId}`)
            .then(resp => {
                if(resp.data.length !== 0) {
                    this.comments = resp.data.comments
                }
            }).finally(action(() => {
                this.loadingComments = false;
        }));
    }

    @action setComment = (e) => {
        let comment = e.target.value;
        this.newComment = comment;

        if(comment.length > 0) {
            this.canPost = true;
        } else {
            this.canPost = false;
        }
    }

    @action postComment = (articleId) => {

        let formData = new FormData();

        formData.append('articleId', articleId);
        formData.append('comment', this.newComment);

        agent.Requests.post('/comment/new', formData)
            .finally(action(() => {
                this.getComments(articleId)
            }));
    }
}

export default new CommentStore();