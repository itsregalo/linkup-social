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
                        Edit Pictures
                    </a>
                </div>
            </div>
            
            <div class="user_info">
                <h6>${data.user.full_name}</h6>
                <p>@${data.user.username}</p>
                <p>Software Developer</p>

                <div class="user_bio">
                    Tech Bro ✌️ 
                    Scrap Restorations 🔧
                    Wannabe Drag Racer 🏎
                </div>
                <div class="location_date_joined">
                    <div class="location">
                        <img src="/client/assets/images/icons/location.svg" alt="">
                        <a href="">Nairobi, Kenya</a>
                    </div>
                    <div class="date_joined">
                        <img src="/client/assets/images/icons/calender.svg" alt="">
                        <a href="">Joined 2021</a>
                    </div>
                </div>

                
            </div>
            `;
        }
        const user_posts_div = document.querySelector('#user_posts');

        const username = document.querySelector('#username')
        const full_name = document.querySelector('#full_name')
        const location = document.querySelector('#location')
        const bio = document.querySelector('#bio')
        const profile_picture = document.querySelector('#profile_picture')
        const background_picture = document.querySelector('#background_picture')

        username.value = data.user.username;
        full_name.value = data.user.full_name;
        location.value = data.user.location;
        bio.value = data.user.bio;

        


    } catch (error) {
        if (error == 'jwt expired') {
            window.location.href = "/client/pages/auth/login.html"
        } else {
            console.log(error);
        }
    }
}

const update_profile_form = document.querySelector('#update_profile_form');

update_profile_form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.querySelector('#username').value;
    const full_name = document.querySelector('#full_name').value;
    const location = document.querySelector('#location').value;
    const bio = document.querySelector('#bio').value;
    const profile_picture = document.querySelector('#profile_picture').files[0];

    // check if the user has uploaded a profile picture so we can use cloudinary
    const cloudinary_url = 'https://api.cloudinary.com/v1_1/ddv1q5oiq/image/upload';
    const cloudinary_preset = 'linkup_social_med';

    const cloudinary_form_data = new FormData();
    cloudinary_form_data.append('file', profile_picture);
    cloudinary_form_data.append('upload_preset', cloudinary_preset);

    const cloudinary_response = fetch(cloudinary_url, {
        method: 'POST',
        body: cloudinary_form_data
    });

    cloudinary_response.then((data) => {
        return data.json();
    }).then((data) => {
        const profile_picture_url = data.secure_url;

        const form_data = {
            username,
            full_name,
            location,
            bio,
            profile_picture: profile_picture_url
        }

        console.log(form_data);

        update_profile(form_data);
    });
});

const update_profile = async (form_data) => {
    try {
        const response = await fetch(`${base_url}/user/auth/update/profile/${user.id}`, {
            method: 'PUT',
            body: JSON.stringify(form_data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const data = await response.json();
        console.log(data);

        if (data.user && response.status === 200) {
            window.location.href = "/client/pages/profile/profile.html"
        }
    } catch (error) {
        if (error == 'jwt expired') {
            window.location.href = "/client/pages/auth/login.html"
        }
        console.log(error);
    }
}
    

get_user_profile();


