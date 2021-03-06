$(function(){

  var objId = $("#list"), lei = 0;


  //导航
  $('.header-r .screen').click(function(){
    var nav = $('.nav'), t = $('.nav').css('display') == "none";
    if (t) {nav.show();}else{nav.hide();}
  })


  var uploadErrorInfo = [],
  	huoniao = {

  	//转换PHP时间戳
  	transTimes: function(timestamp, n){
  		update = new Date(timestamp*1000);//时间戳要乘1000
  		year   = update.getFullYear();
  		month  = (update.getMonth()+1<10)?('0'+(update.getMonth()+1)):(update.getMonth()+1);
  		day    = (update.getDate()<10)?('0'+update.getDate()):(update.getDate());
  		hour   = (update.getHours()<10)?('0'+update.getHours()):(update.getHours());
  		minute = (update.getMinutes()<10)?('0'+update.getMinutes()):(update.getMinutes());
  		second = (update.getSeconds()<10)?('0'+update.getSeconds()):(update.getSeconds());
  		if(n == 1){
  			return (year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second);
  		}else if(n == 2){
  			return (year+'-'+month+'-'+day);
  		}else if(n == 3){
  			return (month+'-'+day);
  		}else{
  			return 0;
  		}
  	}

  	//数字格式化
  	,number_format: function(number, decimals, dec_point, thousands_sep) {
  		var n = !isFinite(+number) ? 0 : +number,
  				prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
  				sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
  				dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
  				s = '',
  				toFixedFix = function (n, prec) {
  					var k = Math.pow(10, prec);
  					return '' + Math.round(n * k) / k;
  				};

  		s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  		if (s[0].length > 3) {
  			s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  		}
  		if ((s[1] || '').length < prec) {
  			s[1] = s[1] || '';
  			s[1] += new Array(prec - s[1].length + 1).join('0');
  		}
  		return s.join(dec);
  	}

  	//将普通时间格式转成UNIX时间戳
  	,transToTimes: function(timestamp){
  		var new_str = timestamp.replace(/:/g,'-');
      new_str = new_str.replace(/ /g,'-');
      var arr = new_str.split("-");
      var datum = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
      return datum.getTime()/1000;
  	}

  	//登录
  	,login: function(){
  		$("#login_iframe, #login_bg").remove();

  		var site = channelDomain;

  		//如果频道域名为子目录
  		if(channelDomain.replace("//", "").indexOf("/") > 1){
  			site = masterDomain;
  		}

  		var src = masterDomain+'/login_popup.html?site='+site+'&v=1.9',
  				wWidth = $(document).width(),
  				wHeight = $(document).height(),
  				fWidht = 650,
  				fHeight = 314;
  		$("<div>")
  			.attr("id", "login_iframe")
  			.html('<iframe scrolling="no" src="'+src+'" frameborder="0" allowtransparency="true"></iframe>')
  			.appendTo("body");
  		$("<div>")
  			.attr("id", "login_bg")
  			.css({"height": wHeight+"px"})
  			.html('<div class="loadPage">'+langData['siteConfig'][37][100]+'</div><iframe></iframe>')//页面加载中，请稍候...
  			.appendTo("body");
  	}

  	//登录窗口尺寸调整
  	,changeLoginFrameSize: function(height){
  		$("#login_iframe, #login_iframe iframe").css({"height": height+"px"}).fadeIn("fast");
  	}

  	//关闭登录窗口
  	,closeLoginFrame: function(){
  		$("#login_iframe, #login_bg").fadeOut("fast", function(){
  			$("#login_iframe, #login_bg").remove();
  		});
  	}

  	//判断登录成功
  	,checkLogin: function(fun){
  		//异步获取用户信息
  		$.ajax({
  			url: masterDomain+'/getUserInfo.html',
  			type: "GET",
  			async: false,
  			dataType: "jsonp",
  			success: function (data) {
  				if(data){
  					fun();
  				}
  			},
  			error: function(){
  				return false;
  			}
  		});
  	}

  	//登录成功
  	,loginSuccess: function(){
  		//异步获取用户信息
  		$.ajax({
  			url: masterDomain+'/getUserInfo.html',
  			type: "GET",
  			dataType: "jsonp",
  			success: function (data) {
  				if(data){

  					location.reload();
  					return false;
  					$("#navLoginBefore").hide();

  					if(data.photo != ""){
  						$("#upic a").html('<img src="'+huoniao.changeFileSize(data.photo, "small")+'" />');
  					}else{
  						$("#upic").html(langData['siteConfig'][38][0]).css({"width": "auto"});//欢迎您，
  					}
  					$("#uname").html(data.nickname);

  					if(data.message > 0){
  						$("#umsg").html(langData['siteConfig'][19][239]+"("+(data.message > 99 ? "99+" : data.message)+")").show();//消息
  					}
  					$("#navLoginAfter").show();
  				}
  			},
  			error: function(){

  			}
  		});
  	}

  	//获取附件不同尺寸
  	,changeFileSize: function(url, to, from){
  		if(url == "" || url == undefined) return "";
  		if(to == "") return url;
  		var from = (from == "" || from == undefined) ? "large" : from;
  		if(hideFileUrl == 1){
  			return url + "&type=" + to;
  		}else{
  			return url.replace(from, to);
  		}
  	}

  	//获取字符串长度
  	//获得字符串实际长度，中文2，英文1
  	,getStrLength: function(str) {
  		var realLength = 0, len = str.length, charCode = -1;
  		for (var i = 0; i < len; i++) {
  		charCode = str.charCodeAt(i);
  		if (charCode >= 0 && charCode <= 128) realLength += 1;
  		else realLength += 2;
  		}
  		return realLength;
  	}

  	//旋转图集文件
  	,rotateAtlasPic: function(mod, direction, img, c) {
  			var g = {
  				mod: mod,
  				type: "rotateAtlas",
  				direction: direction,
  				picpath: img,
  				randoms: Math.random()
  			};
  			$.ajax({
  				type: "POST",
  				cache: false,
  				async: false,
  				url: "/include/upload.inc.php",
  				dataType: "json",
  				data: $.param(g),
  				success: function(a) {
  					try {
  						c(a)
  					} catch(b) {}
  				}
  			});
  		}

  	//删除已上传的图片
  	,delAtlasImg: function(mod, obj, path, listSection, delBtn){
  		var g = {
  			mod: mod,
  			type: "delAtlas",
  			picpath: path,
  			randoms: Math.random()
  		};
  		$.ajax({
  			type: "POST",
  			cache: false,
  			async: false,
  			url: "/include/upload.inc.php",
  			dataType: "json",
  			data: $.param(g),
  			success: function() {}
  		});
  		$("#"+obj).remove();

  		if($("#"+listSection).find("li").length < 1){
  			$("#"+listSection).hide();
  			$("#"+delBtn).hide();
  		}
  	}

  	//将字符串转成utf8
  	,toUtf8: function(str) {
  		var out, i, len, c;
  		out = "";
  		len = str.length;
  		for(i = 0; i < len; i++) {
  			c = str.charCodeAt(i);
  			if ((c >= 0x0001) && (c <= 0x007F)) {
  				out += str.charAt(i);
  			} else if (c > 0x07FF) {
  				out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
  				out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
  				out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
  			} else {
  				out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
  				out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
  			}
  		}
  		return out;
  	}

  	//异步操作
  	,operaJson: function(url, action, callback){
  		$.ajax({
  			url: url,
  			data: action,
  			type: "POST",
  			dataType: "json",
  			success: function (data) {
  				typeof callback == "function" && callback(data);
  			},
  			error: function(){

  				$.post("../login.php", "action=checkLogin", function(data){
  					if(data == "0"){
  						huoniao.showTip("error", langData['siteConfig'][20][262]);//登录超时，请重新登录！
  						setTimeout(function(){
  							location.reload();
  						}, 500);
  					}else{
  						huoniao.showTip("error", langData['siteConfig'][6][203]);//网络错误，请重试！
  					}
  				});

  			}
  		});
  	}

  	//合并相同内容的单元格
  	,rowspan: function(t, colIdx) {
  	    return t.each(function() {
  	        var that;
  	        $('tr', this).each(function(row) {
  	            $('td:eq(' + colIdx + ')', this).filter(':visible').each(function(col) {
  	                if (that != null && $(this).html() == $(that).html()) {
  	                    rowspan = $(that).attr("rowSpan");
  	                    if (rowspan == undefined) {
  	                        $(that).attr("rowSpan", 1);
  	                        rowspan = $(that).attr("rowSpan");
  	                    }
  	                    rowspan = Number(rowspan) + 1;
  	                    $(that).attr("rowSpan", rowspan);
  	                    $(this).hide();
  	                } else {
  	                    that = this;
  	                }
  	            });
  	        });
  	    });
  	}


  }

  //项目
	$(".tab .type").bind("click", function(){
		var t = $(this), id = t.attr("data-id"), index = t.index();
		if(!t.hasClass("curr")){
			state = id;
			atpage = 1;
      $('.count li').eq(index).show().siblings("li").hide();
			t.addClass("curr").siblings("li").removeClass("curr");
      objId.html('');
			getList(1);
		}
	});
  //类型切换
  $(".sel select").bind("change", function(){
    var t = $(this), id = t.val();
      lei = id;
      state = "";
      atpage = 1;

      $(".tab li:eq(0)").addClass("curr").siblings("li").removeClass("curr");
      $('.count li').eq(0).show().siblings("li").hide();
      $('#list').html('');
      getList(1);
  });

  var bidDefaultDay = parseInt($(".day .on").text()),               //默认时长为选中的天数
      bidPriceObj   = $('#dayprice'),                               //每日预算input
      bidAmountObj  = $('#totalPrice em'),                          //总价格
      bidDayObj     = $('.state1 .bidJ-pay-select .inp input'),     //自定义天数input
      bidPopObj     = $('.bidJ-pay, .mask'),                        //浮动层和背景层
      bidCloseObj   = $('.bidJ-pay-tit .close'),                    //关闭按钮
      bidCurrObj    = $("#currPrice"),                              //当前每日预算
      bidEnd        = $("#bidEnd"),                                 //竞价结束时间
      bidPriceObj1  = $('.state2 .bid-inp'),                        //每日增加预算input
      bidAmountObj1 = $('.state2 .total-price'),                    //需要支付费用
      isIncrease    = false,  //是否加价操作
      bidID         = 0,      //要竞价的信息
      bidCurrPrice  = 0,      //当前每日预算，异步获取
      bidCurrDay    = 0;      //剩余竞价天数

      //计算总价
    computeBidAmount = function(){
      var bidDayPrice = bidPriceObj.val();
      var bidAmount = bidDayPrice * bidDefaultDay;
      bidAmount = isNaN(bidAmount) || bidAmount < 0 ? 0 : bidAmount;
      bidAmountObj.html(bidAmount.toFixed(2));
    };

  // 打开竞价
  $('#list').delegate('.bid', 'click', function(){
    var t = $(this), id = t.closest(".house-box").attr("data-id");
    if(t.hasClass("load")) return false;

    t.addClass("load");
    bidID = id;

    //验证信息状态
    $.ajax({
      "url": masterDomain + "/include/ajax.php?service=house&action=checkBidState",
      "data": {"aid": id, "type": type},
      "dataType": "jsonp",
      success: function(data){
        t.removeClass("load");
        if(data && data.state == 100){
          bidPopObj.show();

          //加价
          if(data.info.isbid){
            isIncrease = true;
            $(".bidJ-pay .state1").hide();
            $(".bidJ-pay .state2").show();

            bidCurrPrice = parseFloat(data.info.bid_price);
            bidCurrDay   = (data.info.bid_end - data.info.now) / 24 / 3600;
            bidCurrDay   = bidCurrDay <= 0 ? 1 : bidCurrDay;
            bidCurrDay   = Math.ceil(bidCurrDay);
            bidCurrObj.html(bidCurrPrice);
            bidEnd.html(huoniao.transTimes(data.info.bid_end, 1));
            bidPriceObj1.val(bidDefaultAdd).focus();
            bidAmountObj1.html((bidDefaultAdd * bidCurrDay).toFixed(2));

          }else{
            isIncrease = false;
            $(".bidJ-pay .state1").show();
            $(".bidJ-pay .state2").hide();
            console.log(bidDefault)
            bidPriceObj.val(bidDefault).focus();
            computeBidAmount();
          }

        }else{
          alert(data.info);
        }

        //登录超时
        if(data.state == 101){
          location.reload();
        }
      },
      error: function(){
        t.removeClass("load");
        alert(langData['siteConfig'][45][17]);//网络错误，操作失败，请稍候重试！
      }
    });

  })

  // 选择支付方式
  $('.paybox ul li').click(function(){
    $(this).addClass('on').siblings('li').removeClass('on');
  })


  // 竞价 计算总价
  $('.day li').click(function(){
    var t = $(this), val = t.text();
    t.addClass('on').siblings('li').removeClass('on');
    $('#dayCount').val('');
    bidDefaultDay = parseInt(val);
    computeBidAmount();
  })

  // 自定义天数
  $('#dayCount').focus(function(){
    $('.day li').removeClass('on');
  })

  $('#dayCount').keyup(function(){
    bidDefaultDay = $(this).val();
    computeBidAmount();
  })

  // 自定义预算
  $('#dayprice').keyup(function(){
    computeBidAmount();
  })

   // 每日增加预算
  bidPriceObj1.keyup(function(){
    var t = $(this), val = t.val();
    if(isNaN(val) || val < 0){
      t.val(0);
      val = 0;
    }
    bidAmountObj1.html((val * bidCurrDay).toFixed(2));
  });


  // 选择支付方式
  $('.bidbtn').click(function(){
    // 加价
    if(isIncrease){
      var inpPrice1 = bidPriceObj1.val();
      if (inpPrice1 == "" || isNaN(inpPrice1) || inpPrice1 == 0){
        event.preventDefault();
        alert(langData['siteConfig'][45][18]);//请输入正确的每日预算
        return false;
      }
    }else{
      var dom = $('.day li').hasClass('on'), dayCount = $('#dayCount').val(), dayprice = $('#dayprice').val();
      if (!dom && dayCount == "") {
        alert(langData['siteConfig'][45][19]);//请输入正确的竞价时长
        return false;
      }else if(dayprice == ""){
        alert(langData['siteConfig'][45][18]);//请输入正确的每日预算
        return false;
      }
    }

    $('.bidJ-pay').fadeOut(300);

    //如果不在客户端中访问，根据设备类型删除不支持的支付方式
    if(appInfo.device == ""){
        if(navigator.userAgent.toLowerCase().match(/micromessenger/)){
            $("#alipay, #globalalipay").remove();
        }
    }
    $(".paybox li:eq(0)").addClass("on");

    setTimeout(function(){
      $('.bidJ-pay').hide();
    }, 300);
    $('.paybox').addClass('show').animate({"bottom":"0"},300);
  })

  // 支付
  $('.paybtn').click(function(){
    var t = $(this);
    var inpPrice = bidPriceObj.val();
    var inpPrice1 = bidPriceObj1.val();
    var paytype = $(".paybox .on").data("type");
    //加价
    if(isIncrease){

      if (inpPrice1 == "" || isNaN(inpPrice1) || inpPrice1 == 0){
        event.preventDefault();
        alert(langData['siteConfig'][45][18]);//请输入正确的每日预算
        return false;
      }

      if(paytype == "" || paytype == undefined || paytype == null){
        event.preventDefault();
        alert(langData['siteConfig'][21][75]);//请选择支付方式！
        return false;
      }

      var url = t.data("url1").replace("$aid", bidID).replace("$price", inpPrice1).replace("$paytype", paytype);
      t.attr("href", url);


    //正常竞价
    }else{
      if(!bidID){
        event.preventDefault();
        alert(langData['siteConfig'][20][265]);//请选择要竞价的信息！
        bidCloseObj.click();
        return false;
      }

      if (bidDefaultDay == "" || isNaN(bidDefaultDay) || bidDefaultDay == 0) {
        event.preventDefault();
        alert(langData['siteConfig'][20][266]);//请选择正确的竞价天数
        return false;
      }

      if (inpPrice == "" || isNaN(inpPrice) || inpPrice == 0){
        event.preventDefault();
        alert(langData['siteConfig'][45][18]);//请输入正确的每日预算
        return false;
      }

      if(paytype == "" || paytype == undefined || paytype == null){
        event.preventDefault();
        alert(langData['siteConfig'][21][75]);//请选择支付方式！
        return false;
      }

      var url = t.data("url").replace("$aid", bidID).replace("$price", inpPrice).replace("$day", bidDefaultDay).replace("$paytype", paytype);
      t.attr("href", url);
    }

    //客户端中支付
    if(appInfo.device != ""){
        t.attr("href", url+"&app=1");
    }

    setTimeout(function(){
      $('.paybox').removeClass('show');
      $('.mask').hide();
    }, 500);
  })

  // 点击遮罩层
  $('.mask').on('click',function(){
    $('.mask').hide();
    $('.bidJ-pay').hide();
    $('.paybox').animate({"bottom":"-100%"},300)
    setTimeout(function(){
      $('.paybox').removeClass('show');
    }, 300);
    $('body').removeClass('fixed');
  })


  // 关闭竞价
  $('.bidJ-pay .close').click(function(){
    $('.bidJ-pay, .mask').hide();
    $('body').removeClass('fixed');
  })


  // 删除
  objId.delegate(".del", "click", function(){
    var t = $(this), par = t.closest(".house-box"), id = par.attr("data-id");
    if(id){
      if(confirm(langData['siteConfig'][20][543])){//你确定要删除这条信息吗？
        t.siblings("a").hide();
        t.addClass("load");

        $.ajax({
          url: masterDomain+"/include/ajax.php?service=house&type="+type+"&action=del&id="+id,
          type: "GET",
          dataType: "jsonp",
          success: function (data) {
            if(data && data.state == 100){

              //删除成功后移除信息层并异步获取最新列表
              objId.html('');
              getList(1);

            }else{
              alert(data.info);
              t.siblings("a").show();
              t.removeClass("load");
            }
          },
          error: function(){
            alert(langData['siteConfig'][6][203]);//网络错误，请稍候重试！
            t.siblings("a").show();
            t.removeClass("load");
          }
        });
      }
    }
  });


  // 下拉加载
	$(window).scroll(function() {
    var h = $('.house-box').height();
    var allh = $('body').height();
    var w = $(window).height();
    var scroll = allh - w - h;
		if ($(window).scrollTop() > scroll && !isload) {
      atpage++;
			getList();
		};
	});


  getList(1);


  function getList(is){

    isload = true;

    if(is != 1){
    	// $('html, body').animate({scrollTop: $(".main-tab").offset().top}, 300);
    }

    objId.append('<p class="loading">'+langData['siteConfig'][20][184]+'...</p>');//加载中，请稍候

    var t = "type="+lei;
    if(type == "zu") t = "rentype="+lei;
    var action = type+"List";
    if(type == "qzu" || type == "qgou"){
    	action = "demand";
    	t = type == "qzu" ? "typeid=0" : "typeid=1";
    }

    $.ajax({
    	url: masterDomain+"/include/ajax.php?service=house&action="+action+"&"+t+"&u=1&orderby=1&state="+state+"&page="+atpage+"&pageSize="+pageSize,
    	type: "GET",
    	dataType: "jsonp",
    	success: function (data) {
    		if(data && data.state != 200){
    			if(data.state == 101){
    				$("#total").html(0);
    				$("#audit").html(0);
    				$("#gray").html(0);
    				$("#refuse").html(0);
    				$("#expire").html(0);
    				objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");//暂无相关信息！
    			}else{
    				var list = data.info.list, pageInfo = data.info.pageInfo, html = [];

    				//拼接列表
    				if(list.length > 0){

    					var t = window.location.href.indexOf(".html") > -1 ? "?" : "&";
    					var param = t + "do=edit&type="+type+"&id=";
    					var urlString = editUrl + param;

    					for(var i = 0; i < list.length; i++){
    						var item        = [],
    								id          = list[i].id,
    								title       = list[i].title,
    								community   = list[i].community,
    								addr        = list[i].addr,
    								price       = list[i].price,
    								url         = list[i].url,
    								litpic      = list[i].litpic,
    								protype     = list[i].protype,
    								room        = list[i].room,
    								bno         = list[i].bno,
    								floor       = list[i].floor,
    								area        = list[i].area,
                    isbid       = list[i].isbid,
                    bid_price   = list[i].bid_price,
    								pubdate     = list[i].pubdate;

    						//求租
    						if(type == "qzu" || type == "qgou"){

    							var action = list[i].action;

    							html.push('<div class="item qiu fn-clear" data-id="'+id+'">');
    							html.push('<div class="o"><a href="'+urlString+id+'" class="edit"><s></s>'+langData['siteConfig'][6][6]+'</a><a href="javascript:;" class="del"><s></s>'+langData['siteConfig'][6][8]+'</a></div>');//编辑--删除
    							html.push('<div class="i">');

    							var state = "";
    							if(list[i].state == "0"){
    								state = '&nbsp;&nbsp;·&nbsp;&nbsp;<span class="gray">'+langData['siteConfig'][9][21]+'</span>';  //未审核
    							}else if(list[i].state == "2"){
    								state = '&nbsp;&nbsp;·&nbsp;&nbsp;<span class="red">'+langData['siteConfig'][9][35]+'</span>';  //审核拒绝
    							}

    							var protype = "";
    							switch(action){
                    case "1":
                      protype = langData['siteConfig'][19][764];//新房
                      break;
                    case "2":
                      protype = langData['siteConfig'][19][218];//二手房
                      break;
                    case "3":
                      protype = langData['siteConfig'][19][904];//出租房
                      break;
                    case "4":
                      protype = langData['siteConfig'][19][220];//写字楼
                      break;
                    case "5":
                      protype = langData['siteConfig'][19][221];//商铺
                      break;
                    case "6":
                      protype = langData['siteConfig'][19][905];//厂房/仓库
                      break;
                  }

    							html.push('<p>'+langData['siteConfig'][19][84]+'：'+protype+'&nbsp;&nbsp;·&nbsp;&nbsp;'+langData['siteConfig'][19][8]+'：'+addr+'&nbsp;&nbsp;·&nbsp;&nbsp;'+langData['siteConfig'][11][8]+'：'+huoniao.transTimes(pubdate, 1)+state+'</p>');//类型 --区域 --  发布时间
    							html.push('<h5><a href="'+url+'" target="_blank" title="'+title+'">'+title+'</a></h5>');
    							html.push('</div>');
    							html.push('</div>');

    						//二手房
    						}else if(type == "sale"){

    							var unitprice   = list[i].unitprice;

    							html.push('<div class="house-box" data-id="'+id+'">');
    							html.push('<div class="house-item fn-clear">');
    							if(litpic != "" && litpic != undefined){
    								html.push('<div class="house-img fn-left">');
                    html.push('<a href="'+url+'">');
    								html.push('<img src="'+huoniao.changeFileSize(litpic, "small")+'" />');
    								html.push('</a>');
    								html.push('</div>');
    							}
    							html.push('<dl>');
    							html.push('<dt>'+title+'</dt>');
    							html.push('<dd class="item-area"><em>'+addr+'</em><em>'+bno+'/'+floor+langData['siteConfig'][13][12]+'</em><span class="price fn-right">'+price+langData['siteConfig'][13][27]+echoCurrency('short')+'</span></dd>');//层 -- 万
    							html.push('<dd class="item-type-1"><em>'+community+'</em><em>'+langData['siteConfig'][45][21]+':'+area+echoCurrency('areasymbol')+'</em><em>'+room+'</em><em>'+protype+'</em></dd>');//建面
    							html.push('<dd class="item-type-2">');
                  if(list[i]['state'] == 1){
                    if(isbid == 1){
                      html.push('<a href="javascript:;" class="bid">'+langData['siteConfig'][6][17]+'</a>')//加价
                    }else{
                      html.push('<a href="javascript:;" class="bid">'+langData['siteConfig'][6][16]+'</a></a>')//竞价
                    }
                  }
                  html.push('<a href="'+urlString+id+'" class="edit">'+langData['siteConfig'][6][6]+'</a><a href="javascript:;" class="del">'+langData['siteConfig'][6][8]+'</a>')//编辑 -- 删除
                  html.push('</dd>');
    							html.push('</dl>');
    							html.push('</div>');

    							html.push('</div>');
    							html.push('</div>');

    						//出租房
    						}else if(type == "zu"){

    							var zhuangxiu = list[i].zhuangxiu,
    									rentype   = list[i].rentype;

                  html.push('<div class="house-box" data-id="'+id+'">');
    							html.push('<div class="house-item fn-clear">');
    							if(litpic != "" && litpic != undefined){
    								html.push('<div class="house-img fn-left">');
                    html.push('<a href="'+url+'">');
    								html.push('<img src="'+huoniao.changeFileSize(litpic, "small")+'" />');
    								html.push('</a>');
    								html.push('</div>');
    							}
    							html.push('<dl>');
    							html.push('<dt>'+title+'</dt>');
    							html.push('<dd class="item-area"><em>'+addr+'</em><em>'+bno+'/'+floor+langData['siteConfig'][13][12]+'</em><em>'+rentype+'</em><span class="price fn-right">'+price+langData['siteConfig'][13][27]+echoCurrency('short')+'</span></dd>');//层--万
    							html.push('<dd class="item-type-1"><em>'+community+'</em><em>'+langData['siteConfig'][45][21]+':'+area+echoCurrency('areasymbol')+'</em><em>'+room+'</em><em>'+protype+'</em></dd>');//建面
    							html.push('<dd class="item-type-2">');
                  if(list[i]['state'] == 1){
                    if(isbid == 1){
                      html.push('<a href="javascript:;" class="bid">'+langData['siteConfig'][6][17]+'</a>')//加价
                    }else{
                      html.push('<a href="javascript:;" class="bid">'+langData['siteConfig'][6][16]+'</a></a>')//竞价
                    }
                  }
                  html.push('<a href="'+urlString+id+'" class="edit">'+langData['siteConfig'][6][6]+'</a><a href="javascript:;" class="del">'+langData['siteConfig'][6][8]+'</a>')//编辑 -- 删除
                  html.push('</dd>');
    							html.push('</dl>');
    							html.push('</div>');
    							html.push('</div>');


    						//写字楼
    						}else if(type == "xzl"){

    							var loupan = list[i].loupan;

                  html.push('<div class="house-box" data-id="'+id+'">');
    							html.push('<div class="house-item fn-clear">');
    							if(litpic != "" && litpic != undefined){
    								html.push('<div class="house-img fn-left">');
                    html.push('<a href="'+url+'">');
    								html.push('<img src="'+huoniao.changeFileSize(litpic, "small")+'" />');
    								html.push('</a>');
    								html.push('</div>');
    							}
    							html.push('<dl>');
    							html.push('<dt>'+title+'</dt>');

                  var p = lei == 0 ? echoCurrency('short')+"/"+langData['siteConfig'][13][18] : langData['siteConfig'][13][27]+echoCurrency('short');//月 -- 万

    							html.push('<dd class="item-area"><em>'+addr+'</em><span class="price fn-right">'+price+p+'</span></dd>');
    							html.push('<dd class="item-type-1"><em>'+loupan+'</em><em>'+langData['siteConfig'][45][21]+':'+area+echoCurrency('areasymbol')+'</em><em>'+protype+'</em></dd>');//建面
    							html.push('<dd class="item-type-2">');
                  if(list[i]['state'] == 1){
                    if(isbid == 1){
                      html.push('<a href="javascript:;" class="bid">'+langData['siteConfig'][6][17]+'</a>')//加价
                    }else{
                      html.push('<a href="javascript:;" class="bid">'+langData['siteConfig'][6][16]+'</a></a>')//竞价
                    }
                  }
                  html.push('<a href="'+urlString+id+'" class="edit">'+langData['siteConfig'][6][6]+'</a><a href="javascript:;" class="del">'+langData['siteConfig'][6][8]+'</a>')//编辑 -- 删除
                  html.push('</dd>');
    							html.push('</dl>');
    							html.push('</div>');
    							html.push('</div>');


    						//商铺
    						}else if(type == "sp"){

    							var transfer = list[i].transfer,
    									address  = list[i].address;

                  html.push('<div class="house-box" data-id="'+id+'">');
    							html.push('<div class="house-item fn-clear">');
    							if(litpic != "" && litpic != undefined){
    								html.push('<div class="house-img fn-left">');
                    html.push('<a href="'+url+'">');
    								html.push('<img src="'+huoniao.changeFileSize(litpic, "small")+'" />');
    								html.push('</a>');
    								html.push('</div>');
    							}
    							html.push('<dl>');
    							html.push('<dt>'+title+'</dt>');

                  var p = lei == 0 ? echoCurrency('short')+"/"+langData['siteConfig'][13][18] : langData['siteConfig'][13][27]+echoCurrency('short');//月 -- 万

    							html.push('<dd class="item-area"><em>'+addr+'</em><span class="price fn-right">'+price+p+'</span></dd>');
    							html.push('<dd class="item-type-1"><em>'+protype+'</em><em>'+langData['siteConfig'][45][21]+':'+area+echoCurrency('areasymbol')+'</em><em>'+address+'</em></dd>');//建面
    							html.push('<dd class="item-type-2">');
                  if(list[i]['state'] == 1){
                    if(isbid == 1){
                      html.push('<a href="javascript:;" class="bid">'+langData['siteConfig'][6][17]+'</a>')//加价
                    }else{
                      html.push('<a href="javascript:;" class="bid">'+langData['siteConfig'][6][16]+'</a></a>')//竞价
                    }
                  }
                  html.push('<a href="'+urlString+id+'" class="edit">'+langData['siteConfig'][6][6]+'</a><a href="javascript:;" class="del">'+langData['siteConfig'][6][8]+'</a>')//编辑 -- 删除
                  html.push('</dd>');
    							html.push('</dl>');
    							html.push('</div>');
    							html.push('</div>');


    						//厂房、仓库
    						}else if(type == "cf"){

    							var transfer = list[i].transfer,
    									address  = list[i].address;

                  html.push('<div class="house-box" data-id="'+id+'">');
    							html.push('<div class="house-item fn-clear">');
    							if(litpic != "" && litpic != undefined){
    								html.push('<div class="house-img fn-left">');
                    html.push('<a href="'+url+'">');
    								html.push('<img src="'+huoniao.changeFileSize(litpic, "small")+'" />');
    								html.push('</a>');
    								html.push('</div>');
    							}
    							html.push('<dl>');
    							html.push('<dt>'+title+'</dt>');

                  var p = lei == 0 ? echoCurrency('short')+"/"+langData['siteConfig'][13][18] : langData['siteConfig'][13][27]+echoCurrency('short');//月 -- 万

    							html.push('<dd class="item-area"><em>'+addr+'</em><span class="price fn-right">'+price+p+'</span></dd>');
    							html.push('<dd class="item-type-1"><em>'+protype+'</em><em>'+langData['siteConfig'][45][21]+':'+area+echoCurrency('areasymbol')+'</em><em>'+address+'</em></dd>');//建面
    							html.push('<dd class="item-type-2">');
                  if(list[i]['state'] == 1){
                    if(isbid == 1){
                      html.push('<a href="javascript:;" class="bid">'+langData['siteConfig'][6][17]+'</a>')//加价
                    }else{
                      html.push('<a href="javascript:;" class="bid">'+langData['siteConfig'][6][16]+'</a></a>')//竞价
                    }
                  }
                  html.push('<a href="'+urlString+id+'" class="edit">'+langData['siteConfig'][6][6]+'</a><a href="javascript:;" class="del">'+langData['siteConfig'][6][8]+'</a>')//编辑 -- 删除
                  html.push('</dd>');
    							html.push('</dl>');
    							html.push('</div>');
    							html.push('</div>');


    						}

    					}

    					objId.append(html.join(""));
              $('.loading').remove();
              isload = false;

    				}else{
              $('.loading').remove();
    					objId.append("<p class='loading'>"+langData['siteConfig'][20][185]+"</p>");//已加载完全部信息！
    				}

    				switch(state){
    					case "":
    						totalCount = pageInfo.totalCount;
    						break;
    					case "0":
    						totalCount = pageInfo.gray;
    						break;
    					case "1":
    						totalCount = pageInfo.audit;
    						break;
    					case "2":
    						totalCount = pageInfo.refuse;
    						break;
    				}


    				$("#total").html(pageInfo.totalCount);
    				$("#audit").html(pageInfo.audit);
    				$("#gray").html(pageInfo.gray);
    				$("#refuse").html(pageInfo.refuse);
    				$("#expire").html(pageInfo.expire);
    				// showPageInfo();
    			}
    		}else{
    			$("#total").html(0);
    			$("#audit").html(0);
    			$("#gray").html(0);
    			$("#refuse").html(0);
    			$("#expire").html(0);
    			objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");//暂无相关信息！
    		}
    	}
    });

  }


})
