import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
      Component.Kudos(),
    Component.Comments({
      provider: "giscus",
      options: {
        // from data-repo
        repo: "rlemaitre/rlemaitre.github.io",
        // from data-repo-id
        repoId: "MDEwOlJlcG9zaXRvcnk3OTE0MjEzOQ==",
        // from data-category
        category: 'General"',
        // from data-category-id
        categoryId: "MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyNTc0MTA2",
        // from data-lang
        lang: "en",
      },
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/rlemaitre",
      LinkedIn: "https://linkedin.com/in/rlemaitre/",
      Bluesky: "https://bsky.app/profile/rlemaitre.com",
      Mastodon: "https://social.treehouse.systems/@rlemaitre",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs({ spacerSymbol: "|>" }),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    // Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs({ spacerSymbol: "|>" }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}
