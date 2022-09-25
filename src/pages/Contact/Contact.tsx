import React, {useEffect, useState} from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './contact.css'
import { visuallyHidden } from '@mui/utils';
import {Button, Modal, TextField} from "@mui/material";
import axios from "axios";

interface Data {
    id:number;
    name: string;
    phone: string;
}


function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Name',
    },
    {
        id: 'phone',
        numeric: false,
        disablePadding: false,
        label: 'Phone',
    }
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{
                                'aria-label': 'select all desserts',
                            }}
                        />
                    </TableCell>
                    {headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'left'}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                    <TableCell/>
                </TableRow>
            </TableHead>
    );
}

interface EnhancedTableToolbarProps {
    numSelected: number;
    click:() => void
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { numSelected, click } = props;


    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Nutrition
                </Typography>
            )}
            {numSelected > 0 && (
                <Tooltip title="Delete" onClick={click}>
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) }
        </Toolbar>
    );
};

export default function Contact() {
    const [open, setOpen] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [editName,setEditName] = useState('')
    const [editPhone,setEditPhone] = useState('')
    const [editId,setEditId] = useState(0)
    const handleOpenEdit = (id:number,name:string,phone:string) => {
        setOpenEdit(true)
        setEditName(name)
        setEditPhone(phone)
        setEditId(id)
    };
    const handleCloseEdit = () => setOpenEdit(false);

    const [name,setName] = useState('')
    const [phone,setPhone] = useState('')
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('phone');
    const [rows, setRows] = useState<Data[]>([]);
    const [selected, setSelected] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    function clickDel(){
        if (window.confirm("Вы уверены?")){
            for(let select of selected){
                axios.delete('http://localhost:3000/contact/'+select)
                    .then((res) => {

                    })
                    .catch(console.warn)
            }
            setSelected([])
        }
    }

    function clickEdit(){
        axios.put('http://localhost:3000/contact/'+editId,{name:editName, phone:editPhone})
            .then((res) => {
                axios.get('http://localhost:3000/contact')
                    .then((res) => {
                        handleCloseEdit()
                        setRows(res.data)

                    })
                    .catch(console.warn)
            })
            .catch(console.warn)
    }

    useEffect(() => {
       axios.get('http://localhost:3000/contact')
           .then((res) => {
               setRows(res.data)
           })
           .catch(console.warn)
    },[selected]);
    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => String(n.id));
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    function addClick(name:string,phone:string){
        axios.post('http://localhost:3000/contact',{name,phone})
            .then((res) => {
                setRows([...rows,res.data])
                setName('')
                setPhone('')
                handleClose()
            })
            .catch(console.warn)
    }

    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };



    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const changeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }
    const changePhone = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(event.target.value)
    }
    const changeEditName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditName(event.target.value)
    }
    const changeEditPhone = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditPhone(event.target.value)
    }

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <div>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <EnhancedTableToolbar numSelected={selected.length} click={clickDel} />
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={ 'medium'}
                        >
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                            />
                            <TableBody>
                                {stableSort(rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(String(row.id));
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover

                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        onClick={(event) => handleClick(event, String(row.id))}
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                >
                                                    {row.name}
                                                </TableCell>
                                                <TableCell >{row.phone}</TableCell>
                                                <TableCell ><Button onClick={() => {handleOpenEdit(row.id,row.name,row.phone)}} color="secondary">Edit</Button></TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: ( 53) * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>
            <Modal
                open={openEdit}
                onClose={handleCloseEdit}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={styles.modal}>
                    <Typography color="white" align="center" id="modal-modal-title" variant="h6" component="h2">
                        Edit contact
                    </Typography>
                    <div className={styles.inputBox}>
                            <span className={styles.inputMargin}>
                                <TextField className={styles.input} value={editName} onChange={changeEditName} label="Name" variant="standard" />
                            </span>
                        <TextField className={styles.input} value={editPhone} onChange={changeEditPhone} label="Phone" variant="standard" />
                        <div className={styles.addBtn}>
                            <Button onClick={clickEdit} variant="outlined" color="success" size="large">
                                Edit contact
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <div className={styles.containerBtn}>
                <Button onClick={handleOpen} variant="outlined" color="success" size="large">
                    Add contact
                </Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box className={styles.modal}>
                        <Typography color="white" align="center" id="modal-modal-title" variant="h6" component="h2">
                            Add contact
                        </Typography>
                        <div className={styles.inputBox}>
                            <span className={styles.inputMargin}>
                                <TextField className={styles.input} value={name} onChange={changeName} label="Name" variant="standard" />
                            </span>
                            <TextField className={styles.input} value={phone} onChange={changePhone} label="Phone" variant="standard" />
                            <div className={styles.addBtn}>
                                <Button onClick={() => {addClick(name,phone)}}  variant="outlined" color="success" size="large">
                                    Add contact
                                </Button>
                            </div>
                        </div>
                    </Box>
                </Modal>
            </div>
        </div>
    );
}

