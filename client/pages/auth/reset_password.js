const base_url = 'http://127.0.0.1:8000/api'
const message_div = document.querySelector('.message');

const reset_token = window.location.search.split('=')[1];

const submitResetPassword = async (e) => {
    try {
        e.preventDefault();

        const new_password = document.querySelector('#reset_password').value;
        const repeat_password = document.querySelector('#reset_repeat_password').value;

        const data = await fetch(`${base_url}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({new_password, repeat_password, reset_token})
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

const reset_password_form = document.querySelector('#reset_password_form');
reset_password_form.addEventListener('submit', submitResetPassword);
