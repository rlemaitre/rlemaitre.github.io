import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { Webmentions } from "./quartz/plugins/transformers/webmentions"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "My Mind Palace",
    pageTitleSuffix: " |> Raphaël Lemaitre",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "tinylytics",
      siteId: "UKo7ysT1y9ouVGcZtHMp",
      kudos: true,
    },
    locale: "en-US",
    baseUrl: "rlemaitre.com",
    ignorePatterns: ["private", "xx_system/templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        title: {
          name: "Atkinson Hyperlegible Next",
          weights: [800],
          includeItalic: true,
        },
        header: {
          name: "Atkinson Hyperlegible Next",
          weights: [600],
          includeItalic: true,
        },
        body: {
          name: "Atkinson Hyperlegible Next",
          weights: [800],
          includeItalic: true,
        },
        code: {
          name: "Atkinson Hyperlegible Mono",
          weights: [400],
          includeItalic: false,
        },
      },
      colors: {
        lightMode: {
          light: "#eceff4", // Page background (Nord6)
          lightgray: "#d8dee9", // Borders (Nord4)
          gray: "#4c566a", // Graph links, heavier borders (Nord3)
          darkgray: "#2e3440", // Body text (Nord0)
          dark: "#2e3440", // Header text and icons (Nord0)
          secondary: "#5e81ac", // Link colour, current graph node (Nord10)
          tertiary: "#8fbcbb", // Hover states - Nord7 Teal (couleur pleine)
          highlight: "#8fbcbb20", // Internal link background (Nord7 + opacity)
          textHighlight: "#ebcb8b40", // Markdown highlighted text (Nord13 + opacity)
        },
        darkMode: {
          light: "#2e3440", // Page background (Nord0)
          lightgray: "#434c5e", // Borders (Nord2)
          gray: "#d8dee9", // Graph links, heavier borders (Nord4)
          darkgray: "#eceff4", // Body text (Nord6)
          dark: "#eceff4", // Header text and icons (Nord6)
          secondary: "#81a1c1", // Link colour, current graph node (Nord9)
          tertiary: "#5e81ac", // Hover states - Nord10 Blue (couleur pleine)
          highlight: "#88c0d020", // Internal link background (Nord8 + opacity)
          textHighlight: "#ebcb8b40", // Markdown highlighted text (Nord13 + opacity)
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "nord",
          dark: "nord",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
      Webmentions({
        webmentionEndpoint: "https://webmention.io/rlemaitre.com/webmention",
        pingbackEndpoint: "https://webmention.io/rlemaitre.com/xmlrpc",
        authorName: "Raphaël Lemaitre",
        authorUrl: "https://rlemaitre.com",
        authorPhoto: "https://rlemaitre.com/avatar.jpg",
        enableMicroformats: true,
      }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
