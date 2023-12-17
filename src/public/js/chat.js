const socketClient = io();

const userNameHTML = document.getElementById("userNameI");
const chatForm = document.getElementById("chatForm");
const messageI = document.getElementById("message");
const pChat = document.getElementById("pChat");

let userValue = null;
if (!userValue) {
    Swal.fire({
        title:"chat de IO",
        text: "user",
        input: "text",
        inputValidator: (value) => {
            if (!value) {
                return "put your USerName";                
            }
          },

    }).then((user) => {
        userValue = user.value;
        userNameHTML.innerHTML = userValue;
        socketClient.emit("newUser", userValue)
    });
}
chatForm.onsubmit = (e) => {
    e.preventDefault();
    const data = {
        user: userValue,
        messageI: messageI.value,

    };
    socketClient.emit("message", data);
    messageI.value = "";
};
socketClient.on("pChat", (data) => {
    console.log(data);
    const renderedChat = data
    
        .map((e) => {
            return `<p>${e.user} : ${e.messageI}</p>`
        })
        .join(" ");
    pChat.innerHTML = renderedChat;
});

socketClient.on("bcast", (userValue) => {
    Toastify({
      text: `Ingreso ${userValue} al chat`,
      duration: 10000,
      position: "center",
      
    }).showToast();});
  


