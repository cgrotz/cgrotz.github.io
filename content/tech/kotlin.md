---
layout: tech
title:  "Kotlin"
description: "A modern language for the JVM."
date:   2020-02-23 22:13:00 +0200
ring: adopt
quadrant: language
moved: no
type: tech
---

[Kotlin] is a very interesting alternative to Java on the JVM. With many delightful features. Here are some examples:

```kotlin
fun main() {
	// 1. Type Inference
    var x = 1
    
	// 2. Assignment with Expression
    var value = when (x) {
        1 -> "one"
        2 -> "two"
        else -> "something"
    }
    // 3. String Interpolation
    println("Value is: ${value}")
}
```

[Kotlin]: https://kotlinlang.org