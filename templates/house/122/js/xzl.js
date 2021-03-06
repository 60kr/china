$(function(){

    $("img").scrollLoading();
    $(".totalCount b").html(totalCount);

    $('.lplist').delegate('.codebox', 'hover', function(event) {
        var type = event.type;
        var url = $(this).parent().find('a').attr('href');
        if(type == "mouseenter"){
            $(this).find('.qrcode').css("display","block");
            $(this).find('#qrcode').qrcode({
                render: window.applicationCache ? "canvas" : "table",
                width: 74,
                height: 74,
                text: huoniao.toUtf8(url)
            });
        }else{
            $(this).find('.qrcode').css("display","none");
            $(this).find('#qrcode').html('');
        }
    });
    $('.lplist').delegate('.btn_sc', 'click', function(event) {
        var t = $(this), type = t.hasClass("btn_ysc") ? "del" : "add", id = t.closest('li').attr('data-id');
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
          huoniao.login();
          return false;
        }
        if(type == "add"){
          t.addClass("btn_ysc").html("<i class='isc'></i>已收藏");
        }else{
          t.removeClass("btn_ysc").html("<i class='isc'></i>收藏");
        }
        $.post("/include/ajax.php?service=member&action=collect&module=house&temp=xzl_detail&type="+type+"&id="+id);
    });

    /**
     * 筛选变量
     */
    // var postype = detail.addrid ? 1 : (detail.subway ? 2 : 0);
    var postype = 1;




    // 筛选区域的点击事件 切换位置筛选类型 curr 价格是否为自定义
    $('.filterlist').delegate('a', 'click', function(){
      var t = $(this), par = t.closest('dl'), con = t.parent(), index = par.index();
      if(con.hasClass('area') || con.hasClass('subway') || con.hasClass('pos-item')) return;    // 区域和更多条件区域单独处理

      t.addClass('curr').siblings().removeClass('curr');
      if(index == 0){
        
      }else if(index == 1 || index == 2){
        $('.filterlist .inpbox').removeClass('curr');
      }

    })

    // 一级区域
    $('.t-fi .pos-item').delegate('a', 'click', function(event) {
        var t = $(this),index = t.index(),id = t.attr("data-id");
        t.addClass('curr').siblings().removeClass('curr');
        $('.area .pos-sub-item').html('<a href="javascript:;" class="all curr">不限</a>');
        if ($(this).hasClass("all")) {
            $('.area').hide();
        } else{
            $.ajax({
                url: "/include/ajax.php?service=house&action=addr&type="+id,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    if(data && data.state == 100){
                        var list = [], info = data.info;
                        list.push('<a href="javascript:;"  data-area="'+id+'" data-business="0" class="all curr">不限</a>');
                        for(var i = 0; i < info.length; i++){
                            list.push('<a href="javascript:;" data-area="'+id+'" data-business="'+info[i].id+'">'+info[i].typename+'</a>');
                        }
                        $('.area .pos-sub-item').html(list.join(""));
                        $('.area').show();
                    }
                }
            });
        }
    });

    // 单个删除
    $(".fi-state").delegate(".idel", "click", function () {
        var par = $(this).parent(), group = par.attr('data-group'), level = par.attr("data-level"), id = par.attr("data-id");
        if(group == 0 && level == 1){
            par.siblings('[data-group="0"]').remove();
        }
        par.remove();
        if($(".selected-info").length == 0){
          $(".fi-state").hide();
        }
        clearFilter(group, level, id);
        getList();
    });

    // 清空条件
    $(".btn_clear").on("click", function () {
        $(".fi-state").hide().children('dd').html('');
        clearFilter();
        $(".fi-state").hide();
        getList();
    });

    function clearFilter(obj, level, id){
      var group = obj ? obj : 'all';
      if(group == 'all' || group == 'keywords') keywords = '';
      $('.filterlist dl').each(function(g){
        if(group == 'all' || group == g){
            var box = $(this);
            if(group == 'all' || g != 0 || (g == 0 && level == 1)){
              box.find('.curr').removeClass('curr');
              box.find('.cur').removeClass('cur');
              box.find('.active').removeClass('active');
            }
            if(g == 0){

              // 清除二级
              $('.pos-sub-item a:eq(0)').addClass('curr').siblings().removeClass('curr');

              if(level == 1 || level == undefined){
                $('.area').hide();
                $('.pos-item a').eq(0).addClass('curr');
              }

            }else{
              box.find('dd a:eq(0)').addClass('curr');
              if(g == 1 || g == 2 || g == 3){
                box.find('.inpbox input[type="input"]').val('');
                box.find('.zjbox').each(function(){
                    $(this).children('a:eq(0)').addClass('curr');
                })
              }
            }
          }
        })
    }


    //排序
    $(".m-t li").bind("click", function () {
        var t = $(this),
            i = t.index(),
            id = t.attr('data-id');
        orderby = id;

        if (!t.hasClass("curr")) {
            t.addClass("curr").siblings("li").removeClass("curr");
        }
    });

    $(".m-o a").bind("click", function () {
        var t = $(this),
            i = t.index(),
            id = t.attr('data-id');
        if (i == 1) {
            pantime = id;
        } else if (i == 2) {
            price = id;
        }

        if (!t.hasClass("curr")) {
            t.addClass("curr").siblings("a").removeClass("curr");
        } else {
            if (t.hasClass("curr") && t.hasClass("ob")) {
                t.hasClass("up") ? t.removeClass("up") : t.addClass("up");
            }
        }

    });

    // 切换类别
    $('.filtertab').delegate('li', 'click', function() {
        var t = $(this),i = t.index(),action = t.attr('data-action');
        if(!t.hasClass('on')){
            t.addClass('on').siblings().removeClass('on');
            $('.lplist').eq(i).addClass('show').siblings('.lplist').removeClass('show');
        }
        
        if(action == 'zu'){
            $('.rentbox').show()
            $('.pricebox').hide();
        }else if(action == 'sale'){
            $('.rentbox').hide()
            $('.pricebox').show();
        }
    });

     // 单价/总价
    $('.filprice').delegate('span', 'click', function(event) {
        var t = $(this),i = t.index(),par = t.closest('dl');
        if (!t.hasClass('on')) {
            t.addClass('on').siblings().removeClass('on');
            if (par.hasClass('rentbox')) {
                par.find('.zjbox').eq(i).addClass('zshow').siblings().removeClass('zshow');
            } else {
                par.find('.zjbox').eq(i).addClass('zshow').siblings().removeClass('zshow');
            }
        }
    });
    // 自定义面积
    $("#area_sure").bind("click",function () {
        var price1 = $.trim($("#areaLow").val()), price2 = $.trim($("#areaTop").val());
        var price = [];
        if(price1 == 0 && price2 == ''){
            return false;
        }
        if(price1 != "" || price2 != ""){
            if(price1 != ""){
                price.push(price1);
            }
            price.push(",");

            if(price2 != ""){
                price.push(price2);
            }
        }
        location.href = areaUrl.replace("areaPlaceholder", price.join(""));
    });
    // 自定义租金单价
    $("#btn_zdprice").bind("click",function () {
        var price1 = $.trim($("#zdpriceLow").val()), price2 = $.trim($("#zdpriceTop").val());
        var price = [];
        if(price1 == 0 && price2 == ''){
            return false;
        }
        if(price1 != "" || price2 != ""){
            if(price1 != ""){
                price.push(price1);
            }
            price.push(",");

            if(price2 != ""){
                price.push(price2);
            }
        }

        location.href = priceUrl.replace("pricePlaceholder", price.join(""));
    });

    // 租房自定义单价
    $("#btn_zdprice").bind("click",function () {
        var price1 = $.trim($("#zdpriceLow").val()), price2 = $.trim($("#zdpriceTop").val());
        var price = [];
        if(price1 == 0 && price2 == ''){
            return false;
        }
        if(price1 != "" || price2 != ""){
            if(price1 != ""){
                price.push(price1);
            }
            price.push(",");

            if(price2 != ""){
                price.push(price2);
            }
        }
        location.href = priceUrl.replace("pricePlaceholder", price.join(""));
    });
    //租房自定义总价
    $("#btn_zzprice").bind("click",function () {
        var price1 = $.trim($("#zzpriceLow").val()), price2 = $.trim($("#zzpriceTop").val());
        var price = [];
        if(price1 == 0 && price2 == ''){
            return false;
        }
        if(price1 != "" || price2 != ""){
            if(price1 != ""){
                price.push(price1);
            }
            price.push(",");

            if(price2 != ""){
                price.push(price2);
            }
        }
        location.href = priceUrl.replace("pricePlaceholder", price.join(""));
    });
    // 自定义出售总价
    $("#btn_szprice").bind("click",function () {
        var price1 = $.trim($("#szpriceLow").val()), price2 = $.trim($("#szpriceTop").val());
        var price = [];
        if(price1 == 0 && price2 == ''){
            return false;
        }
        if(price1 != "" || price2 != ""){
            if(price1 != ""){
                price.push(price1);
            }
            price.push(",");

            if(price2 != ""){
                price.push(price2);
            }
        }
        location.href = priceUrl.replace("pricePlaceholder", price.join(""));
    });

    //自定义出售单价
    $("#btn_sdprice").bind("click",function () {
        var price1 = $.trim($("#sdpriceLow").val()), price2 = $.trim($("#sdpriceTop").val());
        var price = [];
        if(price1 == 0 && price2 == ''){
            return false;
        }
        if(price1 != "" || price2 != ""){
            if(price1 != ""){
                price.push(price1*10000);
            }
            price.push(",");

            if(price2 != ""){
                price.push(price2*10000);
            }
        }
        location.href = priceUrl.replace("pricePlaceholder", price.join(""));
    });





});
