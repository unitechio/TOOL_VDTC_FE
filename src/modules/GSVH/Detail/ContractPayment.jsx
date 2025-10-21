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

function ContractPayment() {
  const token = localStorage.getItem("token");
  const [result, setResult] = useState("");
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
        setGroupId(response.data.groupId);
        setOptionTool(response.data.option_tool);
        setDateLimit(response.data.limitDate?response.data.dateLimit:900);
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

    if (startTime === "" || endTime === "" || startTime > endTime) {
      setError("Nhập đúng định dạng!!!");
    } else {
      const startDateObj = new Date(startTime);
              const endDateObj = new Date(endTime);
              const maxEndDate = new Date(startDateObj.getTime() + dateLimit * 24 * 60 * 60 * 1000);
          
              if (endDateObj > maxEndDate) {
                setEndTime(maxEndDate.toISOString().split('T')[0]); // Giới hạn giá trị ngày kết thúc thành ngày tối đa
              }
      setShowLoading(true);
      setResult("");
      axios
        .get(
          `${urlBase}/api/gsvh/contract-payment?startTime=${startTime}&endTime=${endTime}&optionTool=${optionTool}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          // setResult("h.xlsx");
          if (response.data !== "InvalidDate") setResult(response.data);
          console.log(response.data);
          setShowLoading(false);
        })
        .catch((errr) => {
          console.log(errr);
          setShowLoading(false);
        });
    }
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
        <h2 className="text-center text-primary m-3">
          Lịch sử đăng ký ViettelPay
        </h2>
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
            value={endTime}
            id=""
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
          <button
            className="btn btn-success border-bottom mb-2"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
        <div className="login__error mb-4">{error}</div>

        <div id="download-button-sale-order">
          {result ? (
            <div>
              <p>Click down below to download ContractPayment.XLSX</p>
              <button
                className="btn btn-info"
                onClick={() => handleDownload(result)}
              >
                Download ContractPayment.XLSX
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="mt-5" style={{ fontSize: "20px" }}>
          <dt>
            Chọn 2 mốc thời gian cần lấy thông tin báo cáo sau đó ấn submit.
            <dt>
              Tùy thuộc vào mốc thời gian tìm dài hay ngắn sẽ tương ứng thời
              gian đợi tạo XLSX để Download.
            </dt>
          </dt>
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
export default ContractPayment;
