---
title: "Trigger a Ci Pipeline From Command Line"
aliases:
  - "TIL: Trigger a Ci Pipeline From Command Line"
created: "2025-06-22T11:38:51+02:00"
updated: "2025-06-22T11:38:51+02:00"
tags:
  - git
  - ci
  - today-i-learned
cssclasses:
---


At [ADventori](https://adventori.com/), we use [Gitlab CI](https://docs.gitlab.com/ee/ci/) to deploy our staging environments when code changes in our main branch.
This afternoon, I wanted to re-deploy one of our environments with the same code.

One solution I saw was to add a dummy modification to our codebase (for example adding a space in a comment), commit it, and push it to our main branch.
This would trigger our CI/CD pipeline and would result to a new deployment.
This solves my problem, but the code modification is artificial.

Then, I discovered the `--allow-empty` option of `git commit` thanks to this tweet: 

![[tweet-1366466258393161729.png]]

Eventually, I ran the following command, pushed to our main branch and our staging environment was re-deployed.

```bash
git commit --allow-empty -m 'Redeploy staging environment'
```

![Job done!](https://media.giphy.com/media/jS27LWasgUIYrXtP83/giphy.gif)