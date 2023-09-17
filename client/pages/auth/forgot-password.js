const base_url = 'http://127.0.0.1:8000/api'


const submitForgotPasswordEmail = async (e) => {
    e.preventDefault();

    const email = document.querySelector('#email').value;

    const data = await fetch(`${base_url}/auth/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
    });

    const response = await data.json();

    if (data.status === 200) {
        const message_div = document.querySelector('.message');
        message_div.innerHTML = `
            <div class="alert alert-success" role="alert">
                ${response.message}
            </div>
        `;

        setTimeout(() => {
            window.location.href = "/client/pages/auth/login.html";
        }
        , 3000);
    }
    else {
        const message_div = document.querySelector('.message');
        message_div.innerHTML = `
            <div class="alert alert-danger" role="alert">
                ${response.message}
            </div>
        `;
    } 
}

const submitResetPassword = async (e) => {
    e.preventDefault();

    const password = document.querySelector('#password').value;
    const token = window.location.href.split('=')[1];

    const data = await fetch(`${base_url}/auth/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({password, token})
    });

    const response = await data.json();

    if (data.status === 200) {
        const message_div = document.querySelector('.message');
        message_div.innerHTML = `
            <div class="alert alert-success" role="alert">
                ${response.message}
            </div>
        `;

        setTimeout(() => {
            window.location.href = "/client/pages/auth/login.html";
        }
        , 3000);
    }
    else {
        const message_div = document.querySelector('.message');
        message_div.innerHTML = `
            <div class="alert alert-danger" role="alert">
                ${response.message}
            </div>
        `;
    } 
}