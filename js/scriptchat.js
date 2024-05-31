const tx = document.getElementsByTagName('textarea');
for (let i = 0; i < tx.length; i++) {
    console.log(tx.length);
    tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;');
    tx[i].addEventListener('input', OnInput, false);
}

function OnInput() {
    this.style.height = 0;
    this.style.height = (this.scrollHeight) + 'px';
}

const socket = io();
const messages = document.querySelector('.messages');
const form = document.querySelector('.chat_form');
const textarea = document.getElementById('message_text');
const nameBlock = document.querySelector('.username');
const username = nameBlock.textContent;

const clientsTotal = document.getElementById('clients_total');
socket.on('clients_total', (data) => {
    clientsTotal.innerText = `Total clients: ${data}`;
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (textarea.value) {
        socket.emit('chat message', {
            message: textarea.value, 
            username: username
        });
        textarea.value = '';
    }
    document.getElementById('message_text').focus();
});

socket.on('chat message', (data) => {
    const item = document.createElement('li');
    if (data.username == username) {
        item.innerHTML = `<span>You</span>: ${data.message}`
    } else {
        item.innerHTML = `<span>${data.username}</span>: ${data.message}`
    }
    messages.appendChild(item);
    messages.scrollIntoView(false);
    document.getElementById('mes').style.border = '2px solid #fff';
});