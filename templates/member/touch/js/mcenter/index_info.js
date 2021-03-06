$(function(){
	//APP端取消下拉刷新
    toggleDragRefresh('on');

	var isload = false; //加载中

	// tab 切换
	// 二手车收藏和预约切换
	if($(".conBox .conHead").size()>0){
		var left = $(".conBox .conHead span.active").position().left, width = $(".conBox .conHead span.active").width();
		$(".conBox .conHead i").css('left',(left+width/2));
	}

	$(".conBox .conHead span").click(function(){
		var t = $(this);
		var p = t.parents('.conHead')
		t.addClass('active').siblings('span').removeClass('active');
		left = t.position().left, width = t.width();
		var index = t.index();
		p.find('i').css('left',(left+width/2));
		var listbox = p.siblings('.listBox')
		listbox.find('ul').eq(index).removeClass('fn-hide').siblings('ul').addClass('fn-hide');

	});


	// 资讯
	if($(".page_article").size()>0){
		if(userinfo && userinfo.certifyState && userinfo.certifyState!='0'){ //如果是自媒体
			var url = '/include/ajax.php?service=article&action=alist&u=1&orderby=1&page=1&pageSize=2'
			getData(url);
		}
		function getData(url,action){
			var html = [];
			$.ajax({
				url: url,
				data: action,
				type: "POST",
				dataType: "json",
				success: function (data) {
					if(data.state == 100){
						var list = data.info.list;
						for(var i = 0; i<list.length; i++){
							html.push('<dd>');
							html.push('<a href="'+list[i].url+'" class="fn-clear">');
							if(list[i].litpic){
								html.push('<div class="litpic"><img src="'+list[i].litpic+'" onerror="this.src=\'/static/images/404.jpg\'" alt=""></div>');
							}
							html.push('<div class="rText">');
							html.push('<h2>'+list[i].title+'</h2>');
							html.push('<p><span class="info_type">'+list[i].typeName[0]+'</span><span class="pubTime">'+huoniao.transTimes(list[i].pubdate,2)+'</span></p>');
							html.push('</div>');
							html.push('</a>');
							html.push('</dd>');
						}
						$(".con.tougao .first_con ").append(html.join(''));
						$(".con.tougao .first_con dt a em,.countTougao h4").text(data.info.pageInfo.totalCount);

					}else{
						$(".con.tougao").hide();
						$(".con.tougao .first_con dt a em").text(0)
					}
				},
				error: function(){}
			});
		}

	}






	// 二手车
	if($(".page_car").size()>0){
		// 显示我的发布
		if($(".con.link_con dd").length>0){
			$(".con.link_con").removeClass('fn-hide')
		}

		url_shou = "/include/ajax.php?service=member&action=collectList&module=car&page=1&pageSize=3";
		url_shop = '/include/ajax.php?service=car&action=storeList&page=1&pageSize=3';
		getCarData(url_shou,'shoucang');
		// getCarData(url_shop,'shop');

		function getCarData(url,type){
			var html = [];
			$.ajax({
				url: url,
				type: "POST",
				dataType: "json",
				success: function (data) {
					if(data.state == 100){
						var list = data.info.list;
						if(type=='shoucang'){
							for(var i = 0; i<list.length; i++){
								if(!list[i].detail.flag){
									html.push('<li class="con">');
									html.push('<a href="'+list[i].detail.url+'" class="fn-clear">');
									html.push('<div class="car_img"><img src="'+(list[i].detail.litpic?list[i].detail.litpic:(list[i].detail.imglist.length?list[i].detail.imglist[0].path:''))+'" onerror="this.src=\'/static/images/404.jpg\'"></div>');
									html.push('<div class="car_info"><h2>');
									if(list[i].usertype=='0'){
										html.push('<span>个人</span>');
									}
									html.push(list[i].detail.title+'</h2>');
									html.push('<p>');
									if(list[i].detail.cardtime){
										html.push('<span>'+(huoniao.transTimes(list[i].detail.cardtime,2)).split('-')[0]+'年</span>')
									}
									if(list[i].detail.mileage){
										html.push('<em>|</em><span>'+list[i].detail.mileage+'万公里</span></p>');
									}
									html.push('<div class="price_show">'+(list[i].detail.price?("<b>"+list[i].detail.price+"</b>万"):"暂无报价")+'</div>');
									html.push('</div></a></li>');
								}
							}
							$(".conBox .listBox .car_shou").html(html.join(''));
							$(".conBox .listBox .car_shou").append('<div class="link_to"><a href="'+mcenter+'/collect.html?module=car">查看全部 <em>'+data.info.pageInfo.totalCount+'</em> 条收藏</a></div>');
						}else{
							for(var i = 0; i<list.length; i++){
								html.push('<li class="con">');
								html.push('<a href="'+list[i].url+'" class="fn-clear">');
								html.push('<div class="shop_img"><img src="'+list[i].logo+'" onerror="this.src=\'/static/images/404.jpg\'"></div>');
								html.push('<div class="shop_info">');
								html.push('<h2>'+list[i].title+' '+(list[i].licenseState?"<span class=\"renzheng\"></span>":"")+'</h2>');
								html.push('<p><span>'+list[i].city+' '+list[i].address+'</span><em>|</em><span> 8:00-18:00 </span></p>');
								html.push('<div class="num_show">在售<b>'+list[i].salenums+'</b>辆</div>');
								html.push('</div></a></li>');
							}
							$(".conBox .listBox .shop_yuyue").html(html.join(''));
							$(".conBox .listBox .shop_yuyue").append('<div class="link_to"><a href="#">查看全部 <em>'+data.info.pageInfo.totalCount+'</em> 条预约</a></div>');
						}

					}else{
						if(type=='shoucang'){
							$(".conBox .listBox .car_shou").html('<p class="noData">暂无收藏</p>');
						}else{
							$(".conBox .listBox .shop_yuyue").html('<p class="noData">暂无预约</p>');
						}

					}
				},
				error: function(){}
			});
		}
	}

	// 装修
	if($(".page_renovation").size() > 0){
		url_shop = '/include/ajax.php?service=renovation&action=rese&u=1&resetype=0&page=1&pageSize=3';  //预约记录
		url_shou = "/include/ajax.php?service=renovation&action=construction&u=1&page=1&pageSize=3";   //工地
		if($(".car_shou").size()>0){  //普通用户
			getReData(url_shop,'shoucang');
			getReData(url_shou,'shop');
		}
		/* 此处没有数据 */
		function getReData(url,type){
			var html = [];
			$.ajax({
				url: url,
				type: "POST",
				dataType: "json",
				success: function (data) {
					if(data.state == 100){
						var list = data.info.list;
						if(type=='shoucang'){
							for(var i = 0; i<list.length; i++){
								var ltype = '' ;
								if(list[i].type=='0'){
									ltype = '<span>公司</span>';
								}else if(list[i].type == '1'){
									ltype = '<span>工长</span>';
								}else{
									ltype = '<span>设计师</span>';
								}
								html.push('<li class="con">');
								html.push('<a href="'+list[i].author.domain+'" class="fn-clear">');
								html.push('<div class="shop_img"><img src="'+(list[i].type==0?list[i].author.logo:list[i].author.photo)+'" onerror="this.src=\'/static/images/404.jpg\'"></div>');
								html.push('<div class="shop_info">');
								html.push('	<h2>'+ltype+list[i].designer+'</h2>');
								html.push('	<p><span>'+list[i].address+'</span></p>');
								if(list[i].type==0){
									html.push('<div class="num_show"><span>团队<b>'+list[i].author.teamCount+'</b>人</span><span>案例<b>'+list[i].author.caseCount+'</b>套</span></div>');
								}else{
									html.push('<div class="num_show"><span>经验<b>'+ list[i].author.works+'</b>年</span><span>案例<b>'+ list[i].author.case+'</b>套</span></div>');
								}
								html.push('</div></a></li>');
							}
							$(".conBox .listBox .shop_yuyue").html(html.join(''));
							$(".conBox .listBox .shop_yuyue").append('<div class="link_to"><a href="'+memberUrl+'/renovation-order.html">查看全部预约</a></div>');
						}else{
							for(var i = 0; i<list.length; i++){
								var len = list[i].constructionetail.stagearr.length;
								html.push('<li class="con">');
								html.push('<a href="'+list[i].constructionetail.url+'" class="fn-clear">');
								html.push('<div class="car_img"><img src="'+list[i].constructionetail.communitylitpic+'" alt=""></div>');
								html.push('<div class="car_info">');
								html.push('	<h2>'+list[i].constructionetail.title+'</h2>');
								html.push('	<p><span>'+list[i].constructionetail.area+'m<sup>2</sup></span><em>|</em><span>'+list[i].constructionetail.budget+'</span><em>|</em><span>'+list[i].constructionetail.style+'</span></p>');
								html.push('	<div class="re_shop">'+list[i].constructionetail.communitytitle+' <b>•</b> '+list[i].constructionetail.stagearr[len-1].description+'</div>');
								html.push('</div></a></li>');
							}
							$(".conBox .listBox .car_shou").html(html.join(''));
							$(".conBox .listBox .car_shou").append('<div class="link_to"><a href="'+memberUrl+'/renovation-order.html">查看参观的工地</a></div>');
						}

					}else{
						if(type=='shoucang'){
							$(".conBox .listBox .shop_yuyue").html('<p class="noData">暂无预约记录</p>');
						}else{
							$(".conBox .listBox .car_shou").html('<p class="noData">暂无参观的工地</p>');
						}

					}
				},
				error: function(){}
			});
		}


		if($(".joinWrap").size()>0){
			 var swiper = new Swiper('.swiper-container.joinWrap', {
			      pagination: {
			        el: '.joinWrap .page',
			      },
			    });
		}

	}




	// 教育
	if($(".page_education").size() > 0){
		// 我的课程
		if($(".myClass.con dd").length > 0){
			$(".myClass.con").removeClass('fn-hide')
		}
	};

	// 商家
	if($('.page_business').size()>0){
		$(".paidui_con").each(function(){
			var t =$(this);
			if(t.find('dd').length>0){
				t.removeClass('fn-hide')
			}
		})
	}

	// 房产
	if($(".page_house").size() > 0){
		$.ajax({
			url: '/include/ajax.php?service=house&action=membergethousecount&zjusercom='+zjusercom,
			data: '',
			type: "POST",
			dataType: "json",
			success: function (data) {
				if(data.state == 100){
					$('#fbhouse').text(data.info.allfbcount);
					$('#schouse').text(data.info.sccount);
					$('#gzhouse').text(data.info.gzcount);
					$('#khlianxi').text(data.info.contactcount);
					$('#bshoucang').text(data.info.todaycollect);
					$('#khwtcount').text(data.info.khwtcount);
					$('#khyycount').text(data.info.khyycount);
				}else{
					$(".con.tougao").hide();
					$(".con.tougao .first_con dt a em").text(0)
				}
			},
			error: function(){}
		});
		var url_house = '/include/ajax.php?service=house&action=allhouseFabu&gettype=1&page=1&pageSize=2'
		getData(url_house)

		function getData(url,action){
			var html = [];
			$.ajax({
				url: url,
				data: action,
				type: "POST",
				dataType: "json",
				success: function (data) {
					if(data.state == 100){
						var list = data.info.list;
						for(var i = 0; i<list.length; i++){
							html.push('<dd>');
							html.push('<a href="'+list[i].url+'" class="fn-clear">');
							html.push('<div class="litpic"><img src="'+list[i].litpic+'"></div>');
							html.push('<div class="rText">');
							html.push('<h2>'+list[i].title+'</h2>');
							html.push('<p><span class="info_type">二手房</span><span class="pubTime">'+huoniao.transTimes(list[i].pubdate,2)+'</span></p>');
							html.push('</div>');
							html.push('</a>');
							html.push('</dd>');
						}
						$(".con.tougao .first_con ").append(html.join(''));
						$(".con.tougao .first_con dt a em").text(data.info.pageInfo.totalCount)
					}else{
						$(".con.tougao").hide();
						$(".con.tougao .first_con dt a em").text(0)
					}
				},
				error: function(){}
			});
		}





	}


	// 顺风车
	if($(".page_sfcar").size() > 0){
		var url = '/include/ajax.php?service=member&action=collectList&module=sfcar&pageSize=3' ; //收藏
		var url_fabu ='/include/ajax.php?service=sfcar&action=getsfcarlist&u=1&orderby=1&page=1&pageSize=3'; //发布
		var url_call = '/include/ajax.php?service=member&action=footprintsGet&module=sfcar&pageSize=20'; //拨打记录
		 getCarData(url_call,'call');     //拨打记录
		 getCarData(url_fabu,'fabu');    //发布
		 getCarData(url,'shou');    //收藏
		function getCarData(url,type){
			var html = [];
			var Dom ='';
			var golink = '';
			var txt = '';
			if(type=='call'){
				Dom = $(".callList");
				golink = '' ;//跳转页面
				txt = '拨打记录';
			}else if(type=='fabu'){
				Dom = $(".myList");
				golink = memberLink+'/manage-sfcar.html' ;//跳转页面
				txt = '发布';
			}else{
				Dom = $(".shouList");
				golink = memberLink+'/collect.html' ;//跳转页面
				txt = '收藏';
			}
			$.ajax({
				url: url,
				type: "POST",
				dataType: "json",
				success: function (data) {
					if(data.state == 100){
						var list = data.info.list;
						list.forEach(function(d,index){
							if(type == 'shou'){
								d = d.detail;
							}
							var usetypename		= d.usetypename,
								usetype			= d.usetype,
								endaddr			= d.endaddr,
								startaddr		= d.startaddr;
							if (usetype ==0) {
								cartype ='car';
							}else{
								cartype ='truck';
							}
							html.push('<li class="con">');
							html.push('<h4><span class="car-type  '+cartype+'">'+usetypename+'</span> '+startaddr+' <em></em> '+endaddr+'</h4>');
							html.push('<div class="stime"> <b>'+d.missiontime+'</b>'+(d.missiontime1 == undefined ? '': d.missiontime1)+langData['sfcar'][1][5]+'</div>');
							// html.push('<p class="calltime">12-01 12:36 拨出</p>');
							html.push('<a href="tel:'+d.tel+'" class="call_btn">拨打电话</a>');
							html.push('</li>');
						})
						Dom.html(html.join(''));
						// Dom.append('<div class="link_to"><a href="'+golink+'">查看全部记录</a></div>')
					}else{
						Dom.html('<p class="noData">暂无'+txt+'</p>')
					}
				},
				error: function(){}
			});
		}
	}


	// 活动
	if($('.page_huodong').size()>0){
		// 我的发布
		if($(".my_fabu dd").length>0){
			$(".my_fabu").removeClass('fn-hide');
		}

		if($(".my_hd dd").length>0){
			$(".my_hd").removeClass('fn-hide');
		}
	}


	// 直播
	if($('.page_live').size()>0){
		// 我的发布
		$(".live_yu").each(function(){
			var t = $(this);
			if(t.find('dd').length>0){
				t.removeClass('fn-hide')
			}
		})


	}


	// 养老
	if($(".page_pension").size()>0){
		getMsgData('pension',1)
	}


	function getMsgData(module,type){
		$.ajax({
			url: '/include/ajax.php?service=member&action=memberMessageGet&module='+module+'&gettype='+type,
			type: "POST",
			dataType: "json",
			success: function (data) {
				if(data.state==100){
					if(data.info.messcount){
						$(".new_invite").removeClass('fn-hide');
						$(".new_invite .linvite_info .icon i").text(data.info.messcount);
						$(".new_invite .linvite_info span b").text(data.info.memberList[0].name)
					}else{
						 $(".new_invite").addClass('fn-hide')
					}
				}
			},
			error:function(data){},
		});
	}

	// 贴吧
	if($(".page_tieba").size()>0){
		if($(".myList dd").size()>0){
			$(".myList").removeClass('fn-hide')
		}
	}

})
