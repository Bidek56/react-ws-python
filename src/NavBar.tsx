import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from '@material-ui/core';
import { Home, ExitToApp } from '@material-ui/icons';
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(1, 2),
            backgroundColor: '#e3f2fd'
        },
        link: {
            display: 'flex',
        },
        icon: {
            marginRight: theme.spacing(0.5),
            width: 20,
            height: 20,
        }
    }),
);

const NavBar = ({ logout }: { logout: () => void }) => {

    const classes = useStyles();

    return (
        <Paper elevation={2} className={classes.root}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" href="/" className={classes.link}>
                    <Home className={classes.icon} />
                Menu
            </Link>
                <Link color="inherit" href='/' className={classes.link} onClick={logout} >
                    <ExitToApp className={classes.icon} />Logout
            </Link>
            </Breadcrumbs>
        </Paper>
    );
}

NavBar.propTypes = {
    logout: PropTypes.func.isRequired
}

export default NavBar;