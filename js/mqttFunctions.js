/* mqtt параметры */
var mqtt;
var reconnectTimeout = 2000;
var host = "10.0.10.111"; //change this
var port = 9001;
var flag_connected = 0;
/* mqtt параметры КОНЕЦ */
//случайное число, используется для задания имени клиента mqtt, чтоб ыне было одинаковых
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function onFailure(message) {
    console.log("Connection Attempt to Host " + host + "Failed");
    flag_connected = 0
    setTimeout(MQTTconnect, reconnectTimeout);
    //-*- отображать эту ошибку в интерфейсе и скрывать при соединении
}
//функция получения сообщения mqtt
function onMessageArrived(msg) {
    //console.log("Message recieved!");
    if (topic === "claw/info/left-end") {
        setEndValue("leftEnd", message);
      } else if (topic === "claw/info/right-end") {
        setEndValue("rightEnd", message);
      } else if (topic === "claw/info/up-end") {
        setEndValue("upEnd", message);
      } else if (topic === "claw/info/down-end") {
        setEndValue("downEnd", message);
      } else if (topic === "claw/info/forward-end") {
        setEndValue("forwardEnd", message);
      } else if (topic === "claw/info/backward-end") {
        setEndValue("backwardEnd", message);
      }
}
//функция получения сообщения mqtt КОНЕЦ
function onConnect() {
    console.log("Connected");
    //подписываемся на
    mqtt.subscribe("claw/info/#");
    flag_connected = 1;
}

function MQTTconnect() {
    console.log("connecting to " + host + " " + port);
    mqtt = new Paho.MQTT.Client(host, port, getRandomInt(1000000).toString(10));
    var options = {
        timeout: 3,
        onSuccess: onConnect, // при удачном соединении
        onFailure: onFailure, // при неудаче соединения
        userName: "glarionenko",
        password: "55566678" // -*- обфусцировать
    };

    mqtt.onMessageArrived = onMessageArrived //при получении сообщения
    mqtt.connect(options);
}
