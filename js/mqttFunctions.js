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
    console.log("Message recieved!");
    var message = msg.payloadString;
    var topic = msg.destinationName;
    console.log("Message received: " + message.payloadString);
  console.log("Topic: " + message.destinationName);
    if (topic === "claw/info2/left_end") {
      console.log("end detect")
        //setEndValue("leftEnd", message);
      } else if (topic === "claw/info2/right_end") {
        console.log("end detect")
       //setEndValue("rightEnd", message);
      } else if (topic === "claw/info2/up_end") {
        console.log("end detect")
       // setEndValue("upEnd", message);
      } else if (topic === "claw/info2/down_end") {
        console.log("end detect")
        //setEndValue("downEnd", message);
      } else if (topic === "claw/info2/forward_end") {
        console.log("end detect")
        //setEndValue("forwardEnd", message);
      } else if (topic === "claw/info2/backward_end") {
        console.log("end detect")
        //setEndValue("backwardEnd", message);
      }
      
}
//функция получения сообщения mqtt КОНЕЦ
function onConnect() {
    console.log("Connected");
    //подписываемся на
    mqtt.subscribe("claw/info2/#");
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
