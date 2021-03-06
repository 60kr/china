$(function(){
    // 判断浏览器是否是ie8
     if($.browser.msie && parseInt($.browser.version) >= 8){
        $('.app-con .down .con-box:last-child').css('margin-right','0');
        $('.wx-con .c-box:last-child').css('margin-right','0');
    }
    //评论
    var page = 1, pageSize = 10, totalPage = 1;
    var loadmore = $("#leave_message .load_more");

    //表情
    var emot = [];
    for (var i = 1; i < 51; i++) {
        var fi = i < 10 ? "0" + i : i;
        emot.push('<li><a href="javascript:;"><img src="images/ui/i_f'+fi+'.png" /></a></li>');
    }

    // 留言板评论展开
    $('body').delegate('.reply_btn i', "click", function(){
        var x = $(this),
            find = x.closest('.reply').find('.comment_box');
        if (find.css("display") == "block") {
            find.hide();
        }else{
            find.show();
        }
        var name = x.closest(".message_txt").find(".mes_first .name").text();
        find.find(".textarea").attr("placeholder", langData['siteConfig'][6][29]+"：" + name).focus();
    })
    var commonChange = function(t){
        var val = t.text(), maxLength = 200;
        var charLength = val.replace(/<[^>]*>|\s/g, "").replace(/&\w{2,4};/g, "a").length;
        var imglength = t.find('img').length;
        var alllength = charLength + imglength;
        var surp = maxLength - charLength - imglength;
        surp = surp <= 0 ? 0 : surp;

        t.closest('.write').find('em').text(surp);

        if(alllength > maxLength){
            t.text(val.substring(0,maxLength));
            return false;
        }
    // if(alllength > 0){
    //   t.closest('.comment_box').find('.com_btn').css('background','#34bdf6')
    // }else{
    //   t.closest('.comment_box').find('.com_btn').css('background','#d4d4d4')
    // }
    }
    $('body').delegate('.txt', "keyup", function(){
        memerySelection = window.getSelection();
        commonChange($(this));
    })


    // 表情盒子打开关闭
    var memerySelection;
    $('body').delegate('.editor', "click", function(){
        var x = $(this),
            find = x.closest('.comment_foot').find('.face_box');
        if (find.css("display") == "block") {
            find.hide();
            x.removeClass('ed_bc');
        }else{
        memerySelection = window.getSelection();
            find.show();
            x.addClass('ed_bc');
            return false;
        }
    })
    // 选择表情
    $('body').delegate('.face_box ul li', "click", function(){
        var t = $(this).find('img'), textarea = t.closest('.comment_box').find('.textarea'), hfTextObj = textarea;
        hfTextObj.focus();
        pasteHtmlAtCaret('<img src="'+t.attr("src")+'" />');
            commonChange(textarea);
            t.closest(".face_box").hide();
      });

     //根据光标位置插入指定内容
    function pasteHtmlAtCaret(html) {
        var sel, range;
        if (window.getSelection) {
            sel = memerySelection;
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), node, lastNode;
                while ( (node = el.firstChild) ) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if (document.selection && document.selection.type != "Control") {
            document.selection.createRange().pasteHTML(html);
        }
    }
     //光标定位到最后
    function set_focus(el){
        el=el[0];
        el.focus();
        if($.browser.msie){
            var rng;
            el.focus();
            rng = document.selection.createRange();
            rng.moveStart('character', -el.innerText.length);
            var text = rng.text;
            for (var i = 0; i < el.innerText.length; i++) {
                if (el.innerText.substring(0, i + 1) == text.substring(text.length - i - 1, text.length)) {
                    result = i + 1;
                }
            }
        }else{
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }


})