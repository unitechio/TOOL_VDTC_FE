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

function BaoCaoVCB() {
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

    const handleSubmit = () => {
        setError("");
        setResult("")
      
            // console.log(channle);
            const startDateObj = new Date();
            const endDateObj = new Date();
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
                    `${urlBase}/api/kd/get-report-by-sql?startTime=${startDateObj}&endTime=${endDateObj}&optionTool=${optionTool}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
                .then((response) => {
                    // setResult("h.xlsx");
                    setResult(response.data);
                    setShowLoading(false);
                })
                .catch((errr) => {
                    console.log(errr);
                    setShowLoading(false);
                });
      
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
                <h2 className="text-center m-3">Báo cáo liên kết VCB </h2>
                <div className="form-search1 mt-5" style={{ marginLeft: "70px" }}>
                    <div className="form-searchDate row d-flex justify-content-center">
                        <div className="button-confirm col-1 d-flex justify-content-center">
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
                                       BaoCaoVCB.XLSX
                                    </button> :
                                    <div></div>
                            }
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
export default BaoCaoVCB;
