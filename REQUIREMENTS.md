# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index 
- Show (args: product id)
- Create (args: Product)[token required]
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)

#### Users
- Index [token required]
- Show (args: id)[token required]
- Create (args: User)[token required]

#### Orders
- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes

#### Product
| Field | Data Type     |
| :-------- | :------- |
| `id` | `SERIAL PRIMARY KEY` |
| `name` | `VARCHAR(64) NOT NULL` |
| `price` | `integer NOT NULL` |


#### User
| Field | Data Type     |
| :-------- | :------- |
| `id` | `SERIAL PRIMARY KEY` |
| `username` | `VARCHAR(30) NOT NULL` |
| `firstName` | `VARCHAR(15) NOT NULL` |
| `lastName` | `VARCHAR(15) NOT NULL` |
| `password` | `VARCHAR(100) NOT NULL` |

Note : I prefer using decimal type for price


#### Order
| Field | Data Type     |
| :-------- | :------- |
| `id` | `SERIAL PRIMARY KEY` |
| `status` | `VARCHAR(15) DEFAULT 'open'` |
| `user_id` | `bigint REFERENCES users(id) NOT NULL` |


#### Order-Products
| Field | Data Type     |
| :-------- | :------- |
| `id` | `SERIAL PRIMARY KEY` |
| `quantity` | `integer` |
| `order_id` | `bigint REFERENCES orders(id)` |
| `product_id` | `bigint REFERENCES products(id)` |

