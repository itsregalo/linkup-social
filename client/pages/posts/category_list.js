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

const category_id = window.location.search.split('=')[1];

// getting a ist of all posts from the database
const get_posts = async () => {
    try {
        const data = await fetch(`${base_url}/categories/post/category/${category_id}`, {
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
                
               
                if (!post.picture) {
                    posts_div.innerHTML += `
                    <div class="card post_card">
                        <div class="card-header post_head">
                            <div class="profile_pic_user">
                                <img src="${user_det.user.profile_picture}" alt="" width="50px" height="50px">
                                <p>${user_det.user.full_name}</p>
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
                                    <img src="/client/assets/images/icons/comment-outline.svg" alt="">
                                    <p>Comment</p>
                                </div>
                                <div class="share">
                                    <img src="/client/assets/images/icons/share-24.svg" alt="">
                                    <p>Share</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;

                    if (isLiked) {
                        document.querySelectorAll('.like img')[index].src = "/client/assets/images/icons/liked.svg";
                    }

                } else {
                    posts_div.innerHTML += `
                    <div class="card post_card">
                        <div class="card-header post_head">
                        <div class="profile_pic_user">
                            <img src="${user_det.user.profile_picture}" alt="" width="50px" height="50px">
                            <p>${user_det.user.full_name}</p>
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
                                    <img src="/client/assets/images/icons/comment-outline.svg" alt="">
                                    <p>Comment</p>
                                </div>
                                <div class="share">
                                    <img src="/client/assets/images/icons/share-24.svg" alt="">
                                    <p>Share</p>
                                </div>
                            </div>
    
                        </div>
                    </div>
                    `;

                    if (isLiked) {
                        document.querySelectorAll('.like img')[index].src = "/client/assets/images/icons/liked.svg";
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