async function sendMessage() {
    let input = document.getElementById("userInput").value;
    let messages = document.getElementById("messages");

    if (input.trim() === "") return;

    let userMsg = document.createElement("p");
    userMsg.innerText = "You: " + input;
    messages.appendChild(userMsg);

    let botMsg = document.createElement("p");
    botMsg.innerText = "Bot: Thinking...";
    messages.appendChild(botMsg);

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: input })
        });

        const data = await response.json();
        botMsg.innerText = "Bot: " + data.reply;

    } catch (error) {
        botMsg.innerText = "Bot: Website error. Server not connected.";
        console.log(error);
    }

    document.getElementById("userInput").value = "";
    messages.scrollTop = messages.scrollHeight;
}

function handleKey(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}