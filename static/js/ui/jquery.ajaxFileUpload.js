jQuery.extend({
	createUploadIframe: function(d, b) {
		var a = "jUploadFrame" + d;
		var c = '<iframe id="' + a + '" name="' + a + '" style="position:absolute; top:-9999px; left:-9999px"';
		if (window.ActiveXObject) {
			if (typeof b == "boolean") {
				c += ' src="javascript:false"'
			} else {
				if (typeof b == "string") {
					c += ' src="' + b + '"'
				}
			}
		}
		c += " />";
		jQuery(c).appendTo(document.body);
		return jQuery("#" + a).get(0)
	},
	createUploadForm: function(a, j, d) {
		var h = "jUploadForm" + a;
		var c = "jUploadFile" + a;
		var b = jQuery('<form  action="" method="POST" name="' + h + '" id="' + h + '" enctype="multipart/form-data"></form>');
		if (d) {
			for (var e in d) {
				jQuery('<input type="hidden" name="' + e + '" value="' + d[e] + '" />').appendTo(b)
			}
		}
		var f = jQuery("#" + j);
		var g = jQuery(f).clone(true);
		jQuery(f).attr("id", c);
		jQuery(f).before(g);
		jQuery(f).appendTo(b);
		jQuery(b).css("position", "absolute");
		jQuery(b).css("top", "-1200px");
		jQuery(b).css("left", "-1200px");
		jQuery(b).appendTo("body");
		return b
	},
	ajaxFileUpload: function(k) {
		k = jQuery.extend({},
		jQuery.ajaxSettings, k);
		var a = new Date().getTime();
		var b = jQuery.createUploadForm(a, k.fileElementId, (typeof(k.data) == "undefined" ? false: k.data));
		var i = jQuery.createUploadIframe(a, k.secureuri);
		var h = "jUploadFrame" + a;
		var j = "jUploadForm" + a;
		if (k.global && !jQuery.active++) {
			jQuery.event.trigger("ajaxStart")
		}
		var c = false;
		var f = {};
		if (k.global) {
			jQuery.event.trigger("ajaxSend", [f, k])
		}
		var d = function(l) {
			var p = document.getElementById(h);
			try {
				if (p.contentWindow) {
					f.responseText = p.contentWindow.document.body ? p.contentWindow.document.body.innerHTML: null;
					f.responseXML = p.contentWindow.document.XMLDocument ? p.contentWindow.document.XMLDocument: p.contentWindow.document;
					f.responseSearch = p.contentWindow.document.location.search ? p.contentWindow.document.location.search: null
				} else {
					if (p.contentDocument) {
						f.responseText = p.contentDocument.document.body ? p.contentDocument.document.body.innerHTML: null;
						f.responseXML = p.contentDocument.document.XMLDocument ? p.contentDocument.document.XMLDocument: p.contentDocument.document;
						f.responseSearch = p.contentDocument.document.location.search ? p.contentDocument.document.location.search: null
					}
				}
			} catch(o) {
				jQuery.handleError(k, f, null, o)
			}
			if (f || l == "timeout") {
				c = true;
				var m;
				try {
					m = l != "timeout" ? "success": "error";
					if (m != "error") {
						var n = jQuery.uploadHttpData(f, k.dataType);
						if (k.success) {
							k.success(n, m)
						}
						if (k.global) {
							jQuery.event.trigger("ajaxSuccess", [f, k])
						}
					} else {
						jQuery.handleError(k, f, m)
					}
				} catch(o) {
					m = "error";
					jQuery.handleError(k, f, m, o)
				}
				if (k.global) {
					jQuery.event.trigger("ajaxComplete", [f, k])
				}
				if (k.global && !--jQuery.active) {
					jQuery.event.trigger("ajaxStop")
				}
				if (k.complete) {
					k.complete(f, m)
				}
				jQuery(p).unbind();
				setTimeout(function() {
					try {
						jQuery(p).remove();
						jQuery(b).remove()
					} catch(q) {
						jQuery.handleError(k, f, null, q)
					}
				},
				100);
				f = null
			}
		};
		if (k.timeout > 0) {
			setTimeout(function() {
				if (!c) {
					d("timeout")
				}
			},
			k.timeout)
		}
		try {
			var b = jQuery("#" + j);
			jQuery(b).attr("action", k.url);
			jQuery(b).attr("method", "POST");
			jQuery(b).attr("target", h);
			if (b.encoding) {
				jQuery(b).attr("encoding", "multipart/form-data")
			} else {
				jQuery(b).attr("enctype", "multipart/form-data")
			}
			jQuery(b).submit()
		} catch(g) {
			jQuery.handleError(k, f, null, g)
		}
		jQuery("#" + h).load(d);
		return {
			abort: function() {}
		}
	},
	handleError: function(b, d, a, c) {
		if (b.error) {
			b.error.call(b.context || b, d, a, c)
		}
		if (b.global) { (b.context ? jQuery(b.context) : jQuery.event).trigger("ajaxError", [d, b, c])
		}
	},
	uploadHttpData: function(r, type) {
		var data = !type;
		data = type == "xml" || data ? r.responseXML: r.responseText;
		if (type == "json_url") {
			data = {};
			var responseSearch = r.responseSearch;
			var queryStr = responseSearch.substring(1).split("&"),
			oneQueryStr;
			for (var i in queryStr) {
				oneQueryStr = queryStr[i].split("=");
				data[oneQueryStr[0]] = oneQueryStr[1]
			}
		}
		if (type == "script") {
			jQuery.globalEval(data)
		}
		if (type == "json") {
			eval("data = " + data)
		}
		if (type == "html") {
			jQuery("<div>").html(data).evalScripts()
		}
		return data
	}
});