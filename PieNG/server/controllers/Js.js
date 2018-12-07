import express from 'express'
import config from '../config/config.server'
const router = express.Router()

/* GET users listing. */
router.get('/js/:publicKey?', (req, res, next) => {
  const publicKey = req.publicKey || null
  res.status(200).set('Content-Type', 'text/javascript').send(`
(function (name, global, definition) {

	if(typeof module !== 'undefined'){
  		module.exports = definition();
	}else if(typeof define === 'function' && typeof define.amd  === 'object'){
		define(definition({}));
	} else {
		global[name] = definition();
	}

})('Pie', this, function () {

	"use strict";
	
	//global private things
	var _options = {
	    metadata: 'no metadata set by client',
	    callback: function(response){
	        console.log(response);
	    },
	    onClose: function(response){
	        console.log("dialog box closed");
	    }
	};
	
	var iframe, iframeOpen, iframeLoaded, defaults;
	
	//https://gist.github.com/kn0ll/1020251
	//https://stackoverflow.com/questions/6754935/how-to-close-an-iframe-within-iframe-itself
	
	var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent", eventer = window[eventMethod], 
	messageEvent = "attachEvent" == eventMethod ? "onmessage" : "message";
	
	function Inline(params, form) {
        iframeLoaded = !1;
        iframeOpen = !1;
        defaults = params;
        setupIframe(), noBrowserIframeSupport(), listenForCloseEvent(), listenForTransactionReference();
    }
    
    function listenForTransactionReference(){
        eventer(messageEvent, function(e) {
            var data = e.data || e.message;
            if (data && isObject(data) && data.trxref) {
                closeIframe();
                handleSuccess(data.trxref, data.raw);
            }
        }, !1)
    }
    
    function listenForCloseEvent() {
        eventer(messageEvent, function(e) {
            var data = e.data || e.message;
            if (data && ("string" == typeof data || data instanceof String)) {
                closeIframe();
            }
        }, !1)
    }
    
    function isObject(obj) {
        return obj === Object(obj) && "[object Array]" !== Object.prototype.toString.call(obj)
    }
    
    function setupIframe() {
        setupPopup("${config.appUrl}/payment?"+randomId());
    }

	function noBrowserIframeSupport() {
        var testIframe = document.createElement("iframe"),
            browserSupportsIframe = "onload" in testIframe;
        return browserSupportsIframe || console.warn("This browser does not support iframes. Please redirect to standard"), !browserSupportsIframe
    }
    
    function isFunction(functionToCheck) {
        if (!functionToCheck) return !1;
        var getType = {};
        return functionToCheck && "[object Function]" === getType.toString.call(functionToCheck)
    }

    function isValidEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email)
    }
    
    function randomId() {
        for (var text = "", possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", i = 0; 5 > i; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text
    }
    
    function setupPopup(source) {
        var cssText = "z-index: 9999;display: none;background: transparent;background: rgba(0,0,0,0.5);border: 0px none transparent;overflow-x: hidden;overflow-y: hidden;visibility: hidden;margin: 0;padding: 0;-webkit-tap-highlight-color: transparent;-webkit-touch-callout: none; position: fixed;left: 0;top: 0;width: 100%;height: 100%;";
        appendIframe({
            src: source,
            cssText: cssText,
            className: "pie_popup",
            parent: document.body
        });
    }
    
    function appendIframe(params) {
        iframe = document.createElement("iframe");
        iframe.setAttribute("frameBorder", "0");
        iframe.setAttribute("allowtransparency", "true");
        iframe.style.cssText = params.cssText;
        iframe.id = iframe.name = defaults.id;
        iframe.src = params.src;
        iframe.className = params.className;
        params.parent.appendChild(iframe);
        iframe.onload = function() {
            iframeLoaded = !0
        }
    }
    
    function closeIframe() {
        if (iframeOpen) {
            var iframe = document.getElementById(defaults.id);
            iframe.style.display = "none";
            iframe.style.visibility = "hidden";
            iframeOpen = !1;
            document.body.style.overflow = "";
            if (iframe) {
                iframe.parentNode.removeChild(iframe);
            }
            callCloseCallback();
            if(_options.unloader){
                isFunction(_options.unloader), _options.unloader();
            }else{
               removeIndeterminateLoader();
            }
        }
    }
    
    function handleSuccess (reference, body) {
        if (_options.callback || _options.form) {
            var form = _options.form;
            if (form) {
                var input = document.createElement("input");
                input.type = "hidden";
                input.id = "trxref";
                input.value = reference;
                input.name = "trxref";
                form.appendChild(input);
                form.submit();
                return; 
            }
            if (_options.callback) {
                _options.callback.call(this, {
                    trxref: reference,
                    raw: body || ''
                });
            }
        }
    }
    
    function callCloseCallback() {
        _options.onClose && _options.onClose.call(this)
    };
    
    function injectIndeterminateLoader(){
        var div = document.createElement("div");
        // div.setAttribute("class", "progress");
        div.id = "progress";
        div.className = "progress";
        var childDiv = document.createElement("div");
        // childDiv.setAttribute("class", "indeterminate");
        childDiv.id = "progress";
        childDiv.className = "indeterminate";
        div.appendChild(childDiv);
        document.body.appendChild(div);
    }
    
    function removeIndeterminateLoader(){
        // var el = document.getElementById( 'progress' );
        // el.parentNode.removeChild( el );
    }
	
	var Pie = function(){
	   Inline({id: 'pie_if' + randomId()});
	}
	
	Pie.prototype.openIframe = function(){
	   if(this._options.loader){
	     isFunction(this._options.loader), this._options.loader();
	   }else{
	     injectIndeterminateLoader();
	   }
	   if (!iframeOpen) {
	       var params = this._options;
          var open = function() {
            var iframe = document.getElementById(defaults.id);
            var receiver = iframe.contentWindow;
            receiver.postMessage({
              iframeId: defaults.id,
              amount: params.amount,
              customer: params.customer,
              publicKey: ${publicKey ? publicKey : 'params.publicKey'},
              commission: params.commission || 0,
              wallet: params.wallet || 'default',
              commissionWallet: params.commissionWallet || 'default',
              inclusive: (params.inclusive === false ?  params.inclusive : true),
              narration: params.narration || 'Payment',
              reference: params.reference || '',
            }, "*");
            (iframe.style.display = "block", iframe.style.visibility = "visible", document.body.style.overflow = "hidden")
            iframeOpen = !0
          };
          iframeLoaded ? open() : iframe.onload = function() {
            open(), iframeLoaded = !0
          }
        }
	}
	
	/* Factory Method */
	
	Pie.setup = function(options){
	    if(!options || !options.amount || !options.customer || !options.publicKey){
	        throw new Error("amount and customer are required");
	    }
		options = _options = Object.assign({}, _options, options);
		var parent = this;
		console.log(options);
		//Create a constructor
		var Child = function() {
		    parent.apply(this, [_options]);
		};
		
		var Surrogate = function(){
		    this.constructor = Child; 
		};
		
		//Set the prototype chain to inherit from parent, without calling parent‘s constructor function.
	    Surrogate.prototype = parent.prototype;
	    Child.prototype = new Surrogate();
	    
	    Child.prototype._options = options;
	    
	    //Set a convenience property in case the parent’s prototype is needed later.
		Child.__super__ = parent.prototype;
		return (new Child());
	};
	
	return Pie;
});
  `)
})

router.get('/js/fund-wallet', (req, res, next) => {
  res.status(200).set('Content-Type', 'text/javascript').send(`
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
                      margin: 20% auto;\
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
});`)
})

module.exports = router
