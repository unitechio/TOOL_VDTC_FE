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




function SynchronizeCRMOCS() {
    const token = localStorage.getItem("token");
    const [result, setResult] = useState("");
    const [sql, setSql] = useState([]);
    const [optionTool, setOptionTool] = useState("");
    const { id } = useParams();
    const [error, setError] = useState("");
    const [search, setSeacrch] = useState(false);
    const [showSql, setShowSql] = useState(true);
    const [showLoading, setShowLoading] = useState(false);
    const [groupId, setGroupId] = useState("");

    const [epc, setEpc] = useState("");
    const [vehicleCRM, setVehicleCRM] = useState([]);
    const [vehicleOCS, setVehicleOCS] = useState([]);
    const [historyVehicleCSTC, setHistoryVehicleCSTC] = useState([]);
    const [dateLimit, setDateLimit] = useState(900);

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


    function formatJsonString(jsonString) {
        try {
            const jsonObject = JSON.parse(jsonString);
            const formattedJsonString = JSON.stringify(jsonObject, null, 3);
            return formattedJsonString;
        } catch (error) {
            // console.error('Invalid JSON string:', jsonString);
            return jsonString;
        }
    }

    useEffect(() => {
        axios
            .get(`${urlBase}/api/tool-department/getById?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                setGroupId(response.data.groupId);
                setOptionTool(response.data.option_tool);
                setDateLimit(response.data.limitDate ? response.data.limitDate : 900);
                axios
                    .get(
                        `${urlBase}/api/sql/getbyName?optionTool=${response.data.option_tool}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    )
                    .then((response1) => {
                        setSql(response1.data);
                    })
                    .catch((errr) => {
                        console.log(errr);
                    });
            })
            .catch((errr) => {
                console.log(errr);
            });
    }, []);


    const getVehicleOCS = async () => {
        try {
            const res = await API.getVehicleOCS(token, epc);
            setVehicleOCS(res.data);
        } catch (err) {

        }
    }

    const getVehicleCRM = async () => {
        try {
            const res = await API.getVehicleCRM(token, epc);
            setVehicleCRM(res.data);
        } catch (err) {

        }
    }
    const getHistoryVehicleCSTC = async () => {
        try {
            const res = await API.getHistoryVehicleCSTC(token, epc);
            setHistoryVehicleCSTC(res.data);
        } catch (err) {

        }
    }


    const handleSubmit = async () => {
        setVehicleCRM([])
        setHistoryVehicleCSTC([])
        setVehicleOCS({})
        if (epc.length !== 0) {
            setSeacrch(true)
            setError("");
            setShowLoading(true);
            setResult("");
            let err = "0";

            getVehicleOCS()
            getHistoryVehicleCSTC()
            await getVehicleCRM()
            setShowLoading(false)
        }
        else {
            setError("Vui lòng điền đầy đủ thông tin")
            setSeacrch(false);
        }
    }

    const updateStatusVehicle = async (vehicleId, actType) => {
        const isConfirmed = await confirmModal("cập nhập phương tiện trên CRM");
        if (isConfirmed) {
            const updateStatus = async () => {
                try {
                    const res = await API.updateStatusVehicle(token, vehicleId, actType);
                    toast.success("Update thành công.", toastObject)
                } catch (err) {
                    console.log(err);
                }
            }
            await updateStatus()
            getVehicleCRM()
        }
    }

    const createVehicleOCS = async (vehicleId) => {
        const isConfirmed = await confirmModal("thêm xe trên OCS");
        if (isConfirmed) {
            const updateStatus = async () => {
                try {
                    const res = await API.createVehicleOCS(token, vehicleId);
                    if (res.data.description === "WS_RFID_EXIST") {
                        toast.warn("Thẻ đã tồn tại trên OCS!", toastObject);
                    }
                    else if (res.data.description === "Success") {
                        getVehicleOCS();
                        toast.success("Thêm xe thành công OCS.", toastObject);
                    }
                    else if (res.data.description === "WS_CONTRACT_ID_HAS_NOT_EXIST") {
                        toast.warn("Hợp đồng không tồn tại", toastObject);
                    }
                    else if (res.data.description === "WS_PLATE_NUMBER_HAS_NOT_EXIST") {
                        toast.warn("Biển số xe đã tồn tại ở hợp đồng khác", toastObject);
                    }
                    else if (res.data.resultCode === "999") {
                        toast.warn(res.data.description, toastObject);
                    }
                    else {
                        toast.warn(res.data.description, toastObject)
                    }
                } catch (err) {
                    console.log(err);
                }
            }
            await updateStatus()
            getVehicleCRM()
        }
    }


    const deleteVehicleOCS = async (epc, contractId) => {
        const isConfirmed = await confirmModal("xóa xe trên OCS");
        if (isConfirmed) {
            const deleteOCS = async () => {
                try {
                    const res = await API.deleteVehicleOCS(token, epc, contractId);
                    // console.log(res.data);
                    if (res.data.description === "RFID_NOT_FOUND") {
                        toast.warn("Xe đã tồn tại trên OCS!", toastObject);
                    }
                    else if (res.data.description === "Success") {
                        getVehicleOCS();
                        toast.success("Xóa xe thành công trên OCS.", toastObject);
                    }
                    else if (res.data.resultCode === "999") {
                        toast.warn(res.data.description, toastObject);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
            await deleteOCS();
            getVehicleOCS();
        }
    }



    return (
        <div>
            <Header></Header>
            <ToastContainer />
            {showLoading && <Loading></Loading>}
            <div className="container">
                <h2 className="text-center text-primary m-3">Đồng bộ OCS</h2>
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
                                            if (e.key == 'Enter') {
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

            <div className="historyVehicle row  ms-3 me-3 mb-3 mt-3">
                <div className="">
                    {historyVehicleCSTC.length > 0 && search &&
                        <Table striped bordered hover variant="" style={{ minHeight: "250px" }}>
                            <thead>
                                <tr style={{ background: "#ffe2cd" }}><td className="style_text" colSpan="10">Lịch sử xe qua trạm gần nhất</td></tr>
                                <tr style={{ whiteSpace: 'pre-line' }}>
                                    <th>STT</th>
                                    <th>Mã Hợp Đồng</th>
                                    <th>Biển số xe</th>
                                    <th>EPC</th>
                                    <th >ID làn vào</th>
                                    <th>Làn vào</th>
                                    <th>Thời gian vào làn</th>
                                    <th>ID làn ra</th>
                                    <th>Làn ra</th>
                                    <th>Thời gian ra làn</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyVehicleCSTC?.map((info, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        {Object.values(info)?.map((value, i) => (
                                            <td key={i}>{value === null ? "" : value}</td>
                                        ))}
                                    </tr>
                                ))}


                            </tbody>
                        </Table>
                    }

                    {historyVehicleCSTC.length === 0 && search &&
                        <Table striped bordered hover variant="">
                            <thead>
                                <tr style={{ background: "#ffe2cd" }}><td className="style_text" colSpan="10">Lịch sử xe qua trạm gần nhất</td></tr>
                            </thead>
                            <tbody>

                                <tr>
                                    <th>Không tìm thấy lịch sử xe qua trạm gần đây. Vui lòng thử lại!</th>
                                </tr>

                            </tbody>
                        </Table>
                    }

                </div>
            </div>

            <div className="queryVehilce row  ms-3 me-3 mb-3 mt-3">
                {(vehicleCRM.length > 0 || vehicleOCS.description === "Success" || search) && <div>
                    <Table striped bordered hover variant="" style={{ minHeight: "250px" }}>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="scroll-tbody">
                                        {vehicleOCS.description === "Success" && search &&
                                            <Table striped bordered hover variant="" style={{ minHeight: "250px" }}>
                                                <thead>
                                                    <tr style={{ background: "#ffe2cd" }}><td className="style_text" colSpan="8">Thông tin phương tiện trên OCS</td></tr>
                                                    <tr style={{ whiteSpace: 'pre-line' }}>
                                                        {/* <th>Description</th> */}
                                                        <th>EPC</th>
                                                        <th>Biển số xe</th>
                                                        <th>List_Offer</th>
                                                        <th >Mã Hợp Đồng</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="">
                                                    <tr>
                                                        <td>{vehicleOCS?.EPC ?? 'null'}</td>
                                                        <td>{vehicleOCS?.plateNumber ?? 'null'}</td>
                                                        <td>
                                                            {
                                                                Array.isArray(vehicleOCS?.listOffer)
                                                                    ? vehicleOCS.listOffer.map((offer, i) => (
                                                                        <div key={i}>{offer.offerName}</div>
                                                                    ))
                                                                    : typeof vehicleOCS?.listOffer === 'object'
                                                                        ? JSON.stringify(vehicleOCS.listOffer)
                                                                        : vehicleOCS?.listOffer ?? 'null'
                                                            }
                                                        </td>
                                                        <td>{vehicleOCS?.contractId ?? 'null'}</td>
                                                        <td className="Action ">
                                                            <div className="" style={{ textAlign: "left" }}>
                                                                <div className="d-flex flex-column">
                                                                    <div className="mb-2 bd-highlight">
                                                                        <button className="btn btn-danger button_action"

                                                                            onClick={() => {
                                                                                deleteVehicleOCS(vehicleOCS.EPC, vehicleOCS.contractId)
                                                                            }}
                                                                            style={{ fontSize: "12px" }}>
                                                                            Hủy xe OCS
                                                                        </button>
                                                                    </div>
                                                                    {/* <div className="mt-2 bd-highlight">
                                                                        <button className="btn btn-success button_action "
                                                                            style={{ fontSize: "12px" }}>
                                                                            Add xe lên CRM
                                                                        </button>
                                                                    </div> */}
                                                                </div>

                                                            </div>

                                                        </td>
                                                    </tr>


                                                </tbody>
                                            </Table>
                                        }

                                        {vehicleOCS.description !== "Success" && search &&
                                            <Table striped bordered hover variant="">
                                                <thead>
                                                    <tr style={{ background: "#ffe2cd" }}><td className="style_text" colSpan="2">Thông tin phương tiện trên OCS</td></tr>
                                                </thead>
                                                <tbody>

                                                    <tr>
                                                        <th>Không tìm thấy phương tiện trên OCS. Vui lòng thử lại!</th>
                                                    </tr>

                                                </tbody>
                                            </Table>
                                        }

                                    </div>
                                </td>
                                <td>
                                    <div className="scroll-tbody">
                                        {vehicleCRM.length > 0 && search &&
                                            <Table striped bordered hover variant="" style={{ minHeight: "250px" }}>

                                                <thead className="">
                                                    <tr style={{ background: "#ffe2cd" }}> <td className="style_text" colSpan="8">Thông tin phương tiện trên CRM</td></tr>
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

                                                                <div className="" style={{ textAlign: "left" }}>
                                                                    <div className="d-flex flex-column">
                                                                        <div className="mb-2 bd-highlight">
                                                                            <button className="btn btn-danger button_action"
                                                                                disabled={info.status !== 'Hoạt động' || info.activeStatus !== 'Hoạt động'}
                                                                                onClick={() => {
                                                                                    updateStatusVehicle(info.vehicleId, 0)
                                                                                }}
                                                                                style={{ fontSize: "12px" }}>
                                                                                Hủy xe trên CRM
                                                                            </button>
                                                                        </div>
                                                                        <div className="mt-2 mb-2 bd-highlight">
                                                                            <button className="btn btn-success button_action"
                                                                                disabled={info.status === 'Hoạt động' && info.activeStatus === 'Hoạt động'}
                                                                                onClick={() => {
                                                                                    updateStatusVehicle(info.vehicleId, 1)
                                                                                }}
                                                                                style={{ fontSize: "12px" }}>
                                                                                Kích hoạt xe CRM
                                                                            </button>
                                                                        </div>

                                                                        <div className="mt-2 bd-highlight">
                                                                            <button
                                                                                disabled={info.status !== 'Hoạt động' || info.activeStatus !== 'Hoạt động'}
                                                                                onClick={() => {
                                                                                    createVehicleOCS(info.vehicleId)
                                                                                }}
                                                                                className="btn btn-primary button_action" style={{ fontSize: "12px" }}>
                                                                                Add xe lên OCS
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
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>}
            </div>
        </div>
    );
}
export default SynchronizeCRMOCS;
