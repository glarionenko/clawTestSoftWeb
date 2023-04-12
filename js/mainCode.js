function sendMessageToMQTTT(topicName,msgText){
    console.log("Sending...");
    if(flag_connected==1){
    message = new Paho.MQTT.Message(msgText);
    message.destinationName = topicName;
    mqtt.send(message);
    }else{
        console.log("Can't send");
    }
}

var currentIntervalId ={"leftEnd":0,"rightEnd":0,"upEnd":0,"downEnd":0,"forwardEnd":0,"backwardEnd":0};
function setEndValue(id, value) {
    var badge = document.getElementById(id);
    if (value == 1) {
      badge.classList.remove("badge-secondary");
      badge.classList.add("badge-success");
    } else if (value == 0) {
      badge.classList.remove("badge-success");
      badge.classList.add("badge-secondary");
    }
  
    var lastUpdate = new Date().getTime(); // время последнего обновления
    var lastIntervalID = currentIntervalId.get(id);
    if(lastIntervalID!==0){
      clearInterval(lastIntervalID);
    }
    var myIntervalID = setInterval(function() {
      var now = new Date().getTime(); // текущее время
      var diff = now - lastUpdate; // разница в миллисекундах
      if (diff >= 60000) { // если прошло более минуты, останавливаем обновление
        badge.innerText = ">1 min";
        clearInterval(myIntervalID);
        currentIntervalId.set(id,0);
      } else { // обновляем содержимое элемента
        var seconds = Math.floor((diff % 60000) / 1000); // вычисляем количество секунд
        badge.innerText = seconds + " sec";
      }
    }, 1000); // обновляем каждую секунду
    currentIntervalId.set(id,myIntervalID);
  
  }
$(document).ready(function () {
    //соединиться с mqtt
    MQTTconnect();
   // var startEventType = 'mousedown';
   // var endEventType   = 'mouseup';
//if (Modernizr.touch === true) {
    var startEventType = 'touchstart';
    var endEventType   = 'touchend';
//}
    $("#formControlRange").on("input",function() {
        rangeValue=$(this).val()
        console.log(rangeValue);
        $("#power_input").val(rangeValue);

    });

    $(".btn").bind(endEventType,function() {
        attrText = $(this).attr("claw");
        if(attrText!="setup_power" && attrText!="claw_catch" && attrText!="claw_release"){
        topicName = "claw/button";
        msgText = "claw_stop";
        console.log(msgText);
        sendMessageToMQTTT(topicName,msgText);
        }
    });
    $(".btn").bind(startEventType,function() {
        topicName = "claw/button";
        msgText = $(this).attr("claw");
        console.log(msgText);
        sendMessageToMQTTT(topicName,msgText);
        if(msgText=="setup_power"){
            console.log("Sending power...");
            pwrText = $("#power_input").val();
            console.log("Power value is "+pwrText);
            if(pwrText>=0&&pwrText<=100){
                console.log("Power is correct");
                $("#power_text").text(pwrText);
                topicName = "claw/power";
                msgPower = String(pwrText);
                sendMessageToMQTTT(topicName,msgPower);
            }else{
            console.log("Incorrect power value!");
        }
        $("#power_input").val("");
        }
    });
});