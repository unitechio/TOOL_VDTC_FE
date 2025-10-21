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




function ChangePlateNumber() {
    const token = localStorage.getItem("token");
    const [result, setResult] = useState("");
    const [sql, setSql] = useState([]);
    const [optionTool, setOptionTool] = useState("");
    const { id } = useParams();
    const [error, setError] = useState("");
    const [search, setSeacrch] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    let plateNumberNew = "";

    const [epc, setEpc] = useState("");
    const [vehicleCRM, setVehicleCRM] = useState([]);
    const [dateLimit, setDateLimit] = useState(900);

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

    const confirmModal = () => {
        plateNumberNew = "";
        return new Promise((resolve) => {
            Modal.confirm({
                style: { top: '50%', transform: 'translateY(-50%)' },
                title: 'Xác nhận',
                content: (

                    <div className="row mt-2 mb-2">
                        <div className="col-5">
                            <h6>Biển số xe mới:</h6>

                        </div>
                        <div className="col-7 ">
                            <input
                                className="border_input"
                                onChange={(e) => {
                                    plateNumberNew = e.target.value;
                                }}
                                placeholder="Nhập biển số xe mới"
                            />
                        </div>

                    </div>
                ),
                onOk() {
                    // Resolve with the entered value when the user clicks OK
                    resolve(true);
                },
                onCancel() {
                    // Resolve with null when the user clicks Cancel
                    resolve(false);
                },
                height: 700,
                maskClosable: true,
            });
        });
    };

    const getVehicleCRM = async () => {
        try {
            const res = await API.getVehicleCRM(token, epc);
            setVehicleCRM(res.data);
        } catch (err) {

        }
    }

    const updatePlateNumber = async (vehicleId,plateNumber) => {
        const isConfirmed = await confirmModal();
        if (isConfirmed && plateNumber !== plateNumberNew) {
            const updatePlateNumber = async () => {
                try {
                    const res = await API.updatePlateNumber(token, vehicleId, plateNumberNew);
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
            await updatePlateNumber()
            getVehicleCRM()
        }
        else if(plateNumber === plateNumberNew)
        {
            toast.error("Thông tin biển số chưa thay đổi", toastObject)
        }
    }


    const handleSubmit = async () => {
        setVehicleCRM([])
        if (epc.length !== 0) {
            setSeacrch(true)
            setError("");
            setShowLoading(true);
            setResult("");
            let err = "0";

            await getVehicleCRM()
            setShowLoading(false)
        }
        else {
            setError("Vui lòng điền đầy đủ thông tin")
            setSeacrch(false);
        }
    }



    return (
        <div>
            <Header></Header>
            <ToastContainer />
            {showLoading && <Loading></Loading>}
            <div className="container">
                <h2 className="text-center text-primary m-3">Đổi biển số xe</h2>
                <div className="form-search1 mt-5" style={{ marginLeft: "70px" }}>
                    <div className="form-searchDate row">
                        <div className="col-2"></div>
                        <div className="col-6 mt-1">
                            <div className="row">
                                <div className="col-5 mt-2">
                                    <h5>Dữ liệu truy vấn: </h5>
                                </div>
                                <div className="col-6">
                                    <input
                                        style={{ width: "350px", height: "40px" }}
                                        value={epc}
                                        className="border_input "
                                        type="text"
                                        placeholder="Nhập EPC hoặc PLATE_NUMBER"
                                        onChange={(e) => {
                                            setEpc(e.target.value.toLocaleUpperCase().trim())
                                        }}
                                        onKeyDown={(e) => {
                                            if(e.key == 'Enter'){
                                                handleSubmit()
                                              }
                                        }}
                                    />
                                </div>

                            </div>

                        </div>
                        <div className="button-confirm col-2 mt-1">
                            <button
                                className="button_search btn border-bottom mb-2"
                                onClick={handleSubmit}
                            >
                                Tìm kiếm
                            </button>
                        </div>


                    </div >
                    <div className="login__error mb-4">{error}</div>



                </div>

            </div>


            <div className="queryVehilce row  ms-3 me-3 mb-3 mt-3">

                <div className="scroll-tbody">
                    {vehicleCRM.length > 0 && search &&
                        <Table striped bordered hover variant="" style={{ minHeight: "250px" }}>

                            <thead className="">
                                <tr style={{ background: "#ffe2cd" }}> <td className="style_text" colSpan="8">Thông tin phương tiện</td></tr>
                                <tr >
                                    <th>STT</th>
                                    <th>Vehicle_ID</th>
                                    <th>EPC</th>
                                    <th>Mã Hợp Đồng</th>
                                    <th>Biển số xe</th>
                                    <th>Trạng thái xe</th>
                                    <th>Trạng thái thẻ</th>
                                    <th >Action</th>
                                </tr>
                            </thead>

                            <tbody className="scroll-tbody" >
                                {vehicleCRM?.map((info, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        {Object.values(info)?.map((value, i) => (
                                            <td key={i}>{typeof value === 'object' ? JSON.stringify(value) : value}</td>
                                        ))}
                                        <td className="Action" >

                                            <div className="" style={{ textAlign: "" }}>
                                                <div className="d-flex flex-column">
                                                    <div className="mb-2 bd-highlight">
                                                        <button className="btn btn-danger button_action"
                                                            disabled={info.status !== 'Hoạt động' || info.activeStatus !== 'Hoạt động'}
                                                            onClick={() => {
                                                                updatePlateNumber(info.vehicleId,info.plateNumber)
                                                            }}
                                                            style={{ fontSize: "12px" }}>
                                                            Thay đổi biển số
                                                        </button>
                                                    </div>

                                                </div>

                                            </div>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    }
                    {vehicleCRM.length === 0 && search &&
                        <Table striped bordered hover variant="">
                            <thead>
                                <tr style={{ background: "#ffe2cd" }}><td className="style_text" colSpan="2">Thông tin phương tiện trên CRM</td></tr>
                            </thead>
                            <tbody>

                                <tr>
                                    <th>Không tìm thấy phương tiện trên CRM. Vui lòng thử lại!</th>
                                </tr>

                            </tbody>
                        </Table>
                    }

                </div>
            </div>
        </div>
    );
}
export default ChangePlateNumber;
