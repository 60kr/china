$(function(){
	var treeLevel = 0;
	var init = {
		
		//拼接分类
		printTypeTree: function(){
			var typeList = [], l=typeListArr.length, cl = -45, level = 0;
			for(var i = 0; i < l; i++){
				(function(){
					var jsonArray =arguments[0], jArray = jsonArray.lower;
					typeList.push('<li class="li'+level+'">');
					
					typeList.push('<div class="tr clearfix tr_'+jsonArray["id"]+'">');
					typeList.push('  <div class="row3">&nbsp;</div>');
					typeList.push('  <div class="row60 left"><input type="text" data-id="'+jsonArray["id"]+'" value="'+jsonArray["typename"]+'"></div>');
					typeList.push('  <div class="row20"><a href="javascript:;" class="up">向上</a><a href="javascript:;" class="down">向下</a></div>');
					typeList.push('  <div class="row17 left"><a href="javascript:;" class="del" title="删除">删除编辑</a></div>');
					typeList.push('</div>');
					
					typeList.push('</li>');
				})(typeListArr[i]);
			}
			$(".root").html(typeList.join(""));
			init.dragsort();
		}

		//树形递归分类
		,treeTypeList_: function(){
			var typeList = [], cl = "";
			var l=typeListArr;
			for(var i = 0; i < l.length; i++){
				(function(){
					var jsonArray =arguments[0];
					typeList.push('<option value="'+jsonArray["id"]+'">'+cl+"|--"+jsonArray["typename"]+'</option>');
				})(l[i]);
			}
			return typeList.join("");
		}
		
		//拖动排序
		,dragsort: function(){
			//一级
			$('.root').sortable({
	            items: '>li.li0',
				placeholder: 'placeholder',
	            orientation: 'vertical',
	            axis: 'y',
				handle:'>div.tr',
	            opacity: .5,
	            revert: 0,
				stop:function(){
					// saveOpera(1);
					huoniao.stopDrag();
				}
	        });
		}
	};
	
	//拼接现有分类
	if(typeListArr != ""){
		init.printTypeTree();
	};
	
	//搜索
	$("#searchBtn").bind("click", function(){
		var keyword = $("#keyword").val(), typeList = [], l=typeListArr.length;
		if(keyword == "") {
			$("#keyword").focus(); return false;
		}
		$("#list .tr").removeClass("light");
		for(var i = 0; i < l; i++){
			(function(){
				var jsonArray =arguments[0], jArray = jsonArray.lower;
				if(jsonArray["typename"].indexOf(keyword) > -1){
					$(".tr_"+jsonArray["id"]).addClass("light");
				}
				if(jArray != undefined){
					for(var k = 0; k < jArray.length; k++){
						if(jArray[k]['lower'] != null){
							arguments.callee(jArray[k]);
						}
					}
				}

			})(typeListArr[i]);
		}
		//定位第一个
		if($('#list .light').length > 0){
			$(document).scrollTop(Number($('#list .light:first').offset().top));
		}
	});
	
	//搜索回车提交
    $("#keyword").keyup(function (e) {
        if (!e) {
            var e = window.event;
        }
        if (e.keyCode) {
            code = e.keyCode;
        }
        else if (e.which) {
            code = e.which;
        }
        if (code === 13) {
            $("#searchBtn").click();
        }
    });
	
	//头部添加新分类
	$("#addNew_").bind("click", function(){
		var html = [];
		
		html.push('<li class="li0">');
		html.push('  <div class="tr clearfix">');
		html.push('    <div class="row3">&nbsp;</div>');
		html.push('    <div class="row60 left"><input data-id="0" type="text" value=""></div>');
		html.push('    <div class="row20"><a href="javascript:;" class="up">向上</a><a href="javascript:;" class="down">向下</a></div>');
		html.push('    <div class="row17 left"><a href="javascript:;" class="del">删除</a></div>');
		html.push('  </div>');
		html.push('</li>');
		
		$(".root").prepend(html.join(""));
	});
	
	//底部添加新分类
	$("#addNew").bind("click", function(){
		var html = [];
		
		html.push('<li class="li0">');
		html.push('  <div class="tr clearfix">');
		html.push('    <div class="row3">&nbsp;</div>');
		html.push('    <div class="row60 left"><input data-id="0" type="text" value=""></div>');
		html.push('    <div class="row20"><a href="javascript:;" class="up">向上</a><a href="javascript:;" class="down">向下</a></div>');
		html.push('    <div class="row17 left"><a href="javascript:;" class="del">删除</a></div>');
		html.push('  </div>');
		html.push('</li>');
		
		$(this).parent().parent().prev(".root").append(html.join(""));
	});
	
	//input焦点离开自动保存
	$("#list").delegate("input", "blur", function(){
		var id = $(this).attr("data-id"), value = $(this).val();
		if(id != "" && id != 0){
			huoniao.operaJson("shopBrandType.php?dopost=updateType&id="+id, "type=single&typename="+value, function(data){
				if(data.state == 100){
					huoniao.showTip("success", data.info, "auto");
				}else if(data.state == 101){
					//huoniao.showTip("warning", data.info, "auto");
				}else{
					huoniao.showTip("error", data.info, "auto");
				}
			});
		}
	});
	
	//鼠标经过li
	$("#list").delegate(".tr", "mouseover", function(){
		$(this).parent().addClass("hover");
	});
	$("#list").delegate(".tr", "mouseout", function(){
		$(this).parent().removeClass("hover");
	});
	
	//排序向上
	$(".root").delegate(".up", "click", function(){
		var t = $(this), parent = t.parent().parent().parent(), index = parent.index(), length = parent.siblings("li").length;
		if(index != 0){
			parent.after(parent.prev("li"));
			saveOpera(1);
		}
	});
	
	//排序向下
	$(".root").delegate(".down", "click", function(){
		var t = $(this), parent = t.parent().parent().parent(), index = parent.index(), length = parent.siblings("li").length;
		if(index != length){
			parent.before(parent.next("li"));
			saveOpera(1);
		}
	});
	
	//删除
	$(".root").delegate(".del", "click", function(event){
		event.preventDefault();
		var t = $(this), id = t.parent().parent().find("input").attr("data-id"), type = t.parent().text();
		
		var tip = "";
		if(t.parent().parent().next("ul").html() != undefined && t.parent().parent().next("ul").html() != ""){
			tip = "确定后，此分类下的子级和品牌也将同时删除！<br />";
		}

		//从异步请求
		if(type.indexOf("编辑") > -1){
			$.dialog.confirm(tip+"删除后无法恢复，请谨慎操作！！！", function(){
				huoniao.showTip("loading", "正在删除，，请稍候...");
				huoniao.operaJson("shopBrandType.php?dopost=del", "id="+id, function(data){
					if(data.state == 100){
						huoniao.showTip("success", data.info, "auto");
						setTimeout(function() { 
							location.reload();
						}, 800);
					}else{
						alert(data.info);
						return false;
					}
				});
			});
			//跳转到对应删除页面
		}else{
			t.parent().parent().parent().remove();
		}

	});
	
	$("#list").on("submit", function(event){
		event.preventDefault();
	});
	
	//保存
	$("#saveBtn").bind("click", function(){
		saveOpera("");
	});


	//批量删除
	$("#batch").bind("click", function(){
		$.dialog({
			fixed: false,
			title: "批量删除",
			content: '<div class="batch-data"><p class="muted">选择要删除的分类，多个按【ctrl+点击】选择</p><select id="category" multiple>'+init.treeTypeList_()+'</select></div>',
			width: 310,
			ok: function(){
				var ids = [];
				self.parent.$("#category option:selected").each(function(){
					ids.push($(this).val());
				});
				if(ids.length <= 0){
					alert("请选择要删除的分类");
					return false;
				}else{

					$.dialog.confirm("确定后，此分类下的子级和品牌也将同时删除！<br />删除后无法恢复，请谨慎操作！！！", function(){

						huoniao.showTip("loading", "正在删除，，请稍候...");
						huoniao.operaJson("shopBrandType.php?dopost=del", "id="+ids.join(","), function(data){
							if(data.state == 100){

								huoniao.showTip("success", data.info, "auto");
								setTimeout(function() {
									location.reload();
								}, 800);
								
							}else{
								alert(data.info);
								return false;
							}
						});

					}, function(){});

				}
			},
			cancel: true
		});
	});
	
	//返回最近访问的位置
	huoniao.scrollTop();
	
});

//保存
function saveOpera(type){
	var first = $("ul.root>li"), json = '[';
	for(var i = 0; i < first.length; i++){
		(function(){
			var html =arguments[0], count = 0, jArray = $(html).find(">ul>li"), tr = $(html).find(".tr input"), id = tr.attr("data-id"), val = tr.val();

			if(jArray.length > 0 && val != ""){
				json = json + '{"id": "'+id+'", "name": "'+encodeURIComponent(val)+'", "lower": [';
				for(var k = 0; k < jArray.length; k++){
					if($(jArray[k]).find(">ul>li").length > 0){
						arguments.callee(jArray[k]);
					}else{
						var tr = $(jArray[k]).find(".tr input"), id = tr.attr("data-id"), val = tr.val();
						if(val != ""){
							json = json + '{"id": "'+id+'", "name": "'+encodeURIComponent(val)+'", "lower": null},';
						}else{
							count++;
						}
					}
				}
				json = json.substr(0, json.length-1);
				if(count == jArray.length){
					json = json + 'null},';
				}else{
					json = json + ']},';
				}
			}else{
				if(val != ""){
					json = json + '{"id": "'+id+'", "name": "'+encodeURIComponent(val)+'", "lower": null},';
				}
			}
		})(first[i]);
	}
	json = json.substr(0, json.length-1);
	json = json + ']';

	if(json == "]") return false;
	
	var scrolltop = $(document).scrollTop();
	var href = huoniao.changeURLPar(location.href, "scrolltop", scrolltop);
	
	huoniao.showTip("loading", "正在保存，请稍候...");
	huoniao.operaJson("shopBrandType.php?dopost=typeAjax", "data="+json, function(data){
		if(data.state == 100){
			huoniao.showTip("success", data.info, "auto");
			if(type == ""){
				//window.scroll(0, 0);
				//setTimeout(function() {
					location.href = href;
				//}, 800);
			}
		}else{
			huoniao.showTip("error", data.info, "auto");
		}
	});
}