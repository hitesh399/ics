# How to setup Server for API

1. Clone repo
2. Open terminal and go to project root directory
3. go to server directory
4. run `npm install`
5. rename .env.example file to .env and update the mysql credentials 
6. run `adonis  migration:run` to create the database schema.
6. run `adonis serve --dev`

## command to import the data into database from https://news.ycombinator.com/ `adonis crawl` (Run this command at server directory)

# How to setup Client for Web Application

1. Open terminal and go to project root directory
2. go to client directory
3. run `npm install`
4. run `npm start`

