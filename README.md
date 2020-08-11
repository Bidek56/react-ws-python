The client of this project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

1. #### `npm start`

    Runs the app in the development mode.<br />
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

    The page will reload if you make edits.<br />
    You will also see any lint errors in the console.

2. #### `npm test`

    Launches the test runner in the interactive watch mode.<br />
    See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

3. #### `npm run build`

    Builds the app for production to the `build` folder.<br />
    It correctly bundles React in production mode and optimizes the build for the best performance.

    The build is minified and the filenames include the hashes.<br />
    Your app is ready to be deployed!

    See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `Front end server`

The server behind the frontend is written in Deno and Oak.

To run it:

1. [Install Deno](https://deno.land/#installation)

2. Use:
    1. `deno run --allow-net --allow-write --allow-env server.ts`
    
    Or

    2. use [denon](https://github.com/denosaurs/denon): `denon start`

### `Websocket server`
The websocket server is written using Python 3.8

Run it using: `python pyserver/server.py`
