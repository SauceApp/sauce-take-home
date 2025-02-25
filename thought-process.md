step 1: run the program
    - run server 
        1, error
        2. run again, check out the folder and reinstall dotenv-cli
        3. the error is at better-sqlite3, remove it from the package:     // "better-sqlite3": "^9.4.3",
        4. done, reinstall better-sqlite3, update version is 11.8.1
        5. run again 
            "Server is running on check out the playground http://localhost:4000/graphql"
    - run ui
        1. they use vite.js
        2. Have nothing except the title "feedback"
step 2: analyse task
- persist the generated highlights in the db
- display the highlights along with the parent feedback in the rendered list 
- add pagination to the rendered feedback list 
- allow bulk creating without having the API waiting for highlight creation 

step 3: analyse the structure
- server
    -what is graphql-yoga and create yoga. createServer(yoga)
- sql:
    - schema in main.ts is call from sql/schema
        - what is makeExecutableSchema from @graphql-tools/schema
        - what is resolvers and typeDefs
    - schema is import from resolvers and typedevs
    - typeDefs define:
        - Query to have feedback datatype and feedback page datatype
        - Mutation is feedback
        - Feedback is id, text and list of (**highlight**) of the feedbacl
        - Highlight item include int, quote and summary
        - Feedback page is include a list of feedback  and number of feedbacks
    - Resolver get the data from store/feedback and service/feedback
        - resolver get the query data:
            - feedback, get ffedback frim feedback store. input feedback_id
            - feedbacks from feedback page from feedback service. Input page and per_page. what is this in this case.
        - mutation:
            or create feedback when user input a string
        - feedback:
            include a list of highlight <-- seems like I have to create a feedback service here..
- store:
    - store/feedback that resolve get data from .db
        - .db is to create a scehma for feedback and hihglight
            - highlight db has the forein key to feedback id
            - the task is to store the data in here. 
        - it has a datatype about with Highlight datatype 
        - evert get_ functin, it will queryt from db. ? is simlar to {} in python
- service:
    - service/feedback that have a function createfeedback that use prompt from ai/prompt
    - the first service is to add the string in the store, the second is run the analysis from prompt 
    - the second service is to add the feedbackpage into the vfeedbackstore. 
- ai prompt:
    - it has runFeedbackAnalysis:
        - generate id with v4
        - define a prompt 
        - then fit the thing in openai client 
        - and then parse into a Schema. using highlightPromptResult from models
        ideas: structured output so you dont even have to parse schema??
    - model
        - what is z from zod 
        - using to infer the schema i think.
    
step 4: plan
    - task 1: persist highlights
        - at service/feedback: add highlight results into the highlight schema
    - task 2: display the highlight along the parent feedback in the rendered list
        - edit resolvers
        - test with yogagraphql
                query GetFeedbackHighlights($id: Int!) {
                feedback(id: $id) {
                    id
                    text
                    highlights {
                    id
                    quote
                    summary
                    }
                }
                }
    - task 3: add pagination to the rendered
        - want to show highlights: change api.ts
        - edit Ui/feedback-list.tsx: retrieve the feedback at page 1 and page 2 
   
    - task 4: bulk creation
        - define the action typedefs.ts
        - add the action resolvers
        - add the function in feedback.ts 
        - test
        mutation ($texts: [String!]!) {
            createBulkFeedback(text: $texts) {
                id
                text
                highlights {
                id
                summary
                quote
                }
            }
            }

step 5: execute
    - forgot to document 
