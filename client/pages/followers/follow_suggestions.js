const base_url = 'http://127.0.0.1:8000/api'

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
const message_div = document.querySelector('.message');

if (!token) {
    window.location.href = "/client/pages/auth/login.html"
} else {
    const is_authenticated = true;
}

const get_users_not_following = async () => {
    try {
        const response = await fetch(`${base_url}/followers/user/profiles/not-following`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const data = await response.json();
        
        if (data.error == 'jwt expired') {
            window.location.href = "/client/pages/auth/login.html"
        } else{
            const users = data.users_not_following;

            const users_container = document.querySelector('#not_following_container');
            users_container.innerHTML = '';

            users.forEach(user => {
                const user_bio = user.bio ? user.bio : 'No bio yet';
                users_container.innerHTML += `
                <div class="single_follower">
                    <div class="follower_card_head">
                        <div class="follower_left">
                            <img src="${user.profile_picture}" alt="" width="50px" height="50px">
                            <div class="follower_user_info">
                                <div class="user_name_handle">
                                    <a href="">
                                        <h6>${user.full_name}</h6>
                                        <p>@${user.username}</p>
                                    </a> 
                                </div>
                            </div>
                        </div>

                        <div class="follow_button" id="follow_btn_div_${user.id}">
                            <button class="btn btn-outline-primary" id="follow_btn_${user.id}" onclick="followOrUnfollow('${user.id}')">
                                Follow
                            </button>
                        </div>
                    </div>
                    <div class="bio">
                        <p>
                            ${user_bio}
                        </p>
                    </div>
                </div>
                `;
            });
        }
    } catch (error) {
        
    }
}

get_users_not_following();