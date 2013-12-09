(function ($, window, document, undefined) {
    var
        jEvent = $.event,
        addEvent,
        eventName,
        handler,
        normalizeEvent;
    if (document.onwheel !== undefined || document.documentMode > 8) {
        eventName = 'wheel';
        normalizeEvent = function (e) {
            return e;
        };
    } else if (document.onmousewheel !== undefined) {
        eventName = 'mousewheel';
        normalizeEvent = function (e) {
            if (e.wheelDeltaY !== undefined) {
                // for WebKit
                return {
                    deltaX: -e.wheelDeltaX,
                    deltaY: -e.wheelDeltaY,
                    deltaZ: -e.wheelDeltaZ,
                    deltaMode: 0
                };
            }
            // for older IE
            return {
                deltaX: 0,
                deltaY: -e.wheelDelta
                deltaZ: 0,
                deltaMode: 0
            };
        };
    } else {
        // Firefox < 17 only
        eventName = 'DOMMouseScroll';
        normalizeEvent = function (e) {
            return {
                deltaX: 0,
                deltaY: e.detail,
                detaZ: 0,
                deltaMode: 0
            };
        }
    }

    if (jEvent.fixHooks && jEvent.mouseHooks) {
        // fix event object as mouse event
        jEvent.fixHooks[eventName] = jEvent.mouseHooks;
    }
    function handler(e) {
        var eventOrigin = e || window.event,
            evt = jEvent.fix(eventOrigin);
        $.extend(evt, normalizeEvent(eventOrigin));
        evt.type = 'wheel';

        return jEvent.dispatch.call(this, evt);
    }

    jEvent.special.wheel = {
        version: '0.1',
        
        setup: function () {
            if (this.addEventListener) {
                this.addEventListener(eventName, handler, false);
            } else if (this.atachEvent) {
                this.atachEvent('on' + eventName, handler);
            }
        },

        teardown: function () {
            $.removeEvent(this, eventName, handler);
        }
    };
})(jQuery, window, document);