(function(jQ) {
    var count = 0;

    var style = '\
    .$class {\
	    white-space: nowrap;\
	    box-sizing: border-box;\
	    -moz-transform:$translate($start);\
	    -webkit-transform:$translate($start);	\
	    transform:$translate($start);\
	    -moz-animation: $class $duration linear infinite;\
	    -webkit-animation: $class $duration linear infinite;\
	    animation: $class $duration linear infinite;\
	    display: inline-block;\
	}\
	\
	.$class:hover, .$class.pause {\
	    animation-play-state: paused\
	}\
	\
	/* Make it move */\
	@keyframes $class {\
	    0%   { transform:$translate($start); -moz-transform:$translate($start); -webkit-transform:$translate($start); }\
	    100% { transform:$translate($end); -moz-transform:$translate($end); -webkit-transform:$translate($end);}\
	}\
	@-moz-keyframes $class {\
	    0%   { -moz-transform:$translate($start); }\
	    100% { -moz-transform:$translate($end); }\
	}\
	@-webkit-keyframes $class {\
	    0%   { -webkit-transform:$translate($start); }\
	    100% { -webkit-transform:$translate($end); }\
	}';

    var default_options = {
    	speed: 10,
    	direction: 'left'
    }

    var direction_based_tranform = {
    	left: 'translateX',
    	right: 'translateX',
    	top: 'translateY',
    	bottom: 'translateY',
    }

    var direction_based_calculation = {
    	left: 'width',
    	right: 'width',
    	top: 'height',
    	height: 'height',
    }

    function Marquee(jQElement, options) {
        this.jQElement = jQElement;
        this.options = options;
        this.options.class = 'marquee' + count;
        this.style = style;
        this.style_node = null;
        this.started = false;
        count++;
    }

    Marquee.prototype = {
    	_createStyleNode: function(){
    		var style = document.createElement("style");
			$('head').append(style);
			this.style_node = $(style);
    	},

    	_calcuationByWidth: function(){
    		var marquee = this.jQElement;
			var end_width = marquee.outerWidth();
			var start_width = marquee.parent().outerWidth();
			var animation_end_width = Math.max(end_width , start_width);
			this.options.duration = (animation_end_width * (0.1/this.options.speed)) + 's';
			this.options.translate = direction_based_tranform[this.options.direction];
			if(this.options.direction == 'left'){
				this.options.start = start_width + 'px';
				this.options.end = - end_width + 'px';
			}
			else{
				this.options.start = - start_width + 'px';
				this.options.end = end_width + 'px';
			}
    	},

    	_calcuationByHeight: function(){
    		var marquee = this.jQElement;
			var end_height = marquee.outerHeight();
			var start_height = marquee.parent().outerHeight();
			marquee.parent().css({"overflow": "hidden"});
			var animation_end_height = Math.max(end_height , start_height);
			this.options.duration = (animation_end_height * (0.1/this.options.speed)) + 's';
			this.options.translate = direction_based_tranform[this.options.direction];
			if(this.options.direction == 'top'){
				this.options.start = (start_height + 10) + 'px';
				this.options.end = - (animation_end_height + 10) + 'px';
			}
			else{
				this.options.start = - (start_height + 10) + 'px';
				this.options.end = (animation_end_height + 10) + 'px';
			}
    	},

    	_calculateTranform: function(){
    		if(direction_based_calculation[this.options.direction] == 'width'){
    			this._calcuationByWidth();
    		}
    		else{
    			this._calcuationByHeight();
    		}

    	},

        _buildStyle: function() {
        	this._calculateTranform();
        	for(var key in this.options){
        		this.style = this.style.replace(new RegExp('\\$'+key, 'g'), this.options[key]);
        	}
        },

        _applyStyle: function() {
        	this._createStyleNode();
        	this._buildStyle();
  			this.style_node.append(document.createTextNode(this.style));
  			//this
  			this.jQElement.addClass(this.options.class);
        },

        start: function() {
        	if(!this.started){
	        	this._applyStyle();
	        	this.started = true;
	        }
	        else{
	        	this.jQElement.removeClass('pause');
	        	this.jQElement.addClass(this.options.class);
	        }
        },

        stop: function(){
        	this.jQElement.removeClass(this.options.class);
        },

        pause: function(){
        	this.jQElement.addClass('pause');
        }

    }
    jQ.fn.Css3Marquee = function(dynamic_options){
	    return this.each(function() {
	    	dynamic_options = dynamic_options || {};
	        var jQElement = $(this);
	        var options = $.extend({},
	            default_options, jQElement.data(), dynamic_options);
	        var marquee = new Marquee(jQElement, options);
	        jQElement.data('marquee', marquee);
	        marquee.start();
	    })
	}
})(jQuery || $);
