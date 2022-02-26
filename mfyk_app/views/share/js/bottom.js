var seconds = 60;
var timeFlag = 0;
var phoneNum = "";
var trime = "";
var userName = "";
$(".wykf").click(function() {
    zhuge.track('我要看房')
    eventObj("我要看房")
    seconds = 60;
    timeFlag = 0;
    clearInterval(trime);
    $('.getCode').on('click', totalAll)
    $(".wykfReg").show();
    //	$(".wykfReg").css({"bottom":"3.5rem"})
    $(".userName").val("")
    $(".phoneNumber").val("");
    $(".yzmCode").val("");
    $(".error_text").html("");
    $(".getCode").html("获取验证码")
    $(".bg").show();
    $(".bottomBtn ul li a").css({
        "color": "#333333"
    })
    $(".wykf img").attr("src", "../img/h-5-showingselected@2x.png")
    $(".wykf a").css({
        "color": "#33a3f4"
    })
    $(".lxgw img").attr("src", "../img/h-5-contactconsultant@2x.png")
    $(".xzlp img").attr("src", "../img/h-5-download@2x.png")
    $(".wyzq img").attr("src", "../img/h-5-agent@2x.png")
    $('html,body').addClass('ovfHiden');
    $("html, body").scrollTop(0)
    /*$("html, body").animate({
    		scrollTop:0 }, {duration: 500,easing: "swing"});*/
})
$(".lxgw").click(function() {
    zhuge.track('联系顾问')
    eventObj("联系顾问", {
        "项目名称": $("title").html(),
        "顾问姓名": userName,
        "顾问电话": phoneNum,
        "userRoleId": eventuserRoleId,
        "projectId": projectId,
        "sysType": 3,
        "projectName": $("title").html()
    })
    $(".bottomBtn ul li a").css({
        "color": "#333333"
    })
    $(".lxgw img").attr("src", "../img/h-5-contactconsultant_2@2x.png")
    $(".lxgw a").css({
        "color": "#33a3f4"
    })
    $(".wykf img").attr("src", "../img/h-5-showing@2x.png")
    $(".xzlp img").attr("src", "../img/h-5-download@2x.png")
    $(".wyzq img").attr("src", "../img/h-5-agent@2x.png")
})
$(".xzlp").click(function() {
    zhuge.track('下载楼盘')
    eventObj("下载楼盘")
    window.location.href = "login.html?shareInfo=" + shareInfo + "&projectId=" + projectId
    $(".bottomBtn ul li a").css({
        "color": "#333333"
    })
    $(".xzlp img").attr("src", "../img/h-5-downloadselected@2x.png")
    $(".xzlp a").css({
        "color": "#33a3f4"
    })
    $(".wykf img").attr("src", "../img/h-5-showing@2x.png")
    $(".lxgw img").attr("src", "../img/h-5-contactconsultant@2x.png")
    $(".wyzq img").attr("src", "../img/h-5-agent@2x.png")
})
$(".wyzq").click(function() {
    zhuge.track('我要赚钱')
    eventObj("我要赚钱")
    window.location.href = "register.html?shareInfo=" + shareInfo + "&projectId=" + projectId
    $(".bottomBtn ul li a").css({
        "color": "#333333"
    })
    $(".wyzq img").attr("src", "../img/h-5-agentselected@2x.png")
    $(".wyzq a").css({
        "color": "#33a3f4"
    })
    $(".wykf img").attr("src", "../img/h-5-showing@2x.png")
    $(".lxgw img").attr("src", "../img/h-5-contactconsultant@2x.png")
    $(".xzlp img").attr("src", "../img/h-5-download@2x.png")
})


$(".wykfRe input").focus(function() {
    $(".error_text").html("")
})
$(".phoneNumber").focus(function() {
    timeFlag = 0;
})
$('.getCode').unbind('click')
$('.getCode').on('click', totalAll)

function totalAll() {
    timeFlag++
    console.log(timeFlag)
    if (timeFlag == 1) {
        portCall()
    }

}

//调用接口函数
function portCall() {
    var mobilePhone = $('.phoneNumber').val()
    if ($('.phoneNumber').val().length == 11) {
        //            console.log('传递成功')
        //调接口
        $.get(config + "code/sendCode.action", {
            "mobilePhone": mobilePhone
        }, function(data) {
            console.log(data)
            //输入成功
            if (data.operFlag == 1000) {
                timeReduce()
                console.log('验证码成功')
                zhuge.track('验证码成功')
                eventObj("验证码成功")
            }
            //错误代码
            if (data.errorCode == 100301) {
                $('.error_text').html('获取短信验证码失败')
            } else if (data.errorCode == 100101) {
                $('.error_text').html('参数错误')
            }
        })
    } else {
        $('.error_text').html('手机号输入错误')
    }

}


//倒计时函数
function timeReduce() {
    timeFlag = 0;
    trime = setInterval(function() {
        $('.getCode').unbind('click')
        if (seconds <= 0) {
            clearInterval(trime)
        }
        $('.getCode').html(seconds + 's')
        if (seconds == 0) {
            timeFlag = 0;
            $('.getCode').html("重新发送")
            $('.getCode').on('click', totalAll)


            seconds = 61
        }
        seconds--
    }, 1000)
}
$(".sureBtn").click(function() {
    if ($(".userName").val() == "") {
        $('.error_text').html('请输入姓名')
        return false;
    }
    if ($(".phoneNumber").val() == "") {
        $('.error_text').html('请输入手机号')
        return false;
    }
    if ($(".yzmCode").val() == "") {
        $('.error_text').html('请输入验证码')
        return false;
    }
    $.get(config + "share/regist", {
        "shareInfo": shareInfo,
        "name": encodeURI($(".userName").val()),
        "mobilePhone": $(".phoneNumber").val(),
        "code": $(".yzmCode").val(),
        "userSource": userSource

    }, function(data) {
        console.log(data)
        if (data.operFlag == 1000) {
            zhuge.track('关联楼盘成功')
            eventObj('关联楼盘成功')
            regCount(data.targetUserId)
            $(".mfSuccess").fadeIn(300)
            setTimeout(function() {
                $(".mfSuccess").hide()
                $(".bg").hide();
                $(".wykfReg").hide()
            }, 2000)
        } else {
            if (data.errorCode == 600101) {
                $(".error_text").html("分享信息有误")
            } else if (data.errorCode == 99) {
                $(".error_text").html("系统繁忙")
            } else if (data.errorCode == 600102) {
                $(".error_text").html("姓名有误")
            } else if (data.errorCode == 600103) {
                $(".error_text").html("手机号有误")
            } else if (data.errorCode == 600104) {
                $(".error_text").html("验证码有误")
            } else if (data.errorCode == 600105) {
                $(".error_text").html("来源有误")
            } else if (data.errorCode == 600107) {
                $(".error_text").html("已注册")
            } else if (data.errorCode == 100004) {
                $(".error_text").html("验证码不正确")
            } else if (data.errorCode == 100002) {
                $(".error_text").html("验证码不存在")
            } else if (data.errorCode == 100003) {
                $(".error_text").html("验证码超时")
            }
        }
    })



})
$(".closeBtn").click(function() {
    $(".wykfReg").hide();
    $(".bg").hide();
    $('html,body').removeClass('ovfHiden');
})
$(".userName").focus(function() {
    getType()
})
$(".phoneNumber").focus(function() {
    getType()
})
$(".yzmCode").focus(function() {
    getType()
})

function getType() {
    if (navigator.userAgent.indexOf("iPhone") != -1) {

    }
    if (navigator.userAgent.indexOf("iPad") != -1) {

    }
    if (navigator.userAgent.indexOf("Android") != -1) {

        //	            $(".wykfReg").css({"bottom":"0.5rem"})
    }


}