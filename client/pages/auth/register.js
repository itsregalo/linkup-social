const base_url = 'http://localhost:8000/api'

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

// register
const submitRegisterForm = async (user) => {
    try {
        const response = await fetch(`${base_url}/auth/register`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        
        if (response.status === 201) {
            window.location.href = "/client/auth/login.html";

            setTimeout(() => {
                document.querySelector('.message').innerHTML = `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>Success!</strong> Registration successful.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
            }, 1000);
        } else {
            setTimeout(() => {
                document.querySelector('.message').innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Oops!</strong> ${data.message}.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
            }, 1000);
        }

    } catch (error) {
        console.log(error);
    }
}

const form_register = document.querySelector('#registration_form');

form_register.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.querySelector('#register_email').value;
    const username = document.querySelector('#register_username').value;
    const full_name = document.querySelector('#register_full_name').value;
    const password = document.querySelector('#register_password').value;
    const repeat_password = document.querySelector('#register_repeat_password').value;

    if (email === '' || username === '' || full_name === '' || password === '' || repeat_password === '') {
        setTimeout(() => {
            document.querySelector('.message').innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Oops!</strong> All fields are required.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
        }, 1000);
    }

    const user = {
        email,
        username,
        full_name,
        password,
        repeat_password
    }

    submitRegisterForm(user);
});
