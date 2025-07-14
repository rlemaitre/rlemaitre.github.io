import { QuartzTransformerPlugin } from "../types"
import { Root } from "mdast"

export interface Options {
  webmentionEndpoint?: string
  pingbackEndpoint?: string
  authorName?: string
  authorUrl?: string
  authorPhoto?: string
  enableMicroformats?: boolean
}

const defaultOptions: Options = {
  webmentionEndpoint: "",
  pingbackEndpoint: "",
  authorName: "",
  authorUrl: "",
  authorPhoto: "",
  enableMicroformats: true,
}

export const Webmentions: QuartzTransformerPlugin<Options | undefined> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  
  return {
    name: "Webmentions",
    markdownPlugins() {
      return [
        () => {
          return (tree: Root, file) => {
            // Add webmention data to frontmatter so it can be used in templates
            const data = file.data as any
            if (!data.frontmatter) {
              data.frontmatter = {}
            }
            
            data.frontmatter.webmentions = {
              webmentionEndpoint: opts.webmentionEndpoint,
              pingbackEndpoint: opts.pingbackEndpoint,
              author: {
                name: opts.authorName,
                url: opts.authorUrl,
                photo: opts.authorPhoto,
              },
              enableMicroformats: opts.enableMicroformats,
            }
          }
        },
      ]
    },
  }
}