var refreshTopFunc, refreshTopConfig, refreshSmart, refreshTopModule, refreshTopAction, refreshTopTimer, topNormal, topPlan, refreshTopID = refreshTopAmount = refreshFreeTimes = refreshNormalPrice = memberFreeCount = surplusFreeRefresh = refreshTopPayAmount = 0, check_zjuser = false, zjuser_meal = {};
var topPlanData = [];
$(function(){

	var p1 = 0,p3 = 0,p4 = 0;
    $(".fabu_choose").delegate("li","click", function(){
    	$('.fabu_choose ul li').removeClass('active');
        $(this).toggleClass('active');
        var ids = [], type = '';
        $('.fabu_choose ul li').each(function(){
            if($(this).hasClass('active')){
                type   = $(this).data('type');
                var config = $(this).data('id');
                
                $("#config").val(config);
                ids.push($(this).data('price'));
            }
        })
        $('#toptag').val(ids.join());
        $("#type").val(type);
        if(!$('#toptag').val()){
            p1 =0
        }else {
            p1 = $('#toptag').val();
        }
        getPrice();
    });


    $('.choose3 li').click(function () {
        $(this).toggleClass('active');
        var ids = [], boldred = '';
        $('.choose3 li').each(function(){
            if($(this).hasClass('active')){
                var type   = $(this).data('type');
                var id     = $(this).data('id');
                if(type == 'titleblod'){
                    $("#titleblod").val(id);
                }else if(type == 'titlered'){
                    $("#titlered").val(id);
                }
                boldred = 'boldred';
                ids.push($(this).data('price'));
            }else{
                var type   = $(this).data('type');
                if(type == 'titleblod'){
                    $("#titleblod").val('');
                }else if(type == 'titlered'){
                    $("#titlered").val('');
                }
            }
        })
        $('#tag').val(ids.join(","));
        if($(".istopList .active").length == 0){
            $("#type").val(boldred);
        }

        p3 = ids[0];
        if(!ids[0]){
            p3 = 0;
            p4 = 0;
        }
        if(ids[1]){
            p4 = ids[1];
        }else {
            p4 = 0;
        }
        getPrice();
    });
	function getPrice() {
        var price = parseFloat(p1)+parseFloat(p3)+parseFloat(p4);
        var pp = price.toFixed(2)
        $('#all_price').html(pp);
        $("#amount").val(pp);
    }

    var refreshTopFuncSuccess = {

		//????????????
		// type: refresh???top
		// mod: ????????????
		// act: ??????
		// aid: ??????ID
		// btn: ????????????  ?????????
		init: function(type, mod, act, aid, btn, title){

			if(!mod || !act || !aid) return false;
			btn ? btn.addClass('load') : null;  //?????????????????????load??????

			//???????????????????????????????????????????????????
			$.ajax({
				type: "POST",
				url: "/include/ajax.php",
				dataType: "json",
				data: {
					'service': 'siteConfig',
					'action': 'refreshTopConfig',
					'module': mod,
					'act': act
				},
				success: function(data) {
					if(data && data.state == 100){
						refreshTopConfig = data.info;
						refreshTopFuncSuccess.show(type, title);
					}else{
						alert(data.info);
					}
					btn ? btn.removeClass('load') : null;
				},
				error: function(){
					alert(langData['siteConfig'][20][227]);//??????????????????????????????
					btn ? btn.removeClass('load') : null;
				}
            });
            	
		},

		//?????????????????????????????????????????????
		show: function(type, title){
            var that_ = this;
            var rtConfig = refreshTopConfig.config;console.log(rtConfig);
            var smartHtml = [];
            topNormal = rtConfig.topNormal;  //????????????
            if(topNormal.length > 0){
            	//?????????????????? -- ????????????????????????
            	smartHtml.push('<h2 class="adv_tip">'+langData['sfcar'][2][27]+'<span>'+langData['sfcar'][2][28]+'</span></h2>');
            	smartHtml.push('<ul>')
				for (var i = 0; i < topNormal.length; i++) {
                    smartHtml.push('<li class="fn-clear" data-type="topping" data-price="'+topNormal[i].price+'" data-id="'+i+'">');
                    smartHtml.push('<div class="con">');
                    smartHtml.push('<span class="span_day">'+topNormal[i].day+langData['siteConfig'][13][6]+'</span>');//???
                    smartHtml.push('<span class="top_day">'+langData['siteConfig'][32][38]+topNormal[i].day+langData['siteConfig'][13][6]);//????????????--??? --
                    if(topNormal[i].offer > 0){
                    	smartHtml.push('<span class="discount">'+topNormal[i].discount+'</span>');//???
                    }
                    smartHtml.push('</span>');
                    if(topNormal[i].offer>0){
                    	var oldprice  = Number(topNormal[i].price) + Number(topNormal[i].offer);
                    	smartHtml.push('<p class="top_price"><del>'+echoCurrency('symbol')+oldprice+'</del>'+echoCurrency('symbol')+topNormal[i].price+'</p>');
                    }else{
                    	smartHtml.push('<p class="top_price">'+echoCurrency('symbol')+topNormal[i].price+'</p>');
                    }
                    smartHtml.push('</div>');
                    smartHtml.push('</li>');
                }
                smartHtml.push('</ul>')
            }
           
            refreshFreeTimes = rtConfig.refreshFreeTimes;  //?????????????????????
            refreshNormalPrice = rtConfig.refreshNormalPrice;  //??????????????????
            refreshSmart = rtConfig.refreshSmart;  //??????????????????

            if(refreshSmart.length > 0){
            	//?????????????????? -- ??????????????????
                smartHtml.push('<h2 class="adv_tip">'+langData['sfcar'][2][30]+' <span>'+langData['sfcar'][2][31]+'</span></h2>');
                smartHtml.push('<ul>')
                for (var i = 0; i < refreshSmart.length; i++) {
                    smartHtml.push('<li class="fn-clear" data-type="smartRefresh" data-price="'+refreshSmart[i].price+'" data-id="'+i+'">');
                    smartHtml.push('<div class="con">');
                    smartHtml.push('<span class="span_day">'+refreshSmart[i].day+langData['siteConfig'][13][6]+'</span>');//???
                    smartHtml.push('<span class="top_day">'+langData['siteConfig'][32][28]+refreshSmart[i].times+langData['siteConfig'][13][26]);//????????????--??? --
                    if(refreshSmart[i].offer > 0){
                    	smartHtml.push('<span class="discount">'+refreshSmart[i].discount+'</span>');//???
                    }
                    smartHtml.push('</span>');
                    if(refreshSmart[i].offer>0){
                    	var oldprice  = Number(refreshSmart[i].price) + Number(refreshSmart[i].offer);
                    	smartHtml.push('<p class="top_price"><del>'+echoCurrency('symbol')+oldprice+'</del>'+echoCurrency('symbol')+refreshSmart[i].price+'</p>');
                    }else{
                    	smartHtml.push('<p class="top_price">'+echoCurrency('symbol')+refreshSmart[i].price+'</p>');
                    }
                    smartHtml.push('</div>');
                    smartHtml.push('</li>');
                }
                smartHtml.push('</ul>')
            }
            $('.istopList').html(smartHtml.join(''));
		},

    }
    
    refreshTopFuncSuccess.init('', modelType, templates, id, '', successTitle);

    $('.pay_wrap .buy a').bind('click', function(){
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
          window.location.href = masterDomain+'/login.html';
          return false;
        }

        if($("#type").val() == ''){
            alert(langData['info'][1][55]);//???????????????
            return false;
        }

        $('#refreshTopForm').submit();

    });

	
})