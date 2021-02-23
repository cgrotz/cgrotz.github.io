---
layout: post
title:  "Whenjs On Mozilla Rhino"
date:   2013-06-12 10:13:00 +0200
categories: General js Rhino
type: blog
---
Recently I stumpled up on when.js, a great way of doing concurrency in Javascript with a very easy syntax.

For example, it allows a very easy API for doing asynchronous operations:

```javascript
var when = require("when.js");
function operation (message) {
      var deferred = when.defer();
      setTimeout(function(){
            deferred.resolve(message);
      },1000);
      return deferred.promise;
}

operation('Hello World').then(
  function gotIt(img) {
        console.log(img);
  }
);
```

So I decied to try when.js on Mozilla Rhino and share my findings with you. It was rather simple getting when.js to run on Rhino. All I had to do, was to implement a alternative for setTimeout. After I implemented the Rhino version I decided to also implement a version with dynjs.

In comparision I’m impressed by the cleaner API of dynjs and the usage of invokedynamic.

Further Links: 
* Mozilla Rhino https://developer.mozilla.org/de/docs/Rhino 
* dynjs http://dynjs.org/ 
* Example code of the Rhino version https://github.com/cgrotz/whenjs-rhino-example 
* Example code of the dynjs version https://github.com/cgrotz/whenjs-on-dynjs-example