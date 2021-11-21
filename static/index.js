function app() {
    const client = new Paho.MQTT.Client("localhost", Number(9001), "/ws", "browser");

    function onConnect(){
        console.log("Connected!");
    }

    client.connect({
        onSuccess: onConnect,
        userName: "browser",
        password: "123"
    });
}

document.addEventListener('DOMContentLoaded', () => {
    app();
});
