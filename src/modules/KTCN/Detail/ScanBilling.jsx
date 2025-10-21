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
import { Modal } from "antd";

function ScanBilling() {
    const token = localStorage.getItem("token");
    const [result, setResult] = useState("");
    const [sql, setSql] = useState([]);
    const [optionTool, setOptionTool] = useState("");
    const { id } = useParams();
    const [error, setError] = useState("");
    const [showSql, setShowSql] = useState(true);
    const [showLoading, setShowLoading] = useState(false);
    const [groupId, setGroupId] = useState("");

    const [date, setDate] = useState("");

    const rolesString = localStorage.getItem("roles");
    const userRoles = rolesString ? JSON.parse(rolesString) : [];
    const checkRole = (userRoles) => {
        if (userRoles.includes("ADMIN")) {
            return true;
        }
        return false;
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
                    }
                    else {
                        toast.error("Lỗi cú pháp câu lệnh", toastObject);
                    }
                })
                .catch((errr) => {
                    toast.success("Bạn không có quyển làm điều này !!", toastObject);
                    console.log(errr);
                });
        }
    };

    const handleSubmit = async () => {
        setError("");

        const isConfirmed = await confirmModal("Xác nhận thực thi");
        if (isConfirmed) {
            setShowLoading(true);
            setResult("")
            axios
                .get(
                    `${urlBase}/api/ktcn/updateBilling?optionTool=${optionTool}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
                .then((response) => {
                    if(response.data === true)
                    {
                        toast.success("Quét thành công",toastObject);
                    }
                    else{
                        toast.error("Quét lỗi!",toastObject);
                    }
                    setShowLoading(false);
                })
                .catch((errr) => {
                    console.log(errr);
                    setShowLoading(false);
                });
        }
    };

    return (
        <div>
            <Header></Header>

            <ToastContainer />
            {showLoading && <Loading></Loading>}
            <div className="container">
                <h2 className="text-center text-primary m-3">Quét hóa đơn billing chưa được cấp lại mã của Cơ Quan Thuế khi xuất hiện cảnh báo</h2>
                <div className="row mt-5 d-flex justify-content-center">
                    <div className="col-2 mt-2">
                        <h5>Thực hiện quét: </h5>
                    </div>
                    <div className="button-confirm col-2 mt-1">
                        <button
                            className="button_search btn border-bottom mb-2"
                            onClick={handleSubmit}
                        >
                            Quét
                        </button>
                    </div>

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
export default ScanBilling;
