---
title: "Trigger a Ci Pipeline From Command Line"
description: "I redeploy a staging environment with an empty commit instead of a dummy code change."
published: 2021-03-09
tags: ["git","ci","today-i-learned"]
---

At [ADventori](https://adventori.com/), we use [Gitlab CI](https://docs.gitlab.com/ee/ci/) to deploy our staging environments when code changes in our main branch.
This afternoon, I wanted to re-deploy one of our environments with the same code.

One solution I saw was to add a dummy modification to our codebase (for example adding a space in a comment), commit it, and push it to our main branch.
This would trigger our CI/CD pipeline and would result to a new deployment.
This solves my problem, but the code modification is artificial.

Then, I discovered the `--allow-empty` option of `git commit` thanks to this tweet: 

![Tweet by Megan Sullivan (@meganesulli): TIL that you can do git commit --allow-empty to make a new commit with no actual changes to your files. No more random whitespace changes to trigger new builds!](../../../../assets/articles/tweet-1366466258393161729.png)

Eventually, I ran the following command, pushed to our main branch and our staging environment was re-deployed.

```bash
git commit --allow-empty -m 'Redeploy staging environment'
```

![Job done!](https://media.giphy.com/media/jS27LWasgUIYrXtP83/giphy.gif)
