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

function EtagHistory() {
  const token = localStorage.getItem("token");
  const [result, setResult] = useState([]);
  const [sql, setSql] = useState([]);
  const [optionTool, setOptionTool] = useState("");
  const { id } = useParams();
  const [error, setError] = useState("");
  const [showSql, setShowSql] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [groupId, setGroupId] = useState("");

  const [serial,setSerial] = useState("");
  const [month,setMonth] = useState("");

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

  const handleSubmit = () => {
    setError("");
    if (serial === "" || serial.length !==8 || +month%1!==0 || !month) {
      setError("Nhập đúng định dạng!!!");
    } else {
      setShowLoading(true);
      setResult([]);
      axios
        .get(
          `${urlBase}/api/gsvh/etag-history?serial=${serial}&month=${month}&optionTool=${optionTool}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          // setResult("h.xlsx");
          if (response.data) setResult(response.data);
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
        <h2 className="text-center text-primary m-3">
        Tra cứu lịch sử Etag
        </h2>
        <div>
          Serial:{" "}
          <input
            type="input"
            className="rounded me-3 mb-3"
            style={{ fontSize: "25px" }}
            placeholder="Nhập serial"
            onChange={(e) => {
              setSerial(e.target.value);
            }}
          />{" "}
          Month ago:
          <input
            type="number"
            name=""
            min={0}
            id=""
            defaultValue={0}
            className="rounded me-3 mb-3"
            onChange={(e) => {
              setMonth(e.target.value);
            }}
            style={{ fontSize: "25px" }}
          />
          <button
            className="btn btn-success border-bottom mb-2"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
        <div className="login__error mb-4">{error}</div>
        <div className="row">
          <table className="table table-striped table-bordered">
            <thead>
              <tr className="text-center">
                <th>Tác động</th>
                <th>Ngày tác động</th>
                <th>Người tác động</th>
                <th>Note</th>
                <th>Biển số</th>
                <th>Thẻ rfid trên xe</th>
                <th>Thẻ cũ</th>
                <th>Thẻ mới</th>
                <th>Mô tả</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {result.map((rs) => (
                <tr
                  // style={{ justifyContent: "center", alignItems: "center" }}
                  key={rs.plateNumber}
                  className=""
                >
                  <td>{rs.action}</td>
                  <td className=""> {rs.dateAction} </td>
                  <td> {rs.userAction} </td>
                  <td>{rs.note}</td>
                  <td>{rs.plateNumber}</td>
                  <td>{rs.rfidSerial}</td>
                  <td>{rs.serialOld}</td>
                  <td>{rs.serialNew}</td>
                  <td>{rs.description}</td>
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
export default EtagHistory;
