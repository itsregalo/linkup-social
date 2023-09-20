const base_url = 'http://127.0.0.1:8000/api'
const message_div = document.querySelector('.message');

const submitForgotPasswordEmail = async (e) => {
    try {
        e.preventDefault();

        const email = document.querySelector('#forgot_password_email').value;

        const data = await fetch(`${base_url}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email})
        });

        const response = await data.json();
        console.log(response);

        if (data.status === 200) {
            
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
    } catch (error) {
        console.log(error);
        message_div.innerHTML = `
            <div class="alert alert-danger" role="alert">
                ${error}
            </div>
        `;
    }
}

const forgot_password_form = document.querySelector('#forgot_password_form');
forgot_password_form.addEventListener('submit', submitForgotPasswordEmail);