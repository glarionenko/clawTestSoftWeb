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