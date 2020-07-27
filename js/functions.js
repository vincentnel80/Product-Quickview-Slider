    function getRandomInt(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    $(function() {
    	$('.product-container').click(function() {
    		//prevent fast clicking
    		if ($(".opening").length > 0) return false;
    		var $this = $(this);
    		var $parent = $this.parent();
    		var imgWidth = getRandomInt(100, 500);
    		var imgHeight = getRandomInt(100, 500);
    		var newContent = '<div class="reply"><img width="' + imgWidth + '" height="' + imgHeight + '" src="http://placehold.it/' + imgWidth + 'x' + imgHeight + '" style="display: inline;" /></div>'
    		var opened = $parent.hasClass("opened");
    		$(".opened").each(function() {
    			close($(this));
    		});
    		if (!opened) open($parent, $(newContent));
    		return false;
    	});
    });

    function open(obj, content) {
    	obj.addClass("opening");
    	//get siblings from same row and get max height of them
    	//this is for showing expanded element on the same row
    	//maybe this can be done easier, but this is a quick win
    	var top = obj.offset().top;
    	var siblings = obj.siblings().filter(function(index) {
    		return $(this).offset().top == top;
    	});
    	siblings.add(obj);
    	var maxHeight = Math.max.apply(null, siblings.map(function() {
    		// get real height or saved one
    		var res = $(this).height();
    		var attr = $(this).attr('oldH');
    		if (typeof attr !== typeof undefined && attr !== false) {
    			res = attr;
    		}
    		return res;
    	}).get());
    	var heightDiff = maxHeight - obj.height();
    	if (heightDiff < 0) heightDiff = 0;
    	//save old height for closing
    	var oldH = obj.height();
    	obj.attr("oldH", oldH);
    	//create wrapper for content div
    	var wrapper = $('<div class="wrapper" />');
    	//set margin for wrapper. Thus every possible content will be on the same line
    	wrapper.css('margin-top', heightDiff + 10);
    	// add pointing triangle and position it
    	var triangle = $('<span class="triangle"></span>');
    	triangle.css('left', obj.position().left + obj.outerWidth(true) / 2 - 10);
    	wrapper.append(triangle);
    	wrapper.append(content);
    	//animate everything for smooth looking resizing
    	wrapper.ready(function() {
    		obj.animate({
    			height: oldH + wrapper.outerHeight(true) + "px"
    		}, 500, function() {
    			obj.removeClass("opening");
    			obj.addClass("opened");
    		});
    		wrapper.show();
    		content.hide();
    		content.slideDown(250, function() {
    			$('html, body').animate({
    				scrollTop: triangle.offset().top - 40
    			}, 250);
    		});
    	});
    	obj.append(wrapper);
    }

    function close(obj) {
    	obj.removeClass("opened");
    	obj.children().last().remove();
    	obj.animate({
    		height: obj.attr("oldH") + "px"
    	}, 500);
    }