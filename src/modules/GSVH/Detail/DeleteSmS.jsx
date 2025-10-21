import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../Header/Header";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import "./Detail.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../Loading/Loading";
import { urlBase } from "../../UrlBase";
import API from "../../../api";
import { Table } from 'react-bootstrap'
import { Modal } from "antd";




function DeleteSmS() {
    const token = localStorage.getItem("token");
    const [result, setResult] = useState("");
    const [sql, setSql] = useState([]);
    const [optionTool, setOptionTool] = useState("");
    const { id } = useParams();
    const [error, setError] = useState("");
    const [search, setSeacrch] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    let plateNumberNew = "";

    const [contractId, setContractId] = useState("");

    const [inputValue, setInputValue] = useState('');

    const toastObject = {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    };

    const confirmModal = (e) => {
        return new Promise((resolve) => {
            Modal.confirm({
                style: { top: '50%', transform: 'translateY(-50%)' },
                title: 'Xác nhận',
                content: `Bạn có chắc chắn muốn ${e} không?`,
                onOk() {
                    // Resolve with true when the user clicks OK
                    resolve(true);
                },
                onCancel() {
                    // Resolve with false when the user clicks Cancel
                    resolve(false);
                },
                height: 700,
                maskClosable: true,
                // width: 600, // Set the width of the modal
                // height: 700, // Set the height of the modal
            });
        });
    };


    const deleteSmS = async () => {
        const isConfirmed = await confirmModal("xóa gói sms");
        if (isConfirmed && contractId) {
            const deleteSmS = async () => {
                try {
                    const res = await API.deleteSmS(token, contractId);
                    if(res.data.message === "Cập nhật thành công")
                    {
                         toast.success(res.data.message, toastObject)

                    }
                    else{
                        toast.warning(res.data.message, toastObject)
                    }
                } catch (err) {
                    console.log(err);
                }
            }
            await deleteSmS()
        
        }
        else if(!contractId && isConfirmed)
        {
            toast.error("Thông tin chưa đúng", toastObject)
        }
    }


    return (
        <div>
            <Header></Header>
            <ToastContainer />
            {showLoading && <Loading></Loading>}
            <div className="">
                <h2  className="text-center text-primary m-3">Xóa SMS</h2>
                <div className="form-search1 mt-5" style={{ marginLeft: "70px" }}>
                    <div className="form-searchDate row">
                        <div className="col-2"></div>
                        <div className="col-6 mt-1">
                            <div className="row">
                                <div className="col-5 mt-2">
                                    <h5>Contract: </h5>
                                </div>
                                <div className="col-6">
                                    <input
                                        style={{ width: "350px", height: "40px" }}
                                        value={contractId}
                                        className="border_input "
                                        type="text"
                                        placeholder="Nhập Contract_ID"
                                        onChange={(e) => {
                                            setContractId(e.target.value.toLocaleUpperCase().trim())
                                        }}
                                    />
                                </div>

                            </div>

                        </div>
                        <div className="button-confirm col-2 mt-1">
                            <button
                                className="button_search btn border-bottom mb-2"
                                onClick={() => {
                                    deleteSmS()
                                }}
                            >
                                Xóa SmS
                            </button>
                        </div>


                    </div >
                    <div className="login__error mb-4">{error}</div>



                </div>

            </div>

        </div>
    );
}
export default DeleteSmS;
