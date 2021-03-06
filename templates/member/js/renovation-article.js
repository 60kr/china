/**
 * 会员中心分类信息列表
 * by guozi at: 20150627
 */

var objId = $("#list");
$(function(){
	$(".main-tab li[data-id='"+state+"']").addClass("curr");

	$(".main-tab li").bind("click", function(){
		var t = $(this), id = t.attr("data-id");
		if(!t.hasClass("curr") && !t.hasClass("add")){
			state = id;
			atpage = 1;
			t.addClass("curr").siblings("li").removeClass("curr");
			getList();
		}
	});
	getList(1);

	objId.delegate(".del", "click", function(){
		var t = $(this), par = t.closest(".item"), id = par.attr("data-id");
		if(id){
			$.dialog.confirm(langData['siteConfig'][20][543], function(){   //你确定要删除这条信息吗？
				t.siblings("a").hide();
				t.addClass("load");

				$.ajax({
					url: masterDomain+"/include/ajax.php?service=renovation&action=delArtilcle&id="+id,
					type: "GET",
					dataType: "jsonp",
					success: function (data) {
						if(data && data.state == 100){

							//删除成功后移除信息层并异步获取最新列表
							par.slideUp(300, function(){
								par.remove();
								setTimeout(function(){getList(1);}, 200);
							});

						}else{
							$.dialog.alert(data.info);
							t.siblings("a").show();
							t.removeClass("load");
						}
					},
					error: function(){
						$.dialog.alert(langData['siteConfig'][20][183]);  //网络错误，请稍候重试！
						t.siblings("a").show();
						t.removeClass("load");
					}
				});
			});
		}
	});



});

function getList(is){

	if(is != 1){
		$('html, body').animate({scrollTop: $(".main-tab").offset().top}, 300);
	}

	objId.html('<p class="loading"><img src="'+staticPath+'images/ajax-loader.gif" />'+langData['siteConfig'][20][184]+'...</p>');  //加载中，请稍候
	$(".pagination").hide();
	var url ="/include/ajax.php?service=renovation&action=article&u=1&fid="+Identity.id+"&type="+Identity.typeid+"&orderby=1&state="+state+"&page="+atpage +"&pageSize="+pageSize;
	$.ajax({
		url: url,
		type: "GET",
		dataType: "jsonp",
		success: function (data) {
			if(data && data.state != 200){
				if(data.state == 101){
					objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");  //暂无相关信息！
				}else{
					var list = data.info.list, pageInfo = data.info.pageInfo, html = [];
					totalCount = pageInfo.totalCount;
					//拼接列表
					if(list.length > 0){

						var t = window.location.href.indexOf(".html") > -1 ? "?" : "&";
						var param = t + "typename="+Identity.type+"&do=edit&id=";
						var urlString = editUrl + param;

						for(var i = 0; i < list.length; i++){
							var item        = [],
									id          = list[i].id,
									title       = list[i].title,
									color       = list[i].color,
									address     = list[i].address,
									typename    = list[i].typename,
									url         = list[i].url,
									litpic      = list[i].litpic,
									click       = list[i].click,
									common      = list[i].common,
									isvalid     = list[i].isvalid,
									isbid       = parseInt(list[i].isbid),
									bid_type    = list[i].bid_type,
									bid_price   = list[i].bid_price,
									bid_end     = huoniao.transTimes(list[i].bid_end, 1),
									bid_plan    = list[i].bid_plan,
									waitpay     = list[i].waitpay,
									refreshSmart= list[i].refreshSmart,
									is_valid    = list[i].is_valid,
									pubdate     = huoniao.transTimes(list[i].pubdate, 1);

							url = waitpay == "1" || list[i].arcrank != "1" ? 'javascript:;' : url;

							html.push('<div class="item fn-clear" data-id="'+id+'" data-title="'+title+'">');
							if(litpic != "" && litpic != undefined){
								html.push('<div class="p"><a href="'+url+'" target="_blank"><i></i><img onerror="this.src=\''+litpic+'\'" src="'+huoniao.changeFileSize(litpic, "small")+'" /></a></div>');
							}
							
							html.push('<div class="o">');

							html.push('<a href="'+urlString+id+'" class="edit"><s></s>'+langData['siteConfig'][6][6]+'</a>'); //编辑
							if(!refreshSmart && !isbid){
								html.push('<a href="javascript:;" class="del"><s></s>'+langData['siteConfig'][6][8]+'</a>');//删除
							}
							html.push('</div>');
							
							html.push('<div class="i">');

							var arcrank = "";
							if(list[i].arcrank == "0"){
								arcrank = '&nbsp;&nbsp;·&nbsp;&nbsp;<span class="gray">'+langData['siteConfig'][9][21]+'</span>'; //未审核
							}else if(list[i].arcrank == "2"){
								arcrank = '&nbsp;&nbsp;·&nbsp;&nbsp;<span class="red">'+langData['siteConfig'][9][35]+'</span>';//审核拒绝
							}

							html.push('<p>'+langData['renovation'][14][69]+'：'+pubdate+arcrank+'</p>');//发布时间
							html.push('<h5><a href="'+url+'" target="_blank" title="'+title+'" style="color:'+color+';">'+title+'</a></h5>');

							html.push('<p>'+click+'次浏览</p>');
							html.push('</div>');
							html.push('</div>');

						}

						objId.html(html.join(""));

					}else{
						objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");  //暂无相关信息！
					}

					$("#total").html(pageInfo.totalCount);
					$("#audit").html(pageInfo.state1);
					$("#gray").html(pageInfo.state0);
					$("#refuse").html(pageInfo.state2);

					showPageInfo();
				}
			}else{
				objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");  //暂无相关信息！
			}
		}
	});
}
