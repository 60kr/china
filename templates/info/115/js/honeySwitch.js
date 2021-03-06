var honeySwitch = {};
honeySwitch.themeColor = "rgb(240, 242, 247)";
honeySwitch.init = function() {
	var s = "<em class='slider'></em>";
	$("[class^=switch]").append(s);
	$("[class^=switch]").click(function() {
		if ($(this).hasClass("switch-disabled")) {
			return;
		}
		if ($(this).hasClass("switch-on")) {
			$(this).removeClass("switch-on").addClass("switch-off");
			$(".switch-off").css({
				'border-color' : '#dfdfdf',
				'box-shadow' : '0px 0px 3px 0px rgba(0, 35, 92, 0.09) inset',
				'background-color' : 'rgb(240, 242, 247)'
			});
		} else {
			$(this).removeClass("switch-off").addClass("switch-on");
			if (honeySwitch.themeColor) {
				var c = honeySwitch.themeColor;
				$(this).css({
					'border-color' : c,
					'box-shadow' : c + ' 0px 0px 0px 16px inset',
					'background-color' : c
				});
			}
			if ($(this).attr('themeColor')) {
				var c2 = $(this).attr('themeColor');
				$(this).css({
					'border-color' : c2,
					'box-shadow' : c2 + ' 0px 0px 0px 16px inset',
					'background-color' : c2
				});
			}
		}
	});
	// window.switchEvent = function(ele, on, off) {
	// 	$(ele).click(function() {
	// 		if ($(this).hasClass("switch-disabled")) {
	// 			return;
	// 		}
	// 		if ($(this).hasClass('switch-on')) {
	// 			if ( typeof on == 'function') {
	// 				on();
	// 			}
	// 		} else {
	// 			if ( typeof off == 'function') {
	// 				off();
	// 			}
	// 		}
	// 	});
	// }
	if (this.themeColor) {
		var c = this.themeColor;
		$(".switch-on").css({
			'border-color' : c,
			'box-shadow' : c + ' 0px 0px 0px 16px inset',
			'background-color' : c
		});
		$(".switch-off").css({
			'border-color' : '#dfdfdf',
			'box-shadow' : '0px 0px 3px 0px rgba(0, 35, 92, 0.09) inset',
			'background-color' : 'rgb(240, 242, 247)'
		});
	}
	if ($('[themeColor]').length > 0) {
		$('[themeColor]').each(function() {
			var c = $(this).attr('themeColor') || honeySwitch.themeColor;
			if ($(this).hasClass("switch-on")) {
				$(this).css({
					'border-color' : c,
					'box-shadow' : c + ' 0px 0px 0px 16px inset',
					'background-color' : c
				});
			} else {
				$(".switch-off").css({
					'border-color' : '#dfdfdf',
					'box-shadow' : '0px 0px 3px 0px rgba(0, 35, 92, 0.09) inset',
					'background-color' : 'rgb(240, 242, 247)'
				});
			}
		});
	}
};
honeySwitch.showOn = function(ele) {
	$(ele).removeClass("switch-off").addClass("switch-on");
	if(honeySwitch.themeColor){
		var c = honeySwitch.themeColor;
		$(ele).css({
			'border-color' : c,
			'box-shadow' : c + ' 0px 0px 0px 16px inset',
			'background-color' : c
		});
	}
	if ($(ele).attr('themeColor')) {
		var c2 = $(ele).attr('themeColor');
		$(ele).css({
			'border-color' : c2,
			'box-shadow' : c2 + ' 0px 0px 0px 16px inset',
			'background-color' : c2
		});
	}
}
honeySwitch.showOff = function(ele) {
	$(ele).removeClass("switch-on").addClass("switch-off");
	$(".switch-off").css({
		'border-color' : '#dfdfdf',
		'box-shadow' : '0px 0px 3px 0px rgba(0, 35, 92, 0.09) inset',
		'background-color' : 'rgb(240, 242, 247)'
	});
}
$(function() {
	honeySwitch.init();
}); 