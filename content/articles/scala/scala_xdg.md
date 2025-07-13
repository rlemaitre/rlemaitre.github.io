---
{"publish":true,"permalink":"/Articles/scala/scala_xdg.md","title":"Cleaning Up Scala Projects: A Simple Proposal","created":"2025-06-22T11:38:51+02:00","tags":["scala","xdg","developer-experience"],"cssclasses":""}
---



Scala projects are messy. Every tool creates its own folder or config file, and soon your project looks like this mess. A [LinkedIn post](https://www.linkedin.com/posts/matejcerny_scala-activity-7348626678878728193-L9R1) and [Bluesky thread](https://bsky.app/profile/matejcerny.bsky.social/post/3ltjeyhj2ec2m) by Matej Cerny got me thinking about a solution.

## The Problem

Open any Scala project and you'll see this:

```
my-scala-project/
├── .bsp/
├── .bloop/
├── .metals/
├── .idea/
├── target/
├── project/target/
├── .scalafmt.conf
├── .scalafix.conf
├── .gitignore
├── build.sbt
└── src/
    └── main/scala/
```

Every tool dumps files in the root. It's hard to find your actual code. Your `.gitignore` file becomes huge. And cleaning up is a pain because you need to know what each tool creates.

## A Better Way

What if we organized everything like this instead (obviously inspired by [XDG](https://specifications.freedesktop.org/basedir-spec/latest/))?

```
my-scala-project/
├── .config/            # Team configs (goes in git)
│   ├── scalafmt.conf
│   ├── scalafix.conf
│   └── wartremover.conf
├── .local/             # Personal stuff (ignored by git)
│   ├── cache/          # Temp files you can delete
│   │   ├── bloop/
│   │   ├── metals/
│   │   ├── sbt/
│   │   └── coursier/
│   ├── config/         # Your personal settings
│   │   ├── metals.json
│   │   ├── ide-preferences/
│   │   └── personal-settings/
│   └── state/          # Tool data between runs
│       ├── bsp/
│       └── ide-workspace/
├── .gitignore          # Just ".local/"
├── build.sbt
└── src/
    └── main/scala/
```

## What Goes Where

**.config/**: Team rules that everyone shares. Code formatting, linting rules, etc. This goes in git.

**.local/cache/**: Temporary files. You can delete this folder anytime and rebuild.

**.local/config/**: Your personal tool settings. Don't share these.

**.local/state/**: Files tools need to remember things between builds.

Only `.local/` gets ignored by git. Team configs stay shared.

## Why This Helps

**Simple git ignore**: Just add `.local/` instead of a long list.

**Clear structure**: You can tell what's source code and what's tool stuff.

**Easy cleanup**: Delete `.local/` to start fresh.

**Team vs personal**: Shared configs stay in git, personal stuff stays local.

**Future-proof**: New tools can follow the same pattern.

## The Downsides

**Tools need updates**: Every tool would need to support this.

**Migration work**: Existing projects would need to move files around.

**Learning curve**: People are used to the current mess.

**Compatibility**: Tools need to support both old and new ways during transition.

## How to Make This Happen

**Step 1**: Write up the idea and get community feedback.

**Step 2**: Start with core tools like sbt, Metals, and Bloop.

**Step 3**: Get other tools on board.

**Step 4**: Update templates and documentation.

Tools could support this gradually:

```scala
// Example sbt config
ThisBuild / localCacheDirectory := baseDirectory.value / ".local" / "cache"
ThisBuild / localConfigDirectory := baseDirectory.value / ".local" / "config"
ThisBuild / localStateDirectory := baseDirectory.value / ".local" / "state"
ThisBuild / sharedConfigDirectory := baseDirectory.value / ".config"
```

## Let's Make It Happen

Scala projects don't have to be messy. This isn't a big technical change - it's just organizing files better. But it would make every developer's life easier.

What do you think? Would this help your daily work? Let's discuss this and see if we can make Scala projects cleaner for everyone.