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
import { Table } from 'react-bootstrap'
import { Modal } from "antd";
import API from "../../../api";

function ChangeBillCycle() {
  const token = localStorage.getItem("token");
  const [result, setResult] = useState([]);
  const [contractID, setContractID] = useState("");
  const [sql, setSql] = useState([]);
  const [optionTool, setOptionTool] = useState("");

  const [historyChangeBillCyCle, setHistoryChangeBillCyCle] = useState([]);
  const { id } = useParams();
  const [error, setError] = useState("");
  const [showSql, setShowSql] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [groupId, setGroupId] = useState("");
  const [search, setSeacrch] = useState(false);
  

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
    autoClose: 2000,
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
            setGroupId(response.data.groupId);
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
          if(response.data ==="true_update")
        {
        setShowSql(true);
        toast.success("Update thành công !!", toastObject);
        }
        else{
          toast.error("Lỗi cú pháp câu lệnh",toastObject);
        }
        })
        .catch((errr) => {
          toast.success("Bạn không có quyển làm điều này !!", toastObject);
          console.log(errr);
        });
    }
  };
  const handleInput = (e) => {
    setContractID(e.target.value);
  };

  const searchContract = async () => {
    setSeacrch(true);
    setError("");
    setResult([]);
    setShowLoading(true);

    getChangeBillCycle();

    await getHistoryChangeBillCyCle()
    setShowLoading(false);
  };

  const getChangeBillCycle = async () => {
    try {
        const res = await API.getChangeBillCycle(token, contractID);
        setResult(res.data);
    } catch (err) {

    }
  }

  const getHistoryChangeBillCyCle = async () => {
    try {
        const res = await API.getHistoryChangeBillCyCle(token, contractID);
        setHistoryChangeBillCyCle(res.data);
    } catch (err) {

    }
}
  const  handleChangeBillCycle = async () => {
    const isConfirmed = await confirmModal("Xác nhận thay đổi");
    console.log(isConfirmed);
    
    if (result.rowBillCycleChange !=="0" && contractID.length !== 0 && isConfirmed) {
      setShowLoading(true);
      axios
        .put(
          `${urlBase}/api/cskh/change-bill-cycle?contractID=${contractID}&optionTool=${optionTool}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          setShowLoading(false);
          if (response.data === "True_Update") {
            setResult((prev) => ({
              ...prev,
              status: "0",
            }));
            getChangeBillCycle()
            getHistoryChangeBillCyCle()
            toast.success("Cập nhập thành công", toastObject);
            searchContract();
    
          } else {
            toast.error("Cập nhập thất bại", toastObject);
          }
        })
        .catch((errr) => {
          setResult([])
          setShowLoading(false);
          toast.error("Cập nhập thất bại", toastObject);
          console.log(errr);
        });

    }
    
      
  };
  return (
    <div>
      <Header></Header>
      <ToastContainer />
      {showLoading && <Loading></Loading>}
      <div className="container">
        <h2 className="text-center text-primary m-3">Thay đổi hóa đơn lượt</h2>
        <div>
          <input
            className="border_input me-3 mb-3"
            
            // style={{ fontSize: "25px" }}
            type="text"
            value={contractID}
            placeholder="Nhập contractID"
            onChange={handleInput}
            onKeyDown={(e) => {
              if(e.key == 'Enter'){
                searchContract()
                }
          }}
          />
          <button
            className="button_search mb-2"
            onClick={searchContract}
          >
            Search
          </button>
        </div>
        <div className="login__error mb-4">{error}</div>
        <div className="row">
          <div className="col-md-12" style={{ fontSize: "20px" }}>
            <ul>
              <li
                class="list-group-item"
                style={{ display: "flex", flexDirection: "row" }}
              >
                Số hợp đồng: {result.contractId}
              </li>
              <li
                class="list-group-item"
                style={{ display: "flex", flexDirection: "row" }}
              >
                Tên: {result.noticeName}
              </li>
              <li
                class="list-group-item"
                style={{ display: "flex", flexDirection: "row" }}
              >
                Số điện thoại: {result.noticePhone}
              </li>
              <li
                class="list-group-item"
                style={{ display: "flex", flexDirection: "row" }}
              >
                Trạng thái hóa đơn hiển thị: {result.billCycle === '1'? 'Hóa đơn lượt':''}
                {result.billCycle ==='3'? ( result.billCycleMergeType==='0' ? "Hóa đơn gộp theo hợp đồng":"Hóa đơn gộp theo xe") : ""}
              </li>
              <li
                class="list-group-item"
                style={{ display: "flex", flexDirection: "row" }}
              >
                Trạng thái hóa đơn hiện tại: {result.currentBillCycle !== null? result.currentBillCycle:''}
              </li>
            </ul>
          </div>
        </div>
        <div className="row">

          <div className="historyVehicle row  ms-3 me-3 mb-3 mt-3">
                <div className="">
                    {historyChangeBillCyCle.length > 0  && search &&
                        <Table striped bordered hover variant="" style={{ minHeight: "250px" }}>
                            <thead>
                                <tr style={{ background: "#ffe2cd" }}><td className="style_text" colSpan="10">Lịch sử thay đổi trạng thái gần nhất (4 bản ghi gần nhất)</td></tr>
                                <tr style={{ whiteSpace: 'pre-line' }}>
                                    <th>STT</th>
                                    <th>Chu kỳ hóa đơn cũ</th>
                                    <th>Kiểu gộp cũ</th>
                                    <th>Chu kỳ hóa đơn mới</th>
                                    <th >Kiểu gộp mới</th>
                                    <th>Tác động</th>
                                    <th>Ngày thay đổi</th>
                                    <th>Tháng áp dụng chu kỳ mới</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyChangeBillCyCle?.map((info, index) => (
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

                    {historyChangeBillCyCle.length === 0  && search &&
                        <Table striped bordered hover variant="">
                            <thead>
                                <tr style={{ background: "#ffe2cd" }}><td className="style_text" colSpan="10">Lịch sử thay đổi trạng thái gần nhất</td></tr>
                            </thead>
                            <tbody>

                                <tr>
                                    <th>Không tìm thấy lịch sử thay đổi trạng thái gần đây!</th>
                                </tr>

                            </tbody>
                        </Table>
                    }

                </div>
                <div className="col-md-8" style={{ fontSize: "30px" }}>
            <div>
              <button
              disabled={(contractID.length===0 || showLoading || result ===null || result.rowBillCycleChange ==="0")?true:false}
                className="button_search border-bottom text-center"
                style={{marginLeft:'400px'}}
                onClick={handleChangeBillCycle}
              >
                Thay đổi hóa đơn lượt
              </button>
            </div>
          </div>
            </div>
          {/* {checkRole(userRoles) && (
            <div className="col-md-4">
              <dt style={{ fontSize: "20px" }}>Câu lệnh truy vấn</dt>
              <textarea
                disabled={showSql}
                className="mt-4"
                type="text"
                style={{ height: "30%", width: "100%" }}
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
          )} */}
        </div>
      </div>
    </div>
  );
}
export default ChangeBillCycle;

