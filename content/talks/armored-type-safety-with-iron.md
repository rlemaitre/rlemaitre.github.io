---
title: Armored Type Safety With Iron
weight: 10
date: 2025-03-01T00:25:43+01:00
language: en
image: "/images/talks/armored-type-safety-with-iron.png"
venues:
  - name: "Scala Matters"
    url: "https://www.umatr.io/events/scala-matters-paris/"
    logo: "/images/events/scala-matters.png"
    date: "2023-11-23"
    place: "Paris, France"
    slides: ""
  - name: "ScalaIO"
    url: "https://scala.io/sessions/nantes-2024/armored-type-safety-with-iron"
    logo: "/images/events/scalaio.svg"
    date: "2024-02-15"
    place: "Nantes, France"
    slides: ""
  - name: "Scalar"
    url: "https://typeville-56ef49ad5026668-b266fc4d2d9df.webflow.io/talk/armored-type-safety-with-iron"
    logo: "/images/events/scalar.svg"
    date: "2024-03-22"
    place: "Warsaw, Poland"
    slides: ""
  - name: "ScalaMatsuri"
    url: "https://scalamatsuri.org/en/programs/SESSION_DAY_1_07/"
    logo: "/images/events/scala-matsuri.svg"
    date: "2024-06-08"
    place: "Tokyo, Japan"
    slides: ""
  - name: "Functional Scala"
    url: "https://www.functionalscala.com/authors-and-speakers/raphael-lemaitre-2/"
    logo: "/images/events/functional-scala.svg"
    date: "2024-12-05"
    place: "Online"
    slides: ""
copresenters:
  - name: "Valentin Bergeron"
    url: "https://vbergeron.github.io/"
audience: "intermediate"
summary: "Discover how Iron, a type constraint library, can help you enforce constraints in your domain models and ensure a continuous stream of valid data from your API endpoints to the database."
---
When designing an application, we often ends up with domain specific types, that all behold constraints that we try to enforce as much as possible : an age is positive, a delivery date can’t be in the past, etc.
Modeling the data right is a part of the success of Scala and functional programming in general, but it also brings either boilerplate (we have to do again and again validation), or rely purely on conventions.

But there is hope.
Meet the [Iron](https://github.com/Iltotore/iron) library.

Iron is, a type constraint library that allow us to have a safe, declarative and smarter model.
It enables us to have a continuous stream of valid data from our API endpoints to the database, and removes a whole class of bugs.
Using advanced features like opaque types, inlines and the new macro system, it offer a true zero-cost, zero-dependency library that doesn’t hamper compile time.
In this talk, we show first the different techniques we can use to apply constraints is our domains.
Then, we present Iron, its features, extensions, and integrations.
We finish by showcasing a fully-integrated constraint-enforcing app.
