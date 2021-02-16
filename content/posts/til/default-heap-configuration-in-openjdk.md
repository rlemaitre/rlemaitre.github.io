---
title: "TIL: Default Heap Configuration in OpenJDK"
date: 2021-02-16T17:11:50+01:00
draft: false
toc: false
images:
tags:
  - java
  - today I learnt
---
This is the first blog post in the "Today I learnt" (TIL) series.
In this series, as its name suggests, I'll write about random things I learn.
The purpose of all this is to make it easier for me to remember things and, of course, to share it so that others don't struggle to find it.

So, this afternoon, someone asked me what are the heap configuration of a docker-based tomcat.
We haven't set any particular tomcat configuration, except for our app deployment, so the default one is used.

So, now, the question is:

>  What is the default heap configuration of an OpenJDK 8 JVM?

According to [Oracle documentation](https://docs.oracle.com/javase/8/docs/technotes/tools/windows/java.html), _the default value is chosen at runtime based on system configuration._
It appears it depends on the server architecture, the system memory and the VM type (server or client).

For client configurations, as described in [GC Tuning guide](https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/parallel.html#default_heap_size), the default maximum heap size is half of the physical memory up to a physical memory size of 192 megabytes (MB) and otherwise one fourth of the physical memory up to a physical memory size of 1 gigabyte (GB).

For server configurations, as described in [the same guide](https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/ergonomics.html#sthref5), the default maximum heap size is 1/4 of the physical memory up to 1 gigabyte for 32-bits JVMs and to 32 gigabytes for 64-bits JVMs.

A simple way to know what is the default value for your JVM on your environment is to run the following command.

```bash
java -XX:+PrintFlagsFinal -version | grep MaxHeapSize
```

The result for our JVM inside the docker container is:

```text
    uintx MaxHeapSize                              := 16833839104                         {product}
openjdk version "1.8.0_242"
OpenJDK Runtime Environment (build 1.8.0_242-b08)
OpenJDK 64-Bit Server VM (build 25.242-b08, mixed mode)
```

The value is displayed in bytes.
So, here, the default value is 16 GB which is one quarter of the host memory (64 GB).

The `java -XX:+PrintFlagsFinal -version` command displays a lot of information (several hundreds of parameters), such as the heap space size and the selected garbage collector.