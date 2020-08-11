import React from 'react'
import { StatusContext, contextType } from './StatusContext';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Assignment } from '@material-ui/icons';
// import { useCookies } from 'react-cookie';

// Dialog related items
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            marginTop: theme.spacing(3),
            overflowX: 'auto',
        },
        table: {
            minWidth: 650,
        },
        head: {
            backgroundColor: '#e3f2fd',
            color: theme.palette.common.white,
        },
        dialog: {
            whiteSpace: 'pre-line'
        }
    }),
);


const ScrollDialog: React.FC<{ path: string }> = ({ path }) => {

    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

    const descriptionElementRef = React.useRef<HTMLElement>(null);
    React.useEffect(() => {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
            descriptionElement.focus();
        }
    }, [open]);

    // const [cookies, ,] = useCookies(['token']);

    // let authorization = 'Bearer '
    // if (cookies && cookies.token)
    //     authorization += cookies.token

    const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
        setOpen(true);
        setScroll(scrollType);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="contained" color="primary" endIcon={<Assignment />} onClick={handleClickOpen('paper')}>Show Log</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                maxWidth='lg'
            >
                <DialogTitle id="scroll-dialog-title">Content from {path}</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                        style={{ whiteSpace: 'pre-line' }}
                    >
                        {path}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const JobTableView = (): JSX.Element => {

    const { userCount, completedCount, log } = React.useContext<contextType>(StatusContext);

    const classes = useStyles();

    return (
        <Table className={classes.table}>
            <TableHead className={classes.head}>
                <TableRow>
                    <TableCell>Users</TableCell>
                    <TableCell>Completed</TableCell>
                    <TableCell>Log</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow >
                    <TableCell>{userCount}</TableCell>
                    <TableCell>{completedCount}</TableCell>
                    <TableCell>{log && <ScrollDialog path={log} />}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )

}

export default JobTableView;