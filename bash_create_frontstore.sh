#!/usr/bin/env bash

#https://losikov.medium.com/part-1-project-initial-setup-typescript-node-js-31ba3aa7fbf1

echo "----------------------------------------- Generate Project -----------------------------------------"
# Create an initial package.json, the project configuration file
yarn init

# dependencies
yarn add bcrypt@5.0.1 body-parser@1.20.0 cors@2.8.5 db-migrate@0.11.13 db-migrate-pg@1.2.2 dotenv@16.0.0 express@4.17.3 jsonwebtoken@8.5.1 pg@8.7.3
# devDependencies (-D flag is a development dependency)
yarn add -D @types/bcrypt@5.0.0 @types/body-parser@1.19.2 @types/cors@2.8.12 @types/db-migrate-pg@0.0.10 @types/dotenv@8.2.0 @types/eslint@8.4.1 @types/express@4.17.13 @types/jasmine@4.0.2 @types/jsonwebtoken@8.5.8 @types/node@17.0.23 @types/pg@8.6.5 eslint@8.12.0 eslint-config-prettier@8.5.0 eslint-plugin-prettier@4.0.0 jasmine@4.0.2 jasmine-spec-reporter@7.0.0 prettier@2.6.2 ts-node@10.7.0 tsc-watch@4.6.2 typescript@4.6.3 @typescript-eslint/eslint-plugin@5.18.0 @typescript-eslint/parser@5.18.0
yarn global add db-migrate
echo "-------------------------------------- Done Generate Project"

echo " "

echo "-------------------------------- Initial Project With tsconfig.json --------------------------------"
# Create tsconfig.json, required for tsc and ts-node, to compile TypeScript to JavaScript:
yarn tsc --init --target es5 --rootDir src --outDir ./dist --esModuleInterop --lib ES2019,DOM --module commonjs --noImplicitAny true --skipLibCheck true
echo "-------------------------------------- tsconfig.json Created"

echo " "

echo "------------------------------------- Create Project Structure -------------------------------------"
# Create source file in src Directory
mkdir src

#create server.ts
cat >src/server.ts <<ENDOFFILE
import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import userRoutes from "./handlers/user";

const app: express.Application = express()
const address: string = "0.0.0.0:3000"

const corsOptions = {
    origin: 'http://127.0.0.1:3000',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(bodyParser.json())

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})

userRoutes(app)

app.listen(3000, function () {
    console.log(\`starting app on: \${address}\`)
})
ENDOFFILE

#create database.ts
cat >src/database.ts <<ENDOFFILE
import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_TEST_DB,
    ENV,
} = process.env

let client
console.log(ENV)

if(ENV === 'test') {
    client = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
    })
}

if(ENV === 'dev') {
    client = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_TEST_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
    })
}

export default client
ENDOFFILE

echo " "

#prettier
cat >.prettierrc <<ENDOFFILE
{
  "singleQuote": true,
  "printWidth": 80,
  "bracketSpacing": true,
  "semi": false
}
ENDOFFILE

cat <<EOF
"----------------------------------------- Configure eslint -----------------------------------------"
 |       * To check syntax and find problems                                                         |
 |       * JavaScript modules (import/export)                                                        |
 |       * None of these                                                                             |
 |       * Does your project use TypeScript? »  Yes                                                  |
 |       * Where does your code run? »  Node.js                                                      |
 |       * What format do you want your config file to be in? JSON                                   |
 |       * @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest                  |
 |       ? Would you like to install them now with npm? » No (They already installed)                |
 -----------------------------------------------------------------------------------------------------
EOF

# configure eslint
yarn create @eslint/config

# add this scripts to package.json
#create server.ts
cat >past_to_packageJson_file.txt <<ENDOFFILE
"scripts": {
    "start": "npx ts-node src/server.ts",
    "watch": "tsc-watch --esModuleInterop src/server.ts --outDir ./dist --onSuccess \"node ./dist/server.js\"",
    "migrate": "db-migrate --env test up && db-migrate up",
    "test": "set ENV=test db-migrate --env test up && jasmine-ts && db-migrate db:drop test",
    "tsc": "tsc",
    "format": "prettier --config .prettierrc \"src/**/*.{js,html,ts}\" --write",
    "lint": "eslint --ext \"src/**/*.{js,ts}\"",
    "lint:fix": "npm run lint -- --fix"
  },
ENDOFFILE

# create handlers directory
mkdir src/handlers

#create user handler file
cat >src/handlers/user.ts <<ENDOFFILE
// USER HANDLERS
import express, {Request, Response} from "express";
import {User, UserStore} from "../models/user";

const store = new UserStore();

const userRoutes = (app: express.Application) => {
    app.get("/users", index);
    app.post("/users", create);
    app.get("/users/:id/", show);
    app.put("/users/:id", update);
    app.delete("/users/:id/", destroy);
};


const index = async (_req: Request, res: Response) => {
    const users = await store.index();
    res.json(users);
};

const show = async (_req: Request, res: Response) => {
    const user = await store.show(_req.params.id);
    // return error if user not found
    if (!user) {
        res.status(404).json("User not found");
    }
    res.status(200).json(user);
};

const create = async (req: Request, res: Response) => {
    try {
        const user: User = {
            username: req.body.username,
            password: req.body.password,
            age: req.body.age,
            phone: req.body.phone,
        };

        await store.create(user)
            .then(() => {
                res.status(200).json(user)
            })
            .catch(() => {
                res.status(400).json("Could not Create New user")
            })

    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const update = async (req: Request, res: Response) => {
    const user: User = {
        username: req.body.username,
        password: req.body.password,
        age: req.body.age,
        phone: req.body.phone,
    };
    try {
        // update user and return updated user
        await store.update(req.params.id, user)
            .then(() => {
                res.status(200).json(user);
            })
            .catch(() => {
                    res.status(404).json(\`Could not find user with id \${req.params.id}.\`);
                }
            );
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const destroy = async (req: Request, res: Response) => {
    try {

        const user = await store.show(req.params.id);
        // return error if user not found
        if (!user) {
            res.status(404).json("User not found");
        }

        const deleted = await store.delete(req.params.id);
        res.json(deleted);
    } catch (error) {
        res.status(400);
        res.json({error});
    }
};

export default userRoutes;

ENDOFFILE

cat >src/handlers/product.ts <<ENDOFFILE
// PRODUCT HANDLERS
ENDOFFILE

cat >src/handlers/order.ts <<ENDOFFILE
// ORDER HANDLERS
ENDOFFILE

# create models directory
mkdir src/models

#create user model file
cat >src/models/user.ts <<ENDOFFILE
// @ts-ignore
import Client from "../database";

export type User = {
    id?: string;
    username: string;
    password: string;
    age: number;
    phone: string;
};

export class UserStore {
    async index(): Promise<User[]> {
        try {
            // @ts-ignore
            const conn = await Client.connect();
            const sql = "SELECT * FROM users";

            const result = await conn.query(sql);

            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(\`Could not get users. Error: \${err}\`);
        }
    }

    async show(id: string): Promise<User> {
        try {
            const sql = "SELECT * FROM users WHERE id=(\$1)";

            // @ts-ignore
            const conn = await Client.connect();

            const result = await conn.query(sql, [id]);

            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(\`Could not find user \${id}. Error: \${err}\`);
        }
    }

    async create(u: User): Promise<User> {
        try {
            const sql =
                "INSERT INTO users (username, password, age, phone) VALUES(\$1, \$2, \$3, \$4)";
            // @ts-ignore
            const conn = await Client.connect();

            const result = await conn.query(sql, [
                u.username,
                u.password,
                u.age,
                u.phone,
            ]);

            const user = result.rows[0];

            conn.release();

            return user;
        } catch (err) {
            throw new Error(\`Could not add new user \${u.username}. Error: \${err}\`);
        }
    }

    async update(id: string, u: User): Promise<User> {
        try {
            const user = await this.show(id);

            if (!user) {
                throw new Error(\`Could not find user \${id}\`);
            }

            const sql =
                "UPDATE users SET username = \$2, password = \$3, age = \$4, phone = \$5 WHERE id=(\$1)";
            // @ts-ignore
            const conn = await Client.connect();

            const result = await conn.query(sql, [
                id,
                u.username,
                u.password,
                u.age,
                u.phone,
            ]);

            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(\`Could not find user \${u.id}. Error: \${err}\`);
        }
    }

    async delete(id: string): Promise<User> {
        try {
            const sql = "DELETE FROM users WHERE id=(\$1)";
            // @ts-ignore
            const conn = await Client.connect();

            const result = await conn.query(sql, [id]);

            const user = result.rows[0];

            conn.release();

            return user;
        } catch (err) {
            throw new Error(\`Could not delete user \${id}. Error: \${err}\`);
        }
    }
}

ENDOFFILE

cat >src/models/product.ts <<ENDOFFILE
// PRODUCT MODEL
ENDOFFILE

cat >src/models/order.ts <<ENDOFFILE
// ORDER MODEL
// We added the method to attach a product to and order in the order model.
/*
async addProduct(quantity: number, orderId: string, productId: string): Promise<Order> {
    try {
      const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES(\$1, \$2, \$3) RETURNING *'
      //@ts-ignore
      const conn = await Client.connect()

      const result = await conn
          .query(sql, [quantity, orderId, productId])

      const order = result.rows[0]

      conn.release()

      return order
    } catch (err) {
      throw new Error(\`Could not add product \${productId} to order \${orderId}: \${err}\`)
    }
  }
*/
ENDOFFILE

# create .env file
cat >.env <<ENDOFFILE
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=full_stack_dev
POSTGRES_TEST_DB=full_stack_test
POSTGRES_USER=full_stack_user
POSTGRES_PASSWORD=password123
POSTGRES_PORT=5432
TOKEN_SECRET=ahmedsecrettoken!
BCRYPT_PASSWORD=ahmedsecretpassword!
ENV=dev
ENDOFFILE

cat >database.json <<ENDOFFILE
{
  "dev": {
    "driver": "pg",
    "host": {
      "ENV": "POSTGRES_HOST"
    },
    "database": {
      "ENV": "POSTGRES_DB"
    },
    "user": {
      "ENV": "POSTGRES_USER"
    },
    "password": {
      "ENV": "POSTGRES_PASSWORD"
    },
    "port": {
      "ENV": "POSTGRES_PORT"
    }
  },
  "test": {
    "driver": "pg",
    "host": {
      "ENV": "POSTGRES_HOST"
    },
    "database": {
      "ENV": "POSTGRES_TEST_DB"
    },
    "user": {
      "ENV": "POSTGRES_USER"
    },
    "password": {
      "ENV": "POSTGRES_PASSWORD"
    },
    "port": {
      "ENV": "POSTGRES_PORT"
    }
  }
}

ENDOFFILE
echo "---------------------------------- Done Create Project Structure"

echo " "

echo "----------------------------------------- Add Jasmine Test -----------------------------------------"
npx jasmine init

# create test directory
mkdir src/models/tests

# create test file for user model
touch src/models/tests/user.spec.ts

# add helper directory
mkdir src/models/tests/helpers

# create report.ts file
cat >src/models/tests/helpers/report.ts <<ENDOFFILE
import {
    DisplayProcessor,
    SpecReporter,
    StacktraceOption,
} from 'jasmine-spec-reporter'
import SuiteInfo = jasmine.SuiteInfo

class CustomProcessor extends DisplayProcessor {
    public displayJasmineStarted(info: SuiteInfo, log: string): string {
        return \`TypeScript \${log}\`
    }
}

jasmine.getEnv().clearReporters()
jasmine.getEnv().addReporter(
    new SpecReporter({
        spec: {
            displayStacktrace: StacktraceOption.NONE,
        },
        customProcessors: [CustomProcessor],
    })
)
ENDOFFILE

# remove old jasmine.json
rm spec/support/jasmine.json

# edit tests file spec/jasmine.json
cat >spec/support/jasmine.json <<ENDOFFILE
{
  "spec_dir": "dist/models/tests",
  "spec_files": [
    "**/*[sS]pec.?(m)js"
  ],
  "helpers": [
    "helpers/**/*.?(m)js"
  ],
  "env": {
    "stopSpecOnExpectationFailure": false,
    "random": false
  }
}
ENDOFFILE

echo "-------------------------------------- Done Add Jasmine Test"

echo " "

echo "---------------------------------------- Migrate Models ----------------------------------------"

db-migrate create products --sql-file

PRODUCT_MIGRATE_UP=$(find migrations/sqls/*products-up.sql -print -type f)
echo "$PRODUCT_MIGRATE_UP"

cat <<EOF >"$PRODUCT_MIGRATE_UP"
-- Products UP
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    price integer NOT NULL
);
EOF

PRODUCT_MIGRATE_DOWN=$(find migrations/sqls/*products-down.sql -print -type f)
echo "$PRODUCT_MIGRATE_DOWN"

cat <<EOF >"$PRODUCT_MIGRATE_DOWN"
DROP TABLE IF EXISTS products;
EOF

db-migrate create users --sql-file
USER_MIGRATE_UP=$(find migrations/sqls/*users-up.sql -print -type f)
echo "$USER_MIGRATE_UP"

cat <<EOF >"$USER_MIGRATE_UP"
-- Users Up
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(15) NOT NULL,
    last_name VARCHAR(15) NOT NULL,
    password VARCHAR(100) NOT NULL
);
EOF

USER_MIGRATE_DOWN=$(find migrations/sqls/*users-down.sql -print -type f)
echo "$USER_MIGRATE_DOWN"

cat <<EOF >"$USER_MIGRATE_DOWN"
DROP TABLE IF EXISTS users;
EOF

db-migrate create orders --sql-file

ORDER_MIGRATE_UP=$(find migrations/sqls/*orders-up.sql -print -type f)
echo "$ORDER_MIGRATE_UP"

cat <<EOF >"$ORDER_MIGRATE_UP"
-- Orders UP
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(15),
    user_id bigint REFERENCES users(id)
);
EOF

ORDER_MIGRATE_DOWN=$(find migrations/sqls/*orders-down.sql -print -type f)
echo "$ORDER_MIGRATE_DOWN"
cat <<EOF >"$ORDER_MIGRATE_DOWN"
DROP TABLE IF EXISTS orders;
EOF

db-migrate create order_products --sql-file
ORDER_PRODUCTS_MIGRATE_UP=$(find migrations/sqls/*order-products-up.sql -print -type f)
echo "$ORDER_PRODUCTS_MIGRATE_UP"

cat <<EOF >"$ORDER_PRODUCTS_MIGRATE_UP"
-- Order-Products UP
CREATE TABLE IF NOT EXISTS order_products (
    id SERIAL PRIMARY KEY,
    quantity integer,
    order_id bigint REFERENCES orders(id),
    product_id bigint REFERENCES products(id)
);
EOF

ORDER_PRODUCTS_MIGRATE_DOWN=$(find migrations/sqls/*order-products-down.sql -print -type f)
echo "$ORDER_PRODUCTS_MIGRATE_DOWN"
cat <<EOF >"$ORDER_PRODUCTS_MIGRATE_DOWN"
DROP TABLE IF EXISTS order_products;
EOF

echo " "

echo "-------------------------------------- Finally Build Project --------------------------------------"
# Build the project:
yarn tsc
echo "----------------------------------------- Congratulations -----------------------------------------"
