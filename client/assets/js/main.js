function changeTheme(){
    toggle_theme_btn = document.getElementById('toggle_theme_btn');
    toggle_theme_btn.addEventListener('click', function() {
        if (document.body.classList.contains('light')) {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
            toggle_theme_btn.innerHTML = 'Light Mode';
        } else {
            document.body.classList.remove('dark');
            document.body.classList.add('light');
            toggle_theme_btn.innerHTML = 'Dark Mode';
        }
    });
}

window.addEventListener('load', function(){
    document.querySelector('.loader').style.display = 'none';
})
