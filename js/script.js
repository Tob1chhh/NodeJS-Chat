const form = document.getElementById('form');
const loginButton = document.getElementById('loginButton');
const users = [];

function buttonClick() {
    const formData = new FormData(form);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    const user = {
        username: username,
        email: email,
        password: password,
        status: 'Online',
    };
    users.push(user);

    if (username === '' || email === '' || password === '') {
        alert('Input all needed information!');
    }
};