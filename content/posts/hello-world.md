---
title: "Hello World!"
date: 2021-02-11T19:27:29+01:00
draft: false
toc: false
images:
tags:
  - blog
---
It's been a long time I wanted to have a blog.
Writing more and better is one of my goals this year and the blog is a fairly simple way to achieve it.

I will try to write about subjects that interest me: dev, learning, ways to become more efficient (aka productivity), board games and anything else that comes into my mind that deserves to be shared.

## What is my blogging platform?

Once I decided to create this blog, once I found the subjects to write about, I had to find out how to do it.
I had several possibilities to do so:

- Write posts on [Medium](https://medium.com/@rlemaitre)
- Write posts on [dev.to](https://dev.to/rlemaitre)
- Hosting a blog using [wordpress](https://wordpress.com/)
- Use a static site generator and host it on [Gitlab](https://docs.gitlab.com/ee/user/project/pages/) or [Github](https://pages.github.com/)

Being very attached to data protection and confidentiality (on a personal basis, I try to use as little google as possible, I will surely come back to this in a future article), I have chosen not to use a third party service as my main publication platform.
I'm a dev, the choice of the static site generator with articles written in Markdown, and a hosting based on Git was thus naturally imposed to me.
This solution even guarantees better durability over time, [as written by @brandur](https://brandur.org/fragments/graceful-degradation-time).
I turned to [Hugo](https://gohugo.io/) and the [Hello Friend NG](https://github.com/rhazdon/hugo-theme-hello-friend-ng) theme of [Djordje Atlialp](https://atlialp.com/).

The source of this site is hosted on a [Github repository](https://github.com/rlemaitre/rlemaitre.github.io).
Do not hesitate to create [an issue](https://github.com/rlemaitre/rlemaitre.github.io/issues) or a [pull request](https://github.com/rlemaitre/rlemaitre.github.io/pulls) if you see any bug or typo.  

As this theme allows me to have the site and the blog written in several languages, I will try to write as much as possible my articles [in French](/fr/posts/) and [in English](/posts/).

I wanted to have a comment system on the blog. However, because of [data protection issues](https://supunkavinda.blog/disqus), I didn't want to use disqus.
I turned to [Utterances](https://utteranc.es/) which is open source, without any tracking and stores comments as GitHub issues.
So don't hesitate to comment on articles, you just need to have a GitHub account to do so.
