/**
 * cookie、localStorage、sessionStorage
 */
(function(factory){
    var registeredInModuleLoader;
    // if use AMD
    if(typeof define === "function" && define.amd) {
        define(factory);
        registeredInModuleLoader = true;
    }
    // if use CommonJS
    if(typeof exports === "object") {
        module.exports = factory();
        registeredInModuleLoader = true;
    }
    // if no module loader
    if(!registeredInModuleLoader) {
        var oldStorage = window.storage;
        var api = window.storage = factory();
        
        // if has conflict in namespace, only use the api variable as interface
        api.noConflict = function() {
            window.storage = oldStorage;
            return api;
        };
    }
})(function() {
    var cookie = {};
    var localStorage = window.localStorage;
    var sessionStorage = window.sessionStorage;
    var Storage = window.localStorage.__proto__;

    // cookie methods
    cookie.setItem = function(key, val, options) {
        var key = encodeURIComponent(key);
        var val = encodeURIComponent(val);
        var docCookie = document.cookie;
        var optionArr = [];
        for(var option in options) {
            optionArr.push(option + "=" + options[option]);
        }
        var optionStr = optionArr.join(";");
        if(!docCookie) {
            document.cookie = key + "=" + val + ";" + optionStr;
        }else {
            document.cookie = key + "=" + val + ";" + docCookie + ";" + optionStr;
        }   
    };

    cookie.getItem = function(key) {
        var cookies = document.cookie ? document.cookie.split(";") : [];
        for(var i = 0, len = cookies.length; i < len; i++) {
            var cookie = cookies[i];
            var keyValue = cookie.split("=");
            var enCodeKey = encodeURIComponent(key);
            if(keyValue[0] === enCodeKey) {
                return decodeURIComponent(keyValue[1]);
            }
        }  
        // if get nothing
        return null;
    };

    cookie.removeItem = function(key) {
        var re = new RegExp(encodeURIComponent(key) + "=.*?;");
        document.cookie.replace(re, "");
    };

    cookie.all = function() {
        var cookies = document.cookie ? document.cookie.split(";") : [];
        var result = {};
        for(var i = 0, len = cookies.length; i < len; i++) {
            var keyValue = cookies[i].split("=");
            var key = decodeURIComponent(keyValue[0]);
            var val = decodeURIComponent(keyValue[1]);
            result[key] = val;
        }
        return result;
    };
	
	Storage.all = function() {
        var result = {};
		for(var key in this) {
            if(this.hasOwnProperty(key) && typeof this[key] !== "function" && key !== "length") {
                result[key] = this[key];
            }
        }
        return result;
    };
    

    cookie.clear = function() {
        document.cookie = "";
    };

    function storage(type) {
        if(this.constructor === storage) 
            throw "Error: storage is not a constructor.";
        if(!type) 
            throw "Error: Please specify the type of storage when initialize storage Object.";
        switch(type) {
            case "cookie": return cookie;
            case "localStorage": return localStorage;
            case "sessionStorage": return sessionStorage;
            default: return null;
        }
    };

    // extends storage's prototype
    cookie.__proto__ = Storage.__proto__ = storage.prototype;
    
    // common methods
    var commonMethods = {
        set: "setItem",
        get: "getItem",
        remove: "removeItem"
    }
    for(commonName in commonMethods) {
        (function(specialName){
            storage.prototype[commonName] = function() {
                return this[specialName].apply(this , arguments);
            }
        })(commonMethods[commonName]);
    }

    storage.prototype.extend = function(name, func) {
        // if property existed
        if(this[name] !== undefined) {
            throw "can't override existed property.";
        }else {
            this[name] = func;
        }
    };

    storage.prototype.override = function(name, func) {
        this[name] = func;
    };

    return storage;
});