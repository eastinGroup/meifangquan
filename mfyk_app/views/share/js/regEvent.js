var ortherFieldData = [];

function regCount(userId) { /*用户注册统计*/
    ortherFieldData.push({
        "nickName": $(".userName").val(),
        "downloadChannel": "",
        "country": returnCitySN.cname,
        "province": "",
        "city": returnCitySN.cname,
        "roleType": "2",
        "version": "",
        "equipmentBrand": model,
        "equipmentModel": "",
        "operatingSystem": os,
        "carrieroperator": returnCitySN.cip,
        "mobilePhone": $(".firstName").val()
    })
    ortherFieldData = JSON.stringify(ortherFieldData)
    ortherFieldData = ortherFieldData.slice(1, ortherFieldData.length - 1)
    console.log(ortherFieldData)
    $.ajax({
        type: "get",
        url: eventconfig + "eventtrack/userModel/register",
        async: false,
        data: {
            "equipment": 3,
            "registerTime": getNowFormatDate(),
            "application": 1,
            "businessId": "mfq_user_" + userId,
            "ortherField": ortherFieldData
        },
        success: function(data) {
            console.log(data)
        }
    })



}

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

Array.prototype.contains = function(needle) {
    for (i in this) {
        if (this[i].indexOf(needle) > 0)
            return i;
    }
    return -1;
}
var device_type = navigator.userAgent; //获取userAgent信息  
console.log(device_type); //打印到页面  
var md = new MobileDetect(device_type); //初始化mobile-detect  
console.log(md)
var os = md.os(); //获取系统  
var model = "";
if (os == "iOS") { //ios系统的处理  
    os = md.os() + md.version("iPhone");
    model = md.mobile();
} else if (os == "AndroidOS") { //Android系统的处理  
    os = md.os() + md.version("Android");
    var sss = device_type.split(";");
    var i = sss.contains("Build/");
    if (i > -1) {
        model = sss[i].substring(0, sss[i].indexOf("Build/"));
    }
}
console.log(model)