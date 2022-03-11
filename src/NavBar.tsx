import { Paper, Breadcrumbs, Link } from '@mui/material';
import { Home, ExitToApp } from '@mui/icons-material';
import PropTypes from 'prop-types'


const NavBar = ({ logout }: { logout: () => void }) => {

    return (
        <Paper elevation={2} sx={{ py: 1, px: 1.5, backgroundColor: '#e3f2fd' }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" href="/" sx={{display: 'flex'}}>
                    <Home sx={{py: 0.5, width: 20, height: 20 }} />
                Menu
            </Link>
                <Link color="inherit" href='/' sx={{display: 'flex'}} onClick={logout} >
                    <ExitToApp sx={{py: 0.5, width: 20, height: 20 }} />Logout
            </Link>
            </Breadcrumbs>
        </Paper>
    );
}

NavBar.propTypes = {
    logout: PropTypes.func.isRequired
}

export default NavBar;