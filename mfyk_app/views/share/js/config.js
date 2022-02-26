///**
// * Created by yuan on 2017/1/20.
// */
//   var config="http://192.168.1.22:8080/mfyk_app/"
//   var config="http://mfq.meifangquan.com/mfyk_app/";
//   var url_unity="http://mfq.meifangquan.com/";
//   var eventCount="http://mfq.meifangquan.com/"
//	  var config="http://hlf.meifangquan.com:8070/mfyk_app/";
//    var url_unity="http://hlf.meifangquan.com:8070/";
//    var eventCount="http://hlf.meifangquan.com:8070/"
/* var config="http://hlf.meifangquan.com/mfyk_app/";
 var url_unity="http://hlf.meifangquan.com/";*/


/**
 * Created by yuan on 2017/1/20.
 */

var hostname = window.location.hostname; //获取当前页面的url
var port = window.location.port; //获取端口
if (port == "") port = "80";
var config = "http://" + hostname + ":" + port + "/mfyk_app/";
var url_unity = "http://" + hostname + ":" + port + "/";
var eventconfig = "http://hn.meifangquan.com/"