/* global $ */ 
/* global Pie */ 
$(document).ready(function() {
  var loading = function() {
      
  }
  loading();
	$( "#formTarget" ).submit(function( event ) {
	    
	    event.preventDefault();
	    
		Pie.setup({
			amount: $('#amount').val(),//in kobo
			customer: $('#customer').val(),
			publicKey: $('#publicKey').val(),
			commission: $('#commission').val(),
			narration: $('#narration').val(),
			reference: $('#reference').val(),
			inclusive: false,
			commissionWallet: $('#commissionWallet').val(),
			loader: function(){
				console.log("display progress for your user here");
				var addStyle = function(content) {
                	var style = document.createElement('style');
                    style.type = 'text/css';
                    style.innerHTML = content;
                    document.getElementsByTagName('head')[0].appendChild(style);
                };
				var appendHtml = function (el, str) {
                    var div = document.createElement('div');
                    div.innerHTML = str;
                    while (div.children.length > 0) {
                        el.appendChild(div.children[0]);
                    }
                };
                var html = '\
                <div id="pie-loading-overlay">\
                    <div class="hive-fading-circle">\
                        <div class="hive-circle1 hive-circle"></div>\
                        <div class="hive-circle2 hive-circle"></div>\
                        <div class="hive-circle3 hive-circle"></div>\
                        <div class="hive-circle4 hive-circle"></div>\
                        <div class="hive-circle5 hive-circle"></div>\
                        <div class="hive-circle6 hive-circle"></div>\
                        <div class="hive-circle7 hive-circle"></div>\
                        <div class="hive-circle8 hive-circle"></div>\
                        <div class="hive-circle9 hive-circle"></div>\
                        <div class="hive-circle10 hive-circle"></div>\
                        <div class="hive-circle11 hive-circle"></div>\
                        <div class="hive-circle12 hive-circle"></div>\
                    </div>\
                </div>';
                appendHtml(document.body, html);
                addStyle('\
                    #pie-loading-overlay {\
                      position: fixed;\
                      background: transparent;\
                      background: rgba(0,0,0,.2);\
                      width: 100%;\
                      height: 100%;\
                      z-index: 998;\
                      top: 0;\
                      left: 0;\
                    }\
                    .hive-fading-circle {\
                      margin: 8% auto;\
                      width: 100px;\
                      height: 100px;\
                      position: relative;\
                      opacity: 1;\
                    }\
                    \
                    .hive-fading-circle .hive-circle {\
                      width: 100%;\
                      height: 100%;\
                      position: absolute;\
                      left: 0;\
                      top: 0;\
                    }\
                    \
                    .hive-fading-circle .hive-circle:before {\
                      content: "";\
                      display: block;\
                      margin: 0 auto;\
                      width: 15%;\
                      height: 15%;\
                      background-color: #4a90e2;\
                      border-radius: 100%;\
                      opacity: 1;\
                      -webkit-animation: hive-circleFadeDelay 1.2s infinite ease-in-out both;\
                              animation: hive-circleFadeDelay 1.2s infinite ease-in-out both;\
                    }\
                    .hive-fading-circle .hive-circle2 {\
                      -webkit-transform: rotate(30deg);\
                          -ms-transform: rotate(30deg);\
                              transform: rotate(30deg);\
                    }\
                    .hive-fading-circle .hive-circle3 {\
                      -webkit-transform: rotate(60deg);\
                          -ms-transform: rotate(60deg);\
                              transform: rotate(60deg);\
                    }\
                    .hive-fading-circle .hive-circle4 {\
                      -webkit-transform: rotate(90deg);\
                          -ms-transform: rotate(90deg);\
                              transform: rotate(90deg);\
                    }\
                    .hive-fading-circle .hive-circle5 {\
                      -webkit-transform: rotate(120deg);\
                          -ms-transform: rotate(120deg);\
                              transform: rotate(120deg);\
                    }\
                    .hive-fading-circle .hive-circle6 {\
                      -webkit-transform: rotate(150deg);\
                          -ms-transform: rotate(150deg);\
                              transform: rotate(150deg);\
                    }\
                    .hive-fading-circle .hive-circle7 {\
                      -webkit-transform: rotate(180deg);\
                          -ms-transform: rotate(180deg);\
                              transform: rotate(180deg);\
                    }\
                    .hive-fading-circle .hive-circle8 {\
                      -webkit-transform: rotate(210deg);\
                          -ms-transform: rotate(210deg);\
                              transform: rotate(210deg);\
                    }\
                    .hive-fading-circle .hive-circle9 {\
                      -webkit-transform: rotate(240deg);\
                          -ms-transform: rotate(240deg);\
                              transform: rotate(240deg);\
                    }\
                    .hive-fading-circle .hive-circle10 {\
                      -webkit-transform: rotate(270deg);\
                          -ms-transform: rotate(270deg);\
                              transform: rotate(270deg);\
                    }\
                    .hive-fading-circle .hive-circle11 {\
                      -webkit-transform: rotate(300deg);\
                          -ms-transform: rotate(300deg);\
                              transform: rotate(300deg);\
                    }\
                    .hive-fading-circle .hive-circle12 {\
                      -webkit-transform: rotate(330deg);\
                          -ms-transform: rotate(330deg);\
                              transform: rotate(330deg);\
                    }\
                    .hive-fading-circle .hive-circle2:before {\
                      -webkit-animation-delay: -1.1s;\
                              animation-delay: -1.1s;\
                    }\
                    .hive-fading-circle .hive-circle3:before {\
                      -webkit-animation-delay: -1s;\
                              animation-delay: -1s;\
                    }\
                    .hive-fading-circle .hive-circle4:before {\
                      -webkit-animation-delay: -0.9s;\
                              animation-delay: -0.9s;\
                    }\
                    .hive-fading-circle .hive-circle5:before {\
                      -webkit-animation-delay: -0.8s;\
                              animation-delay: -0.8s;\
                    }\
                    .hive-fading-circle .hive-circle6:before {\
                      -webkit-animation-delay: -0.7s;\
                              animation-delay: -0.7s;\
                    }\
                    .hive-fading-circle .hive-circle7:before {\
                      -webkit-animation-delay: -0.6s;\
                              animation-delay: -0.6s;\
                    }\
                    .hive-fading-circle .hive-circle8:before {\
                      -webkit-animation-delay: -0.5s;\
                              animation-delay: -0.5s;\
                    }\
                    .hive-fading-circle .hive-circle9:before {\
                      -webkit-animation-delay: -0.4s;\
                              animation-delay: -0.4s;\
                    }\
                    .hive-fading-circle .hive-circle10:before {\
                      -webkit-animation-delay: -0.3s;\
                              animation-delay: -0.3s;\
                    }\
                    .hive-fading-circle .hive-circle11:before {\
                      -webkit-animation-delay: -0.2s;\
                              animation-delay: -0.2s;\
                    }\
                    .hive-fading-circle .hive-circle12:before {\
                      -webkit-animation-delay: -0.1s;\
                              animation-delay: -0.1s;\
                    }\
                    \
                    @-webkit-keyframes hive-circleFadeDelay {\
                      0%, 39%, 100% { opacity: 0; }\
                      40% { opacity: 1; }\
                    }\
                    \
                    @keyframes hive-circleFadeDelay {\
                      0%, 39%, 100% { opacity: 0; }\
                      40% { opacity: 1; }\
                    }');
			},
			unloader: function(){
				console.log("hide progress for your user");
				var loader = document.getElementById("pie-loading-overlay");
				loader.parentNode.removeChild(loader);
			},
			callback: function(response) {
			    
			},
			form: document.getElementById('formTarget'),
		}).openIframe();
		
	});
});