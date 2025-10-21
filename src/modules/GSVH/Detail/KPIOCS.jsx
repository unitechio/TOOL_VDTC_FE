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
import vi from 'date-fns/locale/vi'; // Import ngôn ngữ tiếng Việt

function KPIOCS() {
    const token = localStorage.getItem("token");
    const [result, setResult] = useState("");
    const [sql, setSql] = useState([]);
    const [optionTool, setOptionTool] = useState("");
    const { id } = useParams();
    const [error, setError] = useState("");
    const [showSql, setShowSql] = useState(true);
    const [showLoading, setShowLoading] = useState(false);
    const [groupId, setGroupId] = useState("");
    const [channle, setChannle] = useState("");
    const [contractId, setContractid] = useState("")
    const today = new Date(); // Ngày hiện tại
    const minDate = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000); // Ngày hiện tại trừ đi 5 ngày

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [dateLimit, setDateLimit] = useState(900);
    const [categorie, setCategorie] = useState("kpi_boo1")

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

    const converToVND = (e) => {
        var x = e;
        x = x.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
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

    const handleSubmit = () => {
        setError("");
        if (startTime === "") {
            setError("Nhập đúng định dạng!!!");
        } else {
            console.log(startTime);
            setShowLoading(true);
            setResult("");
            axios
                .get(
                    `${urlBase}/api/gsvh/generate-ocs-kpi?date=${startTime}&categorie=${categorie}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
                .then((response) => {
                    // setResult("h.xlsx");
                    setResult(response.data)
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
        setCategorie(event.target.value);
        
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
            <div className="container" style={{ textAlign: "left" }}>
                <h2 className="text-center m-3">Báo cáo KPI_OCS</h2>
                <div className="form-search1 mt-5" style={{ marginLeft: "70px" }}>
                    <div className="form-searchDate row">
                        <div className="col-2 mb-2">
                            <h4 className="text-danger"> Xuất báo cáo </h4>
                        </div>
                        <div className="date-fromto col-7 mt-1">
                            <div className="row">
                                <div className="col-3 mt-1 rounded">
                                    <h6 className="">
                                        Ngày xuất báo cáo:{" "}
                                    </h6>
                                </div>
                                <div className="col-4" >
                                    <DatePicker
                                        className="rounded smallDatePicker"
                                        selected={startTime}
                                        onChange={(date) => setStartTime(date)}
                                        // showTimeSelect
                                        timeIntervals={1}
                                        timeCaption="time"
                                        dateFormat="dd/MM/yyyy"
                                        maxDate={today}
                                        minDate={minDate}
                                        locale={vi}
                                    />{" "}
                                </div>
                                <div className="col-5">
                                    <div className="row">
                                        <div className="col-3 mt-1">
                                            <h6>
                                                Loại:
                                            </h6>
                                        </div>
                                        <div className="col-9">
                                            <select
                                                name="search"
                                                id="search"
                                                className="rounded me-3 mb-3 col-8 smallDatePicker"
                                                onChange={handleChannelOnchange}
                                            >
                                                <option value="kpi_boo1" selected>KPI_BOO1</option>
                                                <option value="kpi_vtpay">KPI_VTPAY</option>
                                            </select>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="button-confirm col-1">
                            <button
                                className="button_search mb-2"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        </div>
                        <div className="row d-flex justify-content-center mt-5">

                            {
                                result ?
                                    <button
                                        disabled={!result}
                                        className="button_search col-3"
                                        onClick={() => handleDownload(result)}
                                    >
                                        BaoCao{result.toString().toUpperCase()}
                                    </button> :
                                    <div></div>
                            }
                        </div>


                    </div >


                </div>
                <div className="login__error mb-4">{error}</div>


                {/* Thay đổi câu sql  */}
            </div>
        </div>
    );
}
export default KPIOCS;
