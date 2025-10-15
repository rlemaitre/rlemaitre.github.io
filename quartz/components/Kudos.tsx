import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

type Options = {
  provider: "tinylitics"
  options: {
    className: string
  }
}

const defaultOptions: Options = {
    provider: "tinylitics",
    options: {
        className: "tinylitics_kudos"
    }
} 

export default ((opts: Options = defaultOptions) => {
  const Kudos: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    // check if comments should be displayed according to frontmatter
    const disableKudos: boolean =
      typeof fileData.frontmatter?.kudos !== "undefined" &&
      (!fileData.frontmatter?.kudos || fileData.frontmatter?.kudos === "false")
    if (disableKudos) {
      return <></>
    }

    return (
      <div><button class={opts.options.className}></button></div>
    )
  }

  return Kudos
}) satisfies QuartzComponentConstructor<Options>
