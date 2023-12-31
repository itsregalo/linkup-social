const module_base_url = 'http://127.0.0.1:8000/api'


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

export const user_has_liked_post = async(post_id) => {
    try {
        const response = await fetch(`${api_base_url}/likes/post/${post_id}`, {
            method:'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })

        const data = await response.json();

        if (response.status === 200) {
            return data.user_liked;
        }
    } catch (error) {
        console.log(error);
    }
}

export const if_user_followed = async (user_id) => {
    try {
        const response = await fetch(`${module_base_url}/followers/user/check-follow/${user_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const data = await response.json();

        if (response.status === 200) {
            return data.followed;
        }
    } catch (error) {
        console.log(error);
    }
}