{
    let createPost= function(){

        let newPostForm= $('#new-post-form');

        //'e' denotes event here, and not error
        newPostForm.submit(function(e){
            //submit action we made earlier gets cancelled
            //so we make the submit action manually using ajax
            e.preventDefault();

            $.ajax({
                // method: get or post
                type: 'post',
                url: '/posts/create',
                // data from form gets converted from string type to json(key-value pair), where 'content' is the key and value in form is the 'value'
                data: newPostForm.serialize(),
                success: function(data){
                    console.log('****', data, '****');
                    let newPost= newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));

                    new PostComments(data.data.post._id);

                    // CHANGE
                    new ToggleLike($('.toggle-like-button', newPost));
                    
                    //noty flash message in ajax
                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                }, error: function(error){
                    console.log(error.responseText);
                }
            })
        })
    }

    let newPostDom= function(post){

        // interpolation is used. this html code is copied from _post.ejs
        // concept used is ajax
        // use post._id and not post.id, else ajax function for deleting doesn't work
        return $(`<li id="post-${post._id}">
        
        ${ post.content },
        ${ post.user.name }

        <small>
            <a class="toggle-like-button" data-likes="0" href="/likes/toggle?id=${post._id}&type=Post"> 
                0 Likes 
            </a>

        </small>
        <!-- ${ post.user } -->
        <div id="posts-container">
            
            <!-- delete option is visible only if signed in user has written post -->

            <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>

            <form action="/comments/create" method="POST">
                <input name="content" type="text" placeholder="Type here to add comment...">
                <!-- post._id (id of post) is sent to comment.post in the comment schema -->
                <input type="hidden" name="post" value=${post._id} >
                <input type="submit" value="Add comment">
            </form>

        </div>    
        <div class="post-comments-list">
            <ul id="post-comments-${post._id}">
                
            </ul>
        </div>
    </li>`)
    }

    //method to delete a post from DOM
    let deletePost= function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    console.log(data);
                    $(`#post-${data.data.post_id}`).remove();

                    //noty flash message for deleting
                    new Noty({
                        theme: 'relax',
                        text: "Post deleted!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                }, error: function(error){
                    console.log(error.responseText);
                }
            })
        });
    }

    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    // this is important
    let convertPostsToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1];
            new PostComments(postId);
        });
    }

    createPost();
    convertPostsToAjax();
}
