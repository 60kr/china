/**
 * 会员中心积分明细
 * by guozi at: 20150717
 */

var objId = $("#list");
var pointSummary = [];
var choseArr = {
        zdType: '',
        price: ''
    };
$(function(){

  var device = navigator.userAgent;
	if (device.indexOf('huoniao_iOS') > -1) {
		$('body').addClass('huoniao_iOS');
	}

  var currYear = (new Date()).getFullYear();
  var currMonth = (new Date()).getMonth() + 1;
  currMonth = currMonth < 10 ? '0'+currMonth : currMonth;
  var activeDate2 = currYear+'-'+currMonth;
  var activeDate = currYear+'-'+currMonth;
  	$('.yearly-time').scroller(
      	$.extend({
      		headerText:'选择时间',
          	preset: 'date',
          	dateFormat: 'yy-mm',
          	endYear: currYear,
          	maxDate: new Date(),
          	onSelect: function (valueText, inst) {
              $('#allMoney').text(0);
              activeDate = valueText;
              $(".fakeDd span").text(activeDate);
              getMonthData();
        	}
      })
  	);
	$("#list").delegate('.month','click',function(){
	  	$(".yearly-time").click();//触发时间
	})
	$(".fakeDd").delegate('.month','click',function(){
	  	$(".yearly-time").click();//触发时间
	})

	//获取月度汇总
	function getMonthData(){
		var data = [];
		if (choseArr.price != '' && choseArr.price != ' '&& choseArr.price != undefined) {
	    	data.push('point='+choseArr.price);
	    }
	    if (choseArr.zdType != '' && choseArr.zdType != undefined && choseArr.zdType != null && choseArr.zdType != 'null') {
	      var closPar = $('.incomeType li a[data-id="'+choseArr.zdType+'"]').closest('li');
	      if(closPar.hasClass('leimu')){
	        data.push('ctype='+choseArr.zdType);
	      }
	    }
	    if (choseArr.zdSource != '' && choseArr.zdSource != undefined) {
		data.push('ordertype='+choseArr.zdSource);
    	}

		var dateVal = $('.yearly-time').val();
		data.push('date='+dateVal);

		$.ajax({
			url: "/include/ajax.php?service=member&action=pointSummary",
			data: data.join('&'),
			type: "GET",
			dataType: "json",
			success: function (data) {
				if(data && data.state != 200){
					pointSummary = data.info;
					getList(1);
				}
			}
		});
	}
	getMonthData();

  	//筛选
  	$('.filerP').click(function(){

	    if(!$(this).hasClass('active') || $(this).hasClass('speCurr')){
	      	$(this).addClass('active').siblings('.all').removeClass('active');
	      	$('.mask').show();
	      	if ($(".huoniao_iOS").size()>0) {//app时
		      	$('.filterWrap').animate({'top':'.9rem'},200);
		  	}else{
		  		$('.filterWrap').animate({'top':'1.8rem'},200);
		  	}
		  	$('.dsTitle').addClass('boxS');
		  	$('html').addClass('noscroll');
	    }else{
			if(!$(this).hasClass('speCurr')){
  			$(this).removeClass('active').siblings('.all').addClass('active');
  		}
	      $('.mask').hide();
	      $('.filterWrap').animate({'top':'-100%'},200);
	      $('html').removeClass('noscroll');
	      $('.dsTitle').removeClass('boxS');
	    }
	    if (choseArr.zdType != '' && choseArr.zdType != undefined) {
	    	$('.incomeType li').removeClass('curr');
	    	$('.incomeType li a[data-id="'+choseArr.zdType+'"]').closest('li').addClass('curr');
	    	$(this).addClass('speCurr');
	    }


	    if (choseArr.price != '' && choseArr.price != ' '&& choseArr.price != undefined) {
			var pricAr =choseArr.price.split(',');
			var pr1 = pricAr[0];
			var pr2 = pricAr[1];
			$('#price1').val(pr1);
			$('#price2').val(pr2);
			$(this).addClass('speCurr');
	    }
  	})
  	//点击全部
	$('.dsTitle .all').click(function(){
		if(!$(this).hasClass('active')){
		  	$(this).addClass('active').siblings('.filerP').removeClass('active');
		  	$('.sameList li').removeClass('curr');
		    $('.symbol input').val('');
		    $('.amoutMoney').attr('data-id','');
		  	choseArr.zdType = '';
        	choseArr.zdSource = '';
       	 	choseArr.price = '';
		  	getMonthData();
		}
		$('.mask').hide();
		$('.filterWrap').animate({'top':'-100%'},200);
		$('html').removeClass('noscroll');
		$('.dsTitle').removeClass('boxS');
		$('.filerP').removeClass('speCurr');
	})

  	//关闭弹窗
	$('.mask').click(function(){
		$('.filerP').removeClass('active');
		$('.mask').hide();
		$('.filterWrap').animate({'top':'-100%'},200);
		$('html').removeClass('noscroll');
		$('.dsTitle').removeClass('boxS');
		if((choseArr.zdType != '' && choseArr.zdType != undefined ) || (choseArr.zdSource != '' && choseArr.zdSource != undefined ) || (choseArr.price != '' && choseArr.price != ' '&& choseArr.price != undefined)){
			$('.dsTitle p.all').removeClass('active');
			$('.filerP').addClass('speCurr');
		}else{
			$('.dsTitle p.all').addClass('active');
			$('.filerP').removeClass('speCurr');
		}
	})
	//来源 类型选择
	$('.sameList li').click(function(){
		$(this).toggleClass('curr').siblings('li').removeClass('curr');
	})

	//重置
	$('.btnCon .setBtn').click(function(){
		$('.sameList li').removeClass('curr');
		$('.symbol input').val('');
		$('.amoutMoney').attr('data-id','');
	})
	//确定
	$(".btnCon .sureBtn").bind("click",function () {
		//确定金额
		var price1 = $.trim($("#price1").val()) > 0 ? parseFloat($.trim($("#price1").val())) : 0,
		price2 = $.trim($("#price2").val()) > 0 ? parseFloat($.trim($("#price2").val())) : 0;
		var price = [];
		if((price1 > 0 && price2 > 0) && (price2 > price1)){

			$('.amoutMoney').attr('data-id',price1+','+price2);

		}else if((price1 == '' || price1 == 0) && price2>0){
			$('.amoutMoney').attr('data-id',' ,'+price2);

		}else if((price2 == '' || price2 == 0) && price1>0){

			$('.amoutMoney').attr('data-id',price1+', ')
		}else{

			$('.amoutMoney').attr('data-id',' ')
		}

	    var acLen1 = $('.incomeType li.curr a').attr('data-id');
		var acLen2 = $('.incomeSor li.curr a').attr('data-id');
		var acLen3 = $('.amoutMoney').attr('data-id');
		choseArr.zdType = acLen1;
        choseArr.price = acLen3;
        if((acLen1 != '' && acLen1 != undefined ) || (acLen3 != '' && acLen3 != ' '&& acLen3 != undefined)){
        	$('.dsTitle p.all').removeClass('active');
        	$('.filerP').addClass('speCurr');
        }else{
        	$('.dsTitle p.all').addClass('active');
        	$('.filerP').removeClass('speCurr');
        }

	    $('.filerP').removeClass('active');
	    $('.mask').hide();
	    $('.filterWrap').animate({'top':'-100%'},200);
	    $('.dsTitle').removeClass('boxS');
	    $('html').removeClass('noscroll');

	    getMonthData();


	});


  	// 下拉加载
	$(window).scroll(function() {
		var h = $('.item').height();
		var allh = $('body').height();
		var w = $(window).height();
		var scroll = allh - w - 60;
		if ($(window).scrollTop() > scroll && !isload) {
		  atpage++;
		  getList();
		};

	});


});
var flag = 0;
function getList(is){

	if(!pointSummary) return;

  	isload = true;

	if(is){
		$(".list").html('');
	    atpage = 1;
	}

	objId.append('<p class="loading">'+langData['siteConfig'][20][184]+'...</p>');

	var type = $(".tab .curr").attr("data-id");
	var data=[];
	data.push('page='+atpage);
	data.push('pageSize='+pageSize);

	if (choseArr.zdType != '' && choseArr.zdType != undefined && choseArr.zdType != null && choseArr.zdType != 'null') {
    var closPar = $('.incomeType li a[data-id="'+choseArr.zdType+'"]').closest('li');
      if(closPar.hasClass('leimu')){
        data.push('ctype='+choseArr.zdType);
      }else{
        data.push('type='+choseArr.zdType);
      }
    }

    if (choseArr.price != '' && choseArr.price != ' '&& choseArr.price != undefined) {
    	data.push('point='+choseArr.price);
    }
	var dateVal = $('.yearly-time').val();
	data.push('date='+dateVal);

	$.ajax({
		url: "/include/ajax.php?service=member&action=point",
		data: data.join('&'),
		type: "GET",
		dataType: "json",
		success: function (data) {
			if(data && data.state != 200){
				if(data.state == 101){
					objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
				}else{
					var list = data.info.list, pageInfo = data.info.pageInfo;

          			var msg = totalCount == 0 ? langData['siteConfig'][20][126] : langData['siteConfig'][20][185];

					//拼接列表
					if(list.length > 0){


						for(var i = 0; i < list.length; i++){
							var html = [],html2=[];
							var item   = [],prev_time,prev_YM,next_YM,next_time,
									type   = list[i].type,
                                    ctype   = list[i].ctype,
									time   = list[i].date,
									amount = list[i].amount,
									info   = list[i].info;
							if(i>0){
								prev_time = list[i-1].date;
								prev_YM = (prev_time.split(' ')[0]).split('-')[0]+''+(prev_time.split(' ')[0]).split('-')[1];
							}
							if( i !=(list.length -1)){
								next_time = list[i+1].date;
								next_YM = (next_time.split(' ')[0]).split('-')[0]+''+(next_time.split(' ')[0]).split('-')[1];
							}

							var dYear = (time.split(' ')[0]).split('-')[0];//年份
							var dMonth = (time.split(' ')[0]).split('-')[1];//月份

							var YM = dYear+''+dMonth;
							var oldDate = $('dt[data-date="'+dYear+''+dMonth+'"]').length;//下一页数据加载判断月份是否存在

							//判断下一页第一条数据是不是已存在的月份
							// if(atpage >1){
								var tdate = (list[i].date.split(' ')[0]).split('-')[0]+''+(list[i].date.split(' ')[0]).split('-')[1];
								var oLen = $('dt[data-date="'+tdate+'"]').length;//
								if(oLen > 0){//月份已存在
									flag =1;
								}else{
									flag =0;
								}
							// }

							if((i==0 || (i!=0 && YM != prev_YM)) && oldDate==0){
								html.push('<dl>')
								html.push('<dt data-date="'+dYear+''+dMonth+'">');
								html.push('<p class="month"><span>'+dYear+'-'+dMonth+'</span> <i></i></p>');

								html.push('<div class="listTit">支出'+pointName+'<span class="outMoney"> '+pointSummary[dYear+'-'+dMonth]['expenditure']+'</span><em>|</em>收入'+pointName+'<span class="inMoney"> '+pointSummary[dYear+'-'+dMonth]['income']+'</span></div>');
								html.push('</dt>');
								if(atpage == 1 && i==0){
									//$('.yearly-time').val(dYear+'-'+dMonth);
			            		}

							}
							if(flag ==1){//月份已存在
								html2.push('<dd>');
								html2.push('<div class="item">');
                                html2.push('<div class="leftImg">');
                                if(ctype && ctype!=0){
                                    html2.push('<img src="'+templets_skin+'images/record/'+ctype+'.png" alt="">');
                                  }else{
                                    if(type == 0){
                                      html2.push('<img src="'+templets_skin+'images/record/zhi.png" alt="">');
                                    }else{
                                      html2.push('<img src="'+templets_skin+'images/record/shou.png" alt="">');
                                    }
                                  }
                                html2.push('</div>');
								html2.push('<div class="rCon">');
								html2.push('<div class="rbox">');
								html2.push('<div class="topc">');
								html2.push('<h3>'+info+'</h3><strong class="number'+(type == 1 ? " add" : " less")+'">'+(type == 1 ? "+" : "-")+amount+'</strong>');
								html2.push('</div>');
								html2.push('<p class="time"><em>'+addDateInV1_2(time.split(' ')[0])+'</em>'+time.split(' ')[1]+'</p>');
								html2.push('</div>');
								html2.push('</div>');
								html2.push('</div>');
								html2.push('</dd>');
							}else{
								html.push('<dd>');
								html.push('<div class="item">');
								html.push('<div class="leftImg">');
                                if(ctype && ctype!=0){
                                    html.push('<img src="'+templets_skin+'images/record/'+ctype+'.png" alt="">');
                                  }else{
                                    if(type == 0){
                                      html.push('<img src="'+templets_skin+'images/record/zhi.png" alt="">');
                                    }else{
                                      html.push('<img src="'+templets_skin+'images/record/shou.png" alt="">');
                                    }
                                  }
                                html.push('</div>');
								html.push('<div class="rCon">');
								html.push('<div class="rbox">');
								html.push('<div class="topc">');
								html.push('<h3>'+info+'</h3><strong class="number'+(type == 1 ? " add" : " less")+'">'+(type == 1 ? "+" : "-")+amount+'</strong>');
								html.push('</div>');
								html.push('<p class="time"><em>'+addDateInV1_2(time.split(' ')[0])+'</em>'+time.split(' ')[1]+'</p>');
								html.push('</div>');
								html.push('</div>');
								html.push('</div>');
								html.push('</dd>');
							}


							if(flag ==1){//月份已存在
								objId.find('dl:last').append(html2.join(""));
							}

							if(( YM != next_YM && i !=(list.length -1))){
								html.push('</dl>');
								flag = 0;
							}

							if(flag ==0){//月份已存在
								objId.append(html.join(""));
							}

						}


			            $('.loading').remove();
			            isload = false;


					}else{
            			$('.loading').remove();
						objId.append("<p class='loading'>"+msg+"</p>");
					}

					totalAdd = pageInfo.totalAdd;
					totalLess = pageInfo.totalLess;
					totalCount = pageInfo.totalCount;


          $('#totalCount').val(totalCount);
          $('#totalAdd').text(Number(pageInfo.totalAdd).toFixed(0));
          $('#totalLess').text(Number(pageInfo.totalLess).toFixed(0));

				}
			}else{
				objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
			}
		}
	});
}

function addDateInV1_2(strDate){
	var d = new Date();
	var day = d.getDate();
	var month = d.getMonth() + 1;
	var year = d.getFullYear();
	var dateArr = strDate.split('-');
	var tmp;
	var monthTmp;
	if(dateArr[0] == year){//今年
		if(dateArr[1] == month){//当月
			if(dateArr[2] == day){//今天
				return langData['siteConfig'][13][24];//今天
			}else{
				return dateArr[1]+'-'+dateArr[2]
			}
		}else{
			return dateArr[1]+'-'+dateArr[2]
		}

	}else{
		return strDate;
	}
	// if(dateArr[2].charAt(0) == '0'){
	// 	tmp = dateArr[2].substr(1);
	// }else{
	// 	tmp = dateArr[2];
	// }
	// if(dateArr[1].charAt(0) == '0'){
	// 	monthTmp = dateArr[1].substr(1);
	// }else{
	// 	monthTmp = dateArr[1];
	// }
	// if(day == tmp && month == monthTmp && year == dateArr[0]){
	// 	return langData['siteConfig'][13][24];//今天
	// }else{
	// 	return dateArr[0] + langData['siteConfig'][13][14] + monthTmp + langData['siteConfig'][13][18] + tmp + langData['siteConfig'][13][25];//今天--月--日
	// }
}
