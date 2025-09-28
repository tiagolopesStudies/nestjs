import { it, expect } from 'vitest'

import { Slug } from './slug'

it('should be able to create a slug', () => {
  const slug = Slug.createFromText('example title')

  expect(slug.value).toEqual('example-title')
})
