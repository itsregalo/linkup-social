const base_url = 'https://74d7-105-163-157-110.ngrok-free.app/api'

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
const message_div = document.querySelector('.message');

if (!token) {
    window.location.href = "/client/pages/auth/login.html"
} else {
    const is_authenticated = true;
}

const get_user_details = async (user_id) => {
    try {
        const response = await fetch(`${base_url}/user/info/${user_id}`, {
            method: 'GET',
            body: JSON.stringify(),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        
    }
}

