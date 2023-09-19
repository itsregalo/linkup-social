import { get_user_details } from "/client/assets/js/modules.js"

const base_url = 'http://localhost:8000/api'

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
const message_div = document.querySelector('.message');

if (!token) {
    window.location.href = "/client/auth/login.html";
}

const post_details = async () => {
    try {
        const logged_in_user = await get_user_details(user.id);

        const post_id = window.location.search.split('=')[1];

        const response = await fetch(`${base_url}/posts/${post_id}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const post = await response.json();
        
        const post_user = await get_user_details(post.post.user_id);

        const card_top = document.querySelector('#post_detail_head');  
        
        card_top.innerHTML = ``;
        card_top.innerHTML += `
            <div class="profile_pic_user">
                <img src="${post_user.user.profile_picture}" alt="" width="50px" height="50px">
                <p>${post_user.user.full_name}</p>
            </div>

            <div class="daysince_more_options">
                <p>2 days ago</p>
                <img src="/client/assets/images/icons/more-2-fill.svg" alt="">
            </div>
        `;

        const post_detail = document.querySelector('#post_detail_body');
        post_detail.innerHTML = ``;
        post_detail.innerHTML += `
            <img src="${post.post.picture}" alt="" width="100%">
            <div class="caption">
                <p>${post.post.content}</p>
            </div>
        `;

        const current_user_profile_pic = document.querySelector('.current_user_profile_pic');
        current_user_profile_pic.innerHTML = ``;
        current_user_profile_pic.innerHTML += `
            <img src="${logged_in_user.user.profile_picture}" alt="" width="40px" height="40px">
        `;

        const comment_form = document.querySelector('#comment_post_form');
        comment_form.addEventListener('submit', (e) => {
            e.preventDefault();
            const comment = document.querySelector('#comment_input_field').value;
            const comment_data = {
                comment: comment
            }
            post_comment(post_id, JSON.stringify(comment_data));
        });

        const comments_section = document.querySelector('#comments_section');
        const post_comments = post.comments;

        if (post_comments.length > 0) {
            post_comments.forEach((comment,index) => {
                const comment_user = get_user_details(comment.user_id);
                comment_user.then((user_data) => {
                    comments_section.innerHTML += `
                        <div class="comment_card">
                            <div class="current_user_profile_pic">
                                <img src="${user_data.user.profile_picture}" alt="" width="40px" height="40px">
                            </div>
                            <div class="comment_content">
                                <div class="comment_name_username">
                                    <a href="/client/profile.html">
                                        <h6>${user_data.user.full_name}</h6>
                                        <p>@${user_data.user.username}</p>
                                    </a>
                                </div>
                                <div class="replying_to">
                                    <p>Replying to <a href="">@${post_user.user.username}</a></p>
                                </div>
                                <div class="comment_text">
                                    <p>
                                        ${comment.content}
                                    </p>
                                </div>
                                
                                <div class="comment_actions">
                                    <div class="comment_like">
                                        <img src="/client/assets/images/icons/like-outline.svg" alt="">
                                        <p>Like</p>
                                    </div>
                                    <div class="comment_reply">
                                        <img src="/client/assets/images/icons/reply.svg" alt="">
                                        <p>Reply</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                        `;
                });
                
            });
        } else {
            comments_section.innerHTML = `
            <div class="card no_posts_card">
                <div class="card-body">
                    <div class="no_posts">
                        <p>No Comments yet</p>
                    </div>
                </div>
            </div>
            `;
        }

    } catch (error) {
        console.log(error);
    }
}

const post_comment = async (post_id, comment) => {
    console.log(post_id, comment);
    try {
        const response = await fetch(`${base_url}/comments/posts/${post_id}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: comment
        });

        const data = await response.json();
        console.log(data);
        if (response.status === 201) {
            window.location.reload();
        } else {
            message_div.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    ${data.message}
                </div>
            `;
        }
    } catch (error) {
        console.log(error);
    }
}

post_details();