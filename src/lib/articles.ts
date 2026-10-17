interface Dated {
  readonly data: { readonly published: Date; readonly draft: boolean }
}

/** Entries without drafts, newest first. Returns a new array. */
export function publishedNewestFirst<T extends Dated>(entries: readonly T[]): T[] {
  return entries
    .filter((entry) => !entry.data.draft)
    .toSorted((a, b) => b.data.published.getTime() - a.data.published.getTime())
}

/** Category folder of an article id such as `en/scala/scala_xdg`. */
export const articleCategory = (id: string): string => id.split('/')[1] ?? ''
