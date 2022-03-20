# Quartz
Quartz is a decentralized cash system built like a blockchain, but which stores user data on a webTRC-based graph database to allow for faster queries and light-weight storage.

The app is available [here](https://quartz-bank.herokuapp.com/)

## Table of contents
* [Scope](#scope)
* [Technologies](#technologies)
* [Features](#features)
* [Setup](#setup)
* [Sources](#sources)

## Scope
The app was built as a second project during Ironhack's Full Stack Developer bootcamp.
It was awarded gold medal for best project by teachers and students.

## Features
* User authentication and authorization via Passport
* Off-chain data stored in a MongoDB database
* On-chain data store on [Gun](https://gun.eco/)
* Password reset via Nodemailer
* Svg animations using Green Sock
* Purchasing QRTZ Coins via Stripe
* Proof of Work algorithm for block mining
* Merkle Tree structure for storing transaction data

## Set up
### Dependencies
This project is built with:
* @types/node: 17.0.13
* axios: 0.26.0
* bcryptjs: 2.4.3
* connect-mongo: 4.6.0
* cookie-parser: 1.4.6
* cors: 2.8.5
* crypto-js: 4.1.1
* dotenv: 14.3.2
* express: 4.17.2
* express-session: 1.17.2
* gun: 0.2020.1235
* human-readable-ids: 1.0.4
* mongoose: 6.1.8
* morgan: 1.10.0
* nodemailer: 6.7.2
* passport: 0.5.2
* passport-google-oauth: 2.0.0
* passport-local: 1.0.0
* stripe: 8.203.0
* typescript: 4.5.5

### Config variables
* PORT
ORIGIN
MONGODB_URI
GMAIL_USER
GMAIL_PWD
GOOGLE_OAUTH_ID
GOOGLE_OAUTH_SECRET
GOOGLE_OAUTH_CALLBACK_URL
STRIPE_PRIV_KEY

## Sources
This project is based on CodePulse's tutorial on Youtube.

Available at: https://www.youtube.com/watch?v=Eythq9848Fg&list=PLZQftyCk7_SdoVexSmwy_tBgs7P0b97yD&index=2
