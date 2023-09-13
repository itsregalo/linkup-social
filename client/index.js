const base_url = 'https://74d7-105-163-157-110.ngrok-free.app/api/api'

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

// checking if token is valid
const verifyToken = async (token) => {
    try {
        const response = await fetch(`${base_url}/auth/user/verify-token`, {
            method: 'POST',
            body: JSON.stringify({token}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        if (response.status === 200) {
            return data;
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = "/client/pages/auth/login.html";
        }
    }
    catch (error) {
        console.log(error);
    }
}

// logout
const logout = async () => {
    try {
        // delete token from local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // redirect to login page
        window.location.href = "/client/pages/auth/login.html";

    } catch (error) {
        console.log(error);
    }
}