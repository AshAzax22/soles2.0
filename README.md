# Soles - A Sneaker Reselling E-commerce Site

Soles is an e-commerce platform dedicated to the reselling of sneakers. The platform provides a marketplace for sneaker enthusiasts to buy and sell their favorite footwear.

## Tech Stack

The project is built using the following technologies:

- **HTML**: The structure of the web pages is built using HTML.
- **Node.js**: The backend of the application is powered by Node.js, a JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **MongoDB**: The data is stored in a MongoDB database, a source-available cross-platform document-oriented database program.

## Project Steup

To run the application, follow these steps:

1. Clone the repository with `git clone github.com/AshAzax22.soles2.0.git` 
2. Install the dependencies with `npm install`.
3. Setup the server data with `npm run setup`.
4. Run the following command to boot up the local server ready to receive requests `npm start`

The website will be available on localport:5000

## Application Structure

- `app.js`: The entry point to our application. This file defines our express server and sets up Socket.io. It also requires the routes we'll be using in the application.
- `public/`: This folder contains static files like CSS and JavaScript files.
