import React from 'react'
import PropTypes from 'prop-types'
import { Avatar, Button, Container, Box, CssBaseline, TextField, Typography, Link } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import { StatusContext, contextType } from './StatusContext';

type LoginProps = { setUser: (username: string | null) => void, }

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        '@global': {
            body: {
                backgroundColor: theme.palette.common.white,
            },
        },
        paper: {
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },
    }));

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://reactjs.org/">React</Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
 
const Login = ({ setUser }: LoginProps ) => {

    const userRef = React.useRef<string>('');
    const passRef = React.useRef<string>('');
    const classes = useStyles();

    const { ws, loginError } = React.useContext<contextType>(StatusContext);

    const getUserWs = async () => {

        // console.log("Login WS:", ws.current)

        try {
            ws.current.send(JSON.stringify({ action: "doLogin", login: { user: userRef?.current, pass: passRef?.current }} ));
        }
		catch(err: unknown) {
            if (err instanceof Error)
		        console.error(err.message);
		}
    }

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userRef?.current) {
            console.log('Missing user')
            alert('Missing user')
            setUser(null)
            return
        }

        if (!passRef?.current) {
            console.log('Missing password')
            alert('Error: Missing password')
            setUser(null)
            return
        }

        getUserWs()
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">Sign in</Typography>
                <form id="loginForm" className={classes.form} noValidate onSubmit={handleSignIn}>
                    <TextField id="userInput" variant="outlined" margin="normal" required fullWidth
                        label="User name" name="user" autoComplete="user" autoFocus onChange={e => userRef.current = e.target.value} />
                    <TextField id="passwordInput" variant="outlined" margin="normal" required fullWidth name="password"
                        label="Password" type="password" autoComplete="current-password" onChange={e => passRef.current = e.target.value} />
                    <Button id="signButton" type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>Sign in</Button>                    
                </form>
                {loginError && <Alert severity="error">Login error: {loginError}</Alert>}
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}

Login.propTypes = {
    setUser: PropTypes.func.isRequired
}

export default Login;