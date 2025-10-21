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

function SearchEpcRead() {
  const token = localStorage.getItem("token");
  const [result, setResult] = useState([]);
  const [epc, setEpc] = useState("");
  const [sql, setSql] = useState([]);
  const [optionTool, setOptionTool] = useState("");
  const { id } = useParams();
  const [error, setError] = useState("");
  const [showSql, setShowSql] = useState(true);
  const [showLoading, setShowLoading] = useState(false);

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
            groupId: sql.groupId,
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
    if (!isValid || epc.length != 24 || startTime === "" || endTime === "" || endTime<startTime) {
      console.log(endTime);
      setError("Nhập đúng định dạng!!!");
    } else {
      const startDateObj = new Date(startTime);
              const endDateObj = new Date(endTime);
              const maxEndDate = new Date(startDateObj.getTime() + dateLimit * 24 * 60 * 60 * 1000);
          
              if (endDateObj > maxEndDate) {
                setEndTime(maxEndDate.toISOString().split('T')[0]); // Giới hạn giá trị ngày kết thúc thành ngày tối đa
              }
      setShowLoading(true);
      axios
        .get(
          `${urlBase}/api/gsvh/getEpc?startTime=${startTime}&endTime=${endTime}&epc=${epc}&optionTool=${optionTool}`,
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
  return (
    <div>
      <Header></Header>

      <ToastContainer />
      {showLoading && <Loading></Loading>}
      <div className="container">
        <h2 className="text-center text-primary m-3">Tra cứu EPC Read</h2>
        <div>
          Start Date:{" "}
          <input
            type="date"
            className="rounded me-3 mb-3"
            style={{ fontSize: "25px" }}
            onChange={(e) => {
              setStartTime(e.target.value);
            }}
          />{" "}
          End Date:
          <input
            type="date"
            name=""
            id=""
            min={startTime}
            max={endTime}
            value={endTime}
            className="rounded me-3 mb-3"
            onChange={(e) => {
              const selectedEndDate = e.target.value;

              const startDateObj = new Date(startTime);
              const endDateObj = new Date(selectedEndDate);
              const maxEndDate = new Date(startDateObj.getTime() + dateLimit * 24 * 60 * 60 * 1000);
          
              if (endDateObj > maxEndDate) {
                setEndTime(maxEndDate.toISOString().split('T')[0]); // Giới hạn giá trị ngày kết thúc thành ngày tối đa
              } else {
                setEndTime(selectedEndDate);
              }
            }}
            style={{ fontSize: "25px" }} 
          />
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
                <th>ID</th>
                <th>Trạm</th>
                <th>Làn</th>
                <th>Antenna</th>
                <th>Reader IP</th>
                <th>EPC</th>
                <th>Arrive Time</th>
                <th>Depart Time</th>
                <th>Số lần đọc</th>
                <th>Thời gian tạo</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {result.map((rs) => (
                <tr
                  // style={{ justifyContent: "center", alignItems: "center" }}
                  key={rs.id}
                  className=""
                >
                  <td>{rs.id}</td>
                  <td className=""> {rs.station} </td>
                  <td> {rs.lane} </td>
                  <td>{rs.antenna}</td>
                  <td>{rs.readerIP}</td>
                  <td>{rs.epc}</td>
                  <td>{rs.arriveTime}</td>
                  <td>{rs.departTime}</td>
                  <td>{rs.readCounts}</td>
                  <td>{rs.createDate}</td>
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
export default SearchEpcRead;
