var URL = location.href;
var URLArrary = URL.split('#');
var CLASSID = URLArrary[1] && parseInt(URLArrary[1]) ? parseInt(URLArrary[1]) : listid;

var bodyWidth,winW,winH
var navLeft = [];
var CLASSIDArray = [];
var showPanelIndex = 0;
var first = 0;

var scrollLock = false
var loadingLock = false;

function returnWinSize(w,h,b){
    bodyWidth = wFsize * 7.5;
    winW = w;
    winH = h;

    navItemEach(first);
    initCheck(first);
    if(!first) {
        $('#nav_item_' + CLASSID).addClass('curr');
        panelOnTouch();
        first = 1;
    } else {
        swripPanelScroll();
    }
}

function initCheck(first){
    if(first) return;
    if(in_array(CLASSID,CLASSIDArray)) {
        // 一级栏目ID
        showPanelIndex = $('#nav_item_' + CLASSID).index();
        setNavCurr('#nav');
        navContainScroll('#nav',1,0);
        $('.nav').css('visibility','visible')
        setNavCurr('#nav');
        swripPanelScroll(0);
        pushData(CLASSID,1);

        // 获取子分类
        getSubClass(CLASSID);
    } else {
        // 获取所有栏目id
        getClassDetail(CLASSID);
    }
    $('.navbox').addClass('tran02');
}

function getClassDetail(id) {
    var url = masterDomain + "/include/ajax.php?service=article&action=type&param="+id+'&son=1';
    $.ajax({
        url: url,
        type: "GET",
        dataType: "jsonp",
        success: function (data) {
            if(data && data.state == 100) {
                classFinishing(1,data.info);
            } else {
                classNull();
            }
        },
        error: function(){
            classNull();
        }
    })
}

function classFinishing(top,arr,result){
    if(result == undefined) result = [];
    for(var i = 0 ; i < arr.length ; i++) {
        result[i] = [];
        result[i]['fa'] = [];
        result[i]['fa']['id'] = arr[i]['id'];
        result[i]['fa']['name'] = arr[i]['typename'];
        result[i]['fa']['parid'] = arr[i]['parentid'];
        result[i]['son'] = [];

        if(arr[i]['lower'] != '') {
            classFinishing(0,arr[i]['lower'],result[i]['son']);
        }
    }
    if(top) {
        in_array2(result,result,CLASSID,1);
    }
}

var findResult = [CLASSID];
function in_array2(initialarr,arr,val,no) {
    if(val == 0) {
        findId();
    } else {
        for(var i in arr) {
            if(typeof arr[i] != 'string' && typeof arr[i] != Number) {
                in_array2(initialarr,arr[i],val,0);
            } else {
                if(arr[i] == val && i == 'id') {
                    findResult.push(parseInt(arr['parid']));
                    in_array2(initialarr,initialarr,arr['parid'],0);
                    return;
                }
            }
        }
        no && checkIdIsHave();
    }
}

function findId(){
        var len = findResult.length;
        var id = parseInt(findResult[len-2]),
            subcurrid = parseInt(findResult[len-3]);

            // 顶级栏目
            showPanelIndex = returnIndex(id,CLASSIDArray);
            setNavCurr('#nav');
            navContainScroll('#nav',1,0);
            $('.nav').css('visibility','visible')
            swripPanelScroll(0);
            pushData(CLASSID,1);

            pushSubClass(id,subcurrid);
            delayPushSub(findResult,len-3)
}

function delayPushSub(idarr,index){
    setTimeout(function(){0
        pushSubClass(idarr[index],idarr[--index]);
        if(index > -1) {
            delayPushSub(idarr,index);
        }
    },100)
}

function checkIdIsHave(){
    if(findResult.length == 1) {
        classNull();
    }
}

function returnIndex(id,arr){
    for(var i in arr){
        if(id == arr[i]) {
            return i;
        }
    }
    return 'unfined';
}

function classNull(){
    // 栏目id不存在时 错误提示
    var obox = $('.modal-msg');
    obox.children('.txt').html('栏目不存在，<br />即将为您跳转到推荐页面···');
    var op = obox.parent();
    if(op.is('.modalwrap')) {
        op.addClass('open');
    } else {
        var len = $('.modalwrap').length;
        var $wrap = '<div class="modalwrap open" id="modalwrap_' + len + '" data-close="true">';
        obox.wrapAll($wrap);
        op = obox.parent();
    }
    if(op.attr('data-close') == 'true') {
        setTimeout(function(){
            op.removeClass('open');
            $('#nav_list .item').eq(0).click();
        },2000)
    }
}

function pushData(id,page,getTop){
    id = id === undefined ? CLASSIDArray[showPanelIndex] : id;
    page = page === undefined ? 1 : page;
    if($('#chanel_' + CLASSIDArray[showPanelIndex] + ' .content').length == 0) {
        $('#chanel_' + CLASSIDArray[showPanelIndex]).append('<div class="content"></div><div class="loading"><img src="'+templets_skin+'images/loading.gif" alt=""><span>加载中</span></div>')
    }
    if(in_array(id,CLASSIDArray)) {
        // 一级栏目
        if(id == 0) {
            //推荐
            //$('#picscroll').show();
            if($('#chanel_0 .content').html() == '') {
                getData(id,page);
            }
        } else {
            if(getTop){
                $('#chanel_' + id + ' .content').html('');
            }
            if($('#chanel_' + id + ' .content').html() == '' || $('#chanel_' + id + ' .content').html().indexOf("暂无数据") > -1) {
              if($('#chanel_' + id + ' .content').html().indexOf("暂无数据") > -1){
                $('#chanel_' + id + ' .content').html('');
              }
              getData(id,page);
            }
        }
    } else {
        $('#chanel_' + CLASSIDArray[showPanelIndex] + ' .content').html('');
        getData(id,page,'sub');
    }

    window.location.href = URLArrary[0] + '#' + CLASSID;
}

function setNavCurr(parentsid,index) {
    var obj = $(parentsid),
        index = index === undefined ? showPanelIndex : index;
        obj.find('.item').eq(index).addClass('curr').siblings().removeClass('curr');
}

function navContainScroll(parentsid,level,time) {
    var obj = $(parentsid),
        index = level ? showPanelIndex : obj.find('.item.curr').index();
    var mg = obj.find('.item').css('margin').replace("0px","").replace("px",""),
        left;
        mg = mg == '' ? 0 : mg;
        if(index < 2) {
            left = 0;
        } else {
            var prev = obj.find('.item').eq((index-2 < 0 ? 0 : index - 2));
            left = prev.position().left + prev.width() + 2 * mg;
        }
    var t = time == undefined ? 300 : t;
    animatScrollLeft(obj[0],left,t);
}

function swripPanelScroll(time){
    var index = showPanelIndex;
    var bleft = -index * bodyWidth;
    var t = time === undefined ? 300 : time > 150 ? 300 : time * 2;
    $('#maincontent').animate({'-webkit-transform':'translate3d(' + bleft + 'px,0px,0px)'},t,'ease-out');
    $('#chanel_' + CLASSIDArray[showPanelIndex]).height('auto').siblings('.swrip-panel').height(winH + 'px;')
}

function pushSubClass(id,subcurrid){
    if(in_array(id,CLASSIDArray)) {
        $('#sub_navWrap').html('');
    }
    getSubClass(id,subcurrid);
}

//遍历一级导航，创建 .swrip-panel 并设置尺寸
function navItemEach(type){
    navLeft = [];
    var len = 0;
    var panelBox = G('maincontent');
    $('#nav_list .item').each(function(i){
        var item = $(this);
        navLeft.push(item.position().left);
        if(!type){
            var id = item.attr('data-id');
            CLASSIDArray.push(id);
            var panel;
            if(i == 0) {
                panel = G('chanel_0');
            } else {
                panel = document.createElement('div');
                panel.className = "swrip-panel";
                panel.id = "chanel_" + id;
            }
                panel.style.width = bodyWidth + 'px';
                panel.style.height = winH + 'px';
                panel.style.minHeight = winH + 'px';
            var panelBox = G('maincontent');
            i && panelBox.appendChild(panel);
        } else {
            $('.swrip-panel').width(bodyWidth + 'px;')
        }
        len++;
    })
    panelBox.style.width = bodyWidth * len + 'px';
}

// 绑定滑动事件
function panelOnTouch(){
    var navpar  = $('#nav_list'),
        navitem = navpar.children('.item'),
        navLen  = navitem.length;

    var panewrip = $('#maincontent');
    var isFirstEnd = false,     //首尾
        moveHorizoLock = false,     //禁止左右滑动
        moveVertiLock = false,      //禁止上下滑动
        startPos = {},
        movePos = {},
        endPos = {},
        startTime,
        endTime,
        moveX,
        moveY,
        Dire;

    // START
    panewrip[0].addEventListener('touchstart',function(e){
        if(scrollLock) return;
        startTime = new Date().getTime();
        var touch = e.touches[0];
        startPos = {
            X : touch.pageX,
            Y : touch.pageY
        }
    })
    // MOVE
    panewrip[0].addEventListener('touchmove',function(e){
        if(moveHorizoLock || scrollLock) return;  //如果是上下滑动则返回
        var touch = e.touches[0];
        movePos = {
            X : touch.pageX,
            Y : touch.pageY
        }

        // 判断方向
        moveX = movePos.X - startPos.X;
        moveY = movePos.Y - startPos.Y;

        if(Math.abs(moveX) < Math.abs(moveY) && moveY < 0) {
            Dire = 1;
        } else if(Math.abs(moveX) > Math.abs(moveY) && moveX > 0) {
            Dire = 2;
        } else if(Math.abs(moveX) < Math.abs(moveY) && moveY > 0) {
            Dire = 3;
        } else if(Math.abs(moveX) > Math.abs(moveY) && moveX < 0) {
            Dire = 4;
        }

        if(Dire == 2 || Dire == 4) {
            e.preventDefault();
            if(!moveHorizoLock){
                moveVertiLock = true;
            }
            var _move = moveX , move;
            if(Dire == 2 && showPanelIndex == 0 || Dire == 4 && showPanelIndex == navLen - 1) {
                _move = Math.sqrt(Math.abs(moveX));
                if(Dire == 4) {
                    _move = _move * -1;
                }
                isFirstEnd = true;
            } else {
                isFirstEnd = false;
            }
            move = -showPanelIndex * bodyWidth + _move;
            panewrip.css({'-webkit-transform' : 'translate3d(' + move + 'px,0px,0px)'});
        } else {
            if(!moveVertiLock){
                moveHorizoLock = true;  //锁定左右滑动
            }
            if(moveVertiLock) {
                e.preventDefault();
            }
        }
    })
    // END
    panewrip[0].addEventListener('touchend',function(e){
        touchover();
    })
    // CANCEL
    panewrip[0].addEventListener('touchcancel',function(e){
        touchover();
    })

    function touchover(){
        if(moveHorizoLock) {
            moveHorizoLock = false;     //解除左右滑动锁定
            return;
        }
        moveVertiLock = false;      //解除上下滑动锁定
        if(scrollLock) {
            scrollLock = false;
            return;
        }

        endTime = new Date().getTime();
        var isChange = false;
        var moveSpeed = Math.abs(moveX) / (endTime - startTime);
        if(Math.abs(moveX) > bodyWidth / 3 || moveSpeed > 0.5) {
            if(!isFirstEnd) {
                Dire == 2 && showPanelIndex--;
                Dire == 4 && showPanelIndex++;
                isChange = true;
                $(window).scrollTop(0);
                $(".fixFooter, .navfixbox").show();
            }
        } else {
            isChange = false;
        }

        CLASSID = CLASSIDArray[showPanelIndex];
        swripPanelScroll(endTime - startTime);
        setNavCurr('#nav');
        navContainScroll('#nav',1);

        pushData();

        // ---------------- sub start
        var btn = $('#nav_item_' + CLASSIDArray[showPanelIndex]);

        if(btn.hasClass('open_sub')) {
            var level = parseInt(btn.attr('data-open-level'));

            for(var i = 1;i <= level ;i++) {
                var subid = btn.attr('data-sub-'+i);
                if(i == 1) {
                    isChange && pushSubClass(CLASSID,subid);
                }
                if(i<level) {
                    isChange && pushSubClass(subid,btn.attr('data-sub-'+(i+1)));
                } else {
                    pushSubClass(subid);
                }
            }
        } else {
            // 获取子分类
            isChange && pushSubClass(CLASSID);
            if(CLASSID == 0){
                $('.sub_navWrap').html('');
                setNavH();
                $('.artbanner').show();
            }else{
                $('.artbanner').hide();
            }
        }

        // ---------------- sub end
    }
}

function getData(id,page,leval){
    var oid = leval == 'sub' ? CLASSIDArray[showPanelIndex] : id;
    var objId = 'chanel_' + oid,
        url;
    var panel = $('#' + objId);
    panel.find('.loading').show();

    if(id == 0) {
        url = masterDomain + "/include/ajax.php?service=article&action=alist&mold=" + mold + "&page=" + page + "&pageSize=20";
    } else {
        url = masterDomain + "/include/ajax.php?service=article&action=alist&mold=" + mold + "&typeid=" + id + "&page=" + page + "&pageSize=20";
    }
    artbannerid = id;

    $.ajax({
        url: url,
        type: "GET",
        dataType: "jsonp",
        success: function (data) {
            if(data && data.state != 200){
                if(data.state == 101){
                    // $('.artbanner .swiper-wrapper').html("").hide();
                    panel.children('.content').append("<p class='error'>"+data.info+"</p>");
                    $('.loading').hide();
                }else{
                    var list = data.info.list, html = [], html1 = [];
                    var totalPage = data.info.pageInfo.totalPage;
                    var picNum = 0;
                    for(var i = 0; i < list.length; i++){
                        var item        = [],
                            item1       = [],
                            id          = list[i].id,
                            title       = list[i].title,
                            url         = list[i].url,
                            common      = list[i].common,
                            litpic      = list[i].litpic,
                            description = list[i].description,
                            pubdate     = list[i].pubdate,
                            common      = list[i].common,
                            source      = list[i].source,
                            flag        = list[i].flag;

                        // var img = huoniao.changeFileSize(litpic, "small");
                        var img = litpic;
                        var time = returnHumanTime(pubdate,3);
                        var piccount = list[i].group_img == undefined ? 0 : list[i].group_imgnum;

                        if(artbannerid == 0 && page==1 && img && picNum<=4){
                            item1.push('<div class="slideshow-item">');
                            item1.push('<div class="siteAdvObj">');
                            item1.push('<a href="'+ url +'"><img src="'+ img +'" alt=""></a>');
                            item1.push('</div>');
                            item1.push('<div class="slideinfo">');
                            item1.push('<h3><a href="'+ url +'" >'+ title +'</a></h3>');
                            item1.push('<div class="bg"></div>');
                            item1.push('</div>');
                            item1.push('</div>');
                            picNum++;
                        }else{
                            if(list[i].group_img){
                                item.push('<div class="m_item multipleBox">');
                                item.push('<a data-url="' + url + '" href="javascript:;">');
                                item.push('<h2>' + title + '</h2>');
                                item.push('<div class="imgBox fn-clear">');
                                var n = 0;
                                for (var g = 0; g < list[i].group_img.length; g++) {
                                    var src = huoniao.changeFileSize(list[i].group_img[g].path, "small");
                                    if(src && n < 3) {
                                        var c_class="";
                                        if(n==2){
                                            c_class='last'
                                        }
                                        item.push('<div class="mBox '+c_class+'">');

                                        if(page == 1){
                                            item.push('<img src="'+src+'" onerror=this.src="'+litpic+'" alt="title">');
                                        }else{
                                            item.push('<img src="'+staticPath+'images/blank.gif" onerror=this.src="'+litpic+'" data-url="' + src + '" alt="title">');
                                        }
                                        
                                        item.push('</div>');
                                        n++;
                                        if(n == 3) break;
                                    }
                                }
                                if(piccount > 0){
                                    item.push('<span class="Icount">'+piccount+'图</span>');
                                }
                                item.push('</div>');
                                item.push('<p><span>'+source+'</span><span>'+common+'评论<em>·</em>' + time + '</span></p>');
                                item.push('</a>');
                                item.push('</div>');

                            } else {
                                item.push('<div class="m_item singleBox">');
                                item.push('<a data-url="' + url + '" href="javascript:;" class="fn-clear">');
                                if(img !== undefined && img != ''){
                                    item.push('<div class="aright_">');
                                        if(flag.indexOf('r') > -1){
                                            //item.push('<span class="tag">推荐</span>');
                                        }

                                        if(page == 1){
                                            item.push('<img src="'+img+'" onerror=this.src="'+litpic+'" alt="' + title + '">');
                                        }else{
                                            item.push('<img src="'+staticPath+'images/blank.gif" onerror=this.src="'+litpic+'" data-url="' + img + '" alt="' + title + '">');
                                        }

                                        if(piccount > 0){
                                            item.push('<span class="Icount">'+piccount+'图</span>');
                                        }
                                    item.push('</div>');
                                }
                                item.push('<div class="aleft">');
                                item.push('<h2>' + title + '</h2>');
                                item.push('<p><span>'+source+'</span><span>'+common+'评论<em>·</em>' + time + '</span></p>');
                                item.push('</div>');
                                item.push('</a>');
                                item.push('</div>');
                            }

                        }

                        html.push(item.join(""));
                        html1.push(item1.join(""));
                    }
                    if(leval) {
                        // 非一级菜单
                        if(artbannerid==0){
                            if(page==1){
                                $('.artbanner .swiper-wrapper').html("").append(html1.join(""));
                            }
                        }else{
                            $('.artbanner').hide();
                        }
                        panel.children('.content').html("").append(html.join(""));
                    } else {
                        panel.find('.loading').hide();
                        if(artbannerid==0){
                            if(page==1){
                                $('.artbanner .swiper-wrapper').html(html1.join(""));
                            }
                        }else{
                            $('.artbanner').hide();
                        }
                        panel.children('.content').append(html.join(""));
                    }

                    panel.attr({'data-totalPage':totalPage})
                    panel.attr({'data-page' : page});
                    loadingLock = false;

                    panel.find('.loading').hide().addClass('mgsmall');
                    $('img').scrollLoading();
                    if(artbannerid == 0 && page == 1){
                        if(picNum){
                            new Swiper('.artbanner .swiper-container', {pagination:{ el: '.artbanner .pagination',} ,slideClass:'slideshow-item',loop: true,grabCursor: true,paginationClickable: true,autoplay:{delay: 2000,}});
                        }else{
                            $('.artbanner').hide();
                        }
                    }
                }
            }else{
                panel.find('.loading').hide();
                loadingLock = false;
                $('.artbanner .swiper-wrapper').html("").hide();
                panel.children('.content').append("<p class='error'>数据获取失败，请稍候访问！</p>");
            }
        },
        error: function(){
            panel.find('.loading').hide();
            loadingLock = false;
            $('.artbanner .swiper-wrapper').html("").hide();
            panel.children('.content').append("<p class='error'>数据获取失败，请稍候访问！</p>");
        }
    })
}

function getSubClass(id,subcurrid){
    if(id == 0) return;
    var objSubWrap = $('#sub_navWrap');
    var url = masterDomain + "/include/ajax.php?service=article&action=type&type="+id;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "jsonp",
        success: function (data) {

            if(data && data.state != 200){
                if(data.state == 102){
                    setNavH();
                    // objSubWrap.html("").hide();
                }else{
                    var list = data.info,html = [];
                    for(var i = 0;i < list.length;i++) {
                        var cls = parseInt(list[i]['id']) == subcurrid ? 'item curr' : 'item';
                        html.push('<div class="' + cls + '" data-id="' + list[i]['id'] + '"><a href="javascript:;">' + list[i]['typename'] + '</a></div>')
                    }
                    var n = $('.sub_navbox').length;
                    objSubWrap.append('<div class="sub_navbox" id="sub_navbox_' + n + '">' + html.join("") + '</div>').show();
                    $('#nav_item_' + id).addClass('have_sub');
                    setNavH();
                }
            } else {
                setNavH();
            }
        },
        error: function(){
            setNavH();
        }
    })
}

function setNavH(){
    var n = $('.sub_navbox').length;
    $('.nav').height(0.88 + 0.88 * n + 'rem');
}

var animt;
function animatScrollLeft(o,v,t) {
    clearTimeout(animt);
    var v = parseInt(v),
        n = parseInt(o.scrollLeft),
        c = v - n,
        s = t == undefined || t == 0 ? c : Math.abs(c) / t * 5;

    animt = setInterval(function(){
        if(Math.abs(v - n) <= s) {
            o.scrollLeft = v;
            clearTimeout(animt);
        } else {
            if(c > 0) {
                n = n + s < v ? n + s : v;
            } else {
                n = n - s > v ? n - s : v;
            }
                o.scrollLeft = n;
        }
    },1)
}

function toggleNav(type){
    var nav = $('.nav'),p = $('.navbox');
    if($('.nav').hasClass('showmore') || type == 3) {
        nav.removeClass('showmore');
        p.attr('data-type','close').height('.82rem');
        $('#sub_navWrap').show();
    } else {
        nav.addClass('showmore');
        var h = $('#nav_list').height();
        var item = $('#nav_list .item');
        var _h = item.height();
        var row = h / _h;
        var num = item.length;
        var h_rem = h / wFsize;
        if(!(row % num)) {
            var rowh = _h / wFsize;
            p.css('padding-bottom',rowh + 'rem');
            h_rem += rowh;
        }
        p.attr('data-type','open').height(h_rem + 'rem');
        $('#sub_navWrap').hide();
    }
}


var device = navigator.userAgent;
if (device.indexOf('huoniao_iOS') > -1) {
  $('.navfixbox').addClass('padTop20');
}

$(function(){

    var dataInfo = {};

    var detailList;
    setTimeout(function(){detailList = new h5DetailList();}, 300);
    setTimeout(function(){detailList.removeLocalStorage();}, 800);

    $('#maincontent').delegate('.m_item', 'click', function(){
        var t = $(this), a = t.find('a'), url = a.attr('data-url'), page = Number(t.closest('.swrip-panel').attr('data-page')),
            mainHtml = $("#maincontent").html();
        detailList.insertHtmlStr(dataInfo, mainHtml, {lastIndex: (page + 1)});

        setTimeout(function(){location.href = url;}, 500);

    })

    // 滚动图片
    //$('#picscroll').slider();

    // 显示/隐藏全部导航
    $('#btn_toggle').click(function(){
        toggleNav();
        navContainScroll('#nav');
    })
    // 点击一级导航
    $('#nav_list .item').click(function(){
        $(window).scrollTop(0);
        var btn = $(this),
            id = btn.attr('data-id'),
            index = btn.index();

            CLASSID = id;
            showPanelIndex = index;

        if(id==0){
            $('.artbanner').show();
        }else{
            $('.artbanner').hide();
        }

        if($('.nav').hasClass('showmore')){
            toggleNav();
        }
        navContainScroll('#nav',1);

        if(btn.hasClass('curr')) {
            btn.removeClass('open_sub');
            if($('#sub_navbox_0').length == 0) return;
            if($('#sub_navbox_0 .curr').length == 0) return;
            // $('#chanel_' + CLASSID + ' .loading').removeClass('mgsmall');
            // btn.removeClass('open_sub');
        } else {
            btn.addClass('curr').siblings().removeClass('curr');
            pushData(CLASSID,1);
            swripPanelScroll();
        }
        if(btn.hasClass('open_sub')) {
            var level = parseInt(btn.attr('data-open-level'));

            for(var i = 1;i <= level ;i++) {
                var subid = btn.attr('data-sub-'+i);
                if(i == 1) {
                    pushSubClass(CLASSID,subid);
                }
                if(i<level) {
                    pushSubClass(subid,btn.attr('data-sub-'+(i+1)));
                } else {
                    pushSubClass(subid);
                }
            }
        } else {
            // pushData(CLASSID,1,1);
            // 获取子分类
            pushSubClass(CLASSID);
        }
        setNavH();

    })

    // 点击子级导航
    $(document).on('click','.sub_navbox .item',function(){
        $(window).scrollTop(0);
        var btn = $(this);
        if(btn.hasClass('curr')) return;

        $('#chanel_' + CLASSIDArray[showPanelIndex] + ' .loading').removeClass('mgsmall');
        btn.addClass('curr').siblings().removeClass('curr');
        var id = btn.attr('data-id');

        CLASSID = id;
        pushData(id,1);

        var subPar = btn.parent('.sub_navbox'),
            subLeave =  subPar.index(),
            subParId = subPar.attr('id');
        for(var i = subLeave + 1 ; i < $('.sub_navbox').length ; i++) {
            $('.sub_navbox').eq(i).remove();
        }

        var topMenu = $('#nav_item_' + CLASSIDArray[showPanelIndex]),
            openLevel = topMenu.attr('data-open-level') == undefined ? 1 : parseInt(topMenu.attr('data-open-level'));

            openLevel = subLeave + 1 > openLevel ? subLeave + 1 : openLevel

        topMenu.addClass('open_sub').attr('data-sub-' + (subLeave+1),id)
                                    .attr('data-open-level',openLevel)
        // 获取子分类
        pushSubClass(id);

        navContainScroll('#' +subParId);
    })

    //G('picscroll').addEventListener('touchstart',function(e){
        //scrollLock = true;
    //})



    // 上滑下滑导航隐藏
    var upflag = 1, downflag = 1, fixFooter = $(".fixFooter, .navfixbox");
    //scroll滑动,上滑和下滑只执行一次！
    scrollDirect(function (direction) {
      var dom = $('.navfixbox').hasClass('fix');
      if (direction == "down" && dom) {
        if (downflag) {
          fixFooter.hide();
          $('#backTop').hide();
          downflag = 0;
          upflag = 1;
        }
      }
      if (direction == "up") {
        if (upflag) {
          fixFooter.show();
          $('#backTop').show();
          downflag = 1;
          upflag = 0;
        }
      }
    });

})//ready

function addSubNav(btn){
    if(btn.hasClass('open_sub')) {
        var level = parseInt(btn.attr('data-open-level'));

        for(var i = 1;i <= level ;i++) {
            var subid = btn.attr('data-sub-'+i);
            if(i == 1) {
                pushSubClass(CLASSID,subid);
            }
            if(i<level) {
                pushSubClass(subid,btn.attr('data-sub-'+(i+1)));
            } else {
                pushSubClass(subid);
            }
        }
    } else {
        pushData(CLASSID,1,1);
        // 获取子分类
        pushSubClass(CLASSID);
    }
}

var wxconfig_ = $.extend({}, wxconfig);
$(window).on('hashchange', function(){
   var hash = location.hash;
   var id = hash.replace('#','');
   wxconfig.link = wxconfig_.link + hash;
   wxconfig.title = wxconfig_.title.split('-')[0];
   var active = $('.nav [data-id="'+id+'"]');
    if(id != '0'){
        wxconfig.title += '-' + active.text();
    }
   active.click();
}).trigger('hashchange');

$(window).scroll(function(){
    var sct = $(window).scrollTop();
    if(sct + $(window).height() + 50 > $(document).height() && !loadingLock) {
        var CLASSID = CLASSIDArray[showPanelIndex];
        var panel = $('#chanel_' + CLASSID),
            page = parseInt(panel.attr('data-page'));
            totalPage = parseInt(panel.attr('data-totalPage'));
        if(page < totalPage) {
            loadingLock = true;
            getData(CLASSID,++page);
        }
    }
})
