---
{"publish":true,"permalink":"/Talks/armored-type-safety-with-iron.md","title":"Armored Type Safety With Iron","created":"2025-06-23T13:24:23+02:00","cssclasses":"","socialImage":"/images/talks/armored-type-safety-with-iron.png"}
---



## Abstract
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

## Venues
This talk has been given multiple times:
- 2023-11-23: [Scala Matters](https://www.umatr.io/events/scala-matters-paris/) in Paris, France 🇫🇷
- 2024-02-15: [ScalaIO](https://scala.io/sessions/nantes-2024/armored-type-safety-with-iron) in Nantes, France 🇫🇷
- 2024-03-22: [Scalar](https://typeville-56ef49ad5026668-b266fc4d2d9df.webflow.io/talk/armored-type-safety-with-iron) in Warsaw, Poland 🇵🇱
- 2024-06-08:  [ScalaMatsuri](https://scalamatsuri.org/en/programs/SESSION_DAY_1_07/) in Tokyo, Japan 🇯🇵
- 2024-12-05: [Functional Scala](https://www.functionalscala.com/authors-and-speakers/raphael-lemaitre-2/), Online
