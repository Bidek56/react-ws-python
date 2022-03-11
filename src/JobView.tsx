import React from 'react'
import { StatusContext, contextType } from './StatusContext';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Assignment } from '@mui/icons-material';

// Dialog related items
import { DialogProps } from '@mui/material/Dialog';


const ScrollDialog: React.FC<{ path: string, logContent: string|undefined }> = ({ path, logContent }) => {

    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

    const descriptionElementRef = React.useRef<HTMLElement>(null);
    React.useEffect(() => {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
            descriptionElement.focus();
        }
    }, [open]);

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
                <DialogTitle id="scroll-dialog-title">Log for: {path}</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                        style={{ whiteSpace: 'pre-line' }}
                    >
                        {logContent}
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

    const { userCount, completedCount, log, logContent } = React.useContext<contextType>(StatusContext);

    return (
        <Table sx={{minWidth: 650}}>
            <TableHead sx={{backgroundColor: '#e3f2fd'}}>
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
                    <TableCell>{log && <ScrollDialog path={log} logContent={logContent} />}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )

}

export default JobTableView;