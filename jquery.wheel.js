(function ($, undefined) {
	var eventName,
		normalizeEvent;

	if ( document.onwheel !== undefined || document.documentMode > 8 ) {
		eventName = "wheel";
		normalizeEvent = function ( event, origin ) {
			event.deltaMode = origin.deltaMode;
			event.deltaX = origin.deltaX;
			event.deltaY = origin.deltaY;
			event.deltaZ = origin.deltaZ;
		};
	} else if ( document.onmousewheel !== undefined ) {
		eventName = "mousewheel";
		normalizeEvent = function ( event, origin ) {
			event.deltaMode = 0;

			if ( origin.wheelDeltaY !== undefined ) {
				// for WebKit
				event.deltaX = -origin.wheelDeltaX;
				event.deltaY = -origin.wheelDeltaY;
			} else {
				// for older IE
				event.deltaX = 0;
				event.deltaY = -origin.wheelDelta;
			}
			event.deltaZ = 0;
		};
	} else {
		// firefox zone
		var firefoxMatches = navigator.userAgent.match(/firefox\/(\d+\.?\d*)/i),
			firefoxVersion = firefoxMatches ? +firefoxMatches[1] : 1;
		
		if ( firefoxVersion > 3.5 ) {
			eventName = "MozMousePixelScroll";
			normalizeEvent = function ( event, origin ) {
				event.deltaMode = 0;
				event.deltaZ = 0;
				
				if ( origin.axis === origin.VERTICAL_AXIS ) {
					event.deltaY = origin.detail;
					event.deltaX = 0;
				} else if ( origin.axis === origin.HORIZONTAL_AXIS ) {
					event.deltaX = origin.detail;
					event.deltaY = 0;
				}
			};
		} else {
			eventName = "DOMMouseScroll";
			normalizeEvent = function ( event, origin ) {
				event.deltaMode = 0;
				event.deltaX = 0;
				event.deltaY = origin.detail;
				event.deltaZ = 0;
			}
		}
	}

	if ( $.event.fixHooks && $.event.mouseHooks ) {
		$.event.fixHooks[ eventName ] = $.event.mouseHooks;
	}
	
	$.event.special.wheel = {
		version: "0.2",
		bindType: eventName,
		delegateType: eventName		
	};

	$.event.special[ eventName ] = {
		preDispatch: function ( event ) {
			normalizeEvent( event, event.originalEvent );
			event.type = "wheel";
		}
	};
})( jQuery );
