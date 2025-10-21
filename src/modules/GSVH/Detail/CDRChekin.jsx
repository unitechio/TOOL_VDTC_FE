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

function CDRCheckin() {
  const token = localStorage.getItem("token");
  const [result, setResult] = useState([]);
  const [tmpResult, setTmpResult] = useState([]);
  const [epc, setEpc] = useState("");
  const [sql, setSql] = useState([]);
  const [optionTool, setOptionTool] = useState("");
  const { id } = useParams();
  const [showSql, setShowSql] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [groupId, setGroupId] = useState("");

  const [countEpc, setCountEpc] = useState(-1);
  const [countBs, setCountBs] = useState(-1);
  const [countOff, setCountOff] = useState(-1);

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
            console.log(response1.data);
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
    setShowLoading(true);
    axios
      .get(
        `${urlBase}/api/gsvh/search-cdr?&epc=${epc}&optionTool=${optionTool}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        setResult(response.data);
        const count = response.data.filter((item) =>
          item.checkInType.includes("Trừ Offline qua trạm Boo1")
        );
        setCountOff(count.length ? count.length : 0);
        const count1 = response.data.filter((item) =>
          item.checkInType.includes("Check In EPC Thành Công")
        );
        setCountEpc(count1.length ? count1.length : 0);
        const count2 = response.data.filter((item) =>
          item.checkInType.includes("Checkin Biển Số")
        );
        setCountBs(count2.length ? count2.length : 0);
        setTmpResult(response.data);
        setShowLoading(false);
      })
      .catch((errr) => {
        console.log(errr);
        setShowLoading(false);
      });
  };

  const handleSearchOptionChange = (event) => {
    setTmpResult(result);
    setTmpResult(
      result?.filter((rs) => {
        return rs.checkInType.includes(event.target.value);
      })
    );
  };
  return (
    <div>
      <Header></Header>

      <ToastContainer />
      {showLoading && <Loading></Loading>}
      <div className="container">
        <h2 className="text-center text-primary m-3">Tra cứu CDR Checkin</h2>
        <div>
          <input
            className="rounded me-3 mb-3"
            style={{ fontSize: "25px" }}
            type="text"
            placeholder="EPC hoặc biển số"
            onChange={handleInput}
          />
          <button
            className="btn btn-success border-bottom mb-2"
            onClick={searchEpc}
          >
            Search
          </button>
        </div>
        {(countEpc !== -1 || countBs !== -1 || countOff != -1) && (
          <div
            className="login__error mb-4 d-flex justify-content-end"
            style={{ fontSize: "30px" }}
          >
            <p>
              Checkin EPC:{countEpc}, Checkin BS:{countBs}, Offline:{countOff}
            </p>
          </div>
        )}
        <div className="row">
          <table className="table table-striped table-bordered">
            <thead>
              <tr className="text-center">
                <th>Ticket ID</th>
                <th>EPC</th>
                <th>Giá vé</th>
                <th>Offer TimeStamp</th>
                <th>Biển số</th>
                <th>Tên trạm vào</th>
                <th>Tên trạm ra</th>
                <th>Làn vào</th>
                <th style={{ width: "6px" }}>
                  <select id="mySelect" onChange={handleSearchOptionChange}>
                    <option value="">Search ...</option>
                    <option value="Checkin Biển Số">Checkin Biển Số</option>
                    <option value="Check In EPC Thành Công">
                      Check In EPC Thành Công
                    </option>
                    <option value="Trừ Offline nội trạm">
                      Trừ Offline nội trạm
                    </option>
                    <option value="Trừ Offline qua trạm Boo1">
                      Trừ Offline qua trạm Boo1
                    </option>
                    <option value="Check In thất bại">Check In thất bại</option>
                  </select>
                </th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {tmpResult?.map((rs) => (
                <tr
                  // style={{ justifyContent: "center", alignItems: "center" }}
                  key={rs.id}
                  className=""
                >
                  <td>{rs.ticket_id}</td>
                  <td className=""> {rs.epc} </td>
                  <td> {rs.price} </td>
                  <td>{rs.offerTimeStamp}</td>
                  <td>{rs.plateNumber}</td>
                  <td>{rs.stationInName}</td>
                  <td>{rs.stationOutName}</td>
                  <td>{rs.laneInName}</td>
                  <td>{rs.checkInType}</td>
                  <td>{rs.note}</td>
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
export default CDRCheckin;
