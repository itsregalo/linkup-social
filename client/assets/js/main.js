const api_base_url = 'http://127.0.0.1:8000/api'


function changeTheme(){
    toggle_theme_btn = document.getElementById('toggle_theme_btn');
    toggle_theme_btn.addEventListener('click', function() {
        if (document.body.classList.contains('light')) {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
            toggle_theme_btn.innerHTML = 'Light Mode';
        } else {
            document.body.classList.remove('dark');
            document.body.classList.add('light');
            toggle_theme_btn.innerHTML = 'Dark Mode';
        }
    });
}

const get_suggested_users = async () => {
    try {
        const response = await fetch(`${api_base_url}/followers/user/profiles/suggested`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const data = await response.json();
        
        if (response.status === 200) {
            const suggested_users = data.random_users;
            const suggested_users_container = document.querySelector('#suggested_users');
            suggested_users_container.innerHTML = '';

            suggested_users.forEach(user => {
                suggested_users_container.innerHTML += `
                    <div class="single_suggested_user">
                        <div class="suggested-profile">
                            <img src="${user.profile_picture}" alt="" width="50px" height="50px">
                            <div class="user_name_handle">
                                <h6>${user.full_name}</h6>
                                <p>@${user.username}</p> 
                            </div>
                        </div>
                        <div class="follow_button_suggested">
                            <button class="btn btn-outline-primary">Follow</button>
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.log(error);
    }
}



const followOrUnfollow = async (user_id) => {
    try {
        const response = await fetch(`${base_url}/followers/user/${user_id}/follow`, {
            method: 'POST',
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
        
        if (response.status === 200) {
            const follow_btn_div = document.querySelector(`#follow_btn_div_${user.id}`);

            if (data.message == 'Successfully followed user') {
                
                follow_btn_div.innerHTML = ``;
                follow_btn_div.innerHTML += `
                <button class="btn btn-outline-primary" id="follow_btn_${user.id}" onclick="followOrUnfollow('${user.id}')">
                    Follow
                </button>
                `;
            } 
            else if (data.message == 'Unfollowed user') {
                follow_btn_div.innerHTML = ``;
                follow_btn_div.innerHTML += `
                <button class="btn btn-primary" id="follow_btn_${user.id}" onclick="followOrUnfollow('${user.id}')">
                    Follow
                </button>
                `;
            }
            else {
                console.log(data.message);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

window.addEventListener('load', function(){
    document.querySelector('.loader').style.display = 'none';
})
