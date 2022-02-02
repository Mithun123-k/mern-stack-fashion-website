import React, { Fragment, useEffect } from 'react'
import "./productList.css"
import Sidebar from './Sidebar.js';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, deleteProduct, getAdminProduct } from '../../actions/productAction';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { DataGrid } from '@material-ui/data-grid';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';

const ProductList = ({history}) => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const {error, products } = useSelector((state) => state.products);
    const {error:deleteError, isDeleted} = useSelector((state) => state.product)

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id));
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
            alert.success("Product Deleted Successfully")
            history.push("/admin/dashboard")
            dispatch({type: DELETE_PRODUCT_RESET})
        }

        dispatch(getAdminProduct());
    }, [dispatch, error, alert, deleteError, history, isDeleted])

    const columns = [
        {field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },
        {field: "name", headerName: "Name", minWidth: 350, flex: 1 },
        {field: "stock", headerName: "Stock", type:"number", minWidth: 150, flex: 0.3 },
        {field: "price", headerName: "Price", type:"number", minWidth: 150, flex: 0.5 },
        {field: "action", headerName: "Action", type:"number", minWidth: 120, flex: 0.3, sortable: false, 
        renderCell: (params) => {
            return (
                <Fragment>
                    <Link to= {`/admin/product/${params.getValue(params.id, "id")}`}>
                        <EditIcon />
                    </Link>

                    <Button onClick={() => deleteProductHandler(params.getValue(params.id, "id"))}>
                        <DeleteIcon />
                    </Button>
                </Fragment>
            );
        },
    },                      
       
    ];

    const rows = [];

    products && 
        products.forEach((item) => {
            rows.push({
                id: item._id,
                stock: item.Stock,
                price: item.price,
                name: item.name,
            })
    });
    
    return (
        <Fragment>
            <MetaData title="All Products - Admin"/>

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

export default ProductList;
