class PostComments{
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        this.createComment(postId);

        let self = this;
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
        });
    }


    createComment(postId){
        let pSelf = this;
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self = this;

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function(data){
                    console.log(data);
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).append(newComment);
                    pSelf.deleteComment($(' .delete-comment-button', newComment));

                    // CHANGE
                    new ToggleLike($('.toggle-like-button', newComment));

                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });


        });
    }


    newCommentDom(comment){
        // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
        return $(`<li id="comment-${comment._id}">
        <!-- delete option is visible only if signed in user has written comment -->
        <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
        ${ comment.content }
        ${ comment.user.name }

        <small>
            <a class="toggle-like-button" data-likes="0" href="/likes/toggle?id=${comment._id}&type=Comment"> 
                0 Likes 
            </a>
        </small>
    </li>`);
    }

    deleteComment(deleteLink){
                $(deleteLink).click(function(e){
                    e.preventDefault();
        
                    $.ajax({
                        type: 'get',
                        url: $(deleteLink).prop('href'),
                        success: function(data){
                            console.log(data);
                            $(`#comment-${data.data.comment_id}`).remove();
        
                            new Noty({
                                theme: 'relax',
                                text: "Comment Deleted",
                                type: 'success',
                                layout: 'topRight',
                                timeout: 1500
                                
                            }).show();
                        },error: function(error){
                            console.log(error.responseText);
                        }
                    });
        
                });
            }

}