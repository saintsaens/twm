The Witcher Marketplace (TWM) is a portfolio project using the [PERN stack](https://www.geeksforgeeks.org/what-is-pern-stack/), and the [French State Design System](https://www.systeme-de-design.gouv.fr/).

You can access my public implementation [here](https://twm-frontend.onrender.com/), or follow the instructions below to set up and run the app in your local environment.

## Contents
1. [Prerequisites](#prerequisites)
2. [Install database](#install-database)
3. [Install backend](#install-backend)
4. [Install frontend](#install-frontend)
5. [Run tests](#run-tests)

# Prerequisites

- Clone the repository
- Make sure you have the following installed:
    - Node.js (>=16.0.0)
    - npm (comes with Node.js)
    - PostgreSQL (for database setup)

## Install database

Once PostgreSQL is installed, you need to create a new database. Run the following commands in your terminal or command prompt:

```bash
$ psql -U postgres
```

This will log you into PostgreSQL. Next, create the database for the project:

```bash
$ CREATE DATABASE twm;
```

Then, load the twm.sql file from the repo into your PostgreSQL database.

```bash
$ psql -U postgres -d twm -f /path/to/twm.sql
```

Replace /path/to/twm.sql with the actual path to your twm.sql file.

This command will execute the SQL statements in the dump file and set up the database schema, including tables, constraints, and relationships.

Once the schema is loaded, you can verify that the tables and structures have been created by running:

```bash
$ psql -U postgres -d twm
```

And then:

```bash
\dt
```

## Install backend

- From the root directory, open the backend & install dependencies
    
    ```
    $ cd backend
    $ npm install
    ```
    
- Create an .env file, with the following variables:
    - `SESSION_SECRET`: a random string
    - `PORT`: the port for the backend
    - `DATABASE_URL`: the URL to the local database you created in the previous step
    - `ALLOWED_ORIGINS`: a comma-separated list of URLs where your frontend is going to be hosted.

For example:

```bash
SESSION_SECRET=you-worrisome-toby-jug-of-infected-newt-jet
PORT=3001
DATABASE_URL=postgres://sam@localhost:5432/twm
ALLOWED_ORIGINS=http://localhost:3000,https://twm.badass.com
```

- Run the start command:

```bash
$ npm start
```

And you should see:

```bash
Listening on port 3001…
Connected to PostgreSQL database successfully!
```

## Install frontend

- From the root directory, open the frontend & install dependencies
    
    ```
    $ cd frontend
    $ npm install
    ```
    
- Create an .env file, with the following variables:
    - `REACT_APP_API_URL`: the base URL for the API calls

For example:

```bash
REACT_APP_API_URL=''
```

If you’re hosting your backend someplace, you’ll have to edit that to

```bash
REACT_APP_API_URL='https://twm-backend.badass.com'
```

1. If you chose a port other than 3001 in the backend installation step, edit the line `proxy` from `package.json`

```bash
[...]
"proxy": "http://localhost:<your_port>",
[...]
```

- Run the start command:

```bash
$ npm start
```

## Run tests

### Frontend tests

```bash
$ cd frontend
$ npm test
```

### Backend tests

```bash
$ cd backend
$ npm test
```
