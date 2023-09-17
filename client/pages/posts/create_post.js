const base_url = 'https://2f1a-105-55-126-97.ngrok-free.app/api'

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

const new_post_form = document.querySelector('#new_post_form');


new_post_form.addEventListener('submit', (e) => {
    e.preventDefault();

    const content = document.querySelector('#form_post_content').value;
    const picture = document.querySelector('#form_post_picture').files[0];

    const picture_url = document.querySelector('#form_post_picture').value;
    
    // upload the picture to cloudinary
    const cloudinary_url = 'https://api.cloudinary.com/v1_1/ddv1q5oiq/image/upload';
    const cloudinary_preset = 'linkup_social_med';

    const cloudinary_form_data = new FormData();
    cloudinary_form_data.append('file', picture);
    cloudinary_form_data.append('upload_preset', cloudinary_preset);

    const cloudinary_response = fetch(cloudinary_url, {
        method: 'POST',
        body: cloudinary_form_data
    });

    cloudinary_response.then((data) => {
        return data.json();
    }).then((data) => {
        const picture_url = data.secure_url;

        const form_data = {
            content,
            picture: picture_url
        }

        post_post_form(form_data);
    });
});


const post_post_form = async (form_data) => {
    console.log(form_data);
    try {
        const response = await fetch(`${base_url}/posts/create`, {
            method: 'POST',
            body: JSON.stringify(form_data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        const data = await response.json();

        console.log(data);

        if(data.error == 'jwt expired'){
            window.location.href = "/client/pages/auth/login.html"
        }

        if (response.status === 201) {
            // setTimeout(() => {
            //     document.querySelector('.message').innerHTML = `
            //         <div class="alert alert-success alert-dismissible fade show" role="alert">
            //             <strong>Success!</strong> Post created successfully.
            //             <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            //         </div>
            //     `;
            // }, 1000);

            window.location.href = "/client/pages/posts/posts.html";
        }
    } catch (error) {
        console.log(error);
    }
}