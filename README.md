# Fullstack Flipper app

A small Twitter clone that allows users to create accounts, post messages and follow other users. 

This project is made with NodeJs, Express, Redis, Pug. I've used Javascript Esnext syntax and Tailwindcss for the style.

For Redis database I've choosed to use an online service: https://railway.app

# Start the project for dev

First install the dependencies with `yarn install` then copy/paste .env.example file, rename it .env and change the value in it especially the DATABASE_URI variable.
You can now run the watch command: `yarn watch`

This project is not for running in production, only the local dev/watch mode is working.
