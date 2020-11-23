// SAH Device class
///////////////////////////////////////////////////////////////////////////
SAH.Device = function(data) {
    var _this = this;

    if (typeof data == "object") {
        // call constructor of SAH.Object
        SAH.Object.call(_this, "Devices.Device." + data.Key);
        if (data.Name) {
            _this.loaded = true;
        }
        _this.data = data || {};
        _this.data.Tags = _this.data.Tags.split(" ");
    } else if (typeof data == "string") {
        // call constructor of SAH.Object
        SAH.Object.call(_this, "Devices.Device." + data);
        _this.invoke("get").then(
            function(status, data, errors) {
                _this._loaded = true;
                _this.data = status || {};
            }
        );
    }

    _this.load = function() {
        var deferred = $.Deferred();
        _this.invoke("get").then(
            function(status, data, errors) {
                _this._loaded = true;
                _this.data = status || {};
            }
        );
        return deferred.promise();
    }

    _this.parameters = function() {
        return _this.data;
    }

    _this.parameter = function(key) {
        return _this.data[key];
    }

    _this.name = function() {
        return _this.data.Name;
    }

    _this.key = function() {
        return _this.data.Key;
    }

    _this.containsTag = function(tag) {
        if ($.inArray(tag, _this.data.Tags) != -1) {
            return true;
        }
        return false;
    }

    _this.isActive = function() {
        return _this.data.Active;
    }

    _this.type = function() {
        // first check device type parameter
        if (_this.data.DeviceType != undefined && _this.data.DeviceType.length != 0) {
            return _this.data.DeviceType;
        }
        if (_this.data.DeviceTypes != undefined && _this.data.DeviceTypes.length != 0) {
            return _this.data.DeviceTypes[0].Type;
        }

        if (_this.containsTag("self") == true) {
            if (_this.containsTag("interface") == true) {
                return "Interface";
            }
            if (_this.containsTag("hgw") == true) {
                return "Router";
            }
        }
        return "Computer";
    }

    _this.setActive = function(active) {
        var parameters = {};

        parameters["active"] = active;

        return _this.invoke("setActive", parameters);
    }

    _this.hasTag = function(tag, expression, traverse) {
        var parameters = {};

        parameters["tag"] = tag;
        parameters["expression"] = expression || "";
        parameters["traverse"] = traverse || "this";

        return _this.invoke("hasTag", parameters);
    }
    
    _this.setTag = function(tag, expression, traverse) {
        var parameters = {};

        parameters["tag"] = tag;
        parameters["expression"] = expression || "";
        parameters["traverse"] = traverse || "this";

        return _this.invoke("setTag", parameters);
    }

    _this.clearTag = function(tag, expression, traverse) {
        var parameters = {};

        parameters["tag"] = tag;
        parameters["expression"] = expression || "";
        parameters["traverse"] = traverse || "this";

        return _this.invoke("clearTag", parameters);
    }

    _this.getFirstParameter = function(parameter, expression, traverse) {
        var parameters = {};

        parameters["parameter"] = parameter;
        parameters["expression"] = expression || "";
        parameters["traverse"] = traverse || "this";

        return _this.invoke("getFirstParameter", parameters);
    }

    _this.getParameters = function(parameter, expression, traverse) {
        var parameters = {};

        parameters["parameter"] = parameter;
        parameters["expression"] = expression || "";
        parameters["traverse"] = traverse || "this";

        return _this.invoke("getParameters", parameters);
    }

    _this.topology = function(expression, traverse, flags) {
        var deferred = $.Deferred();
        var parameters = {};

        var buildTree = function(devs) {
            var devices = {};
            for(var i = 0; i < devs.length; i++) {
                var children = devs[i].Children || [];
                devices[devs[i].Key] = new SAH.Device(devs[i]);
                devices[devs[i].Key].Children = buildTree(children);
            }
            return devices;
        }

        parameters["expression"] = expression || "";
        parameters["traverse"] = traverse || "down";
        parameters["flags"] = flags || "";

        _this.invoke("topology", parameters).then(
            function(status, data, errors) {
                var devices = buildTree(status);
                deferred.resolve(devices);
            },
            function(status, data, errors) {
                deferred.reject(errors);
            }
        );
        return deferred.promise();
    }

    _this.isLinkedTo = function(device, traverse) {
        var parameters = {};

        parameters["device"] = device;
        parameters["traverse"] = traverse || "up";

        return _this.invoke("isLinkedTo", parameters);
    }

    _this.setName = function(name, source) {
        var parameters = {};

        parameters["name"] = name;
        parameters["source"] = source || "webui";

        return _this.invoke("setName", parameters);
    }

    _this.delName = function(source) {
        var parameters = {};

        parameters["source"] = source;

        return _this.invoke("removeName", parameters);
    }

    _this.setType = function(type, source) {
        var parameters = {};

        parameters["type"] = type;
        parameters["source"] = source || "webui";

        return _this.invoke("setType", parameters);
    }

    _this.removeType = function(name, source) {
        var parameters = {};

        parameters["type"] = name;
        parameters["source"] = source || "webui";

        return _this.invoke("removeType", parameters);
    }
}

// SAH Device prototype functions
///////////////////////////////////////////////////////////////////////////
// inherit from SAH.Object
SAH.Device.prototype = Object.create(SAH.Object.prototype);

// Devices object (singleton): Device factory
///////////////////////////////////////////////////////////////////////////
SAH.Devices = new SAH.Object("Devices");

SAH.Devices.get = function(expression, flags) {
    var _this = this;
    var deferred = $.Deferred();
    var parameters = {};

    parameters["expression"] = expression || "";
    parameters["flags"] = flags || "";

    _this.invoke("Devices","get",parameters).then(
        function(status, data, errors) {
            var devices = {};
            for(var i = 0; i < status.length; i++) {
                devices[status[i].Key] = new SAH.Device(status[i]);
            }
            deferred.resolve(devices);
        },
        function(status, data, errors) {
            deferred.reject(errors);
        }
    );
    return deferred.promise();
}

SAH.Devices.find = function(expression) {
    var _this = this;
    var deferred = $.Deferred();
    var parameters = {};

    parameters["expression"] = expression || "";

    _this.invoke("Devices","find",parameters).then(
        function(status, data, errors) {
            deferred.resolve(status);
        },
        function(status, data, errors) {
            deferred.reject(errors);
        }
    );
    return deferred.promise();
}

