import { get_user_details, user_has_liked_post } from "/client/assets/js/modules.js"
const base_url = 'http://127.0.0.1:8000/api'

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
const message_div = document.querySelector('.message');


if (!token) {
    window.location.href = "/client/pages/auth/login.html";
}  else {
    const is_authenticated = true;
}

// getting a ist of all posts from the database
const get_posts = async () => {
    try {
        const data = await fetch(`${base_url}/posts/current/all`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const posts = await data.json();

        const posts_div = document.querySelector('#general_posts');
        posts_div.innerHTML = ``;

        if (data.status === 200) {
            // ordwer the posts by post_date
            const post_array = posts.posts.sort((a,b) => {
                return new Date(b.post_date) - new Date(a.post_date);
            });
                
            post_array.forEach(async (post,index)=>{

                const user_det = await get_user_details(post.user_id);
               
                const isLiked = await user_has_liked_post(post.id)
                
                const userOwns = user_det.user.id == user.id;
               
                if (!post.picture) {
                    posts_div.innerHTML += `
                    <div class="card post_card">
                        <div class="card-header post_head">
                            <div class="profile_pic_user">
                                <img src="${user_det.user.profile_picture}" alt="" width="50px" height="50px">
                                <p>${user_det.user.full_name} @${user_det.user.username}</p>
                            </div>

                            <div class="daysince_more_options">
                                <p>2 days ago</p>
                                <img src="/client/assets/images/icons/more-2-fill.svg" alt="">
                            </div>
                        </div>

                        <div class="card-body">
                            <a class="post_link" href="/client/pages/posts/post-detail.html?id=${post.id}">
                                <div class="caption">
                                    <p>${post.content}</p>
                                </div>
                            </a>
                        </div>

                        <div class="card-footer">
                            <div class="like_comment_share">
                                <div class="like">
                                    <img src="/client/assets/images/icons/like-outline.svg" alt="" onclick="likeOrUnlikePost('${post.id}')">
                                    <p>Like</p>
                                </div>
                                <div class="comment">
                                    <a href="/client/pages/posts/post-detail.html?id=${post.id}">
                                        <img src="/client/assets/images/icons/comment-outline.svg" alt="">
                                    </a>
                                    <p>Comment</p>
                                </div>
                                
                                <div class="edit">
                                    <a href="/client/pages/posts/edit-post.html?id=${post.id}">
                                        <img src="/client/assets/images/icons/edit.svg" alt="">
                                        <p>Edit</p>
                                    </a>
                                </div>

                                <div class="delete">
                                    <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#deleteModal-${post.id}">
                                        <img src="/client/assets/images/icons/delete.svg" alt="">
                                        Delete
                                    </button>

                                    <div class="modal fade" id="deleteModal-${post.id}" tabindex="-1" aria-labelledby="deleteModal-${post.id}Label" aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="deleteModal-${post.id}Label">Delete Post</h5>
                                                    <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body">
                                                    <p>Are you sure you want to delete this post?</p>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                    <button type="button" class="btn btn-danger" id="delete_post_btn_${post.id}" onclick="delete_post('${post.id}')">
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    `;

                    if (isLiked) {
                        document.querySelectorAll('.like img')[index].src = "/client/assets/images/icons/liked.svg";
                    }

                    if (userOwns) {
                        document.querySelectorAll('.delete button')[index].style.display = 'block';
                        document.querySelectorAll('.edit button')[index].style.display = 'block';
                    }

                } else {
                    posts_div.innerHTML += `
                    <div class="card post_card">
                        <div class="card-header post_head">
                        <div class="profile_pic_user">
                            <img src="${user_det.user.profile_picture}" alt="" width="50px" height="50px">
                            <p>${user_det.user.full_name} @${user_det.user.username}</p>
                        </div>
    
                            <div class="daysince_more_options">
                                <p>12 mins</p>
                                <img src="/client/assets/images/icons/more-2-fill.svg" alt="">
                            </div>
                        </div>
                        <div class="card-body">
                            <a class="post_link" href="/client/pages/posts/post-detail.html?id=${post.id}">
                                <img src="${post.picture}" alt="" width="100%">
                                <div class="caption">
                                    <p>${post.content}</p>
                                </div>
                            </a>
                        </div>
                        <div class="card-footer">
                            <div class="like_comment_share">
                                <div class="like">
                                    <img src="/client/assets/images/icons/like-outline.svg" alt="" onclick="likeOrUnlikePost('${post.id}')">
                                    <p>Like</p>
                                </div>
                                <div class="comment">
                                    <a href="/client/pages/posts/post-detail.html?id=${post.id}">
                                        <img src="/client/assets/images/icons/comment-outline.svg" alt="">
                                    </a>
                                    <p>Comment</p>
                                </div>
                                
                                <div class="edit">
                                    <a href="/client/pages/posts/edit-post.html?id=${post.id}">
                                        <img src="/client/assets/images/icons/edit.svg" alt="">
                                        <p>Edit</p>
                                    </a>
                                    
                                </div>

                                <div class="delete">
                                    <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#deleteModal-${post.id}" onclick="delete_post('${post.id}')">
                                        <img src="/client/assets/images/icons/delete.svg" alt="">
                                        Delete
                                    </button>

                                    <div class="modal fade" id="deleteModal-${post.id}" tabindex="-1" aria-labelledby="deleteModal-${post.id}Label" aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="deleteModal-${post.id}Label">Delete Post</h5>
                                                    <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body">
                                                    <p>Are you sure you want to delete this post?</p>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                    <button type="button" class="btn btn-danger" id="delete_post_btn_${post.id}" onclick="delete_post('${post.id}')">
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
    
                        </div>
                    </div>
                    `;

                    if (isLiked) {
                        document.querySelectorAll('.like img')[index].src = "/client/assets/images/icons/liked.svg";
                    }

                    if (userOwns) {
                        document.querySelectorAll('.delete button')[index].style.display = 'block';
                        document.querySelectorAll('.edit button')[index].style.display = 'block';
                    } else {
                        document.querySelectorAll('.delete button')[index].style.display = 'none';
                        document.querySelectorAll('.edit button')[index].style.display = 'none';
                    }
                }
            })    
        }

    } catch (error) {
        console.log(error);
    }
}


window.addEventListener('DOMContentLoaded', (event) => {
    get_posts();
});