---
layout: post
title:  "Rhino Maven Plugin Release"
description: "Building maven artifacts from javascript sources"
date:   2013-06-06 10:13:00 +0200
categories: General js Rhino
type: blog
---
rhino-maven-plugin is a Maven plugin to compile Javascript to Java class file using Mozilla Rhino. The compiled classes require Mozilla Rhino to run. The plugin is licensed under the Mozilla Public License 2.0 due to MPL being the license for Rhino

Maven Distribution

```xml
<build>
  <plugins>
    <plugin>
      <groupId>de.skiptag</groupId>
      <artifactId>rhino-maven-plugin</artifactId>
      <version>1.0.1</version>
    </plugin>
  </plugins>
</build>
```
You can start the compilation be simply calling mvn rhino:compile or by adding the following to the plugin tag:

```xml
<executions>
  <execution>
    <phase>compile</phase>
    <goals>
      <goal>compile</goal>
    </goals>
  </execution>
</executions>
```
Mozilla Rhino as dependency

```xml
<dependency>
  <groupId>org.mozilla</groupId>
  <artifactId>rhino</artifactId>
  <version>1.7R4</version>
</dependency>
```
The artifact is deployed to Maven Central so no repository configuration should be necessary.