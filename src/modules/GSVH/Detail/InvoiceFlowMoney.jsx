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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function InvoiceFlowMoney() {
    const token = localStorage.getItem("token");
    const [result, setResult] = useState([{
        result1: "",
        result2: "",
        result3: "",
        result4: "",
        result5: "",
        result6: "",
        result7: "",
        result8: ""
    }]);
    const [sql, setSql] = useState([]);
    const [optionTool, setOptionTool] = useState("");
    const { id } = useParams();
    const [error, setError] = useState("");
    const [showSql, setShowSql] = useState(true);
    const [showLoading, setShowLoading] = useState(false);
    const [groupId, setGroupId] = useState("");
    const [channle, setChannle] = useState("");
    const [contractId, setContractid] = useState("")

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [dateLimit, setDateLimit] = useState(900);

    const [shopName, setShopName] = useState([])

    const rolesString = localStorage.getItem("roles");
    const userRoles = rolesString ? JSON.parse(rolesString) : [];
    const checkRole = (userRoles) => {
        if (userRoles.includes("ADMIN")) {
            return true;
        }
        return false;
    };

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

    const converToVND = (e) =>{
        var x = e;
        x = x.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
        return x;
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

        // Lấy thông tin shopname
        axios
            .get(
                `${urlBase}/api/kd/shop-name`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then((response) => {
                // setResult("h.xlsx");
                setShopName(response.data);
                setShowLoading(false);
            })
            .catch((errr) => {
                console.log(errr);
                setShowLoading(false);
            })

    }, []);

    /*
    edit câu lệnh sql và tên
    */
    const handleSetNameSpl = () => {
        if (!showSql && window.confirm("Bạn có muốn thay đổi không?")) {
            axios
                .put(
                    `${urlBase}/api/sql/setNameSql`,
                    {
                        id: sql.id ? sql.id : 0,
                        groupId: groupId,
                        option_tool: sql.option_tool,
                        nameSqlTool: sql.nameSqlTool,
                        nameSchema: sql.nameSchema,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            // "Content-Type": "multipart/form-data",
                        },
                    }
                )
                .then((response) => {
                    if (response.data === "true_update") {
                        setShowSql(true);
                        toast.success("Update thành công !!", toastObject);
                    } else {
                        toast.error("Lỗi cú pháp câu lệnh", toastObject);
                    }
                })
                .catch((errr) => {
                    toast.success("Bạn không có quyển làm điều này !!", toastObject);
                    console.log(errr);
                });
        }
    };

    const handleSubmit1 = () => {
        setError("");
        if (startTime === "" || endTime === "" || endTime < startTime || contractId === "") {
            setError("Nhập đúng định dạng!!!");
        } else {
            // console.log(channle);
            const startDateObj = new Date(startTime);
            const endDateObj = new Date(endTime);
            const maxEndDate = new Date(
                startDateObj.getTime() + dateLimit * 24 * 60 * 60 * 1000
            );

            if (endDateObj > maxEndDate) {
                setEndTime(maxEndDate); // Giới hạn giá trị ngày kết thúc thành ngày tối đa
            }
            setShowLoading(true);
            // setResult("");
            axios
                .get(
                    `${urlBase}/api/gsvh/get-invoice-flow-money/1?startTime=${startTime}&endTime=${endTime}&contractId=${contractId}&optionTool=${optionTool}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
                .then((response) => {
                    // setResult("h.xlsx");
                    setResult((prev) => ({
                        ...prev,
                        result1: response.data
                    }));
                    setShowLoading(false);
                })
                .catch((errr) => {
                    console.log(errr);
                    setShowLoading(false);
                });
        }
    };

    const handleSubmit2 = () => {
        setError("");
        if (startTime === "" || contractId === "") {
            setError("Nhập sai định dạng!!!");
        } else {

            setShowLoading(true);
            // setResult("");
            axios
                .get(
                    `${urlBase}/api/gsvh/get-invoice-flow-money/2?startTime=${startTime}&contractId=${contractId}&optionTool=${optionTool}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
                .then((response) => {
                    // setResult("h.xlsx");
                    setResult((prev) => ({
                        ...prev,
                        result2: response.data
                    }));
                    setShowLoading(false);
                })
                .catch((errr) => {
                    console.log(errr);
                    setShowLoading(false);
                });
        }
    };
    const handleSubmit3 = () => {
        setError("");
        if (endTime === "" || contractId === "") {
            setError("Nhập sai định dạng!!!");
        } else {

            setShowLoading(true);
            // setResult("");
            axios
                .get(
                    `${urlBase}/api/gsvh/get-invoice-flow-money/3?endTime=${endTime}&contractId=${contractId}&optionTool=${optionTool}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
                .then((response) => {
                    // setResult("h.xlsx");
                    setResult((prev) => ({
                        ...prev,
                        result3: response.data
                    }));
                    setShowLoading(false);
                })
                .catch((errr) => {
                    console.log(errr);
                    setShowLoading(false);
                });
        }
    };

    const handleSubmit4 = () => {
        setError("");
        if (startTime === "" || endTime === "" || endTime < startTime || contractId === "") {
            setError("Nhập đúng định dạng!!!");
        } else {
            // console.log(channle);
            const startDateObj = new Date(startTime);
            const endDateObj = new Date(endTime);
            const maxEndDate = new Date(
                startDateObj.getTime() + dateLimit * 24 * 60 * 60 * 1000
            );

            if (endDateObj > maxEndDate) {
                setEndTime(maxEndDate); // Giới hạn giá trị ngày kết thúc thành ngày tối đa
            }
            setShowLoading(true);
            // setResult("");
            axios
                .get(
                    `${urlBase}/api/gsvh/get-invoice-flow-money/4?startTime=${startTime}&endTime=${endTime}&contractId=${contractId}&optionTool=${optionTool}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
                .then((response) => {
                    // setResult("h.xlsx");
                    setResult((prev) => ({
                        ...prev,
                        result4: response.data
                    }));
                    setShowLoading(false);
                })
                .catch((errr) => {
                    console.log(errr);
                    setShowLoading(false);
                });
        }
    };

    const handleSubmit5 = () => {
        setError("");
        if (startTime === "" || endTime === "" || endTime < startTime || contractId === "") {
            setError("Nhập đúng định dạng!!!");
        } else {
            // console.log(channle);
            const startDateObj = new Date(startTime);
            const endDateObj = new Date(endTime);
            const maxEndDate = new Date(
                startDateObj.getTime() + dateLimit * 24 * 60 * 60 * 1000
            );

            if (endDateObj > maxEndDate) {
                setEndTime(maxEndDate); // Giới hạn giá trị ngày kết thúc thành ngày tối đa
            }
            setShowLoading(true);
            // setResult("");
            axios
                .get(
                    `${urlBase}/api/gsvh/get-invoice-flow-money/5?startTime=${startTime}&endTime=${endTime}&contractId=${contractId}&optionTool=${optionTool}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
                .then((response) => {
                    // setResult("h.xlsx");
                    setResult((prev) => ({
                        ...prev,
                        result5: response.data
                    }));
                    setShowLoading(false);
                })
                .catch((errr) => {
                    console.log(errr);
                    setShowLoading(false);
                });

                axios
                .get(
                    `${urlBase}/api/gsvh/get-invoice-flow-money/8?startTime=${startTime}&endTime=${endTime}&contractId=${contractId}&optionTool=${optionTool}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
                .then((response) => {
                    // setResult("h.xlsx");
                    setResult((prev) => ({
                        ...prev,
                        result8: response.data
                    }));
                    setShowLoading(false);
                })
                .catch((errr) => {
                    console.log(errr);
                    setShowLoading(false);
                });

        }
    };

    const handleSubmit6 = () => {
        setError("");
        if (startTime === "" || endTime === "" || endTime < startTime || contractId === "") {
            setError("Nhập đúng định dạng!!!");
        } else {
            // console.log(channle);
            const startDateObj = new Date(startTime);
            const endDateObj = new Date(endTime);
            const maxEndDate = new Date(
                startDateObj.getTime() + dateLimit * 24 * 60 * 60 * 1000
            );

            if (endDateObj > maxEndDate) {
                setEndTime(maxEndDate); // Giới hạn giá trị ngày kết thúc thành ngày tối đa
            }
            setShowLoading(true);
            // setResult("");
            axios
                .get(
                    `${urlBase}/api/gsvh/get-invoice-flow-money/6?startTime=${startTime}&endTime=${endTime}&contractId=${contractId}&optionTool=${optionTool}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
                .then((response) => {
                    // setResult("h.xlsx");
                    setResult((prev) => ({
                        ...prev,
                        result6: response.data
                    }));
                    setShowLoading(false);
                })
                .catch((errr) => {
                    console.log(errr);
                    setShowLoading(false);
                });

            axios
                .get(
                    `${urlBase}/api/gsvh/get-invoice-flow-money/7?startTime=${startTime}&endTime=${endTime}&contractId=${contractId}&optionTool=${optionTool}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
                .then((response) => {
                    // setResult("h.xlsx");
                    setResult((prev) => ({
                        ...prev,
                        result7: response.data
                    }));
                    setShowLoading(false);
                })
                .catch((errr) => {
                    console.log(errr);
                    setShowLoading(false);
                });
        }
    };




    // chọn channel cần tìm
    const handleChannelOnchange = (event) => {
        setChannle(event.target.value);
        // console.log(event);
    };

    const handleDownload = (fileName) => {
        axios({
            url: `${urlBase}/api/download/download-xlsx?fileName=${fileName}`,
            method: "GET",
            responseType: "blob", // Kiểu dữ liệu trả về là blob
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
        });
    };

    return (
        <div>
            <Header></Header>

            <ToastContainer />
            {showLoading && <Loading></Loading>}
            {console.log(result)}
            <div className="container" style={{ textAlign: "left" }}>
                <h2 className="text-center m-3">Báo cáo hóa đơn dòng tiền </h2>
                <div className="form-search1 mt-5" style={{ marginLeft: "70px" }}>
                    <div className="form-searchDate row">
                        <div className="col-2 mt-1">
                            <h6 className="text-danger">1. Xuất hóa đơn đối chiếu dòng tiền: </h6>
                        </div>
                        <div className="col-3 mt-1">
                            <div className="row">
                                <div className="col-4 mt-1">
                                    <h6>Contract_Id: </h6>
                                </div>
                                <div className="col-4">
                                    <input
                                        value={contractId}
                                        className="rounded "
                                        type="text"
                                        placeholder="Nhập contract_id"
                                        onChange={(e) => {
                                            setContractid(e.target.value)
                                        }}
                                    />
                                </div>

                            </div>

                        </div>
                        <div className="date-fromto col-3">
                            <div className="row">
                                <div className="col-4 mt-1 rounded">
                                    <h6 className="">
                                        Start Date:{" "}
                                    </h6>
                                </div>
                                <div className="col-5">
                                    <DatePicker
                                        className="rounded"
                                        selected={startTime}
                                        onChange={(date) => setStartTime(date)}
                                        // showTimeSelect
                                        timeIntervals={1}
                                        timeCaption="time"
                                        dateFormat="dd/MM/yyyy HH:mm"
                                    />{" "}
                                </div>
                            </div>
                        </div>

                        <div className="date-to col-3">

                            <div>
                                <div className="row">
                                    <div className="col-4 mt-1">
                                        <h6>End Date:</h6>
                                    </div>
                                    <div className="col-6">
                                        <DatePicker
                                            selected={endTime}
                                            className="rounded"
                                            // locale="pt-BR"
                                            // showTimeSelect
                                            // timeFormat="HH:mm"
                                            timeIntervals={1}
                                            dateFormat="dd/MM/yyyy HH:mm"
                                            // style={{ fontSize: "25px" }}
                                            onChange={(date) => {
                                                const selectedEndDate = date
                                                const startDateObj = new Date(startTime);
                                                const endDateObj = new Date(selectedEndDate)
                                                const maxEndDate = new Date(
                                                    startDateObj.getTime() + dateLimit * 24 * 60 * 60 * 1000
                                                );

                                                const newEndTime =
                                                    endDateObj > maxEndDate
                                                        ? maxEndDate
                                                        : selectedEndDate;

                                                setEndTime(newEndTime);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="button-confirm col-1">
                            <button
                                className="btn btn-success border-bottom mb-2"
                                onClick={handleSubmit1}
                            >
                                Submit
                            </button>
                        </div>
                        <div className="row d-flex justify-content-center">

                            {
                                result.result1 ?
                                    <button
                                        disabled={!result.result1}
                                        className="btn btn-info col-3"
                                        onClick={() => handleDownload(result.result1)}
                                    >
                                        BaoCaoHoaDonDongTien.XLSX
                                    </button> :
                                    <div></div>
                            }
                        </div>


                    </div >


                </div>

                <div className="form-search2 mt-5" style={{ marginLeft: "70px" }}>
                    <div className="form-searchDate row">
                        <div className="col-2 mt-1">
                            <h6 className="text-danger">2. Tổng tiền đầu kỳ Thực tế tin nhắn: </h6>
                        </div>

                        <div className="date-to col-3">

                            <div className="row">
                                <div className="col-4 mt-1">
                                    <h6>Contract_Id: </h6>
                                </div>
                                <div className="col-4">
                                    <input
                                        value={contractId}
                                        className="rounded "
                                        type="text"
                                        placeholder="Nhập contract_id"
                                        onChange={(e) => {
                                            setContractid(e.target.value)
                                        }}
                                    />
                                </div>

                            </div>
                        </div>
                        <div className="col-3"></div>

                        <div className="date-fromto col-3">
                            <div className="row">
                                <div className="col-4 mt-1">
                                    <h6 className="">
                                        Start Date:{" "}
                                    </h6>
                                </div>
                                <div className="col-6">
                                    <DatePicker
                                        className="rounded"
                                        selected={startTime}
                                        onChange={(date) => setStartTime(date)}
                                        // showTimeSelect
                                        timeIntervals={1}
                                        timeCaption="time"
                                        dateFormat="dd/MM/yyyy HH:mm"
                                    />{" "}
                                </div>
                            </div>
                        </div>

                        <div className="button-confirm col-1">
                            <button
                                className="btn btn-success border-bottom mb-2"
                                onClick={handleSubmit2}
                            >
                                Submit
                            </button>
                        </div>

                        <div className="d-flex justify-content-center">
                            {
                                result.result2 !== "" ? (result.result2 >= 0 ? <dt>Kết quả: {converToVND(result.result2)}</dt> : <dt></dt>) :
                                    <div></div>
                            }
                        </div>

                    </div >


                </div>

                <div className="form-search3 mt-5" style={{ marginLeft: "70px" }}>
                    <div className="form-searchDate row">
                        <div className="col-2 mt-1">
                            <h6 className="text-danger">3. Tổng tiền cuối kỳ thực tế tin nhắn : </h6>
                        </div>
                        <div className="date-to col-3">

                            <div className="row">
                                <div className="col-4 mt-1">
                                    <h6>Contract_Id: </h6>
                                </div>
                                <div className="col-4">
                                    <input
                                        value={contractId}
                                        className="rounded "
                                        type="text"
                                        placeholder="Nhập contract_id"
                                        onChange={(e) => {
                                            setContractid(e.target.value)
                                        }}
                                    />
                                </div>

                            </div>
                        </div>
                        <div className="col-3"></div>

                        <div className="date-fromto col-3">
                            <div className="row">
                                <div className="col-4 mt-1">
                                    <h6 className="">
                                        End Date:{" "}
                                    </h6>
                                </div>
                                <div className="col-6">
                                    <DatePicker
                                        className="rounded"
                                        selected={endTime}
                                        onChange={(date) => setEndTime(date)}
                                        // showTimeSelect
                                        timeIntervals={1}
                                        timeCaption="time"
                                        dateFormat="dd/MM/yyyy HH:mm"
                                    />{" "}
                                </div>
                            </div>
                        </div>
                        <div className="button-confirm col-1">
                            <button
                                className="btn btn-success border-bottom mb-2"
                                onClick={handleSubmit3}
                            >
                                Submit
                            </button>
                        </div>
                        <div className="d-flex justify-content-center">
                            {
                                result.result3 !== "" ? (result.result3 >= 0 ? <dt>Kết quả: {converToVND(result.result3)}</dt> : <dt></dt>) :
                                    <div></div>
                            }
                        </div>

                    </div >


                </div>

                <div className="form-search4 mt-5" style={{ marginLeft: "70px" }}>
                    <div className="form-searchDate row">
                        <div className="col-2 mt-1">
                            <h6 className="text-danger">4. Tổng tiền nạp (tiền nạp + tiền hủy gd của các tháng trước) : </h6>
                        </div>
                        <div className="col-3 mt-1">
                            <div className="row">
                                <div className="col-4 mt-1">
                                    <h6>Contract_Id: </h6>
                                </div>
                                <div className="col-4">
                                    <input
                                        value={contractId}
                                        className="rounded "
                                        type="text"
                                        placeholder="Nhập contract_id"
                                        onChange={(e) => {
                                            setContractid(e.target.value)
                                        }}
                                    />
                                </div>

                            </div>

                        </div>
                        <div className="date-fromto col-3">
                            <div className="row">
                                <div className="col-4 mt-1 rounded">
                                    <h6 className="">
                                        Start Date:{" "}
                                    </h6>
                                </div>
                                <div className="col-5">
                                    <DatePicker
                                        className="rounded"
                                        selected={startTime}
                                        onChange={(date) => setStartTime(date)}
                                        // showTimeSelect
                                        timeIntervals={1}
                                        timeCaption="time"
                                        dateFormat="dd/MM/yyyy HH:mm"
                                    />{" "}
                                </div>
                            </div>
                        </div>

                        <div className="date-to col-3">

                            <div>
                                <div className="row">
                                    <div className="col-4 mt-1">
                                        <h6>End Date:</h6>
                                    </div>
                                    <div className="col-6">
                                        <DatePicker
                                            selected={endTime}
                                            className="rounded"
                                            // locale="pt-BR"
                                            // showTimeSelect
                                            // timeFormat="HH:mm"
                                            timeIntervals={1}
                                            dateFormat="dd/MM/yyyy HH:mm"
                                            // style={{ fontSize: "25px" }}
                                            onChange={(date) => {
                                                const selectedEndDate = date
                                                const startDateObj = new Date(startTime);
                                                const endDateObj = new Date(selectedEndDate)
                                                const maxEndDate = new Date(
                                                    startDateObj.getTime() + dateLimit * 24 * 60 * 60 * 1000
                                                );

                                                const newEndTime =
                                                    endDateObj > maxEndDate
                                                        ? maxEndDate
                                                        : selectedEndDate;

                                                setEndTime(newEndTime);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="button-confirm col-1">
                            <button
                                className="btn btn-success border-bottom mb-2"
                                onClick={handleSubmit4}
                            >
                                Submit
                            </button>
                        </div>
                        <div className="d-flex justify-content-center">
                            {
                                result.result4 !== "" ? (result.result4 >= 0 ? <dt>Kết quả: {converToVND(result.result4)}</dt> : <dt></dt>) :
                                    <div></div>
                            }
                        </div>

                    </div >


                </div>

                <div className="form-search5 mt-5" style={{ marginLeft: "70px" }}>
                    <div className="form-searchDate row">
                        <div className="col-2 mt-1">
                            <h6 className="text-danger">5. Tổng tiền tiêu dùng lên hóa đơn(tiền xe qua trạm, tiền mua vé tháng quý): </h6>
                        </div>
                        <div className="col-3 mt-1">
                            <div className="row">
                                <div className="col-4 mt-1">
                                    <h6>Contract_Id: </h6>
                                </div>
                                <div className="col-4">
                                    <input
                                        value={contractId}
                                        className="rounded "
                                        type="text"
                                        placeholder="Nhập contract_id"
                                        onChange={(e) => {
                                            setContractid(e.target.value)
                                        }}
                                    />
                                </div>

                            </div>

                        </div>
                        <div className="date-fromto col-3">
                            <div className="row">
                                <div className="col-4 mt-1 rounded">
                                    <h6 className="">
                                        Start Date:{" "}
                                    </h6>
                                </div>
                                <div className="col-5">
                                    <DatePicker
                                        className="rounded"
                                        selected={startTime}
                                        onChange={(date) => setStartTime(date)}
                                        // showTimeSelect
                                        timeIntervals={1}
                                        timeCaption="time"
                                        dateFormat="dd/MM/yyyy HH:mm"
                                    />{" "}
                                </div>
                            </div>
                        </div>

                        <div className="date-to col-3">

                            <div>
                                <div className="row">
                                    <div className="col-4 mt-1">
                                        <h6>End Date:</h6>
                                    </div>
                                    <div className="col-6">
                                        <DatePicker
                                            selected={endTime}
                                            className="rounded"
                                            // locale="pt-BR"
                                            // showTimeSelect
                                            // timeFormat="HH:mm"
                                            timeIntervals={1}
                                            dateFormat="dd/MM/yyyy HH:mm"
                                            // style={{ fontSize: "25px" }}
                                            onChange={(date) => {
                                                const selectedEndDate = date
                                                const startDateObj = new Date(startTime);
                                                const endDateObj = new Date(selectedEndDate)
                                                const maxEndDate = new Date(
                                                    startDateObj.getTime() + dateLimit * 24 * 60 * 60 * 1000
                                                );

                                                const newEndTime =
                                                    endDateObj > maxEndDate
                                                        ? maxEndDate
                                                        : selectedEndDate;

                                                setEndTime(newEndTime);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="button-confirm col-1">
                            <button
                                className="btn btn-success border-bottom mb-2"
                                onClick={handleSubmit5}
                            >
                                Submit
                            </button>
                        </div>
                        <div className="d-flex justify-content-center row">
                            <div className="col-5 mt-2">
                                {
                                    result.result5 !== "" ? (result.result5 >= 0 ? <dt>Kết quả: {converToVND(result.result5)}
                                    </dt> : <dt></dt>) :
                                        <div></div>

                                }
                            </div>
                            <div className="col-4">
                                {
                                    result.result8 ?
                                        <button
                                            disabled={!result.result8}
                                            className="btn btn-info"
                                            onClick={() => handleDownload(result.result8)}
                                        >
                                            Filechitiet.XLSX
                                        </button> :
                                        <div></div>

                                }

                            </div>
                        </div>

                    </div >


                </div>

                <div className="form-search6 mt-5" style={{ marginLeft: "70px" }}>
                    <div className="form-searchDate row">
                        <div className="col-2 mt-1">
                            <h6 className="text-danger">6. Tổng tiền tiêu dùng lên hóa đơn(tiền mua vé tháng quý): </h6>
                        </div>
                        <div className="col-3 mt-1">
                            <div className="row">
                                <div className="col-4 mt-1">
                                    <h6>Contract_Id: </h6>
                                </div>
                                <div className="col-4">
                                    <input
                                        value={contractId}
                                        className="rounded "
                                        type="text"
                                        placeholder="Nhập contract_id"
                                        onChange={(e) => {
                                            setContractid(e.target.value)
                                        }}
                                    />
                                </div>

                            </div>

                        </div>
                        <div className="date-fromto col-3">
                            <div className="row">
                                <div className="col-4 mt-1 rounded">
                                    <h6 className="">
                                        Start Date:{" "}
                                    </h6>
                                </div>
                                <div className="col-5">
                                    <DatePicker
                                        className="rounded"
                                        selected={startTime}
                                        onChange={(date) => setStartTime(date)}
                                        // showTimeSelect
                                        timeIntervals={1}
                                        timeCaption="time"
                                        dateFormat="dd/MM/yyyy HH:mm"
                                    />{" "}
                                </div>
                            </div>
                        </div>

                        <div className="date-to col-3">

                            <div>
                                <div className="row">
                                    <div className="col-4 mt-1">
                                        <h6>End Date:</h6>
                                    </div>
                                    <div className="col-6">
                                        <DatePicker
                                            selected={endTime}
                                            className="rounded"
                                            // locale="pt-BR"
                                            // showTimeSelect
                                            // timeFormat="HH:mm"
                                            timeIntervals={1}
                                            dateFormat="dd/MM/yyyy HH:mm"
                                            // style={{ fontSize: "25px" }}
                                            onChange={(date) => {
                                                const selectedEndDate = date
                                                const startDateObj = new Date(startTime);
                                                const endDateObj = new Date(selectedEndDate)
                                                const maxEndDate = new Date(
                                                    startDateObj.getTime() + dateLimit * 24 * 60 * 60 * 1000
                                                );

                                                const newEndTime =
                                                    endDateObj > maxEndDate
                                                        ? maxEndDate
                                                        : selectedEndDate;

                                                setEndTime(newEndTime);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="button-confirm col-1">
                            <button
                                className="btn btn-success border-bottom mb-2"
                                onClick={handleSubmit6}
                            >
                                Submit
                            </button>
                        </div>
                        <div className="d-flex justify-content-center row">
                            <div className="col-5 mt-2">
                                {
                                    result.result6 !== "" ? (result.result6 >= 0 ? <dt>Kết quả: {converToVND(result.result6)}
                                    </dt> : <dt></dt>) :
                                        <div></div>

                                }
                            </div>
                            <div className="col-4">
                                {
                                    result.result7 ?
                                        <button
                                            disabled={!result.result7}
                                            className="btn btn-info"
                                            onClick={() => handleDownload(result.result7)}
                                        >
                                            Filechitiet.XLSX
                                        </button> :
                                        <div></div>

                                }

                            </div>
                        </div>

                    </div >


                </div>



                <div className="login__error mb-4">{error}</div>


                {/* Thay đổi câu sql  */}
                {checkRole(userRoles) && (
                    <div className="col-md-8 mt-5">
                        <dt style={{ fontSize: "20px" }}>Câu lệnh truy vấn</dt>
                        <textarea
                            disabled={showSql}
                            className="mt-4"
                            type="text"
                            style={{ height: "150px", width: "100%" }}
                            value={sql.nameSqlTool}
                            onChange={(e) => {
                                setSql((prev) => ({
                                    ...prev,
                                    nameSqlTool: e.target.value,
                                }));
                            }}
                        />
                        <textarea
                            disabled={showSql}
                            className="mt-4"
                            type="text"
                            style={{ height: "30%", width: "100%" }}
                            value={sql.option_tool}
                            onChange={(e) => {
                                setSql((prev) => ({
                                    ...prev,
                                    option_tool: e.target.value,
                                }));
                            }}
                        />

                        <div>
                            <button
                                onClick={() => {
                                    setShowSql(!showSql);
                                }}
                                className="mt-2 me-2 btn btn-secondary border-bottom "
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleSetNameSpl}
                                className="mt-2 btn btn-warning border-bottom "
                            >
                                Save
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default InvoiceFlowMoney;
