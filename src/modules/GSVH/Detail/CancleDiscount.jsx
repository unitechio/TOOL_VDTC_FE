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

function CancleDiscount() {
  const token = localStorage.getItem("token");
  const [result, setResult] = useState([]);
  const [epc, setEpc] = useState("");
  const [sql, setSql] = useState([]);
  const [optionTool, setOptionTool] = useState("");
  const { id } = useParams();
  const [error, setError] = useState("");
  const [showSql, setShowSql] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [groupId, setGroupId] = useState("");

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [dateLimit,setDateLimit] = useState(900); 

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
        setDateLimit(response.data.limitDate?response.data.limitDate:900);
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
    setEpc(e.target.value);
  };

  const searchEpc = () => {
    setError("");
    const regex = /^[a-zA-Z0-9]+$/;
    const isValid = regex.test(epc);
    if (epc.length != 24 ) {
      setError("Nhập đúng định dạng!!!");
    } else {
      setShowLoading(true);
      axios
        .get(
          `${urlBase}/api/gsvh/get-exceptionlist-platnumber?epc=${epc}&optionTool=${optionTool}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          setResult(response.data);
          setShowLoading(false);
        })
        .catch((errr) => {
          console.log(errr);
          setShowLoading(false);
        });
    }
  };

  // Update miễn giảm
  const handleUpdate = (listId) => {
    if(window.confirm("Bạn muốn hủy miễn giảm?"))
    {
        axios
        .get(
          `${urlBase}/api/gsvh/update-exceptionlist-platnumber?listId=${listId}&optionTool=${optionTool}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          if(response.data === "True_update")
          {
            toast.success("Cập nhật thành công.",toastObject);
            searchEpc();
          }
          else
          {
            toast.error("Cập nhật thất bại!!",toastObject);
          }
          setShowLoading(false);
        })
        .catch((errr) => {
        
          console.log(errr);
          setShowLoading(false);
          toast.error("Cập nhật thất bại!!",toastObject);
        });
    }
  }
  return (
    <div>
      <Header></Header>

      <ToastContainer />
      {showLoading && <Loading></Loading>}
      <div className="container">
        <h2 className="text-center text-primary m-3">Hủy miễn giảm gói</h2>
        <div>
          
          <input
            className="rounded me-3 mb-3"
            style={{ fontSize: "25px" }}
            type="text"
            placeholder="EPC"
            onChange={handleInput}
          />
          <button
            className="btn btn-success border-bottom mb-2"
            onClick={searchEpc}
          >
            Search
          </button>
        </div>
        <div className="login__error mb-4">{error}</div>
        <div className="row">
          <table className="table table-striped table-bordered">
            <thead>
              <tr className="text-center">
                <th>Exception List ID</th>
                <th>EPC</th>
                <th>Plate Number</th>
                <th>Create Date</th>
                <th>Station Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {result.map((rs) => (
                <tr
                  // style={{ justifyContent: "center", alignItems: "center" }}
                  key={rs.exceptionListId}
                  className=""
                >
                  <td>{rs.exceptionListId}</td>
                  <td className=""> {rs.epc} </td>
                  <td> {rs.plateNumber} </td>
                  <td>{rs.creatDate}</td>
                  <td>{rs.stationName}</td>
                  <td>{rs.status}</td>
                  <td>{rs.status!=='7' && <button style={{ fontSize: "10px" }}
                  onClick={()=>{
                    handleUpdate(rs.exceptionListId)
                  }}
                        className="btn btn-danger border-bottom">Hủy miễn giảm</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
export default CancleDiscount;
