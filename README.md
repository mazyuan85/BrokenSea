# BrokenSea - GA Unit 2 Project

## Project Brief

- Built with HTML, EJS, CSS, Express, MongoDB and Javascript
- To simulate full-stack web development
- Hosted on Cyclic
 
 ## Timeframe

 1 week

 ## Technologies & Tools Used

 - HTML
 - Javascript
 - EJS
 - CSS
 - MongoDB
 - Express
 - express-session (for cookies)
 - bcrypt (for hashing passwords)
 - connect-mongo (for user authentication)

<br>

## Overview

![BrokenSea](https://raw.githubusercontent.com/mazyuan85/BrokenSea/main/public/images/brokensea.png)

BrokenSea is a simulation of a NFT marketplace. After a visitor registers an account and logs in, they can perform different actions such as listing, buying, selling, or even burning (destroying) their own NFTs. 

As a creator, a user can also mint their own NFT collection and put them up for sale on the marketplace.

## Deployment 

This project is deployed on Cyclic: https://mysterious-suspenders-fawn.cyclic.app/

## Core Features

![BrokenSeaMainPage](https://raw.githubusercontent.com/mazyuan85/BrokenSea/main/public/images/brokenseamainpage.png)

As a visitor:
- View all collections
- View all NFTs, listed prices, and previous transactions

As a user: 
(in addition to the above)
- Mint (create) a brand new collection and NFTs
- Buy, sell, delist, or update price of NFTs
- Deposit imaginary currency
- Create multiple wallets within an account
- Burn (destroy) an NFT

## Database Model

![DatabaseSchema](https://raw.githubusercontent.com/mazyuan85/BrokenSea/main/public/images/dbdiagram.png)

#### Basic Relationships
A user can have many wallets.
A wallet can own many NFTs.
A NFT collection can have many NFTs.
The marketplace model keeps track of transactions of each individual NFT.

## Development Process

- Conjured model schematics with basic validation
- Drew up HTML wireframe
- Started with registering of users and logging in functions, including hashing of passwords with bcrypt
- Continued with wallet creation, including the ability to add multiple wallets and deposit imaginary currency
- Worked on minting a brand new NFT collection associated with a single wallet
- Created index, collection, single item pages to display NFTs
- Improved CSS to enhance overall user experience
- Integrated connect-mongo for proper cookie storage and user auth

## Future Implementations

- More secure validations
- Transfer NFTs between users
- Allow user to import NFTs through JSON files

## References

- CSS template used: https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_templates_marketing&stacked=h
- Convert MongoDB JSON to SQL: https://sqlizer.io/
- Convert SQL into Database Model Diagram: https://dbdiagram.io/
