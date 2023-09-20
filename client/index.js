const base_url = 'http://127.0.0.1:8000/api';
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));


if (!token) {
    window.location.href = "/client/pages/auth/login.html";
}

const is_authenticated = true;

const get_your_followers_posts = async () => {
    try {
        const response = await fetch(`${base_url}/posts/user/me/following/posts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const data = await response.json();

        if(response.status === 200) {
            const index_posts_div = document.querySelector('#index_posts');
            const my_followers_posts = data.posts;

            if(my_followers_posts.length > 0) {
                index_posts_div.innerHTML = ``;
                my_followers_posts.forEach((post,index)=>{
                    index_posts_div.innerHTML += `
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
                            <a class="post_link" href="">
                                <img src="/client/assets/images/trump.png" alt="" width="100%">
                                <div class="caption">
                                    <p>Next Level #Trump</p>
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
                });
            } else {
                index_posts_div.innerHTML = `
                <div class="card no_posts_card">
                    <div class="card-body">
                        <div class="no_posts">
                            <p>Follower's posts will appear here</p>
                        </div>
                    </div>
                </div>
                `;
            }
        } else {
        }

        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

get_your_followers_posts();