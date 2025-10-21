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

function StationAlert() {
  const token = localStorage.getItem("token");
  const [result, setResult] = useState([]);
  const [sql, setSql] = useState([]);
  const [optionTool, setOptionTool] = useState("");
  const { id } = useParams();
  const [showSql, setShowSql] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [groupId, setGroupId] = useState("");

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
    const fetchData = async () => {
      if(optionTool)
      {
        axios.get(
          `${urlBase}/api/gsvh/station-alert-get-list?&optionTool=${optionTool}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
          .then((response) => {
            if(response.data!="") setResult(response.data);
            setShowLoading(false);
          })
          .catch((errr) => {
            setShowLoading(false);
          console.log(errr);
          });
      }
    };
  
    const fetchDataAndUpdateSql = async () => {
      try {
        const response = await axios.get(
          `${urlBase}/api/tool-department/getById?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        setGroupId(response.data.groupId);
        setOptionTool(response.data.option_tool);
  
        const response1 = await axios.get(
          `${urlBase}/api/sql/getbyName?optionTool=${response.data.option_tool}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        setSql(response1.data);
      } catch (err) {
        console.log(err);
      }
    };
    

    
    // Gọi lần đầu tiên ngay sau khi component được render
    fetchDataAndUpdateSql();

    fetchData();
  
    // Thiết lập lịch gọi API mỗi 5 phút
    const intervalId = setInterval(fetchData, 5 * 60 *1000 );
  
    // Hủy lịch gọi khi component unmount
    return () => clearInterval(intervalId);
  }, [optionTool]);

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



  return (
    <div>
      <Header></Header>

      <ToastContainer />
      {showLoading && <Loading></Loading>}
      <h2 className="text-center text-white mb-4 w-100" style={{background: result.length===0?"#0099ff":"#ff5858",width:"100%"}}>
        Station alert
        </h2>
      <div className="container">
        <div className="row">
          <table className="table table-striped table-bordered">
            <thead>
              <tr className="text-center">
                <th>ID Trạm</th>
                <th>Tên Trạm</th>
                <th>Ngưỡng cảnh báo</th>
                <th>Loại giao dịch</th>
                <th>Làn</th>
                <th>Giao dịch gần nhất</th>
                <th>Thời gian</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {result.map((rs) => (
                <tr
                  // style={{ justifyContent: "center", alignItems: "center" }}
                  key={rs.plateNumber}
                  className=""
                >
                  <td>{rs.stationID}</td>
                  <td className=""> {rs.stationName} </td>
                  <td> {rs.alertThreshold} </td>
                  <td>{rs.alertType}</td>
                  <td>{rs.lane}</td>
                  <td>{rs.lastTransaction}</td>
                  <td>{rs.duration}</td>
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
export default StationAlert;
