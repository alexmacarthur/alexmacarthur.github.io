/**
 * jQuery TypeIt
 * @author Alex MacArthur (http://macarthur.me)
 * @version 1.0.4
 * @copyright 2015 Alex MacArthur
 * @description Types out a given string or strings.
 */

 (function($){

   // the actual jQuery function
   $.fn.typeIt = function(options, callback){
    // now call a callback function
     return this.each(function(){
       $(this).data("typeit", new $.fn.typeIt.typeItClass($(this), options, callback));
     });
   };

   // create the class
   $.fn.typeIt.typeItClass = function(theElement, options, callback){
    // plugin default settings
    this.defaults = {
       whatToType:'This is the default string. Please replace this string with your own.',
       typeSpeed: 200,
       lifeLike: false,
       showCursor: true,
       breakLines: true,
       breakWait: 500,
       delayStart: 250
     };

    this.dataDefaults = {
     whatToType : theElement.data('typeitWhattotype'),
     typeSpeed: theElement.data('typeitSpeed'),
     lifeLike: theElement.data('typeitLifelike'),
     showCursor: theElement.data('typeitShowcursor'),
     breakLines: theElement.data('typeitBreaklines'),
     breakWait: theElement.data('typeitBreakWait'),
     delayStart : theElement.data('typeitDelayStart')
    };

    // the element that holds the text
    this.theElement = theElement;
    // callback function that executes after strings have been printed
    this.callback = callback;
    // the settings for the plugin instance
    this.settings = $.extend({}, this.defaults, options, this.dataDefaults);
    // the number of types a character has been typed for each pass over a string
    this.typeCount = 0;
    // the character number of a string that's currently being deleted
    this.deleteCount = 0;
    // the string number that's currently being typed or deleted
    this.stringCount = 0;

    this.stringPlaceCount = 0;
    // the length of the current string being handled
    this.phraseLength = 0;
    this.cursor = '';
    this.deleteTimeout = null;
    this.typeTimeout = null;
    this.shortenedText = null;

    if(typeof this.callback != 'function'){
      this.callback = function() {
        console.log('This is not a valid function, punk.');
      };
    }

    this.init(theElement);
   };

   // create a new prototype
   var _proto = $.fn.typeIt.typeItClass.prototype;

   // initialize the plugin
   _proto.init = function(theElement){

     this.stringArray = this.settings.whatToType;
     // check if the value is an array or just a string
     if(Object.prototype.toString.call(this.stringArray) !== '[object Array]'){
       // since it's not already an array, turn it into one, since later functionality depends on it being one
       this.stringArray = '["' + this.stringArray + '"]';
       this.stringArray = JSON.parse(this.stringArray);
     }
     this.mergedStrings = this.stringArray.join('');
     this.stringLengths = {};
     this.phraseLength = this.stringLengths[this.stringCount];

     // get the string lengths and save to array, set up ti-containers for each string
     for(j=0; j < this.stringArray.length; j++){
        this.stringLengths[j] = this.stringArray[j].length;
        // set up the number of ti-containers we'll need to hold the strings
        theElement.append('<span class="ti-container"><span class="ti-text-container ti-cursor"></span></span>');
     }

      // add .active-container to the first .ti-text-container so the cursor starts blinking before a string is printed
      theElement.find('.ti-container:first-child').find('.ti-text-container').addClass('active-container');

     // if breakLines is false, then we for sure only need ONE ti-container even if there multiple strings, so make sure of that
     if(this.settings.breakLines === false) {
        theElement.find('.ti-container').remove();
        theElement.append('<span class="ti-container"><span class="ti-text-container ti-cursor"></span></span>');
     }

     // if showCursor is false, then remove the ti-cursor class
     if(this.settings.showCursor === false) {
      $(this.theElement).find('.ti-text-container').removeClass('ti-cursor');
     }

      // start to type the string(s)
      setTimeout(function() {
        this.typeLoop();
      }.bind(this), this.settings.delayStart);

   };

   _proto.typeLoop = function(){

    // set the length of the current phrase being typed
    this.phraseLength = this.stringLengths[this.stringCount];

     // make it human-like if specified in the settings
    if(this.settings.lifeLike === true){
      this.delayTime = this.settings.typeSpeed*Math.random();
    } else {
      this.delayTime = this.settings.typeSpeed;
    }

    this.typeTimeout = setTimeout(function () {

      // append the string of letters to the respective .ti-text-container
      var characterToAppend = this.mergedStrings[this.typeCount+this.stringPlaceCount];

      // if breakLines is set to true, add the 'active-container' class to the next .ti-text-container in the list.
      if(this.settings.breakLines === true) {
        $(this.theElement).find('.ti-text-container:eq('+ this.stringCount +')').addClass('active-container').append(characterToAppend);
      } else {
        $(this.theElement).find('.ti-text-container').addClass('active-container').append(characterToAppend);
      }

      this.typeCount++;
      // if there are still characters to be typed, call the same function again
      if (this.typeCount < this.phraseLength) {
        this.typeLoop(this.stringLengths[this.stringCount]);
        // if there are no more characters to print and there is more than one string to be typed, delete the string just printed
      } else if(this.stringArray.length > 1) {
        // update the this.stringPlaceCount so that we're appending starting at the correct spot in the merged string
        this.stringPlaceCount = this.stringPlaceCount + this.phraseLength;
        // reset this.typeCount in case this function needs to be reused
        this.typeCount = 0;

          // if the stringCount is the same as the number of strings we started with, we're done, so call the callback function
        if(this.stringCount+1 === this.stringArray.length) {
          this.callback();
          // if we're not on the last string, then move on to to delete, unless the user wants to break lines
        } else if((this.stringCount+1 < this.stringArray.length) && this.settings.breakLines === false){

          setTimeout(function(){
            this.deleteLoop();
          }.bind(this), this.settings.breakWait);

        // if breakLines is true and we still have strings left to type, break it and continue
        } else if (this.stringCount+1 < this.stringArray.length && this.settings.breakLines === true){
          this.stringCount++;

          setTimeout(function(){

            // remove any 'active-container' classes fromt the elements
            $(this.theElement).find('.ti-text-container').removeClass('active-container');

            // give 'active-container' class to next container, so the cursor can start blinking
            $(this.theElement).find('.ti-text-container:eq('+ this.stringCount +')').addClass('active-container');

            // after another slight delay, continue typing the next string
            setTimeout(function(){
              this.typeLoop();
            }.bind(this), this.settings.breakWait);

          }.bind(this), this.settings.breakWait);

        }

        // since there are no more strings to be typed, we're done and can call the callback function
      } else {
        this.callback();
      }
    }.bind(this), this.delayTime);

   };

   _proto.deleteLoop = function() {

    this.deleteTimeout = setTimeout(function () {

      // get the string from the element and cut it by one character at the end
      shortenedText = $(this.theElement).find('.ti-text-container').text().substring(0, $(this.theElement).find('.ti-text-container').text().length - 1);

      // then, put that shortened text into the element so it looks like it's being deleted
      $(this.theElement).find('.ti-text-container').text(shortenedText);

       this.deleteCount++;
        // if there are still characters in the string, run the function again
       if (this.deleteCount < this.phraseLength) {
         this.deleteLoop();
        // if there are still strings in the array, go back to typing.
       } else if(this.stringArray[this.stringCount+1] !== undefined){
         this.deleteCount = 0;
         this.stringCount++;
         this.typeLoop();
       }
       // make backspacing much quicker by dividing delayTime (arbitrarily) by three
     }.bind(this), this.delayTime/3);
   };

  // stop the plugin from typing or deleting stuff whenever it's called
   _proto.stopTyping = function() {
      clearTimeout(this.typeTimeout);
      clearTimeout(this.deleteTimeout);
   };

 }(jQuery));

/*!
 * jQuery Scrollify
 * Version 0.1.11
 *
 * Requires:
 * - jQuery 1.6 or higher
 *
 * https://github.com/lukehaas/Scrollify
 *
 * Copyright 2015, Luke Haas
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function ($,window,document,undefined) {
	"use strict";
	var heights = [],
		names = [],
		elements = [],
		overflow = [],
		index = 0,
		interstitialIndex = 1,
		currentHash = window.location.hash,
		hasLocation = false,
		timeoutId,
		timeoutId2,
		top = $(window).scrollTop(),
		scrollable = false,
		locked = false,
		scrolled = false,
		manualScroll,
		swipeScroll,
		util,
		disabled = false,
		scrollSamples = [],
		scrollTime = new Date().getTime(),
		settings = {
			//section should be an identifier that is the same for each section
			section: "section",
			sectionName: "section-name",
			easing: "easeOutExpo",
			scrollSpeed: 1100,
			offset : 0,
			scrollbars: true,
			axis:"y",
			target:"html,body",
			before:function() {},
			after:function() {},
			afterResize:function() {}
		};
	function animateScroll(index,instant) {
		if(disabled===true) {
			return true;
		}
		if(names[index]) {
			settings.before(index,elements);
			interstitialIndex = 1;
			if(settings.sectionName) {
				window.location.hash = names[index];
			}
			if(instant) {
				$(settings.target).stop().scrollTop(heights[index]);
				settings.after(index,elements);
			} else {
				$(settings.target).stop().animate({
					scrollTop: heights[index]
				}, settings.scrollSpeed,settings.easing);
				
				$(settings.target).promise().done(function(){locked = false;settings.after(index,elements);});
			}

		}
	}

	function isAccelerating(samples) {

        if(samples<4) {
        	return false;
        }
        var limit = 20,sum = 0,i = samples.length-1,l;
        if(samples.length<limit*2) {
        	limit = Math.floor(samples.length/2);
        }
        l = samples.length-limit;
        for(;i>=l;i--) {
        	sum = sum+samples[i];
        }
        var average1 = sum/limit;

        sum = 0;
        i = samples.length-limit-1;
        l = samples.length-(limit*2);
        for(;i>=l;i--) {
        	sum = sum+samples[i];
        }
        var average2 = sum/limit;

        if(average1>=average2) {
        	return true;
        } else {
        	return false;
        }
	}
	$.scrollify = function(options) {
		$.easing['easeOutExpo'] = function(x, t, b, c, d) {
			return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
		};
		

		manualScroll = {
			handleMousedown:function() {
				if(disabled===true) {
					return true;
				}
				scrollable = false;
				scrolled = false;
			},
			handleMouseup:function() {
				if(disabled===true) {
					return true;
				}
				scrollable = true;
				if(scrolled) {
					manualScroll.calculateNearest();
				}
			},
			handleScroll:function() {
				if(disabled===true) {
					return true;
				}
				if(timeoutId){
					clearTimeout(timeoutId);  
				}
				timeoutId = setTimeout(function(){
						
					scrolled = true;
					if(scrollable===false) {
						return false;
					}
					scrollable = false;
					manualScroll.calculateNearest();

				}, 200);
			},
			calculateNearest:function() {
				top = $(window).scrollTop();
				var i =1,
					max = heights.length,
					closest = 0,
					prev = Math.abs(heights[0] - top),
					diff;
				for(;i<max;i++) {
					diff = Math.abs(heights[i] - top);
					
					if(diff < prev) {
						prev = diff;
						closest = i;
					}
				}
				if(atBottom() || atTop()) {
					index = closest;
					animateScroll(closest,false);
				}
			},
			wheelHandler:function(e,delta) {
				if(disabled===true) {
					return true;
				}
				if(!overflow[index]) {
					e.preventDefault();
				}
				var currentScrollTime = new Date().getTime();
				delta = delta || -e.originalEvent.detail / 3 || e.originalEvent.wheelDelta / 120;

				
				if((currentScrollTime-scrollTime) > 1300){
					scrollSamples = [];
				}
				scrollTime = currentScrollTime;

				if(scrollSamples.length >= 35){
					scrollSamples.shift();
				}
				scrollSamples.push(Math.abs(delta*10));

				if(locked) {
					return false;
				}

				if(delta<0) {
					if(index<heights.length-1) {
						if(atBottom()) {
							if(isAccelerating(scrollSamples)) {
								e.preventDefault();
								index++;
								locked = true;
								animateScroll(index,false);
							} else {
								return false;
							}
						}
					}
				} else if(delta>0) {
					if(index>0) {
						if(atTop()) {
							if(isAccelerating(scrollSamples)) {
								e.preventDefault();
								index--;
								locked = true;
								animateScroll(index,false);
							} else {
								return false
							}
						}
					}
				}

			},
			keyHandler:function(e) {
				if(disabled===true) {
					return true;
				}
				if(e.keyCode==38) {
					if(index>0) {
						if(atTop()) {
							index--;
							animateScroll(index,false);
						}
					}
				} else if(e.keyCode==40) {
					if(index<heights.length-1) {
						if(atBottom()) {
							index++;
							animateScroll(index,false);
						}
					}
				}
			},
			init:function() {
				if(settings.scrollbars) {
					$(window).bind('mousedown', manualScroll.handleMousedown);
					$(window).bind('mouseup', manualScroll.handleMouseup);
					$(window).bind('scroll', manualScroll.handleScroll);
				} else {
					$("body").css({"overflow":"hidden"});
				}
				
				$(document).bind('DOMMouseScroll mousewheel',manualScroll.wheelHandler);
				$(document).bind('keydown', manualScroll.keyHandler);
			}
		};
		
		swipeScroll = {
			touches : {
				"touchstart": {"y":-1}, 
				"touchmove" : {"y":-1},
				"touchend"  : false,
				"direction" : "undetermined"
			},
			options:{
				"distance" : 30,
				"timeGap" : 800,
				"timeStamp" : new Date().getTime()
			},
			touchHandler: function(event) {
				if(disabled===true) {
					return true;
				}
				var touch;
				if (typeof event !== 'undefined'){	
					if (typeof event.touches !== 'undefined') {
						touch = event.touches[0];
						switch (event.type) {
							case 'touchstart':
								swipeScroll.touches.touchstart.y = touch.pageY;
								swipeScroll.touches.touchmove.y = -1;

								swipeScroll.options.timeStamp = new Date().getTime();
								swipeScroll.touches.touchend = false;
							case 'touchmove':
								swipeScroll.touches.touchmove.y = touch.pageY;
								if(swipeScroll.touches.touchstart.y!==swipeScroll.touches.touchmove.y) {
									//if(!overflow[index]) {
										event.preventDefault();
									//}
									if((swipeScroll.options.timeStamp+swipeScroll.options.timeGap)<(new Date().getTime()) && swipeScroll.touches.touchend == false) {
										
										swipeScroll.touches.touchend = true;
										if (swipeScroll.touches.touchstart.y > -1) {

											if(Math.abs(swipeScroll.touches.touchmove.y-swipeScroll.touches.touchstart.y)>swipeScroll.options.distance) {
												if(swipeScroll.touches.touchstart.y < swipeScroll.touches.touchmove.y) {
													
													swipeScroll.up();

												} else {
													swipeScroll.down();
													
												}
											}
										}
									}
								}
								break;
							case 'touchend':
								if(swipeScroll.touches[event.type]===false) {
									swipeScroll.touches[event.type] = true;
									if (swipeScroll.touches.touchstart.y > -1 && swipeScroll.touches.touchmove.y > -1) {

										if(Math.abs(swipeScroll.touches.touchmove.y-swipeScroll.touches.touchstart.y)>swipeScroll.options.distance) {
											if(swipeScroll.touches.touchstart.y < swipeScroll.touches.touchmove.y) {
												swipeScroll.up();
												
											} else {
												swipeScroll.down();
												
											}
										}
										swipeScroll.touches.touchstart.y = -1;
									}
								}
							default:
								break;
						}
					}
				}
			},
			down: function() {
				if(index<=heights.length-1) {
					if(atBottom() && index<heights.length-1) {
						
						index++;
						animateScroll(index,false);
					} else {
						if(Math.floor(elements[index].height()/$(window).height())>interstitialIndex) {

							interstitialScroll(parseInt(heights[index])+($(window).height()*interstitialIndex));
							interstitialIndex += 1;

						} else {
							interstitialScroll(parseInt(heights[index])+(elements[index].height()-$(window).height()));
						}
						
					}
				}
			},
			up: function() {
				if(index>=0) {
					if(atTop() && index>0) {
						
						index--;
						animateScroll(index,false);
					} else {
						
						if(interstitialIndex>2) {

							interstitialIndex -= 1;
							interstitialScroll(parseInt(heights[index])+($(window).height()*interstitialIndex));
							
						} else {

							interstitialIndex = 1;
							interstitialScroll(parseInt(heights[index]));
						}
					}

				}
			},
			init: function() {
				if (document.addEventListener) {
					document.addEventListener('touchstart', swipeScroll.touchHandler, false);	
					document.addEventListener('touchmove', swipeScroll.touchHandler, false);	
					document.addEventListener('touchend', swipeScroll.touchHandler, false);
				}
			}
		};


		util = {
			handleResize:function() {
				clearTimeout(timeoutId2);
				timeoutId2 = setTimeout(function() {
					sizePanels();
					calculatePositions(true);
					settings.afterResize();
				},50);
			}
		};

		settings = $.extend(settings, options);
		
		sizePanels();

		calculatePositions(false);


		if(hasLocation===false && settings.sectionName) {
			window.location.hash = names[0];
		} else {
			animateScroll(index,false);
		}
		
		manualScroll.init();
		swipeScroll.init();

		$(window).bind("resize",util.handleResize);
		window.addEventListener("orientationchange", util.handleResize, false);

		function interstitialScroll(pos) {
			$(settings.target).stop().animate({
				scrollTop: pos
			}, settings.scrollSpeed,settings.easing);
		}

		function sizePanels() {
			$(settings.section).each(function(i) {
				if($(this).css("height","auto").outerHeight()<$(window).height()) {
					$(this).css({"height":$(window).height()});
					overflow[i] = false;
				} else {
					$(this).css({"height":$(this).height()});
					overflow[i] = true;
				}
			});
		}
		function calculatePositions(resize) {
			$(settings.section).each(function(i){
				if(i>0) {
					heights[i] = parseInt($(this).offset().top) + settings.offset;
				} else {
					heights[i] = parseInt($(this).offset().top);
				}
				if(settings.sectionName && $(this).data(settings.sectionName)) {
					names[i] = "#" + $(this).data(settings.sectionName).replace(/ /g,"-");
				} else {
					names[i] = "#" + (i + 1);
				}
				
				
				elements[i] = $(this);

				if(window.location.hash===names[i]) {
					index = i;
					hasLocation = true;
				}
			});
			

			if(true===resize) {
				animateScroll(index,false);
			}
		}

		function atTop() {
			top = $(window).scrollTop();
			if(top>parseInt(heights[index])) {
				return false;
			} else {
				return true;
			}
		}
		function atBottom() {
			top = $(window).scrollTop();
			if(top<parseInt(heights[index])+(elements[index].height()-$(window).height())) {
				return false;
			} else {
				return true;
			}
		}
	}

	function move(panel,instant) {
		var z = names.length;
		for(;z>=0;z--) {
			if(typeof panel === 'string') {
				if (names[z]===panel) {
					index = z;
					animateScroll(z,instant);
				}
			} else {
				if(z===panel) {
					index = z;
					animateScroll(z,instant);
				}
			}
		}
	}
	$.scrollify.move = function(panel) {
		if(panel===undefined) {
			return false;
		}
		move(panel,false);
	};
	$.scrollify.instantMove = function(panel) {
		if(panel===undefined) {
			return false;
		}
		move(panel,true);
	};
	$.scrollify.next = function() {
		if(index<names.length) {
			index += 1;
			animateScroll(index,false);
		}
	};
	$.scrollify.previous = function() {
		if(index>0) {
			index -= 1;
			animateScroll(index,false);
		}
	};
	$.scrollify.instantNext = function() {
		if(index<names.length) {
			index += 1;
			animateScroll(index,true);
		}
	};
	$.scrollify.instantPrevious = function() {
		if(index>0) {
			index -= 1;
			animateScroll(index,true);
		}
	};
	$.scrollify.destroy = function() {
		$(settings.section).each(function() {
			$(this).css("height","auto");
		});
		$(window).unbind("resize",util.handleResize);
		if(settings.scrollbars) {
			$(window).unbind('mousedown', manualScroll.handleMousedown);
			$(window).unbind('mouseup', manualScroll.handleMouseup);
			$(window).unbind('scroll', manualScroll.handleScroll);
		}
		$(document).unbind('DOMMouseScroll mousewheel',manualScroll.wheelHandler);
		$(document).unbind('keydown', manualScroll.keyHandler);

		if (document.addEventListener) {
			document.removeEventListener('touchstart', swipeScroll.touchHandler, false);	
			document.removeEventListener('touchmove', swipeScroll.touchHandler, false);	
			document.removeEventListener('touchend', swipeScroll.touchHandler, false);
		}
		heights = [];
		names = [];
		elements = [];
		overflow = [];
	};
	$.scrollify.update = function() {
		util.handleResize();
	};
	$.scrollify.current = function() {
		return elements[index];
	};
	$.scrollify.disable = function() {
		disabled = true;
	};
	$.scrollify.enable = function() {
		disabled = false;
	};
	$.scrollify.isDisabled = function() {
		return disabled;
	};
}(jQuery,this,document));
/* jQuery.fracs 0.15.1 - http://larsjung.de/jquery-fracs/ */
!function(){"use strict";function t(t,n){return typeof t===n}function n(t,n){return t instanceof n}function i(t){return t&&t.nodeType}function e(t){return i(t)?t:n(t,m)?t[0]:void 0}function o(t,n,i){return m.each(t,function(t,e){i=n.call(e,i,t,e)}),i}function r(t,n,i){var e,o,r;if(t===n)return!0;if(!t||!n||t.constructor!==n.constructor)return!1;for(e=0,o=i.length;o>e;e+=1){if(r=i[e],t[r]&&k(t[r].equals)&&!t[r].equals(n[r]))return!1;if(t[r]!==n[r])return!1}return!0}function s(t,n,i,e){this.left=x(t),this.top=x(n),this.width=x(i),this.height=x(e),this.right=this.left+this.width,this.bottom=this.top+this.height}function h(t,n,i,e){this.visible=t||0,this.viewport=n||0,this.possible=i||0,this.rects=e&&y({},e)||null}function l(t,n){this.els=t,this.viewport=n}function c(t,n,i){var e;return m.inArray(i,S)>=0?e=s.ofElement(t):m.inArray(i,C)>=0&&(e=h.of(t,n)),e?e[i]:0}function u(t,n){return t.val-n.val}function a(t,n){return n.val-t.val}function f(t){var n=s.ofContent(t,!0),i=s.ofViewport(t,!0),e=n.width-i.width,o=n.height-i.height;this.content=n,this.viewport=i,this.width=0>=e?null:i.left/e,this.height=0>=o?null:i.top/o,this.left=i.left,this.top=i.top,this.right=n.right-i.right,this.bottom=n.bottom-i.bottom}function p(t){this.el=t||window}function d(t,n){this.context=t,this.viewport=n,this.init()}function v(t,n,i,e){this.context=new l(t,n),this.property=i,this.descending=e,this.init()}function w(t){t&&t!==window&&t!==document?(this.context=t,this.$autoTarget=m(t)):this.context=window,this.init()}function g(t,n){function i(n,i,e,o){return e=h(e)?e.apply(n,i):e,h(o[e])?o[e].apply(n,i):void r.error('Method "'+e+'" does not exist on jQuery.'+t)}function e(t){t&&(s(c,t.statics),s(u,t.methods)),c.modplug=e}var o=[].slice,r=jQuery,s=r.extend,h=r.isFunction,l=s({},n),c=function a(){return i(this,o.call(arguments),l.defaultStatic,a)},u=function f(t){return h(f[t])?f[t].apply(this,o.call(arguments,1)):i(this,o.call(arguments),l.defaultMethod,f)};e.prev={statics:r[t],methods:r.fn[t]},e(n),r[t]=c,r.fn[t]=u}var m=jQuery,b=m(window),T=m(document),y=m.extend,k=m.isFunction,V=Math.max,E=Math.min,x=Math.round,q=function(){var t={},n=1;return function(i){return i?(t[i]||(t[i]=n,n+=1),t[i]):0}}();y(s.prototype,{equals:function(t){return r(this,t,["left","top","width","height"])},area:function(){return this.width*this.height},relativeTo:function(t){return new s(this.left-t.left,this.top-t.top,this.width,this.height)},intersection:function(t){if(!n(t,s))return null;var i=V(this.left,t.left),e=E(this.right,t.right),o=V(this.top,t.top),r=E(this.bottom,t.bottom),h=e-i,l=r-o;return h>=0&&l>=0?new s(i,o,h,l):null},envelope:function(t){if(!n(t,s))return this;var i=E(this.left,t.left),e=V(this.right,t.right),o=E(this.top,t.top),r=V(this.bottom,t.bottom),h=e-i,l=r-o;return new s(i,o,h,l)}}),y(s,{ofContent:function(t,n){return t&&t!==document&&t!==window?n?new s(0,0,t.scrollWidth,t.scrollHeight):new s(t.offsetLeft-t.scrollLeft,t.offsetTop-t.scrollTop,t.scrollWidth,t.scrollHeight):new s(0,0,T.width(),T.height())},ofViewport:function(t,n){return t&&t!==document&&t!==window?n?new s(t.scrollLeft,t.scrollTop,t.clientWidth,t.clientHeight):new s(t.offsetLeft,t.offsetTop,t.clientWidth,t.clientHeight):new s(b.scrollLeft(),b.scrollTop(),b.width(),b.height())},ofElement:function(t){var n=m(t);if(!n.is(":visible"))return null;var i=n.offset();return new s(i.left,i.top,n.outerWidth(),n.outerHeight())}}),y(h.prototype,{equals:function(t){return this.fracsEqual(t)&&this.rectsEqual(t)},fracsEqual:function(t){return r(this,t,["visible","viewport","possible"])},rectsEqual:function(t){return r(this.rects,t.rects,["document","element","viewport"])}}),y(h,{of:function(t,n){var e,o,r;return t=i(t)&&s.ofElement(t)||t,n=i(n)&&s.ofViewport(n)||n||s.ofViewport(),t instanceof s&&(e=t.intersection(n))?(o=e.area(),r=E(t.width,n.width)*E(t.height,n.height),new h(o/t.area(),o/n.area(),o/r,{document:e,element:e.relativeTo(t),viewport:e.relativeTo(n)})):new h}});var S=["width","height","left","right","top","bottom"],C=["possible","visible","viewport"];y(l.prototype,{sorted:function(t,n){var i=this.viewport;return m.map(this.els,function(n){return{el:n,val:c(n,i,t)}}).sort(n?a:u)},best:function(t,n){return this.els.length?this.sorted(t,n)[0]:null}}),y(f.prototype,{equals:function(t){return r(this,t,["width","height","left","top","right","bottom","content","viewport"])}}),y(p.prototype,{equals:function(t){return r(this,t,["el"])},scrollState:function(){return new f(this.el)},scrollTo:function(t,n,i){var e=m(this.el===window?"html,body":this.el);t=t||0,n=n||0,i=isNaN(i)?1e3:i,e.stop(!0).animate({scrollLeft:t,scrollTop:n},i)},scroll:function(t,n,i){var e=this.el===window?b:m(this.el);t=t||0,n=n||0,this.scrollTo(e.scrollLeft()+t,e.scrollTop()+n,i)},scrollToRect:function(t,n,i,e){n=n||0,i=i||0,this.scrollTo(t.left-n,t.top-i,e)},scrollToElement:function(t,n,i,e){var o=s.ofElement(t).relativeTo(s.ofContent(this.el));this.scrollToRect(o,n,i,e)}});var L={init:function(){this.callbacks=m.Callbacks("memory unique"),this.currVal=null,this.prevVal=null,this.checkProxy=m.proxy(this.check,this),this.autoCheck()},bind:function(t){this.callbacks.add(t)},unbind:function(t){t?this.callbacks.remove(t):this.callbacks.empty()},trigger:function(){this.callbacks.fireWith(this.context,[this.currVal,this.prevVal])},check:function(t){var n=this.updatedValue(t);return void 0===n?!1:(this.prevVal=this.currVal,this.currVal=n,this.trigger(),!0)},$autoTarget:b,autoEvents:"load resize scroll",autoCheck:function(t){this.$autoTarget[t===!1?"off":"on"](this.autoEvents,this.checkProxy)}};y(d.prototype,L,{updatedValue:function(){var t=h.of(this.context,this.viewport);return this.currVal&&this.currVal.equals(t)?void 0:t}}),y(v.prototype,L,{updatedValue:function(){var t=this.context.best(this.property,this.descending);return t&&(t=t.val>0?t.el:null,this.currVal!==t)?t:void 0}}),y(w.prototype,L,{updatedValue:function(){var t=new f(this.context);return this.currVal&&this.currVal.equals(t)?void 0:t}});var M="fracs";g(M,{statics:{version:"0.15.1",Rect:s,Fractions:h,Group:l,ScrollState:f,Viewport:p,FracsCallbacks:d,GroupCallbacks:v,ScrollStateCallbacks:w,fracs:function(t,n){return h.of(t,n)}},methods:{content:function(t){return this.length?s.ofContent(this[0],t):null},envelope:function(){return o(this,function(t){var n=s.ofElement(this);return t?t.envelope(n):n})},fracs:function(n,i,o){t(n,"string")||(o=i,i=n,n=null),k(i)||(o=i,i=null),o=e(o);var r=M+".fracs."+q(o);return"unbind"===n?this.each(function(){var t=m(this).data(r);t&&t.unbind(i)}):"check"===n?this.each(function(){var t=m(this).data(r);t&&t.check()}):k(i)?this.each(function(){var t=m(this),n=t.data(r);n||(n=new d(this,o),t.data(r,n)),n.bind(i)}):this.length?h.of(this[0],o):null},intersection:function(){return o(this,function(t){var n=s.ofElement(this);return t?t.intersection(n):n})},max:function(t,n,i){return k(n)||(i=n,n=null),i=e(i),n?(new v(this,i,t,!0).bind(n),this):this.pushStack(new l(this,i).best(t,!0).el)},min:function(t,n,i){return k(n)||(i=n,n=null),i=e(i),n?(new v(this,i,t).bind(n),this):this.pushStack(new l(this,i).best(t).el)},rect:function(){return this.length?s.ofElement(this[0]):null},scrollState:function(n,i){var e=M+".scrollState";return t(n,"string")||(i=n,n=null),"unbind"===n?this.each(function(){var t=m(this).data(e);t&&t.unbind(i)}):"check"===n?this.each(function(){var t=m(this).data(e);t&&t.check()}):k(i)?this.each(function(){var t=m(this),n=t.data(e);n||(n=new w(this),t.data(e,n)),n.bind(i)}):this.length?new f(this[0]):null},scroll:function(t,n,i){return this.each(function(){new p(this).scroll(t,n,i)})},scrollTo:function(t,n,i,o){return m.isNumeric(t)&&(o=i,i=n,n=t,t=null),t=e(t),this.each(function(){t?new p(this).scrollToElement(t,n,i,o):new p(this).scrollTo(n,i,o)})},scrollToThis:function(t,n,i,o){return o=new p(e(o)),o.scrollToElement(this[0],t,n,i),this},softLink:function(t,n,i,o){return o=new p(e(o)),this.filter("a[href^=#]").each(function(){var e=m(this);e.on("click",function(){o.scrollToElement(m(e.attr("href"))[0],t,n,i)})})},sort:function(n,i,o){return t(i,"boolean")||(o=i,i=null),o=e(o),this.pushStack(m.map(new l(this,o).sorted(n,!i),function(t){return t.el}))},viewport:function(t){return this.length?s.ofViewport(this[0],t):null}},defaultStatic:"fracs",defaultMethod:"fracs"})}();

// cached variables
var $window = $(window);
var $top = $('#top');
var $main = $('#main');
var $homeSections = $('.HomeSection', $main);
var viewportHeight = $window.height();
var viewportWidth = $window.width();

$(document).ready(function(){

	// on resize, do stuff
	$window.resize(function(){
		viewportHeight = $window.height();
		viewportWidth = $window.width();
		initScrollify();
	});

	// initialize TypeIt
	initTypeIt();

	// set the color of the appropriate menu item, based on where we are on the page
	initCurrentMenuLink();

	// initialize the portfolio slider
	initSlick();

	// initlize the scroll-snapping plugin
	initScrollify();

	// set up contact form functionality
	initContactForm();

	// set up smooth scrolling
	initSmoothScroll();

});

function initSmoothScroll() {
	$('.SectionsNav-link').click(function(e) {
		e.preventDefault();
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				$('html,body').animate({
				  scrollTop: target.offset().top
				}, 1000);
				return false;
			}
		}
	});
}

function initTypeIt() {
	$('#homeHeader').typeIt({
		typeSpeed: 125,
			whatToType: ["Hi, I'm Alex MacArthur."]
	}, function(){
		$('.SocialNav-item', '.SocialNav').addClass('animation-popup');
	});
}

function initScrollify() {
	// if using desktop/tablet, init scrollify if not already initialized
	if(viewportWidth > 600) {
		if(!$main.hasClass('scrollify-enabled')) {
			$.scrollify({
				section : ".HomeSection",
				sectionName: ""
			});
			$main.addClass('scrollify-enabled');
		}
	// if not already destroyed, destroy it
	} else {
		if($main.hasClass('scrollify-enabled')) {
			$.scrollify.destroy();
			$main.removeClass('scrollify-enabled');
		}
		// set each HomeSection to auto height
		$homeSections.css('height', 'auto');
		// set top HomeSection to explicit height
		$top.css('height', viewportHeight);
	}
}

function initCurrentMenuLink() {
	currentMenuLink();
	$window.scroll(function() {
		currentMenuLink();
	});
}

function initSlick() {
	$('#workList').slick({
		infinite: false,
		slidesToShow: 3,
		slidesToScroll: 3,
		prevArrow: $('#slickPrevious'),
		nextArrow: $('#slickNext'),
		speed: 100,
		easing: 'swing',
		responsive: [
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 2,
			}
		},
		{
			breakpoint: 600,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			}
		},
	]
	});
}

function initContactForm() {
	$('#ContactForm').submit(function(e){
		e.preventDefault();
		var $formName = $('#formName');
		var $formEmail = $('#formEmail');
		var $formMessage = $('#formMessage');
		var $statusMessages = $('#StatusMessages');

		$statusMessages.removeClass('failure success');

		$.ajax({
				url: "//formspree.io/alex@macarthur.me",
				method: "POST",
				data: {
					name: $formName.val(),
					email: $formEmail.val(),
					message: $formMessage.val(),
				},
				dataType: "json"
		}).done(function(response) {
			$formName.val('');
			$formEmail.val('');
			$formMessage.val('');

			$statusMessages.html('Your message was successfully sent! Thanks.').removeClass('failure').addClass('success');
		}).fail(function(data) {
			$statusMessages.html('Sorry, an something\'s messed up. Refresh the page to try again, or just send an email to alex@macarthur.me.').removeClass('success').addClass('failure');
		});
	});
}

function currentMenuLink(){

	var sections = $('.HomeSection');
	var mostVisible = $('#top');
	var mostVisibleID = 'top';

	// grabs each section and checks for most percentage on screen
	$.each(sections, function() {
		mostVisible = $(this).fracs().visible > mostVisible.fracs().visible ? $(this) : mostVisible;
		mostVisibleID = mostVisible.attr('id');
	});

	if(mostVisibleID === 'top') {
		$('.BottomNav').addClass('is-invisible');
	} else {
		$('.BottomNav').removeClass('is-invisible');
	}

	$('.SectionsNav-link').removeClass('active-link');
	$('.SectionsNav-link[href="#' + mostVisibleID + '"]').addClass('active-link');

}
