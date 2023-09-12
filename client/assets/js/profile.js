const client_url = "http://localhost:3000";
const base_url = "http://localhost:8000/api";

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

const get_profile = async () => {
    try {
        // get user id from the url
        const user_id = window.location.pathname.split('?')[1].split('=')[1];
        const response = await axios.get(`${base_url}/user/profile/${user_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        console.log(error);
    }
}