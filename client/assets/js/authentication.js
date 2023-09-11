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


// validate login form
const loginForm = document.querySelector('.login-form-area form');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const loginEmail = document.querySelector('#login_email').value;
    const loginPassword = document.querySelector('#login_password').value;

    if (loginEmail === '' || loginPassword === '') {
        setTimeout(() => {
            document.querySelector('.message').innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Oops!</strong> All fields are required.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
        }, 1000);
    } else {
        setTimeout(() => {
            document.querySelector('.message').innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Success!</strong> Login successful.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
        }, 1000);
    }

    handleLoginForm(e);
});

// register
const submitRegisterForm = async (user) => {
    try {
        const response = await axios.post(`${base_url}/auth/register`, user);
        const { data } = response;
        window.location.href = "/client/auth/login.html";
    } catch (error) {
        console.log(error);
    }
}

const handleRegisterForm = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const username = formData.get('username');
    const fullname = formData.get('fullname');
    const password = formData.get('password');
    const repeat_password = formData.get('repeat_password');

    const user = {
        email,
        username,
        fullname,
        password,
        repeat_password
    }

    submitRegisterForm(user);
}

// validate register form
const registerForm = document.querySelector('#registration_form');

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.querySelector('#email').value;
    const username = document.querySelector('#username').value;
    const fullname = document.querySelector('#fullname').value;
    const password = document.querySelector('#password').value;
    const repeat_password = document.querySelector('#repeat_password').value;

    if (email === '' || username === '' || fullname === '' || password === '' || repeat_password === '') {
        setTimeout(() => {
            document.querySelector('.message').innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Oops!</strong> All fields are required.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
        }, 1000);
    } else {
        setTimeout(() => {
            document.querySelector('.message').innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Success!</strong> Registration successful.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
        }, 1000);
    }

    handleRegisterForm(e);
});





