// 引入微信脚本
document.head.appendChild(document.createElement('script')).src = '/static/js/ui/clipboard.min.js?v=' + ~(-new Date());
if(typeof(wx) == 'undefined') {
    document.head.appendChild(document.createElement('script')).src = 'https://res.wx.qq.com/open/js/jweixin-1.3.2.js?v=' + ~(-new Date());

    // document.write(unescape("%3Cscript src='https://res.wx.qq.com/open/js/jweixin-1.3.2.js?v=" + ~(-new Date()) + "'type='text/javascript'%3E%3C/script%3E"));
}

$(function(){

    function entityToString(str){
      var div = document.createElement('div');
      div.innerHTML = str.replace(/&amp;/g, '&');
      return div.innerText;
    }
    wxconfig && (wxconfig.title = entityToString(wxconfig.title));
    wxconfig && (wxconfig.description = entityToString(wxconfig.description));

    if(wxconfig && wxconfig.imgUrl.indexOf('siteConfig/logo') > -1 && shareAdvancedUrl){
        wxconfig.imgUrl = shareAdvancedUrl;
    }

    if(wxconfig){
      var userid = $.cookie((window.cookiePre ? window.cookiePre : 'HN_') + 'userid');
      if(userid){
        wxconfig.link = wxconfig.link.indexOf('?') > -1 ? (wxconfig.link + '&fromShare=' + userid) : (wxconfig.link + '?fromShare=' + userid)
      }
    }

    //小程序
    if(navigator.userAgent.toLowerCase().match(/micromessenger/)) {
        wx.miniProgram.getEnv(function (res) {
            if (res.miniprogram) {
                wx.miniProgram.postMessage({
                    data: {
                        title: '  ',
                        imgUrl: wxconfig.imgUrl,
                        desc: wxconfig.description,
                        link: wxconfig.link
                    }
                });
            }
        });
    }


    // 百度小程序
    if( navigator.userAgent.indexOf('swan-baiduboxapp') > -1){
    	swan.webView.getEnv(function (res) {
          if(res.smartprogram) {
          	 setTimeout(function(){
          	 	swan.webView.postMessage({
                    data: {
                        title: wxconfig.title,
                        imgUrl: wxconfig.imgUrl,
                        desc: wxconfig.description,
                        link: wxconfig.link
                    }
            	});
          	 }, 1000);
          }
      });
    }

    //分享功能只提供给APP使用
    // var deviceUserAgent = navigator.userAgent;
    // if (deviceUserAgent.indexOf('huoniao') > -1) {
    //     $('.HN_PublicShare').show();
    // }else{
    //     $('.HN_PublicShare').hide();
    // }

	// 由于每个页面都引入了touchBase.css，所以把公共分享的样式转移到了touchBase.css中  by: gz 20180314
	// $("head").append('<link rel="stylesheet" type="text/css" href="'+staticPath+'css/publicShare.css?t='+~(-new Date())+'">');
	var HN_user_lang = ($.cookie('HN_lang') != null && $.cookie('HN_lang') != 'zh-CN' ? "" : "fn-hide");
	var shareHtml = '<div class="HN_PublicShare_shearBox fn-hide"id="HN_PublicShare_shearBox"><div class="HN_PublicShare_sheark1"><div class="HN_PublicShare_sheark2"><div class="HN_PublicShare_HN_style_32x32"><ul class="fn-clear">' +
	  '<li> <a class="HN_button_qzone" href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + wxconfig.link + '&desc=' + wxconfig.title + '"></a>'+langData['siteConfig'][38][13]+'</li>' +	//QQ空间
	  '<li><a class="HN_button_tsina" href="http://service.weibo.com/share/share.php?url=' + wxconfig.link + '&desc=' + document.title + '"></a>'+langData['siteConfig'][23][127]+'</li>' +		//新浪微博
	  '<li><a class="HN_button_tweixin"></a>'+langData['siteConfig'][27][139]+'</li>' +// 微信
	  '<li><a class="HN_button_ttqq"></a>'+langData['siteConfig'][38][14]+'</li>' +	//QQ好友
	  '<li><a class="HN_button_comment"><span class="HN_txt jtico jtico_comment"></span></a>'+langData['siteConfig'][38][15]+'</li>' +	//朋友圈
	  '<li class="'+HN_user_lang+'"> <a class="HN_button_fb " href="https://www.facebook.com/sharer/sharer.php?u='+encodeURI(wxconfig.link)+'"></a>facebook</li>' +	//facebook
      	  '<li><a class="HN_button_code"><span class="HN_txt jtico jtico_code"></span></a>'+langData['siteConfig'][20][593]+'</li>' +	//二维码
	  '<li><button class="HN_button_link" data-clipboard-action="copy"  data-clipboard-text="'+ wxconfig.link +'"></button>'+langData['siteConfig'][39][62]+'</li>' +		//复制链接
	  '</ul></div></div> <div class="HN_PublicShare_cancel" id="HN_PublicShare_cancelShear">'+langData['siteConfig'][6][12]+'</div></div>' +	//取消
	  '<div class="HN_PublicShare_bg" id="HN_PublicShare_shearBg"></div></div ><div class="HN_PublicShare_shearBox HN_PublicShare_codeBox" id="HN_PublicShare_codeBox"><div class="HN_PublicShare_sheark1">' +
	  '<img src="" alt="" width="130" height="130"><p>'+langData['siteConfig'][38][16]+'</p>' +	//让朋友扫一扫访问当前网页
	  '<div class="HN_PublicShare_cancel" id="HN_PublicShare_cancelcode">'+langData['siteConfig'][6][12]+'</div>' +	//取消
	  '</div><div class="HN_PublicShare_bg"></div></div><div class="HN_PublicShare_zhiyin fn-hide"><div class="HN_PublicShare_bg"><div class="HN_PublicShare_zhibox"><img src="' + staticPath + 'images/HN_Public_sharezhi.png?v=1" alt=""></div></div></div>';

	// $("head").append('<style id="publit_shear_load">.HN_PublicShare_shearBox,.HN_PublicShare_zhiyin {display:none;}</style>');
	$("body").append(shareHtml);

	var hnShare = {
		showShareBox: function(){
			// $("#publit_shear_load").remove();
			$('#HN_PublicShare_shearBox').removeClass('fn-hide').animate({'bottom': '0'}, 200);
			$('#HN_PublicShare_shearBox .HN_PublicShare_bg').css({'height':'100%','opacity':1});

		}

		,closeShearBox: function(){
			$('#HN_PublicShare_shearBox').animate({'bottom': '-100%'}, 200);
			$('#HN_PublicShare_shearBox .HN_PublicShare_bg').css({'height':'0','opacity':0});
		}

		,showQRBox: function(){
			$('#HN_PublicShare_shearBox').animate({'bottom': '-100%'}, 200);
			$('#HN_PublicShare_codeBox').animate({'bottom': '0'}, 200);
		}
		,closeQRBox: function(){
            $('#HN_PublicShare_codeBox').animate({'bottom': '-100%'}, 200);
            $('.HN_PublicShare_shearBox .HN_PublicShare_bg').css({'height':'0','opacity':0});
      	}
      	,showSRBox: function(){
			$('.HN_PublicShare_zhiyin').show();
			$('.HN_PublicShare_zhiyin .HN_PublicShare_bg').css({'height':'100%','opacity':1});
      	}
      	,closeSRBox: function(){
			$('.HN_PublicShare_zhiyin').hide();
    	    $('.HN_PublicShare_zhiyin .HN_PublicShare_bg').css({'height':'0','opacity':0});
      	}
	}


	var device = navigator.userAgent;
    var clipboardShare;

	$("body").delegate(".HN_PublicShare", "click", function(){
		//非客户端下调用默认分享功能
		var device = navigator.userAgent;
		if(device.indexOf('huoniao') <= -1){

            if(!clipboardShare){
                clipboardShare = new ClipboardJS('.HN_button_link');
                clipboardShare.on('success', function(e) {
                    alert(langData['siteConfig'][46][101]);  //复制成功
                });

                clipboardShare.on('error', function(e) {
                    alert(langData['siteConfig'][46][102]); //复制失败
                });
            }

			var QzoneUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+wxconfig.link+'&desc='+wxconfig.title,
			TsinaUrl = 'http://service.weibo.com/share/share.php?url='+wxconfig.link+'&desc='+wxconfig.title;
			$('.HN_button_qzone').attr("href",QzoneUrl);
			$('.HN_button_tsina').attr("href",TsinaUrl);
			hnShare.showShareBox();

		//客户端下调用原生分享功能
		}else{
            setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler("appShare", {
					"platform": "all",
					"title": wxconfig.title,
					"url": wxconfig.link,
					"imageUrl": wxconfig.imgUrl,
					"summary": wxconfig.description
				}, function(responseData){
					var data = JSON.parse(responseData);
					// if(data.state == 100){
					// 	alert("分享成功！");
					// }else{
					// 	alert(data.info);
					// }
				})
		  });
      }

      //隐藏浮动菜单
      $('.fixFooter').show();
	  $('.header').removeClass('open');
	  $('#navBox_4').hide();
	  $('#navBox_4 .bg').css({'height':'0','opacity':0});

      return false;
	});
	$("body").delegate(".HN_PublicShare", "touchend", function(e){
		//取消点透事件，增加此代码会导致不能分享
		 // e.preventDefault();
	});

	//单独分享
	$("body").delegate(".HN_PublicShare_Singel", "click", function(event){
		event.preventDefault();
		var id = $(this).attr("data-id");
		var device = navigator.userAgent;
		if(device.indexOf('huoniao') > -1){
			setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler("appShare", {
					"platform": id,
					"title": wxconfig.title,
					"url": wxconfig.link,
					"imageUrl": wxconfig.imgUrl,
					"summary": wxconfig.description
				}, function(responseData){
					var data = JSON.parse(responseData);
					// if(data.state == 100){
					// 	alert("分享成功！");
					// }else{
					// 	alert(data.info);
					// }
				})
			});
		}else{
			if(id == "1zone"){
				location.href = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+wxconfig.link+'&desc='+document.title;
			}else if(id == "weibo"){
				location.href = 'http://service.weibo.com/share/share.php?url='+wxconfig.link+'&desc='+document.title;
			}else if(id == "weixin"){
				var code = masterDomain+'/include/qrcode.php?data='+encodeURIComponent(wxconfig.link);
				// hnShare.showQRBox();
				hnShare.showSRBox();
				// $('.HN_PublicShare_bg').css({'height':'100%','opacity':1});
				$('#HN_PublicShare_codeBox img').attr('src', code);
			}else if(id == "timeline"){
				var code = masterDomain+'/include/qrcode.php?data='+encodeURIComponent(wxconfig.link);
				// hnShare.showQRBox();
				hnShare.showSRBox();
				// $('.HN_PublicShare_bg').css({'height':'100%','opacity':1});
				$('#HN_PublicShare_codeBox img').attr('src', code);
			}else if(id == "qq"){
				var code = masterDomain+'/include/qrcode.php?data='+encodeURIComponent(wxconfig.link);
				// hnShare.showQRBox();
				hnShare.showSRBox();
				// $('.HN_PublicShare_bg').css({'height':'100%','opacity':1});
				$('#HN_PublicShare_codeBox img').attr('src', code);
			}
		}
	});

	// $("body").delegate("#HN_PublicShare_shearBg", "tap click", function(){
	// 	hnShare.closeShearBox();
	// 	hnShare.closeQRBox();
	// 	hnShare.closeSRBox();
	// });

	$("#HN_PublicShare_shearBg").click(function(){
		hnShare.closeShearBox();
		hnShare.closeQRBox();
		hnShare.closeSRBox();
	});

	// $("body").delegate(".HN_PublicShare_bg", "tap click", function(){
	// 	hnShare.closeShearBox();
	// 	hnShare.closeQRBox();
	// 	hnShare.closeSRBox();
	// });

	$(".HN_PublicShare_bg").click(function(){
		hnShare.closeShearBox();
		hnShare.closeQRBox();
		hnShare.closeSRBox();
	});

	$("body").delegate(".HN_PublicShare_bg", "touchend", function(e){
		//取消点透事件，增加此代码会导致不能分享
		 // e.preventDefault();
	});

	// $("body").delegate("#HN_PublicShare_cancelShear", "tap click", function(){
	// 	hnShare.closeShearBox();
	// });

	$("#HN_PublicShare_cancelShear").click(function(){
		hnShare.closeShearBox();
	});

	// $("body").delegate("#HN_PublicShare_cancelcode,#HN_PublicShare_cancelShear", "tap click", function(){

	// 	hnShare.closeShearBox();
	// 	hnShare.closeQRBox();
	// });

	$("#HN_PublicShare_cancelcode,#HN_PublicShare_cancelShear").click(function(){
		hnShare.closeShearBox();
		hnShare.closeQRBox();
	});

	// $("body").delegate(".HN_button_code", "tap click", function(){
	// 	var code = masterDomain+'/include/qrcode.php?data='+encodeURIComponent(wxconfig.link);
	// 	hnShare.showQRBox();
	// 	$('#HN_PublicShare_codeBox img').attr('src', code);
	// });

	$(".HN_button_code").click(function(){
		var code = masterDomain+'/include/qrcode.php?data='+encodeURIComponent(wxconfig.link);
		hnShare.showQRBox();
		$('#HN_PublicShare_codeBox img').attr('src', code);
	});

	$('.HN_button_tweixin, .HN_button_ttqq, .HN_button_comment').click(function(){
		hnShare.closeShearBox();
		hnShare.showSRBox();
	})


	//微信分享
    if(navigator.userAgent.toLowerCase().match(/micromessenger/)) {
        wx.config({
            debug: false,
            appId: wxconfig.appId,
            timestamp: wxconfig.timestamp,
            nonceStr: wxconfig.nonceStr,
            signature: wxconfig.signature,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'openLocation', 'scanQRCode',],
            openTagList: ['wx-open-launch-app'] ,// 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
        });
        wx.ready(function () {
            wx.onMenuShareAppMessage({
                title: wxconfig.title,
                desc: wxconfig.description,
                link: wxconfig.link,
                imgUrl: wxconfig.imgUrl,
                trigger: function (res) {
                    hnShare.closeSRBox();
                },
            });
            wx.onMenuShareTimeline({
                title: wxconfig.title + ' ' + wxconfig.description,
                link: wxconfig.link,
                imgUrl: wxconfig.imgUrl,
            });
            wx.onMenuShareQQ({
                title: wxconfig.title,
                desc: wxconfig.description,
                link: wxconfig.link,
                imgUrl: wxconfig.imgUrl,
            });
            wx.onMenuShareWeibo({
                title: wxconfig.title,
                desc: wxconfig.description,
                link: wxconfig.link,
                imgUrl: wxconfig.imgUrl,
            });
            wx.onMenuShareQZone({
                title: wxconfig.title,
                desc: wxconfig.description,
                link: wxconfig.link,
                imgUrl: wxconfig.imgUrl,
            });
        });
    }

	// 复制链接


});
