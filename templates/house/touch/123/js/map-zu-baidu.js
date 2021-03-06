$(function(){

    //APP端取消下拉刷新
    toggleDragRefresh('off');

  var mask = $('.mask'), moreFilter = [];
  var map, list = $(".list");
  var windowHeight = $(window).height(), headHeight = $('.header').height(), tabHeight = $(".choose-tab").height(), mapHeight = windowHeight - headHeight - tabHeight;
  $('#map').height(mapHeight);

  // 右上角导航
  $('.h-menu').on('click', function() {
    if ($('.nav,.mask').css("display") == "none") {
      $('.nav,.mask').show();
    } else {
      $('.nav,.mask').hide();
    }
  })


	var init = {

		//替换模板关键字
		replaceTpl: function(template, data, allowEmpty, chats){
			var regExp;
			chats = chats || ['\\$\\{', '\\}'];
			regExp = [chats[0], '([_\\w]+[\\w\\d_]?)', chats[1]].join('');
			regExp = new RegExp(regExp, 'g');
			return template.replace(regExp,	function (s, s1) {
				if (data[s1] != null && data[s1] != undefined) {
					return data[s1];
				} else {
					return allowEmpty ? '' : s;
				}
			});
		},

		//创建地图
		createMap: function(){
			map = new BMap.Map(g_conf.mapWrapper, {enableMapClick: false, minZoom: g_conf.minZoom});
			map.centerAndZoom(g_conf.cityName, g_conf.minZoom);
			map.enableScrollWheelZoom(); //启用滚轮放大缩小
			map.disableInertialDragging(); //禁用惯性拖拽
			map.addEventListener("tilesloaded", init.tilesloaded); //地图加载完毕执行
		}

		//地图加载完毕添加地图比例尺控件/自定义缩放/收起/展开侧栏
		,tilesloaded: function(){
			map.addControl(new BMap.ScaleControl({
				anchor: BMAP_ANCHOR_BOTTOM_LEFT,
				offset: new BMap.Size(380, 4)
			}));
			map.removeEventListener("tilesloaded", init.tilesloaded);

			//自定义缩放
			$(".zoom-ctrl span").on("click", function(){
				$(this).hasClass("zoom-plus") ? map.zoomIn() : map.zoomOut();
			});


			//初始加载
			init.getSaleData("tilesloaded");


			map.addEventListener("zoomend", function() {
				init.updateOverlays("zoom");
			});
			map.addEventListener("moveend", function() {
				init.updateOverlays("drag");
			});


			//气泡点击  区域
			$("#"+g_conf.mapWrapper).on("touchend", ".bubble-1", function() {

				var t = $(this),
				newView = {
					lng: parseFloat(t.attr("data-longitude")),
					lat: parseFloat(t.attr("data-latitude")),
					typ: g_conf.minZoom + 3
				};
				newView.lng && newView.lat ? map.centerAndZoom(new BMap.Point(newView.lng, newView.lat), newView.typ) : map.setZoom(newView.typ);


			//气泡点击  商圈
			}).on("touchend", ".bubble-2", function(){

				var t = $(this),
				newView = {
					lng: parseFloat(t.attr("data-longitude")),
					lat: parseFloat(t.attr("data-latitude")),
					typ: g_conf.minZoom + 5
				};
				newView.lng && newView.lat ? map.centerAndZoom(new BMap.Point(newView.lng, newView.lat), newView.typ) : map.setZoom(newView.typ);

				init.getSaleData("community");


			//气泡点击 小区
			}).on("touchend", ".bubble-3", function(e) {

        var t = $(this).find("a"), url = t.attr("href");
        location.href = url;



			});



			init.updateLoupanListDiv();
			$(window).resize(function(){
				init.updateLoupanListDiv();
			});







    // 筛选框点击切换
    $('.choose-tab li').click(function(){
      $('body').addClass('fixed');

      var t = $(this), index = t.index(), box = $('.choose-box .choose-item').eq(index);
      if (box.css('display') == "none") {
        t.addClass('active').siblings('li').removeClass('active')
        box.show().siblings().hide();mask.show();
      }
      else {
        $('body').removeClass('fixed');
        t.removeClass('active');
        box.hide();mask.hide();
      }

    })

    //筛选框点击内容
    $('.choose-ul li').click(function(){
      var t = $(this), val = t.find('a').text(), parent = t.closest('.choose-ul'), index = parent.index() ,ul = t.closest('.choose-ul');
      t.addClass('active').siblings('li').removeClass('active');
      $('.choose-tab li').eq(index).find('span').html(val);
      mask.hide();
      $('.choose-ul').hide();
      $('.choose-tab li').removeClass('active');
      if(!ul.hasClass("link_ul")){
		   init.confirmFilter();
		}
    })

    // 更多内容点击
    $('.choose-more-item li').click(function(){
      $(this).addClass('active').siblings('li').removeClass('active');
    })
    // 更多内容 重置
    $('.choose-more .reset').click(function(){
      $('.choose-more li').removeClass('active');
      moreFilter = [];
      init.getSaleData();
    })
    // 更多内容 确认
    $('.choose-more .confirm').click(function(){
      $('.choose-tab li').removeClass('active');
      moreFilter = [];
      $(".choose-box .choose-more-item").each(function(){
        var t = $(this);
        var type = t.attr("data-type"), val = t.find(".active a").attr("data-val"), txt = t.find(".active a").text();
        if(val != undefined){
          moreFilter.push(type+"="+val);
        }
		if(type=='price'){
			 moreFilter.push(type+"="+($(".p1").val()/100+','+$(".p2").val()/100));
		}
      });
      init.getSaleData();
      mask.hide();$('.choose-more').hide();
    })

    // 点击遮罩层
    $('.mask').on('touchstart',function(){
      mask.hide();
      $('.choose-item, .nav').hide();
      $('.choose-tab li').removeClass('active');

    })

    }


		//更新列表容器高度
		,updateLoupanListDiv: function(){

			var sidebarHeight = $(".sidebar").height(),
				foHeight = $(".f-o").height(),
				lcountHeight = $(".lcount").height();

			list.css({"height": sidebarHeight - foHeight - lcountHeight + "px"});
		}


		//获取区域及楼盘信息
		,getSaleData: function(type){

			var visBounds = init.getBounds();
			var boundsArr = [];
			boundsArr.push('min_latitude='+visBounds['min_latitude']);
			boundsArr.push('max_latitude='+visBounds['max_latitude']);
			boundsArr.push('min_longitude='+visBounds['min_longitude']);
			boundsArr.push('max_longitude='+visBounds['max_longitude']);

			var data = boundsArr.join("&")+(g_conf.filter.length > 0 ? "&"+g_conf.filter.join("&") : "");
      data = data + (data != "" ? "&" : "") + moreFilter.join("&");

			//页面打开就请求获取区域数据
			if(!type || type == "tilesloaded" || type == ""){

				$.ajax({
					"url": g_conf.urlPath[1],
					"data": data,
					"dataType": "jsonp",
					"async": false,
					"success": function(data){

						var districtData = [];
						if(data && data.state == 100){

							var list = data.info ;
							for(var i = 0; i < list.length; i++){
								districtData[i] = [];
								districtData[i]['id'] = list[i].id;
								districtData[i]['name'] = list[i].addrname;
								districtData[i]['longitude'] = list[i].longitude;
								districtData[i]['latitude'] = list[i].latitude;
								districtData[i]['house_count'] = list[i].count;
								districtData[i]['avg_unit_price'] = list[i].price;
							}

						}


						g_conf.districtData = districtData;
						init.updateOverlays(type);

					}
				});

			//type为bizcircle(商圈)时，请求商圈信息
			}else if(type == "bizcircle"){

				if(g_conf.bizcircle.length == 0){
					$.ajax({
						"url": g_conf.urlPath[2],
						"data": data,
						"dataType": "jsonp",
						"async": false,
						"success": function(data){

							var bizcircleData = [];
							if(data && data.state == 100){

								var list = data.info;
								for(var i = 0; i < list.length; i++){
									bizcircleData[i] = [];
									bizcircleData[i]['id'] = list[i].id;
									bizcircleData[i]['name'] = list[i].addrname;
									bizcircleData[i]['longitude'] = list[i].longitude;
									bizcircleData[i]['latitude'] = list[i].latitude;
									bizcircleData[i]['house_count'] = list[i].count;
									bizcircleData[i]['avg_unit_price'] = list[i].price;
								}

							}


							g_conf.bizcircle = bizcircleData;
							data = init.getVisarea(g_conf.bizcircle);
							init.createBubble(data, bubbleTemplate[2], 2);

						}
					});
				}else{
					data = init.getVisarea(g_conf.bizcircle);
					init.createBubble(data, bubbleTemplate[2], 2);
				}

			//type为community(小区)时间，请求小区信息，根据地图当前可视范围进行筛选
			}else if(type == "community"){

				$.ajax({
					"url": g_conf.urlPath[3],
					"data": data,
					"dataType": "jsonp",
					"async": false,
					"success": function(data){

						var saleData = [];
						if(data && data.state == 100){

							var list = data.info;
							for(var i = 0; i < list.length; i++){
								saleData[i] = [];
								saleData[i]['id'] = list[i].id;
								saleData[i]['name'] = list[i].title;
								saleData[i]['longitude'] = list[i].longitude;
								saleData[i]['latitude'] = list[i].latitude;
								saleData[i]['house_count'] = list[i].count;
								saleData[i]['avg_unit_price'] = list[i].price;
								saleData[i]['href'] = list[i].url;
							}

						}


						g_conf.saleData = saleData;
						data = init.getVisarea(g_conf.saleData);
						init.createBubble(data, bubbleTemplate[3], 2);

					}
				});

			}

		}



		//更新地图状态
		,updateOverlays: function(type){

			if(type == "tilesloaded"){
				map.centerAndZoom(g_conf.cityName, g_conf.minZoom);
			}

			var zoom = map.getZoom(), data = [];

			//区域集合
			if(zoom - g_conf.minZoom <= 2){

				data = init.getVisarea(g_conf.districtData);
				init.createBubble(data, bubbleTemplate[1], 1);

			}else{

				//商圈集合
				if(zoom - g_conf.minZoom <= 4){

					init.getSaleData("bizcircle");

				//小区集合
				}else if(zoom - g_conf.minZoom > 4){

					init.getSaleData("community");

				}

			}

		}


		//获取地图可视区域范围
		,getBounds: function(){
			var e = map.getBounds(),
			t = e.getSouthWest(),
			a = e.getNorthEast();
			return {
				min_longitude: t.lng,
				max_longitude: a.lng,
				min_latitude: t.lat,
				max_latitude: a.lat
			}
		}


		//提取可视区域内的数据
		,getVisarea: function(data){
			data = data || [];
			var areaData = [],
					visBounds = init.getBounds(),
					n = {
						min_longitude: parseFloat(visBounds.min_longitude),
						max_longitude: parseFloat(visBounds.max_longitude),
						min_latitude: parseFloat(visBounds.min_latitude),
						max_latitude: parseFloat(visBounds.max_latitude)
					};

			$.each(data, function(e, a) {
				var i = a.length ? a[0] : a,
				l = parseFloat(i.longitude),
				r = parseFloat(i.latitude);
				l <= n.max_longitude && l >= n.min_longitude && r <= n.max_latitude && r >= n.min_latitude && areaData.push(a)
			});

			return areaData;
		}


		//创建地图气泡
		,createBubble: function(data, temp, resize){

			init.cleanBubble();

			ids = 0;

			$.each(data,	function(e, o) {
				var bubbleLabel, r = [];
				o.avg_price = (o.avg_unit_price/1).toFixed(0);

				bubbleLabel = new BMap.Label(init.replaceTpl(temp, o), {
					position: new BMap.Point(o.longitude, o.latitude),
					offset: bubbleMapSize[resize]()
				});

				bubbleLabel.addEventListener("mouseover", function() {
					this.setStyle({zIndex: "4"});
				});

				bubbleLabel.addEventListener("mouseout", function() {
					this.setStyle({zIndex: "2"});
				});

				bubbleLabel.setStyle(bubbleStyle);
				map.addOverlay(bubbleLabel);

        // 统计可视区域内的数量
        ids += Number(o.house_count);

			});

      $(".lcount strong").html(ids);

		}

		//删除地图气泡
		,cleanBubble: function(){
			map.clearOverlays();
		}



		//设置售价范围
		,setSjRange: function(val){
			var minTxt = maxTxt = echoCurrency('short'), min = val[0], max = val[1];

			$("#sjObj").slider({values: [min, max]});

			minTxt = min == g_conf.sjMin ? "" : minTxt;
			maxTxt = max == 0 ? "" : (max == g_conf.sjMax ? maxTxt + "以上" : maxTxt);
			$("#sjTxt").text(min + minTxt + " - " + max + maxTxt);
		}


		//确定筛选条件
		,confirmFilter: function(){

				var filter = [];

				//填充条件
				filterTitle = [];
				filterData = [];
				filterData['filter'] = [];


				$(".choose-box .choose-ul").each(function(i){
					var t = $(this);
					var type = t.attr("data-type"), val = t.find(".active a").attr("data-val"), txt = t.find(".active a").text();
					filterData['filter'][i-2] = [type, val];

					if(type!='' && type!='undefined' && type!=null){
						filter.push(type+"="+val);
					}

				});


				g_conf.filter = filter;
				init.getSaleData();


		}

		//取消筛选
		,cancelFilter: function(){

			$(".filter-cancel").bind("click", function(){

				//填充最后一次的筛选条件
				if(filterData != undefined){

					var i = 0, filter = filterData['filter'], price = filterData['price'], area = filterData['area'];
					for(i; i < filter.length; i++){
						var type = filter[i][0], val = filter[i][1];
						$(".filter dl").each(function(){
							var t = $(this), ty = t.attr('data-type');
							if(type == ty){
								t.find("a").removeClass("on");
								t.find("a[data-val="+val+"]").addClass("on");
							}
						});
					}

					init.setSjRange([price[0], price[1]]);

				}

				$(".f-o li:eq(0)").click();

			});

		}


	}


	//气泡偏移
	var bubbleMapSize = {
			1 : function() {
				return new BMap.Size(-46, -46)
			},
			2 : function() {
				return new BMap.Size(-1, 10)
			},
			3 : function() {
				return new BMap.Size(-1, 10)
			},
			4 : function() {
				return new BMap.Size(-9, -9)
			}
		}

		//气泡模板
		,bubbleTemplate = {

			//区域
			1 : '<div class="bubble bubble-1" data-longitude="${longitude}" data-latitude="${latitude}" data-id="${id}"><p class="name" title="${name}区">${name}区</p><p class="num">${avg_price}'+echoCurrency('short')+'/月</p><p><span class="count">${house_count}</span>套</p></div>',

			//区域
			2 : '<div class="bubble bubble-1 bubble-2" data-longitude="${longitude}" data-latitude="${latitude}" data-id="${id}"><p class="name" title="${name}区">${name}区</p><p class="num">${avg_price}'+echoCurrency('short')+'/月</p><p><span class="count">${house_count}</span>套</p></div>',

			//小区
			3 : '<p class="bubble-3 bubble" data-longitude="${longitude}" data-latitude="${latitude}" data-id="${id}"><i class="num">${house_count}套</i><span class="name"><i class="name-des"><a href="${href}" target="_blank">${name}</a></i></span><i class="arrow-up"><i class="arrow"></i><i></p>'

		}

		//列表模板
		,listTemplate = {

			//楼盘列表
			roomlist: '<div class="list-item"><a href="${href}" target="_blank" title="${title}" data-community="${community_id}"><div class="item-aside"><img src="${list_picture_url}"><div class="item-btm"><span class="item-img-icon"><i class="i-icon-arrow"></i><i class="i-icon-dot"></i></span><span>${house_picture_count}</span></div></div><div class="item-main"><p class="item-tle">${title}</p><p class="item-des"><span>${frame_room}</span><span data-origin="${house_area}">${house_area}㎡</span><span>朝${frame_orientation}</span><span class="item-side">${price_total}<span>'+echoCurrency('short')+'/月</span></span></p><p class="item-community"><span class="item-exact-com">${community_name}</span><em>${update}</em></p></div></a></div>'

		}

		//气泡样式
		,bubbleStyle = {
			color: "#fff",
			borderWidth: "0",
			padding: "0",
			zIndex: "2",
			backgroundColor: "transparent",
			textAlign: "center",
			fontFamily: '"Hiragino Sans GB", "Microsoft Yahei UI", "Microsoft Yahei", "微软雅黑", "Segoe UI", Tahoma, "宋体b8bf53", SimSun, sans-serif'
		}

		,isNewList = false   //是否为新列表
		,salePage = 1        //楼盘数据当前页
		,saleChooseData;     //查看户型的楼盘数据

  	g_conf.districtData = [];
  	g_conf.bizcircle = [];
  	g_conf.saleData = [];

  	init.createMap();


    // 定位
    $('.zoom-local').click(function(){
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
      if(this.getStatus() == BMAP_STATUS_SUCCESS){

          var mk = new BMap.Marker(r.point);
          map.addOverlay(mk);
          map.panTo(r.point);
      }
      else {
        alert('failed'+this.getStatus());
      }
    },{enableHighAccuracy: true})
  })


});
