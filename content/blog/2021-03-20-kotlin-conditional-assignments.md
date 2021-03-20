---
layout: post
title:  "Assigning values in Kotlin with a condition"
description: "Kotlin provides some really beautiful options when assigning values"
date:   2021-03-20 22:13:00 +0200
categories: CleanCode Kotlin
type: blog
---

I wanted to share with you something today, that I find beautiful. It sparks joy in me when seeing it. Of course, beauty is in the eye of the beholder, so you might think differently, and that's okay as well.

Let's take a look at this assignment of a value to a variable. 
```Java
var name = "Bob";

String message;
if(name.equals("Bob")) {
    message = "Hello Bob";
}
else {
    message = "Good Day Sir";
}

System.out.println("Message is: "+message);
```
We all have an assignment like that in our codebase somewhere. Or maybe we have something with a switch-statement.
```Java
var name = "Bob";

String message;
switch(name) {
    case "Bob":
        message = "Hello Bob";
        break;
    default:
        message = "Good Day Sir";
}

System.out.println("Message is: "+message);
```

Why is this a bad style? The whole style is verbose and invites to add additional code into the if and switch-statement. It's not easily apparent what is the relationship between the condition check and the variable that should be assigned. It becomes even worse when there is a default value or null assigned to the message. Making the whole statement error-prone as well, since it can easily happen that the assignment is missed in one of the cases.

Now let's look at how Kotlin solves this. In Kotlin conditional statements are assignable! Wow! This means you can replace the first example with the following code.

```Kotlin
var name = "Bob";

var message = if(name.equals("Bob")) {
    "Hello Bob"
}
else {
    "Good Day Sir"
}

println("Message is: ${message}")
```

Do you see how this makes the code more readable? The whole purpose of the if-statement becomes much clearer. It's there since we need to assign a value to our message variable, based on a condition we have to evaluate.

The same goes for our second example with the switch-statement.

```Kotlin
var name = "Bob";

var message = when(name) {
    "Bob" -> "Hello Bob"
    else -> "Good Day Sir"
}

println("Message is: ${message}")
```

Not just that the when-statement has a lot less boilerplate, compared to the traditional switch-statement. The whole purpose of the when-statement in such a conditional assignment becomes immediately clear to the reader.

You can read more about Kotlin's when statement with very nice examples on [Baeldung].


[Baeldung]: https://www.baeldung.com/kotlin/when