import { WatchedList } from './watched-list'

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b
  }
}

describe('Watched list', () => {
  it('should be able to create a watched list', () => {
    const list = new NumberWatchedList([1, 2, 3])

    expect(list.currentItems).toHaveLength(3)
    expect(list.currentItems).toEqual([1, 2, 3])
  })

  it('should be able to add a new item', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.add(4)

    expect(list.currentItems).toHaveLength(4)
    expect(list.currentItems).toEqual([1, 2, 3, 4])
    expect(list.getNewItems()).toEqual([4])
  })

  it('should be able to add a new item', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.remove(2)

    expect(list.currentItems).toHaveLength(2)
    expect(list.currentItems).toEqual([1, 3])
    expect(list.getRemovedItems()).toEqual([2])
  })

  it('should be able to add a item that was removed', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.remove(3)
    list.add(3)

    expect(list.currentItems).toHaveLength(3)
    expect(list.currentItems).toEqual([1, 2, 3])
    expect(list.getRemovedItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
  })

  it('should be able to update the list', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.update([1, 3, 4, 5])

    expect(list.currentItems).toHaveLength(4)
    expect(list.currentItems).toEqual([1, 3, 4, 5])
    expect(list.getRemovedItems()).toEqual([2])
    expect(list.getNewItems()).toEqual([4, 5])
  })
})
