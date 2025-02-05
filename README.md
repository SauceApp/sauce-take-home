# Sauce Technical Task


## The Project
This repository is a simplified and partial implementation of Sauce.

The project consists of a GraphQL server that exposes some queries and mutations to create and fetch feedback records.
A feedback record is simply some text with some form of product feedback. \
e.g. "The UI is too cluttered, I can't find the settings page." would be a feedback record explaining an issue someone is facing with a product.

The UI is a simple React application that renders a list of feedback records.

## The Task
Make changes in order to implement the following: \
\
**- Persist the generated highlights in the db (SQLite)** \
**- Display the highlights along with the parent feedback in the rendered list** \
**- Add pagination to the rendered feedback list**

**Bonus** \
**- Allow bulk creation without having the API waiting for highlight creation**

## Structure

#### Server
- ai - This package contains the AI types, client and prompt functions.
- gql - This package contains the GraphQL schema and resolvers.
- service - This package contains the executed logic.
- store - This package contains and interfaces with the data store (in-memory sqlite3).
- main.ts - The entry point of the graphql server.

#### UI
- feedback - This package contains the feedback list and the relevant graphql queries.
- App.tsx - The entry point of the UI.

## Running the project

### Server

```bash
# 1. Creates the .env file with the OpenAI secret placeholder.
#    Make sure to replace <shared-secret-key> with the secret that was shared with you.
# Hello
echo "OPENAI_SECRET=\"<shared-secret-key>\"" > server/.env
```

```bash
# 2. Install dotenv-cli so the secret can be resolved.
npm install -g dotenv-cli 
```

```bash
# 3. Run the server
cd server && npm install && npm run dev
```

### UI

```bash
# 1. Run the UI
cd ui && npm install && npm run dev
```

# API

You can access the GraphQL playground at
[http://localhost:4000/graphql](http://localhost:4000/graphql)
and run the sample queries below.

## Sample Queries
These queries are helpful for populating and fetching data.

```graphql
# Create a feedback record
mutation ($text: String!) {
  createFeedback(text: $text) {
    id
    text
  }
}

# Variables
#  {
#  "text": "Would be cool to have a \"merge\" option potentially? This issue and request are sort of related, and actually sourced from the same Slack message. Would be cool to merge them back into one."
#  }
```

```graphql
# Get a feedback record
query ($id: ID!) {
  feedback(id: $id) {
    id
    text
  }
}

# Variables
#  {
#  "id": "1"
#  }
```

```graphql
# Get a page of feedback records
query ($page: Int!, $per_page: Int!) {
  feedbacks(page: $page, per_page: $per_page) {
    id
    text
  }
}

# Variables
#  {
#  "page": 1,
#  "per_page": 10
#  }
```
