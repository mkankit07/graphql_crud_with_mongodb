const express = require('express')
const bodyParser = require('body-parser')
const { graphqlHTTP } = require('express-graphql')
const mongoose = require("mongoose")
const app = express()
const { buildSchema } = require('graphql')
const PORT = 5000
const bcrypt = require('bcrypt')
app.use(bodyParser.json());
const Event = require("./models/event")
const User = require("./models/user")
app.use("/graphql", graphqlHTTP({
    schema: buildSchema(`
     type Event {
         _id:ID!
         title:String!
         description:String!
         price:Float!
         date:String!
     }
     type User{
        _id:ID!
         name:String!
         email:String!
         password:String!
     }
     
     input UserInput {
        name:String!
         email:String!
         password:String!
    }

     input EventInput {
         title:String!
         description:String!
         price:Float!
         date:String!
     }
     type RootQuery {
         events:[Event!]!
     }
 
     type RootMutation {
          createEvent(eventInput:EventInput):Event
          createUser(userInput:UserInput):User
     }
     schema{
         query:RootQuery
         mutation:RootMutation
     }`),
    rootValue: {
        events: () => {
            return Event.find().then((events) => {
                return events
            }).catch(err => {
                console.log(err);
            })
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            })
            return event.save().then(result => {
                console.log(result)
                return result
            }).catch(err => {
                console.log(err)
                throw err
            }
            )
        },
        createUser: (args) => {
            return User.findOne({ email: args.userInput.email }).then((data) => {
                if (data) {
                    throw new Error("User already exists")
                } else {
                    const user = new User({
                        name: args.userInput.name,
                        email: args.userInput.email,
                        password: bcrypt.hashSync(args.userInput.password, 10),
                    })
                    return user.save().then(result => {
                        console.log(result)
                        return result
                    }).catch(err => {
                        console.log(err)
                        throw err
                    }
                    )
                }
            })

        }
    },
    graphiql: true
}))
// app.get("/",)
mongoose.connect("mongodb://localhost:27017/graphqlDb").then(() => {
    app.listen(PORT, () => {
        console.log(`your server listening on ${PORT}`)
    })
}).catch(err => {
    console.log(err);
})
