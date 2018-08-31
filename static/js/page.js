function _getBiggerSettingsObject() {
    var _settings = BIGGER_SETTINGS_BASE;

    // check user custome settings
    var _has__bs = typeof(BIGGER_SETTINGS_APPEND) != "undefined" && $.isPlainObject(BIGGER_SETTINGS_APPEND);
    if (!_has__bs) {
        return _settings;
    }
    // merge user custom settings
    MergeObjectAttrs(_settings, BIGGER_SETTINGS_APPEND);
    return _settings;
}

function detectMaxjaxActions(mathjaxConfig) {
    // insert mathjx only if the pathname is not exclude.
    // mathjaxConfig.exclude: ['/_search', '/_delete', "/_login"]
    //
    var _pathnameFirst = '/' + location.pathname.split('/')[1];
    var isExclued = mathjaxConfig.exclude.indexOf(_pathnameFirst) >= 0;
    if (mathjaxConfig.enable && !isExclued) {
        InsertNewScript(mathjaxConfig.path);
    }
}

function detectAceEditorActions(editorEle, aceConfig) {
    if (!editorEle) {
        return;
    }
    // detect device type
    var is_phone = isMobile.phone;
    var is_tablet = isMobile.tablet;
    var is_seven_inch = isMobile.seven_inch;
    var is_mobile_device = is_phone || is_tablet || is_seven_inch;

    // update summary notice.
    var logMsg = document.getElementById("logMsg");
    logMsg.setAttribute("placeholder", "Edit summary (Briefly describe your changes)")

    if (!is_mobile_device && aceConfig.enable) {
        init_ace_editor(editorEle, aceConfig);
    } else {
        // on mobile page, use the default text area.
        $('#editedText').css('visibility', "visible").css('display', "block");
    }
}

function improveSpecialPages() {
    // import some pages
    var pathname = location.pathname;

    // improve the upload page.
    if (pathname == '/_upload') {
        $("#file").change(function() {
            var fn = $(this).val().replace(/.*\\/, "");
            $("#wikiname").val(fn);
        });
    }

    // set query value to input if on a search result page.
    if (pathname == "/_search") {
        var search_text = getURLParamByName('patterns');
        if (search_text && search_text != "") {
            $('.input-search-form').each(function(idx, item) {
                $(item).val(search_text)
            });
        }
    }
}


function UIUEImprove() {
    // scroll to top button
    var scrollup = $('.scrollup');
    $(scrollup).hide();
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $(scrollup).fadeIn();
        } else {
            $(scrollup).fadeOut();
        }
    });
    $(scrollup).on, ("click", function() {
        $('html, body').animate({
            scrollTop: 0
        }, 100);
        return false;
    });

    // update buttons or inputs into bootstrap style.
    $('input[type="submit"], input[type="button"]').each(function(idx, item) {
        $(item).addClass('btn btn-default btn-sm');
    });

    $('table').each(function(idx, item) {
        $(item).addClass('table table-bordered table-hover')
    });
}


function utilsImprove(biggerConfig) {
    if (biggerConfig.google_analytics_id != "") {
        enableGoogleAnalytics(biggerConfig.google_analytics_id);
    }

    if (biggerConfig.highlightjs.enable) {
        var cssFilePath = "/js/highlight/styles/" + biggerConfig.highlightjs.theme + ".css";
        InsertNewStylesheet(cssFilePath);
        var callback = function() {
            $('pre').each(function(i, block) {
                hljs.highlightBlock(block);
            });
        }
        InsertNewScript("/js/highlight/highlight.pack.js", callback);
    }
    if (biggerConfig.target_blank) {
        $("#content a[href^='http://']").attr("target", "_blank");
    }

}

$(document).ready(function() {
    var editorEle = document.getElementById("editedText"); // get editor text area
    var biggerConfig = _getBiggerSettingsObject();
    var mathjaxConfig = biggerConfig.mathjax;
    var aceConfig = biggerConfig.ace;

    detectMaxjaxActions(mathjaxConfig);
    detectAceEditorActions(editorEle, aceConfig);
    improveSpecialPages();
    UIUEImprove();
    utilsImprove(biggerConfig);
	
    $("a#collapse").click(function(){
        $("div#TOC").slideToggle("slow");
    });
    $("div#TOC").css({"position":"fixed","top":"50px","right":"5px","height":"500px","overflow-y":"auto","display":"none"});
    $("div#editor").css({"height":"1000px"});

// count tag s
String.prototype.endWith=function(oString){  
	var   reg=new   RegExp(oString+"$");  
	return   reg.test(this);     
} 
var current_url = window.location.href;

var $lis = {};
if(current_url.indexOf("_categories") != -1){
	var $lis = $("#content>ul>li");
}else if(current_url.indexOf("_category") != -1){
	var $lis = $("#categoryList>ul>li");
}
// lis which should count
$lis.each(function(){
	var $tmp_li = $(this);
	var tmp_url = $(this).find("a").attr("href");
	if(tmp_url.endWith("_categories")){
		return;
	}
	$.ajax({
		type: "GET"
		,url:tmp_url
		,success:function(result){
			var tmp_div = document.createElement("div");
			var $result_html = $(tmp_div).html(result);
			var $all_count_li = $result_html.find("#content>ul>li");
			var count_span = document.createElement("span");
			count_span.innerHTML = "("+$all_count_li.size()+")";
			$tmp_li.append(count_span);
		}
	});
	
});

// count tag e

// which link to this topic begin
	anchor_source_list = $("a[href^='#']:not(h1 a,h2 a,h3 a,h4 a,#TOC ul li a)");
	title_list = $("h1,h2,h3,h4");
	anchor_source_list.each(function(){
		var tmp_anchor_source = $(this);
		var source_tittle_brather=$(this);
		while(source_tittle_brather!= undefined && source_tittle_brather.prevAll("h1,h2,h3,h4").length == 0){
			source_tittle_brather = source_tittle_brather.parent();
		}
		var anchor_source_title = "";
		if(source_tittle_brather != undefined){
		//   anchor_source_title = source_tittle_brather.prevAll("h1,h2,h3,h4").first();
		   anchor_source_title = source_tittle_brather.prevAll("h1,h2,h3,h4");
		}
		
		var tmp_anchor_to_tittle = title_list.filter(function(){
			var anchor_to_tmp = $(this)
			if("#"+anchor_to_tmp.attr("id") == tmp_anchor_source.attr("href")){
				return true;
			}
			return anchor_to_tmp.children("a").attr("href") == tmp_anchor_source.attr("href");
		});
		//console.log(tmp_anchor_to_tittle);
		if(tmp_anchor_to_tittle.data("a_lists") == undefined){
			tmp_anchor_to_tittle.data("a_lists","");
		}
		//console.log(tmp_anchor_to_tittle.data("a_lists"));
		var a_lists = tmp_anchor_to_tittle.data("a_lists");
		//a_lists += "<li>"+anchor_source_title.html()+"</li>";
		a_lists += "<li><a href='#"+anchor_source_title.attr("id")+"'>"+anchor_source_title.first().html()+"</a></li>";
		tmp_anchor_to_tittle.data("a_lists",a_lists);
		
		
	});
	
	title_list.each(function(){
		
		var ul_element = document.createElement("ul");
		ul_element.innerHTML = $(this).data("a_lists");
		$(this).after(ul_element);
		var span_element = document.createElement("button");
		span_element.innerHTML="+/-";
		$(ul_element).after(span_element);
		
	});
	$("button").prev("ul").css("display","none");
	$("button").click(function(){
	    $(this).prev("ul").slideToggle("slow");
	});
// which link to this topic end

});
