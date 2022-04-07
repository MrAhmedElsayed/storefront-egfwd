// PRODUCT MODEL

/*
Products
Index
Show
Create [token required]
*/
export type Product = {
  id: number
  name: string
  price: number
}

export class ProductModel {
  async index(): Promise<Product[]> {
    try {

    } catch (error) {

    }
  }

  async show(id: number): Promise<Product> {
    try {

    } catch (error) {

    }
  }

  async create(data: Product): Promise<Product> {
    try {

    } catch (error) {

    }
  }
}
