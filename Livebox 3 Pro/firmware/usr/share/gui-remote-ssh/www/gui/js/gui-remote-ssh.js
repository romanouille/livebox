/*
 * Copyright : (C) 2012 SAGEM Communications - SST
 *
 * This software and source file is the property of Sagem Communications
 * and may not be copied or used without prior written consent.
 *
 * vim: set fileencoding=utf-8
 *
 * This file contains classes to access to the gateway services. Each
 * constructor must redefine the methods for middleware requests.
 *
 * Author  mnasri.wissem@sagem.com
 * Date    12/12/2012
 */

// jQuery namespace (local $ alias!)
(function($, gui) {

    /**
     * @Function checkMACAddress: Check MAC Address
     * 
     * @param divClass:
     * 
     */

        $.widget("ui.rsshprogressbar", {

            _init : function() {

                this.element.progressbar({
                    value : this._value()
                });

                this._refreshValue();

            },

            destroy : function() {

                this.element.progressbar("destroy");

                this.valueDiv.remove();

                $.widget.prototype.destroy.apply(this, arguments);

            },

            _timerInterval : null,

            progress : function() {
                var self = this;
                this._timerInterval = setInterval(function() {

                    var iElapsedMs = new Date() - self.options.duration * self.options.value / 100; // elapsed time in MS 

                    var timeLeftMs = self.options.duration - iElapsedMs; // = leftTime from DM Base

                    iPerc = (timeLeftMs > 0) ? timeLeftMs / self.options.duration * 100 : 0; // percentages 

                    // display current positions and progress 
                    self.options.value = iPerc;

                    self._refreshValue();

                    // in case of Finish 
                    if (iPerc <= 0) {
                        clearInterval(self._timerInterval);
                    }

                }, this.options.interval);
                return this;
            },

            stop : function() {

                clearInterval(this._timerInterval);
                return this;
            },

            _value : function() {
                return this.options.value;
            },

            _refreshValue : function() {
                var value = this._value();
                var progressLabel = this.element.children(".label");
                this.element.progressbar("value", value);
                var timeLeftSec = (value* this.options.duration)/100;
                progressLabel.text(parseInt(timeLeftSec / 60, 10) + "min " + parseInt(timeLeftSec % 60, 10) + "sec");
            }

        });

        $.extend($.ui.rsshprogressbar, {
            version : "0.0.1",
            defaults : {
                value : 100,
                duration : 30*60,
                interval : 100
            }
        });

    })(jQuery);
/*
 * Local variables: tab-width: 4 indent-tabs-mode: nil c-basic-offset: 4 End:
 * vim: fileformat=unix tabstop=4 expandtab shiftwidth=4
 */