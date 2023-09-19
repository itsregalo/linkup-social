import { get_user_details } from "/client/assets/js/modules.js"

const base_url = 'http://localhost:8000/api'

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));


if (!token) {
    window.location.href = "/client/auth/login.html";
}

const post_id = window.location.search.split('=')[1];

const get_post = async () => {
    const logged_in_user = await get_user_details(user.id);

    const response = await fetch(`${base_url}/posts/${post_id}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const post = await response.json();
    
    const post_user = await get_user_details(post.post.user_id);

    const postContentUpdate = document.querySelector('#postContentUpdate');
    postContentUpdate.value = post.post.content;
}

get_post();

const update_post = async (post_id, data) => {
    try {

        const response = await fetch(`${base_url}/posts/update/${post_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: data
        });

        const result = await response.json();
        console.log(result);
        if (response.status === 200) {
            message_div.innerHTML = `
                <div class="alert alert-success" role="alert">
                    ${result.message}
                </div>
            `;
            setTimeout(() => {
                message_div.innerHTML = ``;
            }, 2000);
            window.location.href = "/client/pages/posts/posts.html"
        } else if(response.status === 401) {
            window.location.href = "/client/pages/posts/posts.html"
            message_div.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    ${result.message}
                </div>
            `;
            setTimeout(() => {
                message_div.innerHTML = ``;
            }, 2000);
        }
    } catch (error) {
        console.log(error);
    }
}

const updatePostForm = document.querySelector('#update_post_form');

updatePostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const postContentUpdate = document.querySelector('#postContentUpdate');
    const data = {
        content: postContentUpdate.value
    }
    update_post(post_id, JSON.stringify(data));
});



