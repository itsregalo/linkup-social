const base_url = 'https://74d7-105-163-157-110.ngrok-free.app/api'

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
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log(data);

    } catch (error) {
        console.log(error);
    }
}

get_user_profile();