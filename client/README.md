## Getting Started

### Setting up the project for the first time?

- Install [nvm](https://github.com/nvm-sh/nvm).
- Install Node 12: `nvm install 12`
- Switch to using Node 12: `nvm use 12`
- From this directory, `npm run setup` to install front end dependencies and create an `.env` file
- get a [Mapbox](https://account.mapbox.com/auth/signin/) API token and add that to your `.env` file as the `MAPBOX_TOKEN`
- get the `API_URL` from a team member and add that to your `.env` file. Alternatively, you can [bring up](https://github.com/hackforla/311-data/blob/dev/docs/server_setup.md) your own local server and use that.

Setup complete!

### Development

- From this directory, `npm start` to check your `.env` file and start webpack dev server

Your browser should open to `0.0.0.0:3000` and the site should render. Webpack will detect saved code changes, rebuild the bundle in memory, and update the site in your browser.

Stop webpack dev server with `Ctrl-C`.

### Useful commands

```
npm run setup                 # install dependencies listed in package.json and check .env file
npm run check-env             # checks .env file exists and has all required keys
npm start                     # check .env file and start webpack dev server
npm run dev                   # start webpack dev server (no .env check)
npm run build                 # run webpack in production mode - output is placed in dist directory
npm run lint                  # lint javascript in client directory
```
