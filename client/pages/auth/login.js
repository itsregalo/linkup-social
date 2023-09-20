const base_url = 'http://127.0.0.1:8000/api'

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

// login
const submitLoginForm = async (user) => {
    try {
        const response = await fetch(`${base_url}/auth/login`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);

        if (response.status === 200) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            setTimeout(() => {
                document.querySelector('.message').innerHTML = `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>Success!</strong> Login successful.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
            }, 1000);

            window.location.href = "/client/index.html";
        }  else {
            setTimeout(() => {
                document.querySelector('.message').innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Oops!</strong> ${data.message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
            }, 1000);
        }
    }
    catch (error) {
        console.log(error);
    }
}

const loginFormSubmitEvent = () => {
    const login_form = document.querySelector('#login_form');

    login_form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.querySelector('#login_email').value;
        const password = document.querySelector('#login_password').value;

        if (email === '' || password === '') {
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
            password
        }

        submitLoginForm(user);
    });
}

