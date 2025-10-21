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

function KhongDocThe() {
  const token = localStorage.getItem("token");
  const [result, setResult] = useState();
  const [result1, setResult1] = useState();
  const [sql, setSql] = useState([]);
  const [optionTool, setOptionTool] = useState("");
  const { id } = useParams();
  const [showSql, setShowSql] = useState(true);
  const [showLoading, setShowLoading] = useState(false);


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
  
  const handleError = () => {
    setShowLoading(true);
    axios
      .get(
        `${urlBase}/api/gsvh/error-list?&optionTool=${optionTool}`,
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
  };
  const handleFixed = () => {
    setShowLoading(true);
    axios
      .get(
        `${urlBase}/api/gsvh/fixed-list?&optionTool=${optionTool}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        setResult1(response.data);
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
      <div className="container">
        <h2 className="text-center text-primary m-3 mt-5">Danh sách xe nghi ngờ không đọc được thẻ</h2>
        <div>
          <button
            className="btn btn-success border-bottom mb-2"
            onClick={handleError}
          >
            ErrorList
          </button>
          <div id="download-button-sale-order">
           {result?<div>
           <p>Click down below to download KhongDocThe.XLSX</p>
            <button className="btn btn-info" onClick={() => handleDownload(result)}>
            Download KhongDocThe.XLSX
            </button>
           </div>:""}
          </div>
        </div>
        <h2 className="text-center text-primary m-3 mt-5">Danh sách xe đã được xử lý</h2>
        <div>
          <button
            className="btn btn-success border-bottom mb-2"
            onClick={handleFixed}
          >
            FixedList
          </button>
          <div id="download-button-sale-order">
           {result1?<div>
           <p>Click down below to download FixedEtag.XLSX</p>
            <button className="btn btn-info" onClick={() => handleDownload(result1)}>
            Download FixedEtag.XLSX
            </button>
           </div>:""}
          </div>
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
export default KhongDocThe;
