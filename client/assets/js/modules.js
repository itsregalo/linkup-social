const module_base_url = 'https://74d7-105-163-157-110.ngrok-free.app/api'


export const get_user_details = async (user_id) => {
    try {
        const response = await fetch(`${module_base_url}/auth/user/info/${user_id}`, {
            method: 'GET',
            body: JSON.stringify(),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.status === 200) {
            return data;
        }
    } catch (error) {
        console.log(error);
    }
}