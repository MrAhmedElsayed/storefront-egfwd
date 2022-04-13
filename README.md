
# Storefront Backend Project

 API for an online store to make product ideas available for purchase


## Installation

Clone the project

```bash
  git clone git@github.com:MrAhmedElsayed/storefront-egfwd.git
```

Go to the project directory

```bash
  cd storefront-egfwd
```

Install dependencies

```bash
  yarn
```

Start the server

```bash
  yarn dev
```

**Note:** Server will be running on **_port 3000_**

### Create a database to start using the API [psql for postgres database]
```bash
    CREATE DATABASE full_stack_dev;
    CREATE USER full_stack_user WITH ENCRYPTED PASSWORD 'password123';
    GRANT ALL PRIVILEGES ON DATABASE full_stack_dev TO full_stack_user;
```
**Note:** database run on **_localhost_** and **_port 5432_**

fill the `.env` file with below variables then run `db-migrate up` to apply migrations to database.

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file

`POSTGRES_HOST`  
`POSTGRES_DB`  
`POSTGRES_TEST_DB`  
`POSTGRES_USER`  
`POSTGRES_PASSWORD`  
`POSTGRES_PORT`  
`BCRYPT_PASSWORD`   
`SALT_ROUNDS`   
`TOKEN_SECRET`  
`ENV`   
## Running Tests

To run tests, run the following command

```bash
  yarn test
```


## Database Diagrame

to understand models relations, please see this diagram

![Database Diagrame](https://github.com/MrAhmedElsayed/storefront-egfwd/blob/main/public/images/full_stack_dev.png)


## API Reference

### - Products 

#### Get all Products

```http
  GET /products
```

sample output

```json
[
    {
        "id": 1,
        "name": "Corsair Vengeance RGB Pro SL 32GB",
        "price": 250
    }
]
```

#### Get Product

```http
  GET /products/:productId
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `productId` | `string` | **Required**. id for product |

sample output

```json
{
    "id": 1,
    "name": "Corsair Vengeance RGB Pro SL 32GB",
    "price": 250
}
```

#### create product

```http
  POST /products    [token required]
```

body

```json
{
    "name": "test product 4",
    "price": 12
}
```

#### list user's order products

```http
  GET /user/:userID/orders/:orderID/products
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userID` | `string` | **Required**. user id |
| `orderID` | `string` | **Required**. user order id |

sample output

```json
[
    {
        "id": 1,
        "name": "Corsair Vengeance RGB Pro SL 32GB",
        "price": 250,
        "quantity": 1,
        "order_id": "3",
        "product_id": "3"
    }
]
```

### - Users

#### authenticate user

```http
  POST /users/login
```
body

```json
{
    "username": "sara",
    "password": "123"
}
```

sample output [user token]

```json
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC ...."
```


#### Get all Users

```http
  GET /users     [token required]
```

sample output

```json
[
    {
        "id": 1,
        "name": "Corsair Vengeance RGB Pro SL 32GB",
        "price": 250
    }
]
```

#### Get user

```http
  GET /users/:userId/    [token required]
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userID` | `string` | **Required**. user id |

sample output

```json
{
    "id": 2,
    "username": "sarah",
    "first_name": "sara",
    "last_name": "Ali",
    "password": "$2b$10$dpjDOlbwkPjb4wSqqI.iVOSVyK6jkV3c.DV4y7nUF0agbtl6LvZKW"
}
```

#### create user

```http
  POST /users   [token required]
```

body

```json
{
   "username": "sarah123",
   "first_name": "sara",
   "last_name": "Ali",
   "password": "123"
}
```

sample output [user token]

```json
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC ...."
```


### - Orders

#### Get all Orders

```http
  GET /orders     [token required]
```

sample output

```json
[
    {
        "id": 2,
        "status": "open",
        "user_id": "1"
    },
    {
        "id": 3,
        "status": "open",
        "user_id": "1"
    }
]
```

#### Current Order by user (args: user id)[token required]

```http
  GET /user/:userId/orders    [token required]
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userID` | `string` | **Required**. user id |

sample output

```json
[
    {
        "id": 2,
        "status": "open",
        "user_id": "1"
    }
]
```

#### create user order

```http
  POST /user/:userId/create-order   [token required]
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userID` | `string` | **Required**. user id |

body

```json
{
    "status": "open"
}
```

sample output

```json
{
    "id": 4,
    "status": "open",
    "user_id": "1"
}
```



#### add products to order

```http
  POST /orders/:orderId/products   [token required]
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `orderId` | `string` | **Required**. order id |

body

```json
{
    "quantity": 1,
    "product_id": 3
}
```

sample output

```json
{
    "id": 2,
    "quantity": 1,
    "order_id": "3",
    "product_id": "3"
}
```