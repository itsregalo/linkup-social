import axios from 'axios'
const base_url = 'http://localhost:8000/api'

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

// login
const submitLoginForm = async (user) => {
    try {
        const response = await axios.post(`${base_url}/auth/login`, user);
        const { data } = response;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/';
    } catch (error) {
        console.log(error);
    }
}

const handleLoginForm = (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = {
        email,
        password
    }

    submitLoginForm(user);
}


