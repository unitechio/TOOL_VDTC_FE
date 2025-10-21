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




function UserBlackList() {
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

    const [username, setUsername] = useState("");
    const [userBlackList, setuserBlackList] = useState([]);
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


    const getUserBlackList = async () => {
        try {
            const res = await API.getUserBlackList(token, username);

            setuserBlackList(res.data.data);
        } catch (err) {

        }
    }


    const handleSubmit = async () => {
        if (username.length !== 0) {
            setSeacrch(true)
            setError("");
            setShowLoading(true);
            setResult("");
            let err = "0";

            getUserBlackList()
            setShowLoading(false)
        }
        else {
            setError("Vui lòng điền đầy đủ thông tin")
            setSeacrch(false);
        }
    }

    const unlockUserBlackList = async (username) => {
        const isConfirmed = await confirmModal("Xác nhận gỡ cấm user");
        if (isConfirmed) {
            const unlock = async () => {
                try {
                    const res = await API.unlockUserBlackList(token, username);
                    getUserBlackList()
                    console.log(res.data.data);

                    if (res.data.data) {
                        toast.success("Gỡ cấm thành công.", toastObject)
                    }
                    else {
                        toast.error("Gỡ cấm thất bại.", toastObject)
                    }
                } catch (err) {
                    console.log(err);
                }
            }
            await unlock()
        }
    }

    const lockUserBlackList = async (username) => {
        const isConfirmed = await confirmModal("Xác nhận cấm user");
        if (username !== "" &&  isConfirmed) {
            const unlock = async () => {
                try {
                    const res = await API.lockUserBlackList(token, username);
                    getUserBlackList()

                    if (res.data.data) {
                        toast.success("Cấm thành công.", toastObject)
                    }
                    else {
                        toast.error("Cấm thất bại.", toastObject)
                    }
                } catch (err) {
                    console.log(err);
                }
            }
            await unlock()
        }
    }


    return (
        <div>
            <Header></Header>
            <ToastContainer />
            {showLoading && <Loading></Loading>}
            <div className="container">
                <h2 className="text-center text-primary m-3">Gỡ cấm user đấu nối</h2>
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
                                        value={username}
                                        className="border_input "
                                        type="text"
                                        placeholder="Nhập username"
                                        onChange={(e) => {
                                            setUsername(e.target.value.toLocaleUpperCase().trim())
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

                    <div className="">
                        {userBlackList.length > 0 && search &&
                            <Table striped bordered hover variant="" style={{ minHeight: "250px" }}>
                                <thead>
                                    <tr style={{ background: "#ffe2cd" }}><td className="style_text" colSpan="10">Thông tin user đấu nối</td></tr>
                                    <tr style={{ whiteSpace: 'pre-line' }}>
                                        <th>STT</th>
                                        <th>Username</th>
                                        <th>Ngày ghi nợ</th>
                                        <th>Biển số xe</th>
                                        <th >Hợp đồng</th>
                                        <th>Trạng thái</th>
                                        <th>Tác động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userBlackList?.map((info, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            {Object.values(info)?.map((value, i) => (
                                                <td key={i}>{value === null ? "" : value}</td>
                                            ))}
                                            <td className="Action">
                                                <div className="" style={{ textAlign: "center" }}>
                                                    <div className="d-flex flex-column align-items-center">
                                                        <div className="mb-2 bd-highlight">
                                                            <button
                                                                className="btn btn-danger button_action"
                                                                disabled={userBlackList === null}
                                                                onClick={() => {
                                                                    unlockUserBlackList(userBlackList[0].userName);
                                                                }}
                                                                style={{ fontSize: "12px" }}
                                                            >
                                                                Gỡ cấm
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

                        {userBlackList?.length === 0 && search && (
                            <Table striped bordered hover variant="" style={{ minHeight: "250px" }}>
                                <thead>
                                    <tr style={{ background: "#ffe2cd" }}>
                                        <td className="style_text" colSpan="10">Thông tin user đấu nối</td>
                                    </tr>
                                    <tr style={{ whiteSpace: 'pre-line' }}>
                                        <th>STT</th>
                                        <th>Username</th>
                                        <th>Tác động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td> {/* STT Column */}
                                        <td>{username}</td> {/* Default Username */}
                                        <td>
                                            <button
                                                className="btn btn-danger button_action"
                                                onClick={() => {
                                                    console.log(username);
                                                    
                                                    lockUserBlackList(username);
                                                }}
                                                style={{ fontSize: "12px" }}
                                            >
                                                Cấm
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        )}


                    </div>

                </div>

            </div>
        </div>
    );
}
export default UserBlackList;