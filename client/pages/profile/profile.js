const base_url = 'http://127.0.0.1:8000/api'

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
const message_div = document.querySelector('.message');

if (!token) {
    window.location.href = "/client/pages/auth/login.html"
} else {
    const is_authenticated = true;
}

const get_user_profile = async () => {
    try {
        const response = await fetch(`${base_url}/user/profile/${user.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const data = await response.json();
        console.log(data);
        if (data.error == 'jwt expired') {
            window.location.href = "/client/pages/auth/login.html"
        }

        if (data.user && response.status === 200) {
            const profile_username = document.querySelector('#profile_username');
            const user_profile_area = document.querySelector('#user_profile_area');

            profile_username.innerHTML = `${data.user.username}`;

            user_profile_area.innerHTML = ``;
            user_profile_area.innerHTML += `
            <div class="background_image">
                <img src="/client/assets/images/users/kotlin_bg.jpg" alt="" width="100%">
                
            </div>

            <div class="profile_photo">
                <img src="${data.user.profile_picture}" alt="" width="100px" height="100px">
                <div class="edit_profile_btn">
                    <a href="/client/pages/profile/update-profile.html" class="btn btn btn-outline-primary">
                        Edit Profile
                    </a>
                </div>
            </div>
            
            <div class="user_info">
                <h6>${data.user.full_name}</h6>
                <p>@${data.user.username}</p>

                <div class="user_bio">
                    <p>${data.user.bio}</p>
                </div>
                <div class="location_date_joined">
                    <div class="location">
                        <img src="/client/assets/images/icons/location.svg" alt="">
                        <a href="">${data.user.location}</a>
                    </div>
                    <div class="date_joined">
                        <img src="/client/assets/images/icons/calender.svg" alt="">
                        <a href="">Joined 2023</a>
                    </div>
                </div>

                <div class="user_follow_followers">
                    <div class="following_count">
                        <span class="count">${data.user_following.length}</span>
                        <a href="/client/pages/followers/following.html" class="light_link">Following</a>
                    </div>
                    <div class="followers_count">
                        <span class="count">${data.user_followers.length}</span>
                        <a href="/client/pages/followers/followers.html" class="light_link">Followers</a>
                    </div>
                </div>
            </div>
            `;
        }
        const user_posts_div = document.querySelector('#user_posts');

        if (data.user_posts.length > 0) {
            const the_posts = data.user_posts;

            // sort posts by date
            the_posts.sort((a, b) => {
                return new Date(b.post_date) - new Date(a.post_date);
            });
            user_posts_div.innerHTML = ``;

            the_posts.forEach(post => {
                if(!post.picture){
                    user_posts_div.innerHTML += `
                        <div class="card post_card">
                            <div class="card-header post_head">
                                <div class="profile_pic_user">
                                    <img src="${data.user.profile_picture}" alt="" width="50px" height="50px">
                                    <p>${data.user.full_name}</p>
                                </div>
        
                                <div class="daysince_more_options">
                                    <p>2 days ago</p>
                                    <img src="/client/assets/images/icons/more-2-fill.svg" alt="">
                                </div>
                            </div>
                            <div class="card-body">
                                <a class="post_link" href="">
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
                }else{
                    user_posts_div.innerHTML += `
                    <div class="card post_card">
                        <div class="card-header post_head">
                            <div class="profile_pic_user">
                                <img src="/client/assets/images/users/elon.jpg" alt="" width="50px" height="50px">
                                <p>GiftM</p>
                            </div>
    
                            <div class="daysince_more_options">
                                <p>2 days ago</p>
                                <img src="/client/assets/images/icons/more-2-fill.svg" alt="">
                            </div>
                        </div>
                        <div class="card-body">
                            <a class="post_link" href="">
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
                }
            });
        } else {
            // no posts card
            user_posts_div.innerHTML = `
                <div class="card no_posts_card">
                    <div class="card-body">
                        <div class="no_posts">
                            <p>No posts yet</p>
                        </div>
                    </div>
                </div>
            `;
        }

    } catch (error) {
        if (error == 'jwt expired') {
            window.location.href = "/client/pages/auth/login.html"
        } else {
            console.log(error);
        }
    }
}


get_user_profile();