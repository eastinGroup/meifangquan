 var appId = "wx57a582092bbbb155"; //

 function toShare(typeId, fileName) {
     var url = location.href.replace(/&/g, "%26");
     //      var url ="http://www.meifangquan.com/mfyk_app/views/share/html/shareVideo.html?shareInfo=eyJwcm9qZWN0SWQiOiIiLCJ1c2VyUm9sZUlkIjoiNyIsInR5cGVJZCI6IjI3OSIsInR5cGUiOiI1IiwiYXBwVHlwZSI6IjkifQ=="
     var img_url = config + "file/download?downloadId=" + typeId + "&downloadType=3&fileName=" + fileName + "&mediaType=2";
     console.log("img_url=" + img_url)
     $.ajax({
         type: "post",
         url: config + "common/queryJssdk",
         dataType: "JSON",
         data: "url=" + url,
         success: function(msg) {
             console.log(msg)
             if (msg.operFlag = "1000") {
                 console.log("成功")
                 wx.config({
                     debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                     appId: appId, // 必填，公众号的唯一标识
                     timestamp: msg.timestamp, // 必填，生成签名的时间戳
                     nonceStr: msg.nonceStr, // 必填，生成签名的随机串
                     signature: msg.signature, // 必填，签名，见附录1
                     jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'startRecord', 'stopRecord', 'showOptionMenu', 'translateVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                 });

                 wx.ready(function() { //分享朋友
                     wx.onMenuShareAppMessage({
                         title: title, // 分享标题
                         desc: '品味VR全角度经典户型，尽享醇厚生活内涵。', // 分享描述
                         imgUrl: img_url, // 分享图标
                         type: 'link', // 分享类型,music、video或link，不填默认为link
                         dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                         success: function() {

                             // 用户确认分享后执行的回调函数
                         },
                         cancel: function() {

                             // 用户取消分享后执行的回调函数
                         }
                     });
                     wx.onMenuShareTimeline({ //分享朋友圈
                         title: title, // 分享标题
                         desc: '品味VR全角度经典户型，尽享醇厚生活内涵。',
                         /*分享描述*/
                         imgUrl: img_url, // 分享图标
                         success: function() {

                         },
                         cancel: function() {

                         }
                     });
                 });
             }
         }
     });
 }