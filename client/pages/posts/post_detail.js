const { get_user_details } = "./auth/login";

const base_url = 'http://localhost:8000/api'

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
const message_div = document.querySelector('.message');

if (!token) {
    window.location.href = "/client/auth/login.html";
}

console.log(get_user_details(user.id));