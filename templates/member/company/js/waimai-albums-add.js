$(function(){

	//提交发布
	$("#submit").bind("click", function(event){

		event.preventDefault();

		var t = $(this),
			typeid  = $("#typeid").val();

		if(t.hasClass("disabled")) return;

		var offsetTop = 0;

		//验证分类
		if(typeid == "" || typeid == 0){
			var dl = $("#selType");
			dl.find(".tip-inline").removeClass().addClass("tip-inline error").html("<s></s>"+langData['siteConfig'][27][50]);
			offsetTop = offsetTop == 0 ? dl.position().top : offsetTop;
		}

		var imgli = $("#listSection2 li");
		var certs = $("#litpic").val().replace(/\|/g, "||").replace(/,/g, "###");
		$("#litpic").attr("value", certs);

		if(imgli.length <= 0){
			$.dialog.alert(langData['siteConfig'][21][145]);
			return false;
		}

		if(offsetTop){
			$('.main').animate({scrollTop: offsetTop - 5}, 300);
			return false;
		}

		var form = $("#fabuForm"), action = form.attr("action"), url = form.attr("data-url");
		data = form.serialize();

		t.addClass("disabled").html(langData['siteConfig'][6][35]+"...");

		$.ajax({
			url: action,
			data: data,
			type: "POST",
			dataType: "json",
			success: function (data) {
				if(data && data.state == 100){
					var tip = langData['shop'][1][7];
					$.dialog({
						title: langData['siteConfig'][19][287],
						icon: 'success.png',
						content: tip,
						ok: function(){
							location.href = url;
						}
					});
				}else{
					$.dialog.alert(data.info);
					t.removeClass("disabled").html(langData['shop'][1][7]);
					$("#verifycode").click();
				}
			},
			error: function(){
				$.dialog.alert(langData['siteConfig'][20][183]);
				t.removeClass("disabled").html(langData['shop'][1][7]);
				$("#verifycode").click();
			}
		});


	});

});
