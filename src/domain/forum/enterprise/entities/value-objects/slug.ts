export class Slug {
  private constructor(public value: string) {}

  static create(value: string) {
    return new Slug(value)
  }

  static createFromText(text: string) {
    return new Slug(
      text
        .normalize('NFKD')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/_/g, '-')
        .replace(/--+/g, '-')
        .replace(/-$/g, '')
    )
  }
}
