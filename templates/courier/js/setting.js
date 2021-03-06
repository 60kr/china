// input输入框 组件
var InputText = {
	props: ['type','placeholder','name','areacode','readonly','id'],
	data:function(){
		return {
			eyeshow:true,
			input_ :'',
			password_:'',
		}
	},
	
	methods:{
		input(){
			var el = event.target;
			input_ = event.target.value;
			var name = $(el).attr('name');
			if(name=='username'){
				 this.$parent.userinfo.username = input_
			}else if(name=='password'){
				this.input_ = input_
				this.$parent.userinfo.password = input_;
			}else if(name=='telphone'){
				this.$parent.userphone.userphone = input_
			}else if(name=='captcha'){
				if(isNaN(input_)){
					showErr("请输入正确的验证码！");return false;
				}
				this.$parent.userphone.validcode = input_
			}else if(name=='areaCode'){
				this.$parent.userphone.areaCode = input_
			}else if(name=='nickname'){
				this.$parent.reg_info.nickname = input_
			}else if(name=='sex'){
				this.$parent.reg_info.sex = input_;
			}else if(name=='age'){
				this.$parent.reg_info.age = input_
			}else if(name=='sure_password'){
				this.input_ = input_
				this.$parent.userinfo.password = input_;
			}
			
			if(name=='password' || name=='sure_password'){
				password_ = input_
			}else{
				password_ = ''
			}
		},
		
		// 显示弹窗
		pop_show:function(){
			$(".popl_mask").show();
			$(".popl_box").css('bottom','0')
		},
		coutDown:function(t){
			var target = t?t:event.currentTarget
			// 倒计时
			
			var mydate= new Date();
			mydate.setMinutes(mydate.getMinutes()+1); //当前时间加1分钟
			var end_time = new Date(mydate).getTime();//月份是实际月份-1
			var sys_second = (end_time-new Date().getTime())/1000;
			$(target).html("60s");
			var timer = setInterval(function(){
				if (sys_second > 1) {
					sys_second -= 1;
					var second = Math.floor(sys_second % 60);
					$(target).attr("disabled","true");//添加disabled属性
					$(target).html(second+"s");
	
				} else { 
					$(target).removeAttr("disabled");//移除disabled属性
					$(target).css("opacity","1");
					$(target).html(langData['siteConfig'][19][736]);  //"获取"
					clearInterval(timer);//清楚定时器
				}
			}, 1000);
		}
	},
	template: `
	<div v-bind:class="['inpbox',{tel_inpbox:name =='telphone'}]">
		<!-- <span v-if='name =="telphone"' class="areacode" v-on:click="pop_show">{{areacode}}</span>
		<input v-if='name =="telphone"' type="hidden" name="areaCode" v-model="areacode" > -->
		<button v-if='name =="captcha"' class="get_code" >`+langData['siteConfig'][19][736]+`</button>
		<input v-bind:type="type" v-bind:placeholder="placeholder" :id="id"  v-bind:name="name" v-bind:readonly="readonly"  v-on:input="input"   v-bind:class="[{input_text:eyeshow === true && type=='password'}]" :maxlength='(name =="captcha"||name =="age")?"6":""'>
		
		<i v-if='type=="password"' v-on:click="eyeshow = !eyeshow" v-bind:class="[{ eye_open: !eyeshow === true }]"></i>
	</div>
	`,
};


new Vue({
	el: "#page",
	data: {
		page_cphone:0,
		page_testid:0,  //跳转验证身份
		page_cpsd:0,  //跳转修改密码
		bindtel:0,  //是否发送验证码
		page_bind:0,  //跳转绑定电话
		userinfo:{'username':'','password':pass},
		userphone:{'userphone':'','validcode':'','areaCode':''},
		pripolicy:0, //隐私政策
		consult:0,
		changeLang:0,
	},
	components:{
		'input-txt':InputText,
	},
	mounted() {
		if(!geetest){
			$('body').delegate(".get_code",'click',function(){
				if($(this).hasClass("disabled")) return;
				var areaCode = areaCode;
				var phone = phone;
				if(phone == ''){
					showErr(langData['siteConfig'][20][463]);//请输入手机号码
					return false;
				}

				if(areaCode == "86"){
					var phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
					if(!phoneReg.test(phone)){
						showErr(langData['siteConfig'][20][465]);   //手机号码格式不正确
						return false;
					}
				}
				sendVerCode();

			});
		}else{
			//极验验证
			var handlerPopupFpwd = function (captchaObjReg) {
				// captchaObjReg.appendTo("#popupReg-captcha-mobile");

				// 成功的回调
				captchaObjReg.onSuccess(function () {
					var validate = captchaObjReg.getValidate();
					dataGeetest = "&terminal=mobile&geetest_challenge="+validate.geetest_challenge+"&geetest_validate="+validate.geetest_validate+"&geetest_seccode="+validate.geetest_seccode;
					sendVerCode();
					// $("#maskReg, #popupReg-captcha-mobile, .gt_popup").removeClass("show");
				});
				captchaObjReg.onClose(function () {
					// getYzmBtn.text(langData['siteConfig'][4][1]);
				})

				window.captchaObjReg = captchaObjReg;
			};

			//获取验证码
			$('body').delegate(".get_code",'click',function(){
				if($(this).hasClass("disabled")) return;
				var areaCode = areaCode;
				var phone = phone;
				if(phone == ''){
					showErr(langData['siteConfig'][20][463]);//请输入手机号码
					return false;
				}

				if(areaCode == "86"){
					var phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
					if(!phoneReg.test(phone)){
						showErr(langData['siteConfig'][20][465]);   //手机号码格式不正确
						return false;
					}
				}

				if (captchaObjReg) {
					captchaObjReg.verify();
				}


			})



			$.ajax({
				url: "/include/ajax.php?service=siteConfig&action=geetest&terminal=mobile&t=" + (new Date()).getTime(), // 加随机数防止缓存
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
					}, handlerPopupFpwd);
				}
			});
		}
	},
	methods:{
		bindchage:function(){
			// var tt = this;
			// tt.page_testid = !tt.page_testid;
			//
			// if(!tt.bindtel){
			// 	setTimeout(function(){
			// 		tt.bindtel = !tt.bindtel;
			// 	},500)
			// 	this.$refs.inpbox.coutDown('.page_cid .get_code');
			// }
			var tt = this;
			var el = event.currentTarget;
			var type = $(el).attr('data-type');
			tt.page_testid = !tt.page_testid;


			$(".next_step").attr('data-type',type)
			
		}

		,savepws:function(){
			var el = event.currentTarget;
			var datatype = $(el).attr('data-type');
			var data = '';
			if(datatype == 'bindpws'){
				var edittype	= 'edpws';
				var pws 	= $("#pws").val();
				var repws 	= $("#repws").val();

				if(pws == '' || pws == undefined){
					showErr(langData['siteConfig'][19][164]); return false;  //"请输入密码！"
				}
				if(repws == '' || repws == undefined){
					showErr(langData['siteConfig'][20][24]); return false;  //"请再次输入密码！"
				}
				if(pws!=repws){
					showErr(langData['waimai'][10][47]); return false;  //俩次密码输入不一致！
				}
				var reg = new RegExp("^(?![a-zA-z]+$)(?!\\d+$)(?![!@#$%^&*]+$)[a-zA-Z\\d!@#$%^&*]+$");
				if(!reg.test(pws)|| !reg.test(repws)){
					showErr(langData['waimai'][10][48]); return false;
					// 温馨提示：请输入大、小写字母、数字或特殊字符！
				}
				data = "&password="+pws;
			}else{
				var newphone = $("#newphone").val();
				var code 	 = $("#code").val();
				var edittype = 'edphone';

				if(!(/^1[3456789]\d{9}$/.test(newphone))){
					showErr(langData['waimai'][10][49]); //手机号有误！请重新填写
				}
				if(code == undefined){
					showErr(langData['waimai'][10][50]);  //langData['waimai'][10][48]请填写验证码~!
				}

				data = "&phone="+newphone+"&code="+code;
			}
			axios({
				method: 'post',
				url: '/include/ajax.php?service=waimai&action=courierEditpwsphone&edittype='+edittype+data,
			})
			.then((response)=>{
				var data = response.data;
				var npage = this.page;
				if(data.state==100){
					if(edittype == 'edpws'){
						showErr(data.info);
						$('body').append('<iframe src="'+masterDomain+'/logout.html?from=app" style="display: none;"></iframe>');
						setTimeout(function(){
							setupWebViewJavascriptBridge(function(bridge) {
								bridge.callHandler('appLogout', {}, function(){});
							});
						}, 0);
						setTimeout(function(){
							location.href = '/?service=waimai&do=courier&template=logout';
						}, 0);
					}else{
						showErr(data.info);
						window.location = '/?service=waimai&do=courier&template=index';
					}
				}else{
					showErr(data.info);
				}

				$(".reload").removeClass("rotate")
			});
		},
		nextPage:function(){
			var el 		= event.currentTarget;
			var type 	= $(el).attr('data-type');
			var vercode	= $("#vercode").val();
			if(!(/^1[3456789]\d{9}$/.test(phone))){
				showErr(langData['waimai'][10][49]); //手机号有误！请重新填写
			}
			axios({
				method: 'post',
				url: '/include/ajax.php?service=waimai&action=verificationCode&vercode='+vercode+'&phone='+phone,
			})
			.then((response)=>{
				var data = response.data;
				if(data.state==100){
					if(type=='tel'){
						this.page_bind = !this.page_bind;
					}else{
						this.page_cpsd = !this.page_cpsd;
					}
					showErr(data.info);
				}else{
					showErr(data.info);
				}
			});
		},
		
		
		
	},
	// watch:{
	// 	changeLang:function(){
	// 		$(".mobileSelect").remove();
	// 		if(!this.changeLang){
	// 			setTimeout(function(){
	// 				sexSelect = new MobileSelect({
	// 					trigger: '.reg_box .inpbox input[name="sex"] ',
	// 					title: '',//房型选择
	// 					wheels: [
	// 								{data:this.lgData},
								   
	// 							],
	// 					position:[0],
	// 					callback:function(indexArr, data){
	// 						$('.reg_box .inpbox input[name="sex"]').val(data);
	// 						changeval(data)
	// 					}
	// 				});
	// 			},600)
				
	// 		}
	// 	}
	// }




});
$(function(){
	console.log(langList);
	var langIndex = 0;
	langList.forEach(function(val,index){
		if(val.name==langname){
			langIndex = index;
		}
	})
	var langSelect = new MobileSelect({
		trigger: '.changl .info_val span',
		title: langData['waimai'][10][51], //手机号有误！请重新填写
		wheels: [
			{data:langList},
		],
		keyMap:{
			id:'code',
			value:'name'
		},
		position:[langIndex],
		callback:function(indexArr, data){
			var lang = data[0].code;
			var channelDomainClean = typeof masterDomain != 'undefined' ? masterDomain.replace("http://", "").replace("https://", "") : window.location.host;
			var channelDomain_1 = channelDomainClean.split('.');
			var channelDomain_1_ = channelDomainClean.replace(channelDomain_1[0]+".", "");

			channelDomain_ = channelDomainClean.split("/")[0];
			channelDomain_1_ = channelDomain_1_.split("/")[0];

			$.cookie(cookiePre + 'lang', lang, {expires: 7, domain: channelDomainClean, path: '/'});
			$.cookie(cookiePre + 'lang', lang, {expires: 7, domain: channelDomain_, path: '/'});
			$.cookie(cookiePre + 'lang', lang, {expires: 7, domain: channelDomain_1_, path: '/'});

			if(device.indexOf('huoniao') > -1){
				//客户端页面重载
				setupWebViewJavascriptBridge(function(bridge) {
					bridge.callHandler('changeLanguage', {'region': lang},	function(responseData){});
				});
			}else{
				location.href = referer;
			}
			
			
		}
	});
	// langSelect.locatePostion(0,1);
})
var showErrTimer;
function showErr(data) {
	showErrTimer && clearTimeout(showErrTimer);
	$(".popErr").remove();
	$("body").append('<div class="popErr"><p>' + data + '</p></div>');
	$(".popErr p").css({
		"margin-left": -$(".popErr p").width() / 2,
		"left": "50%"
	});
	$(".popErr").css({
		"visibility": "visible"
	});
	showErrTimer = setTimeout(function() {
		$(".popErr").fadeOut(300, function() {
			$(this).remove();
		});
	}, 1500);
}
function coutDown(){
	// 倒计时
	var mydate= new Date();
	mydate.setMinutes(mydate.getMinutes()+1); //当前时间加1分钟
	var end_time = new Date(mydate).getTime();//月份是实际月份-1
	var sys_second = (end_time-new Date().getTime())/1000;
	var timer = setInterval(function(){
		if (sys_second > 1) {
			sys_second -= 1;
			var second = Math.floor(sys_second % 60);
			$(".get_code").attr("disabled","true");//添加disabled属性
			$(".get_code").css("opacity",".5");
			$(".get_code").html(second+"s");

		} else {
			$(".get_code").removeAttr("disabled");//移除disabled属性
			$(".get_code").css("opacity","1");
			$(".get_code").html(langData['siteConfig'][19][736]);  //"获取"
			clearInterval(timer);//清楚定时器
		}
	}, 1000);
}
function sendVerCode(){
	var btn = $(".get_code");
	var phone1 = phone;
	// var phone = $("input[name='telphone']").val()
	// var areacode = $("input[name='areaCode']").val()
	var areacode1 = areaCode;
	if(btn.hasClass("disabled")) return;
	btn.addClass("disabled").text(langData['siteConfig'][23][99]);
	data = 'phone='+phone1+'&areaCode='+areacode1
	var tt = this;
	$.ajax({
		url: "/include/ajax.php?service=siteConfig&action=getPhoneVerify&type=auth&vertype=1",
		data: data+dataGeetest,
		type: "GET",
		dataType: "jsonp",
		success: function (data) {
			//获取成功
			if(data && data.state == 100){
				coutDown();
				//获取失败
			}else{
				btn.removeClass("disabled").text(langData['siteConfig'][4][1]);
				showErr(data.info);
			}
		},
		error: function(){
			btn.removeClass("disabled").text(langData['siteConfig'][4][1]);
			showErr(langData['siteConfig'][20][173]);
		}
	});
}
