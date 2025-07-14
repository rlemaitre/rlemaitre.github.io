---
created: 2025-07-13T14:38:43+02:00
updated: 2025-07-13T18:57:35+02:00
publish: false
title: Independent Web Presence Guide
---
## Table of Contents

1. [Why create your own web space?](#why)
2. [Choosing and registering a domain name](#domain)
3. [Hosting options](#hosting)
4. [Creating your first website](#first-site)
5. [Securing your digital identity](#identity-security)
6. [Decentralized interactions](#interactions)
7. [Discovery and community](#discovery)
8. [Resources and tools](#resources)
## Why create your own web space? {#why}
In a web dominated by a few large platforms, creating your own website means:
- **Actually owning your content**: no risk of posts being deleted or accounts suspended
- **Controlling your presentation**: design and organization according to your taste, not an algorithm
- **Avoiding surveillance**: no advertising tracking, no behavioral profiling
- **Joining a community**: the independent web brings together people sharing these values
- **Learning**: understanding how the web works by building your own

The goal isn't to completely replace social networks, but to have a stable and durable digital "home."
## Choosing and registering a domain name {#domain}
### What is a domain name?
A domain name (like `yourname.com`) is your address on the internet. It's the equivalent of your postal address for the web.
### Choosing your name
**Practical tips:**
- Use your name if available (`john-doe.com`)
- Or a stable pseudonym you already use
- Avoid hyphens and numbers if possible
- Prefer `.com`, `.org`, or your country's extension (`.fr`, `.uk`, `.ca`, etc.)
### Registration steps

1. Check availability of your name on the registrar's website
2. Create an account
3. Add the domain to cart (usually $10-15/year)
4. **Important:** Enable WHOIS protection to protect your personal data
5. Configure DNS (see hosting section)
## Hosting options {#hosting}
### Free hosting (to get started)
**GitHub Pages**
- Perfect for static sites
- Free custom domain
- Git-based interface (somewhat technical)
**Neocities**
- Simple web interface
- Active community
- 1GB storage limit
**Netlify**
- Excellent for static sites
- Automatic deployment
- Generous free plan
### Traditional paid hosting
**Recommended hosts:**
- **Alwaysdata** - Great support, reasonable prices
- **DreamHost** - Long-standing, indie-friendly
- **NearlyFreeSpeech** - Pay-what-you-use model
- **Hetzner** - Germany-based, excellent value
### Self-hosting (advanced)
If you're technically comfortable:
- **VPS** from Hetzner, DigitalOcean, or Linode
- **Raspberry Pi** at home (mind the bandwidth)
- **Home server** with dynamic DNS
## Creating your first website {#first-site}
### Option 1: Simple HTML
To start, a simple `index.html` file:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Name - Web Developer</title>
    <style>
        body { 
            font-family: system-ui, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <h1>Hello, I'm [Your Name]</h1>
    <p>Welcome to my corner of the web!</p>
    
    <h2>About</h2>
    <p>I'm a [description]. I'm interested in [your interests].</p>
    
    <h2>Contact</h2>
    <p>Email: <a href="mailto:you@yourdomain.com">you@yourdomain.com</a></p>
    
    <h2>Elsewhere</h2>
    <ul>
        <li><a href="https://github.com/yourusername">GitHub</a></li>
        <li><a href="/feed.xml">RSS</a></li>
    </ul>
</body>
</html>
```

### Option 2: Static site generators
**For beginners:**
- **Jekyll** - Integrated with GitHub Pages
- **Hugo** - Very fast, many themes
**More modern:**
- **Eleventy** - Flexible, JavaScript-based
- **Astro** - Modern, excellent performance
### Recommended structure

```
mysite/
├── index.html          # Homepage
├── about/             # About page
├── blog/              # Articles
├── contact/           # Contact
├── feed.xml           # RSS feed
└── .well-known/       # Web standards
```
## Securing your digital identity {#identity-security}
### Creating a PGP key
PGP cryptography allows you to sign your content and prove your identity.

**With GPG (command line):**
```bash
# Generate a new key
gpg --full-generate-key

# Choose:
# - Type: RSA and RSA
# - Size: 4096 bits
# - Duration: 0 (no expiration) or 2 years

# Export the public key
gpg --armor --export your@email.com > my-public-key.asc
```

**With graphical interface:**
- **Windows:** Gpg4win
- **macOS:** GPG Suite
- **Linux:** Seahorse (GNOME) or KGpg (KDE)
### Publishing your public key

1. **On your website:** `/pgp-key.asc` or in `/.well-known/`
2. **Keyserver:** `keys.openpgp.org` or `keyserver.ubuntu.com`
### Signing your content
Sign your important articles or recommendations:

```bash
# Sign a file
gpg --clearsign --armor my-article.md

# Create a detached signature
gpg --detach-sign --armor recommendations.json
```
## Decentralized interactions {#interactions}
### RSS - Following and being followed
**Creating your RSS feed:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
    <title>My Blog</title>
    <link>https://mysite.com</link>
    <description>My thoughts on web and tech</description>
    <language>en</language>
    
    <item>
        <title>My first post</title>
        <link>https://mysite.com/blog/first-post</link>
        <pubDate>Thu, 01 Jun 2025 10:00:00 GMT</pubDate>
        <description>Post content...</description>
    </item>
</channel>
</rss>
```
**Recommended RSS readers:**
- **Feedly** - Modern interface, synchronization
- **Inoreader** - Very comprehensive
- **NetNewsWire** (Mac/iOS) - Open source, elegant
- **FreshRSS** - Self-hosted
### Webmentions - Web interactions
Webmentions allow you to notify a site when you mention it.
**Receiving webmentions:**
1. Add to your `<head>`:
```html
<link rel="webmention" href="https://webmention.io/mysite.com/webmention" />
```
2. Create an account on [webmention.io](https://webmention.io)
3. Display mentions on your pages
**Sending webmentions:**
- Manual: [Telegraph](https://telegraph.p3k.io/)
- Automatic: integration in your site generator
### IndieAuth - Decentralized authentication
Use your own site as identity:
```html
<!-- In the <head> of your homepage -->
<link rel="authorization_endpoint" href="https://indieauth.com/auth">
<link rel="token_endpoint" href="https://tokens.indieauth.com/token">
```
## Discovery and community {#discovery}

### Blogroll and links
Create a "Links" or "Blogroll" page with your favorite sites:
```html
<h2>Sites I recommend</h2>
<ul>
    <li><a href="https://example.com">Site Name</a> - Short description</li>
    <li><a href="https://other.example">Other Site</a> - Why it's interesting</li>
</ul>
```
### Webrings
Webrings are circles of sites linked together:
- [IndieWeb Webring](https://xn--sr8hvo.ws/)
- [Hotline Webring](https://hotlinewebring.club/)
- [Yesterweb Webring](https://webring.yesterweb.org/)
- Create your own for your community
### Directories and indexes
Submit your site to:
- [Marginalia Search](https://search.marginalia.nu/) - Engine for alternative web
- [Wiby](https://wiby.me/) - Classic web pages
- [IndieWeb Directory](https://indieweb.org/directory)
- Topic-specific directories in your field
### Recommendation protocol (in development)
An emerging standard for sharing site recommendations:
```json
{
  "identity": "https://mysite.com",
  "updated": "2025-06-01",
  "recommendations": [
    {
      "url": "https://otherblog.com",
      "title": "Marie's Blog",
      "description": "Excellent articles on urban permaculture",
      "tags": ["gardening", "ecology", "urban"],
      "type": "blog",
      "language": "en"
    }
  ],
  "interests": ["web", "ecology", "photography"]
}
```
## Resources and tools {#resources}
### Communities
- [IndieWeb](https://indieweb.org/) - Movement for an independent web
- [32-Bit Cafe](https://32bit.cafe/) - Creative web community
- [Neocities](https://neocities.org/) - Hosting and community
- [Small Web](https://ar.al/2020/08/07/what-is-the-small-web/) - Philosophy and tools
### Development tools
**Code editors:**
- **VS Code** - Free, very complete
- **Sublime Text** - Fast and elegant
- **Vim/Neovim** - For purists
**Site generators:**
- [Jekyll](https://jekyllrb.com/) - Ruby, GitHub integration
- [Hugo](https://gohugo.io/) - Go, very fast
- [Eleventy](https://www.11ty.dev/) - JavaScript, flexible
- [Astro](https://astro.build/) - Modern, multi-framework
### Design and typography
**Minimal CSS frameworks:**
- [Water.css](https://watercss.kognise.dev/) - Classless
- [MVP.css](https://andybrewer.github.io/mvp/) - Semantic HTML
- [Pico.css](https://picocss.com/) - Modern and lightweight
**Web fonts:**
- System fonts (`system-ui`) - Fast, native
- [Inter](https://rsms.me/inter/) - Excellent readability
- [Atkinson Hyperlegible](https://brailleinstitute.org/freefont) - Accessibility-focused
### Analyzers and validators
- [W3C Markup Validator](https://validator.w3.org/) - HTML validation
- [Wave](https://wave.webaim.org/) - Accessibility
- [PageSpeed Insights](https://pagespeed.web.dev/) - Performance
- [IndieWebify.Me](https://indiewebify.me/) - IndieWeb features
### Analytics (privacy-friendly)
- [Plausible](https://plausible.io/) - Simple, privacy-focused
- [Fathom](https://usefathom.com/) - Minimal tracking
- [GoatCounter](https://www.goatcounter.com/) - Open source
- Or skip analytics entirely!
## Next steps
1. **Start simple**: a basic HTML file
2. **Add content** regularly
3. **Connect** with the IndieWeb community
4. **Experiment** with technologies that interest you
5. **Share** your experience and help others get started

The independent web is built little by little, site by site, person by person. Welcome to this adventure!
