(function ($, document, undefined) {
	var jEvent = $.event,
		addEvent,
		eventName,
		handler,
		normalizeEvent;

	if ( document.onwheel !== undefined || document.documentMode > 8 ) {
		eventName = "wheel";
		normalizeEvent = function (event, eventOrigin) {
			event.deltaMode = eventOrigin.deltaMode;
			event.deltaX = eventOrigin.deltaX;
			event.deltaY = eventOrigin.deltaY;
			event.deltaZ = eventOrigin.deltaZ;
		};
	} else if ( document.onmousewheel !== undefined ) {
		eventName = "mousewheel";
		normalizeEvent = function (event, eventOrigin) {
			event.deltaMode = 0;

			if ( eventOrigin.wheelDeltaY !== undefined ) {
				// for WebKit
				event.deltaX = -e.wheelDeltaX;
				event.deltaY = -e.wheelDeltaY;
				event.deltaZ = -e.wheelDeltaZ;
			} else {
				// for older IE
				event.deltaX = 0;
				event.deltaY = -e.wheelDelta;
				event.deltaZ = 0;
			}
		};
	} else {
		// firefox zone
		var firefoxString = navigator.userAgent.match(/firefox\/\d+\.?\d*/i),
			firefoxVersion = 1;
		
		if ( firefoxString && firefoxString.length ) {
			firefoxVersion = +firefoxString[0].substr(8);
		}
		
		if ( firefoxVersion > 3.5 ) {
			eventName = "MozMousePixelScroll";
			normalizeEvent = function (event, eventOrigin) {
				event.deltaMode = 0;
				event.deltaZ = 0;
				
				if ( eventOrigin.axis === eventOrigin.VERTICAL_AXIS ) {
					event.deltaY = eventOrigin.detail;
					event.deltaX = 0;
				} else if ( eventOrigin.axis === eventOrigin.HORIZONTAL_AXIS ) {
					event.deltaX = eventOrigin.detail;
					event.deltaY = 0;
				}
			};
		} else {
			eventName = "DOMMouseScroll";
			normalizeEvent = function ( event, eventOrigin) {
				event.deltaMode = 0;
				event.deltaX = 0;
				event.deltaY = eventOrigin.detail;
				event.deltaZ = 0;
			}
		}
	}
	
	if ( jEvent.fixHooks && jEvent.mouseHooks ) {
		// fix event object as mouse event
		jEvent.fixHooks[eventName] = jEvent.mouseHooks;
	}
	
	function handler(e) {
		var eventOrigin = e || window.event,
			event = jEvent.fix( eventOrigin );
		
		normalizeEvent( event, eventOrigin );
		event.type = "wheel";
		return jEvent.dispatch.call( this, event );
	}
	
	jEvent.special.wheel = {
		version: "0.1",

		setup: function () {
			if ( this.addEventListener ) {
				this.addEventListener( eventName, handler, false );
			} else if ( this.atachEvent ) {
				this.atachEvent( "on" + eventName, handler );
			}
		},
		
		teardown: function () {
			$.removeEvent( this, eventName, handler );
		}
	};
})( jQuery, document );
