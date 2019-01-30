# About
This script is implemented in imitation of [js-cookie](https://github.com/js-cookie/js-cookie), which is a useful javascript API.

# Installation
1. Download the script [here](https://github.com/maoyonglong/storage.js/blob/master/storage.js).
2. use the command `npm i -d myl-storage.js` in npm.

# Basic Usage
create a storage, specifying the type one of cookie, localStorage and sessionStroage.
```js
var c = storage("cookie"); // cookie
var l = storage("localStorage"); // localStorage 
var s = storage("sessionStorage"); // sessionStorage
```
This script supports some common approaches defined in `storage.prototype`, and now uses cookie storage as an example.
```js
var c = storage("cookie"); // cookie storage
c.set("a", "1"); // set a key-value "a: 1" in cookie
c.get("a"); // get the value of key "a" in cookie
c.remove("a"); // remove the key "a" in cookie
```
Alternatively, you can also use the methods as follow:  
```js
var c = storage("cookie");
c.setItem("a", "1"); // like set method
c.getItem("a", "1"); // like get method
c.removeItem("a"); // like remove method
c.all(); // Returns an object with all key-value pairs in cookie
c.clear(); // clear all key-value pairs in cookie
```
When you using a cookie storage, you can add a object param in set or setItem method to certain the cookie's options, such as path and so on.
```js
var c = storage("cookie");
c.set("a", "1", {
    path: "/"
});
```
# Extension
You can extend or override storage methods by using `extend or override` methods
### common method
Use the following code to change common method defined in `storage.prototype`
```js
storage.prototype.extend("fun", function() {});
storage.prototype.override("fun", function(){});
```
### personal method
Use the following code to change personal method defined in cookie storage, session storage or local storage.
```js
var c = storage("cookie");
c.extend("fun", function(){});
c.override("fun", function(){});
```