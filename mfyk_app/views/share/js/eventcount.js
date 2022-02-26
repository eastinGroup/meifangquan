/*eventName, operatorId, operTime, visitBatch, softwareType,ortherField*/
var ip = "";
ip = returnCitySN["cip"];

var visitBatch = "";
visitBatch = sessionStorage.getItem("visitBatch");
if (visitBatch) {

} else {
    visitBatch = getNowFormatDate();
    sessionStorage.setItem("visitBatch", visitBatch);
}
var hostname = window.location.hostname;
console.log(hostname)
var softwareType = "";
var eventRoleId = "";
var eventuserRoleId = "";
if (hostname.indexOf("hlf") >= 0) {
    //softwareType="mfq_fir"
    softwareType = "mfq_dev"
} else if (hostname.indexOf("mfq") >= 0) {
    softwareType = "mfq"
} else {
    softwareType = "mfq_dev"
}
//$.getJSON("//ip.wheff7.com/ipinfo", function(data) {
//	console.log(data)
//	ip=data.onlineip
//})
function eventObj(eventName, obj) {
    var eventTracks = [];
    var ortherField = [];
    if (obj) {
        ortherField.push(obj)
    } else {
        ortherField.push({
            "userRoleId": eventuserRoleId,
            "projectId": projectId,
            "sysType": 3,
            "projectName": $("title").html()
        })
    }
    ortherField = JSON.stringify(ortherField);
    ortherField = ortherField.slice(1, ortherField.length - 1);
    eventTracks.push({
        "eventName": eventName,
        "operatorId": ip,
        "operTime": getNowFormatDate(),
        "visitBatch": visitBatch,
        "softwareType": softwareType,
        "ortherField": ortherField,
        "eventRoleId": eventRoleId,
        "eventProjectId": projectId,
    })
    eventTracks = JSON.stringify(eventTracks);
    console.log(eventTracks)
    $.ajax({
        type: "post",
        url: eventconfig + "eventtrack/event/tracking",
        async: true,
        data: {
            "eventTracks": eventTracks
        },
        success: function(data) {
            console.log(data)
        }
    })

}


console.log(getNowFormatDate())

function getNowFormatDate() { /*当前时间*/
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var getHours = date.getHours();
    var getMinutes = date.getMinutes();

    var getSeconds = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (getHours >= 0 && getHours <= 9) {
        getHours = "0" + getHours;
    }
    if (getMinutes >= 0 && getMinutes <= 9) {
        getMinutes = "0" + getMinutes;
    }
    if (getSeconds >= 0 && getSeconds <= 9) {
        getSeconds = "0" + getSeconds;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
        " " + getHours + seperator2 + getMinutes +
        seperator2 + getSeconds;
    return currentdate;
}