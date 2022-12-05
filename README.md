### The purpose of this project is to create a modern UI using React which connects to Python server using websocket in order to run long data tasks  
  

The client of this project was bootstrapped with [Vite](https://vitejs.dev) and it uses [MUI](https://mui.com/)

To install MUI with React 18, please `npm i --legacy-peer-deps` until MUI fixes it's support for React 18

### Available client scripts using npm

In the project directory, you can run:

1. #### `npm start`

    Runs the client app in the development mode.<br />
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

### `Python Websocket server`
The websocket server is written using Python 3.9

To run it:
1. `pip install -r pyserver/requirements.txt`
2. `python pyserver/server.py`

Or

1. `npm i -g nodemon`
2. `nodemon --exec python pyserver/server.py`
