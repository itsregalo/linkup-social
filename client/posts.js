import { get_user_details } from "./auth/login.js"; 
const base_url = 'http://localhost:8000/api'

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
const message_div = document.querySelector('.message');


if (!token) {
    window.location.href = "/client/auth/login.html";
} else {
    const is_authenticated = true;
}



// getting a ist of all posts from the database
const get_posts = async () => {
    try {
        const data = await fetch(`${base_url}/posts`, {
            method: 'GET',
            body: JSON.stringify(),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const posts = await data.json();

        const posts_div = document.querySelector('#general_posts');
        posts_div.innerHTML = '';

        if (data.status === 200) {
            const post_array = posts.posts;
                
            post_array.forEach((post,index)=>{

                const user_det = get_user_details(post.user_id);
                console.log(user_det);


                if (!post.picture) {
                    posts_div.innerHTML += `
                    <div class="card post_card">
                    <div class="card-header post_head">
                        <div class="profile_pic_user">
                            <img src="/client/assets/images/users/itsregalo.jpg" alt="" width="50px" height="50px">
                            <p>GiftM</p>
                        </div>

                        <div class="daysince_more_options">
                            <p>2 days ago</p>
                            <img src="/client/assets/images/icons/more-2-fill.svg" alt="">
                        </div>
                    </div>
                    <div class="card-body">
                        <a class="post_link" href="/client/post-detail.html">
                            <div class="caption">
                                <p>${post.content}</p>
                            </div>
                        </a>
                    </div>
                    <div class="card-footer">
                        <div class="like_comment_share">
                            <div class="like">
                                <img src="/client/assets/images/icons/like-outline.svg" alt="">
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
                } else {
                    posts_div.innerHTML += `
                    <div class="card post_card">
                        <div class="card-header post_head">
                            <div class="profile_pic_user">
                                <img src="/client/assets/images/users/itsregalo.jpg" alt="" width="50px" height="50px">
                                <p>GiftM</p>
                            </div>
    
                            <div class="daysince_more_options">
                                <p>12 mins</p>
                                <img src="/client/assets/images/icons/more-2-fill.svg" alt="">
                            </div>
                        </div>
                        <div class="card-body">
                            <a class="post_link" href="/client/post-detail.html">
                                <img src="${post.picture}" alt="" width="100%">
                                <div class="caption">
                                    <p>${post.content}</p>
                                </div>
                            </a>
                        </div>
                        <div class="card-footer">
                            <div class="like_comment_share">
                                <div class="like">
                                    <img src="/client/assets/images/icons/like-outline.svg" alt="">
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
                }
            })
        }

    } catch (error) {
        const message = error.message;
        console.log(message);
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    get_posts();
});