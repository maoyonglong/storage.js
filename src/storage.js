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
    // check
    if(typeof window === "undefined") {
        throw "The storage only can be used in frontend.";
    }
    var cookie = {};
    var Storage = window.localStorage.__proto__;
    var localStorage = {};
    var sessionStorage = {};

    localStorage.__proto__ = window.localStorage;
    sessionStorage.__proto__ = window.sessionStorage;

    // tools
    function getStorageFunc(obj) {
        var result = {};
        for(var key in obj) {
            if(!Object.hasOwnProperty(key) && typeof obj[key] === "function") {
                result[key] = obj[key];
            }
        }
        return result;
    }

    function getOwnAttr(obj) {
        var result = {};
        for(var key in obj) {
            if(obj.hasOwnProperty(key) && typeof obj[key] !== "function" && key !== "length") {
                result[key] = obj[key];
            }
        }
        return result;
    };

    function mapMethods(methods, callback) {
        for(var key in methods) {
            (function(key) {
                callback(key, methods[key]);
            })(key);
        }
    }

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

    // link methods to window.localStorage or window.sessionStorage
    var winStorageMethods = getStorageFunc(localStorage);
    mapMethods(winStorageMethods, function(key, method) {
        sessionStorage[key] = localStorage[key] = function() {
            return method.apply(this.__proto__, arguments);
        }
    });
	
	sessionStorage.all = localStorage.all = function() {
        return getOwnAttr(this.__proto__);
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
    mapMethods(commonMethods, function(key, method) {
        storage.prototype[key] = function() {
            return this[method].apply(this, arguments);
        }
    });

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