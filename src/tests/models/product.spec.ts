import { ProductModel } from '../../models/product'

const store = new ProductModel()

describe('Product Model', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined()
  })

  it('should have a show method', () => {
    expect(store.show).toBeDefined()
  })

  it('should have a create method', () => {
    expect(store.create).toBeDefined()
  })

  it('should have a User Products that belong to Order method', () => {
    expect(store.userOrderProducts).toBeDefined()
  })

  it('create method should add a product', async () => {
    const result = await store.create({
      id: 1,
      name: 'Corsair Vengeance RGB Pro SL 32GB',
      price: 250,
    })
    expect(result).toEqual({
      id: 1,
      name: 'Corsair Vengeance RGB Pro SL 32GB',
      price: 250,
    })
  })

  it('index method should return a list of products', async () => {
    const result = await store.index()
    expect(result).toEqual([
      {
        id: 1,
        name: 'Corsair Vengeance RGB Pro SL 32GB',
        price: 250,
      },
    ])
  })

  it('show method should return the correct product', async () => {
    const result = await store.show('1')
    expect(result).toEqual({
      id: 1,
      name: 'Corsair Vengeance RGB Pro SL 32GB',
      price: 250,
    })
  })
})
