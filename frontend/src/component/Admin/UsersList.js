import React, { Fragment, useEffect } from 'react'
import "./productList.css"
import Sidebar from './Sidebar.js';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { DataGrid } from '@material-ui/data-grid';
import { getAllUsers, clearErrors, deleteUser } from '../../actions/userAction';
import { DELETE_USER_RESET } from '../../constants/userConstants';

const UsersList = ({history}) => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const {error, users } = useSelector((state) => state.allUsers);
    const {error:deleteError, isDeleted, message} = useSelector((state) => state.profile)

    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id));
    }
   
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }
        if (isDeleted) {
            alert.success(message)
            history.push("/admin/users")
            dispatch({type: DELETE_USER_RESET})
        }

        dispatch(getAllUsers());
    }, [dispatch, error, alert, deleteError, history, isDeleted, message])

    const columns = [
        {field: "id", headerName: "User ID", minWidth: 180, flex: 0.5 },
        {field: "email", headerName: "Email", minWidth: 200, flex: 1 },
        {field: "name", headerName: "Name", minWidth: 100, flex: 0.3 },
        {field: "role", headerName: "Role", type:"number", minWidth: 100, flex: 0.5, cellClassName: (params) => {
            return params.getValue(params.id, 'role') === 'admin' ? 'greenColor' : 'redColor'
        } },
        {field: "action", headerName: "Action", type:"number", minWidth: 100, flex: 0.3, sortable: false, 
        renderCell: (params) => {
            return (
                <Fragment>
                    <Link to= {`/admin/user/${params.getValue(params.id, "id")}`}>
                        <EditIcon />
                    </Link>

                    <Button onClick={() => deleteUserHandler(params.getValue(params.id, "id"))}>
                        <DeleteIcon />
                    </Button>
                </Fragment>
            );
        },
    },                      
       
    ];

    const rows = [];

    users && 
        users.forEach((item) => {
            rows.push({
                id: item._id,
                role: item.role,
                email: item.email,
                name: item.name,
            })
    });
    
    return (
        <Fragment>
            <MetaData title="All Users - Admin"/>

            <div className="dashboard">
                <Sidebar />
                <div className="productListContainer">
                    <h1 id="productListHeading">All Users</h1>
                    <DataGrid 
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        className='productListTable'
                        autoHeight
                    />
                </div>
            </div>
        </Fragment>
    )
}

export default UsersList;