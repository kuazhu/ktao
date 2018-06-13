/*
* @Author: TomChen
* @Date:   2018-05-24 18:08:59
* @Last Modified by:   TomChen
* @Last Modified time: 2018-06-13 19:51:43
*/
var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var server = http.createServer(function(req,res){
	res.setHeader("Content-Type","text/html;charset=UTF-8");

	var urlStr = req.url;
	console.log("req url:::",urlStr);
	//如果请求的是/favicon.ico直接返回
	if(urlStr == '/favicon.ico'){
		res.statusCode = 404;
		res.end();
	}

	var prams = url.parse(urlStr,true).query;
	var callback = prams.callback;
	var obj = '{"name":"TOM","age":18}';
	console.log(prams.callback);
	var resStr = callback + '('+obj+')';

	//jQuery112405206270674256741_1528887936784({"name":"TOM","age":18})

	//jQuery112407373568336424607_1528887701381({"name":"TOM","age":18})
	// var parmsStr = JSON.stringify(prams);
	// res.statusCode = 200;
	res.end(resStr);		
	
});

server.listen(3000,'127.0.0.1',function(){
	console.log("server is running at http://127.0.0.1:3000");
})