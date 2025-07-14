import { QuartzComponent, QuartzComponentProps } from "./types"

export default (() => {
  const WebmentionsHead: QuartzComponent = ({ cfg, fileData, externalResources }: QuartzComponentProps) => {
    const webmentionData = fileData.frontmatter?.webmentions
    
    if (!webmentionData) {
      return null
    }

    const {
      webmentionEndpoint,
      pingbackEndpoint,
      author,
      enableMicroformats,
    } = webmentionData

    return (
      <>
        {/* Webmention endpoints */}
        {webmentionEndpoint && (
          <link rel="webmention" href={webmentionEndpoint} />
        )}
        {pingbackEndpoint && (
          <link rel="pingback" href={pingbackEndpoint} />
        )}
        
        {/* Author microformats */}
        {enableMicroformats && author?.name && (
          <>
            <meta name="author" content={author.name} />
            {author.url && (
              <link rel="author" href={author.url} />
            )}
          </>
        )}
        
        {/* IndieAuth rel-me links */}
        {author?.url && (
          <link rel="me" href={author.url} />
        )}
        
        {/* Open Graph and Twitter Card meta tags for better webmention context */}
        {author?.name && (
          <>
            <meta property="og:site_name" content={cfg.pageTitle} />
            <meta name="twitter:creator" content={author.name} />
          </>
        )}
      </>
    )
  }

  WebmentionsHead.css = `
    /* No CSS needed for head elements */
  `

  return WebmentionsHead
}) satisfies QuartzComponentConstructor