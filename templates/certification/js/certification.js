$(function() {

	var changeUidByPhone = '';
	var timer = null;

	//动态步骤
	var names = [];
	for (var i = 0; i < certifyArr.length; i++) {
		names.push(certifyArr[i].title);
	}

	//显示第一个
	var step = 0;
	$('.item-' + certifyArr[0]['type']).show();

	//大于一种时，显示步骤
	if(names.length > 1){
		initStep();
		function initStep() {
			$(".step").step({
				stepNames: names,
				initStep: 0
			})
		}
	}else{
		$('.bg h3').css({'padding-top': '65px'});
	}

	//判断是否为公众号
	if(certifyArr[step].type == 'wechat'){
		dynamicVertifyWechat();
	}

	//提交
	$('.item-phone .confirm').bind('click', function(){

		var t = $(this);
		if(t.hasClass('disabled')) return false;

		var phone = $("#phone"), vdimgck = $("#vercode");
		if($.trim(phone.val()) == "" || !checkPhone(phone.val())){
			popTip(langData['siteConfig'][20][232], "error");//请输入正确的手机号码
			phone.focus();
			return "false";
		}
		if($.trim(vdimgck.val()) == ""){
			popTip(langData['siteConfig'][20][28], "error");//请输入短信验证码
			vdimgck.focus();
			return "false";
		}

		t.addClass('disabled').html(langData['siteConfig'][6][35] + '...');  //提交中

		$.ajax({
			url: "/include/ajax.php?service=member&action=updateAccount&do=chphone",
			data: "areaCode="+$(".areaCodeBox .code").text()+"&phone="+phone.val()+"&vdimgck="+vdimgck.val()+"&changeUidByPhone="+changeUidByPhone,
			type: "POST",
			dataType: "jsonp",
			success: function (data) {
				if(data && data.state == 100){
					stepNext();
				}else{
					popTip(data.info, "error");
					t.removeClass('disabled').html(langData['siteConfig'][6][118]);  //重新提交
				}
			}
		});

	});

	//关注公众号，提交
	var wechatClick = false;
	$('.item-wechat .confirm').bind('click', function(){

		var t = $(this);
		if(t.hasClass('disabled')) return false;

		wechatClick = true;
		t.addClass('disabled').html(langData['siteConfig'][23][143] + '...');  //检测中

		dynamicVertifyWechat();
	});


	//实名认证，提交
	$('.item-card .confirm').bind('click', function(){

		var t = $(this);
		if(t.hasClass('disabled')) return false;

		var realname = $("#realname"), idcard = $("#idcard"), license = $("#license"), front = $("#front"), back = $("#behind");

		// if(!checkIdcard(idcard.val())){
		// 	popTip("请输入正确的身份证号码", "error");
		// 	idcard.focus();
		// 	return "false";
		// }

		if($.trim(front.val()) == ""){
			popTip(langData['siteConfig'][20][107], "error");//请上传身份证正面照片
			return "false";
		}
		if($.trim(back.val()) == ""){
			popTip(langData['siteConfig'][20][108], "error");//请上传身份证反面照片
			return "false";
		}

		if($.trim(realname.val()) == ""){
			popTip(langData['siteConfig'][20][248], "error");  //请输入真实姓名
			realname.focus();
			return "false";
		}
		if($.trim(idcard.val()) == ""){
			popTip(langData['siteConfig'][20][106], "error");//请输入身份证号码
			idcard.focus();
			return "false";
		}

		if(license.size() > 0 && $.trim(license.val()) == ""){
			popTip(langData['siteConfig'][20][109], "error");//请上传营业执照
			return "false";
		}

		t.addClass('disabled').html(langData['siteConfig'][6][35] + '...');  //提交中

		$.ajax({
			url: "/include/ajax.php?service=member&action=updateAccount&do=certify",
			data: "realname="+realname.val()+"&idcard="+idcard.val()+"&front="+front.val()+"&back="+back.val()+"&license="+license.val(),
			type: "POST",
			dataType: "jsonp",
			success: function (data) {
				if(data && data.state == 100){
					stepNext();
					$('.auditState, .auditState .state3').show();
					$('.auditState .state2, .item-card .form').hide();
				}else{
					popTip(data.info, "error");
					t.removeClass('disabled').html(langData['siteConfig'][6][118]);  //重新提交
				}
			}
		});

	});


	//下一步
	function stepNext(){
		//如果是最后一步，并且不是实名认证
		if(step == certifyArr.length - 1 && certifyArr[step].type != 'card'){
			location.href = from;
		}

		if(step < certifyArr.length - 1){
			$(".step").step("next");
			step++;

			$('.main .item').hide();
			$('.item-' + certifyArr[step]['type']).show();
		}

		//判断是否为公众号
		if(certifyArr[step].type == 'wechat'){
			dynamicVertifyWechat();
		}
	}



	var geetestData = "";
	if(geetest){

		//极验验证
		var handlerPopup = function (captchaObj) {
			// captchaObj.appendTo("#popup-captcha");

			// 成功的回调
			captchaObj.onSuccess(function () {

				var result = captchaObj.getValidate();
				var geetest_challenge = result.geetest_challenge,
					geetest_validate = result.geetest_validate,
					geetest_seccode = result.geetest_seccode;

				geetestData = "&geetest_challenge="+geetest_challenge+'&geetest_validate='+geetest_validate+'&geetest_seccode='+geetest_seccode;

				checkPhoneBindState();
			});


			// 重新发送
			$("html").delegate(".getCodes", "click", function(){
				var areaCode = $("#areaCode"), phone = $("#phone");

				if(areaCode.val() == ''){
					popTip(langData['siteConfig'][30][39], "error");   //请选择国家区号
					return false;
				}
				if(phone.val() == ''){
					popTip(langData['siteConfig'][20][463], "error");  //请输入手机号码
					phone.focus();
					return false;
				}
				captchaObj.verify();
			})
		}

		$.ajax({
			url: "/include/ajax.php?service=siteConfig&action=geetest&t=" + (new Date()).getTime(), // 加随机数防止缓存
			type: "get",
			dataType: "json",
			success: function (data) {
				initGeetest({
					gt: data.gt,
					challenge: data.challenge,
					offline: !data.success,
					new_captcha: true,
					product: "bind",
					width: '312px'
				}, handlerPopup);
			}
		});

	//没有验证码时
	}else{
		// 重新发送
		$("html").delegate(".getCodes", "click", function(){
			checkPhoneBindState();
		})
	}


	function getPhoneVerify(){
		var t = $(".getCodes"), areaCode = $("#areaCode"), phone = $("#phone");

		$.ajax({
			url: "/include/ajax.php?service=siteConfig&action=getPhoneVerify&type=verify",
			data: "areaCode="+areaCode.val()+"&phone="+phone.val() + "&" + geetestData,
			type: "POST",
			dataType: "json",
			success: function (data) {
				//获取成功
				if(data && data.state == 100){
					countDown(t);

				//获取失败
				}else{
					t.removeClass("disabled").html(langData['siteConfig'][4][4]);//获取短信验证码
					popTip(data.info, "error");
				}
			}
		});
		$("#vdimgck").focus();
	}

	function checkPhoneBindState(){
		var t = $(".getCodes"), areaCode = $("#areaCode"), phone = $("#phone");

		if(t.hasClass("disabled")) return false;

		if(areaCode.val() == ''){
			popTip(langData['siteConfig'][30][39], "error");   //请选择国家区号
		}
		if(phone.val() == ''){
			popTip(langData['siteConfig'][20][463], "error");  //请输入手机号码
			phone.focus();
		}else{

			t.addClass("disabled");
			t.html(langData['siteConfig'][7][3]+'...');

			// 验证手机号是否被其他用户绑定
			$.ajax({
				url: "/include/ajax.php?service=siteConfig&action=checkPhoneBindState",
				data: "phone="+phone.val(),
				type: "POST",
				dataType: "json",
				success: function (data) {
					//获取成功
					if(data && data.state == 100){
						// 手机号已被其他用户绑定
						if(data.info != "no"){
							if(confirm(langData['siteConfig'][30][88].replace('<br>', "\r\n"))){ //该手机号码已经注册过会员，确定要将该手机号码绑定到当前登陆账号吗？<br>确定后原账号将解除手机绑定，确认进入下一步？
								changeUidByPhone = data.info;
								getPhoneVerify();
							}else{
								t.removeClass("disabled").html(langData['siteConfig'][4][4]);//获取短信验证码
							}
						}else{
							getPhoneVerify();
						}
					}
				}
			})
		}
	}

	//国际手机号获取
	getNationalPhone();
	function getNationalPhone(){
		$.ajax({
			url: "/include/ajax.php?service=siteConfig&action=internationalPhoneSection",
			type: 'get',
			dataType: 'JSONP',
			success: function(data){
				if(data && data.state == 100){
					var phoneList = [], list = data.info;
					for(var i=0; i<list.length; i++){
						phoneList.push('<li data-cn="'+list[i].name+'" data-code="'+list[i].code+'">'+list[i].name+' +'+list[i].code+'</li>');
						//初始areacode
						var firstCode = list[0].code;
						$('#areaCode').val(firstCode);
						$('.areaCode i').text('+'+firstCode);
					}
					$('.areaCode_wrap ul').append(phoneList.join(''));
				}else{
					$('.areaCode_wrap ul').html('<div class="loading">'+langData['siteConfig'][21][64]+'</div>');  //暂无数据！
				}
			},
			error: function(){
				$('.areaCode_wrap ul').html('<div class="loading">'+langData['siteConfig'][20][462]+'</div>');  //加载失败！
			}
		})
	}

	//显示区号
	$('.areaCode').bind('click', function(e){
		e.stopPropagation();
		var areaWrap =$(this).closest("dd").find('.areaCode_wrap');
		if(areaWrap.is(':visible')){
			areaWrap.fadeOut(300)
		}else{
			areaWrap.fadeIn(300);
			return false;
		}
	});

	//选择区号
	$('.areaCode_wrap').delegate('li', 'click', function(){
		var t = $(this), code = t.attr('data-code');
		var par = t.closest("dd");
		var areaIcode = par.find(".areaCode");
		areaIcode.find('i').html('+' + code);
		$("#areaCode").val(code);
	});

	$('body').bind('click', function(){
		$('.areaCode_wrap').fadeOut(300);
	});

	var wait = 60;
	function countDown(t) {
		if (wait == 0) {
			t.removeClass("disabled");
			t.html(langData['siteConfig'][6][184]);  //重新获取验证码
			wait = 60;
		} else {
			t.addClass("disabled");
			t.html(langData['siteConfig'][20][234].replace('1', wait));  //1秒后可重新获取
			wait--;
			setTimeout(function() {
				countDown(t)
			}, 1000);
		}
	}

	//提示信息
	function popTip(txt, cla){
		alert(txt);
	}


	//判断手机号码
	function checkPhone(num){
		if($('#areaCode').val() == '86'){
			var exp = new RegExp("^1[23456789]{1}[0-9]{9}$", "img");
			if(!exp.test(num)){
				return false;
			}
		}
		return true;
	}


	//动态验证是否关注公众号
	function dynamicVertifyWechat(){
		if(timer != null){
  			clearInterval(timer);
  		}
		timer = setInterval(function(){
			$.ajax({
				type: 'POST',
				async: false,
				url: '/include/ajax.php?service=member&action=detail&id='+uid,
				dataType: 'json',
				success: function(str){
					if(str.state == 100 && str.info.wechat_subscribe == 1){
						//如果已经关注，进行下一步
						clearInterval(timer);

						//下一步
						stepNext();

					}else{
						if(wechatClick){
							$('.item-wechat .confirm').removeClass('disabled').html(langData['siteConfig'][6][57]);  //重新检测
							wechatClick = false;
							popTip(langData['siteConfig'][23][144]);  //检测到还未关注，请重新扫码！\r\n已经关注？请检查关注的账号是否与当前登录账号一致，如果不一致，请先在微信端解除绑定！
							location.reload();
						}
					}
				}
			});
		}, 2000);
	}

	//删除图片
	$('.uploadinp').bind('click', function(){
		$(this).closest('.upobj').find('.li-rm').click();
	});

	//重新认证
	$('.recertify').bind('click', function(){
		$('.auditState').hide();
		$('.form').show();
	});

});
