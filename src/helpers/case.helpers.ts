
export function toSlugCase (str: string) {
    return str
      .replace(/([A-Z])([A-Z])/g, '$1-$2')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase()
      .replace(/([a-z])_([a-z])/g, '$1-$2')
}