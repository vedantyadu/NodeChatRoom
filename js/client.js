
const socket = io("http://localhost:5000", { transports : ['websocket'] });


const message_input = document.querySelector(".message-input");
const username_input = document.querySelector(".username-input");
const blocker_div = document.querySelector(".blocker-div");
const message_area = document.querySelector(".message-area");


message_input.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        emit_message();
    }
});

document.querySelector(".send-button").addEventListener("click", emit_message);
document.querySelector(".enter-button").addEventListener("click", emit_username);


function user_joined_notification(name) {
    message_area.insertAdjacentHTML("beforeend", `
        <div class="message-div">
            <div class="notification">${name} joined the chat</div>
        </div>
    `)
    message_area.scrollTop = message_area.scrollHeight;
}

function user_disconnected_notification(name) {
    message_area.insertAdjacentHTML("beforeend", `
        <div class="message-div">
            <div class="notification">${name} disconnected</div>
        </div>
    `)
    message_area.scrollTop = message_area.scrollHeight;
}

function new_message(data) {
    data.username
    message_area.insertAdjacentHTML("beforeend", `
        <div class="message-div">
            <div class="other-message">
                <div class="text other-text">
                    ${data.message}
                </div>
                <div class="username ohter-username">
                    ${data.username}
                </div>
            </div>
        </div>
    `)
    message_area.scrollTop = message_area.scrollHeight;
}

function emit_username() {
    socket.emit("join", username_input.value);
    blocker_div.classList.add("remove");
    message_area.insertAdjacentHTML("beforeend", `
        <div class="message-div">
            <div class="notification">Welcome to the chatroom</div>
        </div>
    `)
}

function emit_message() {
    const message = message_input.value;
    socket.emit("send", message);
    message_area.insertAdjacentHTML("beforeend", `
        <div class="message-div">
            <div class="self-message">
                <div class="text self-text">
                    ${message}
                </div>
                <div class="username self-username">
                    You
                </div>
            </div>
        </div>
    `)
    message_input.value = "";
    message_input.focus();
    message_area.scrollTop = message_area.scrollHeight;
}


socket.on('user-joined', (name) => {
    user_joined_notification(name);
});

socket.on('user-disconnected', (info) => {
    user_disconnected_notification(info);
});

socket.on('new-message', (info) => {
    new_message(info);
});
