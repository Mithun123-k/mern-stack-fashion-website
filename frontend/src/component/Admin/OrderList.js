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
import { deleteOrder, getAllOrders, clearErrors } from '../../actions/orderAction';
import { DELETE_ORDER_RESET } from '../../constants/orderConstants';

const OrderList = ({history}) => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const {error, orders } = useSelector((state) => state.allOrders);
    const {error:deleteError, isDeleted} = useSelector((state) => state.order)

    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id))
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
            alert.success("Oreder Deleted Successfully")
            history.push("/admin/orders")
            dispatch({type: DELETE_ORDER_RESET})
        }

        dispatch(getAllOrders());
    }, [dispatch, error, alert, deleteError, history, isDeleted])

    const columns = [
        {
            field: "id",
            headerName: "Order ID",
            minWidth: 300,
            flex: 1,
        },
        {
            field: "status",
            headerName: " Status",
            minWidth: 150,
            flex: 0.5,
            cellClassName: (params) => {
                return params.getValue(params.id, "status") === "Delivered" ? "greenColor" : "redColor";

            }
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 150,
            flex: 0.3,
        },
        {
            field: "amount",
            headerName: "Amount",
            type: "number",
            minWidth: 270,
            flex: 0.5,
        },
        {field: "action", headerName: "Action", type:"number", minWidth: 150, flex: 0.3, sortable: false, 
        renderCell: (params) => {
            return (
                <Fragment>
                    <Link to= {`/admin/order/${params.getValue(params.id, "id")}`}>
                        <EditIcon />
                    </Link>

                    <Button onClick={() => deleteOrderHandler(params.getValue(params.id, "id"))}>
                        <DeleteIcon />
                    </Button>
                </Fragment>
            );
        },
    },                      
       
    ];

    const rows = [];

    orders && 
        orders.forEach((item) => {
            rows.push({
                id: item._id,
                itemsQty: item.orderItems.length,
                amount: item.totalPrice,
                status: item.orderStatus,
            })
    });
    
    return (
        <Fragment>
            <MetaData title="All Orders - Admin"/>

            <div className="dashboard">
                <Sidebar />
                <div className="productListContainer">
                    <h1 id="productListHeading">All Products</h1>
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

export default OrderList;
