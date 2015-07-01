L.AnimatedMarker = L.Marker.extend({
    options: {
        speed: 200,          // meters / seconds
        autoStart: true,     // animate on add?
        loop: true,          // autorestart reverse animation at end
        waitingLoop: 2000,   // waiting before restart reverse animation
        waitingStart: 1000,  // waiting before first start
        onEnd: function () {
        },
        clickable: true
    },

    initialize: function (latlngs, options) {
        this._originalLatlngs = latlngs;
        this._end = true;
        this.speed = options.speed / 1000; //translate to meters / milliseconds

        var self = this;
        document.addEventListener("visibilitychange", function() {
            if (document.hidden) {
                console.log("hidden stop");
                self.stop();
            } else {
                self.start();
                console.log("hidden start");
            }
        }, false);
        L.Marker.prototype.initialize.call(this, latlngs[0], options);
    },

    handleVisibilityChange: function () {
        if (document.hidden) {
            console.log("hidden stop");
            this.stop();
        } else {
            this.start();
            console.log("hidden start");
        }
    },

    onAdd: function (map) {
        this._map = map;
        this.initevents();
        L.Marker.prototype.onAdd.call(this, map);
        if (this.options.autoStart) { //use ready event
            var self = this;
            setTimeout(function () {
                self.restart(false);
            }, this.options.waitingStart);
        }
    },

    initevents: function () {
        var self = this;

        this._map.on('zoomstart', function () {
            self.stop();
        });

        this._map.on('zoomend', function () {
            self.start();
        });

        this.on("mouseover", function (e) {
            self.stop();
        });

        this.on("mouseout", function (e) {
            self.start();
        });
    },

    restart: function (reverse) {
        if (reverse) {
            this._originalLatlngs.reverse();
        }

        this._latlngs = this._originalLatlngs.slice();
        this._latlngslen = this._originalLatlngs.length;
        this._end = false;
        this._i = 1;
        this.start();
    },

    stop: function () {
        if (this._end)
            return;

        if (this._tid) {
            clearTimeout(this._tid);
            delete this._tid;
        }

        var position = this._icon.getBoundingClientRect();
        var container = this._map._container.getBoundingClientRect();

        var x = position.left - container.left - this._icon.offsetLeft;
        var y = position.top - container.top - this._icon.offsetTop;

        var point = L.point(x, y);
        var latlng = this._map.containerPointToLatLng(point);

        this.stopTransition();
        this.setLatLng(latlng);

        this._i--;
        this._latlngs[this._i - 1] = latlng;
    },

    startTransition: function (timems) {
        if (this._icon) {
            this._icon.style[L.DomUtil.TRANSITION] = 'all ' + timems + 'ms linear';
        }
        if (this._shadow) {
            this._shadow.style[L.DomUtil.TRANSITION] = 'all ' + timems + 'ms linear';
        }
    },

    stopTransition: function () {
        if (this._icon) {
            this._icon.style[L.DomUtil.TRANSITION] = '';
        }
        if (this._shadow) {
            this._shadow.style[L.DomUtil.TRANSITION] = '';
        }
    },

    start: function () {
        if (this._end)
            return;

        var self = this;
        var timems = this._latlngs[this._i - 1].distanceTo(this._latlngs[this._i]) / this.speed;

        this.startTransition(timems);

        // Move to the next vertex
        this.setLatLng(this._latlngs[this._i]);
        if (this._i < (this._latlngslen - 1)) {
            // Queue up the animation to the next vertex
            this._tid = setTimeout(function () {
                self.start();
            }, timems);
        } else {
            // Queue up the end
            if (this.options.loop) {
                this._tid = setTimeout(function () {
                    self._end = true;
                    self.stopTransition();
                    self.restart(true);
                }, timems + this.options.waitingLoop);
            } else {
                this._tid = setTimeout(function () {
                    self._end = true;
                    self.stopTransition();
                    self.options.onEnd.apply(self, Array.prototype.slice.call(arguments));
                }, timems);
            }
        }
        this._i++;
    }
});

L.animatedMarker = function (latlngs, options) {
    return new L.AnimatedMarker(latlngs, options);
};
