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
import * as XLSX from 'xlsx';

function ChangeDateTicket() {
  
  const token = localStorage.getItem("token");
  const [result, setResult] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [sql, setSql] = useState([]);
  const [optionTool, setOptionTool] = useState("");
  const { id } = useParams();
  const [error, setError] = useState("");
  const [showSql, setShowSql] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showUpdate,setShowUpdate]  = useState(false);
  const [dateNew,setDateNew] = useState("");
  const [groupId, setGroupId] = useState("");

  const [fileExcel, setFileExcel] = useState(null);
  const [excelData, setExcelData] = useState(null);

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
            setGroupId(response.data.groupId);
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
  // const handleInput = (e) => {
  //   setTicketId(e.target.value);
  // };

  const searchTicket = () => {
    setError("");
    setResult("");
    setShowLoading(true);
    axios
      .get(
        `${urlBase}/api/gsvh/get-ticket?ticketId=${ticketId}&optionTool=${optionTool}`,
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
        setShowLoading(false);
        console.log(errr);
      });
  };

  const handleUpdateDate = () => {
    if (dateNew.length >=9 && window.confirm("Bạn chắc chắn muốn thay đổi")) {
      setShowLoading(true);
      axios
        .put(
          `${urlBase}/api/gsvh/update-date-ticket?ticketId=${result.ticketId}&date=${dateNew}&optionTool=${optionTool}`,
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
              feRevenueDate: dateNew,
            }));
            toast.success("Cập nhập thành công", toastObject);
          } else {
            toast.error("Cập nhập thất bại", toastObject);
          }
        })
        .catch((errr) => {
          setResult("")
          setShowLoading(false);
          toast.error("Cập nhập thất bại", toastObject);
          console.log(errr);
        });
    }
  };

  // xử lý file
  const handleUpdateFile = ()=>{
    if (fileExcel && window.confirm("Bạn chắc chắn muốn thay đổi")) {
      setShowLoading(true);
      axios
        .put(
          `${urlBase}/api/gsvh/update-date-ticket-file?optionTool=${optionTool}`,
          {file:fileExcel},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          setResult(response.data);
          setShowLoading(false)
        })
        .catch((errr) => {
          setShowLoading(false);
          toast.error("Cập nhập thất bại", toastObject);
          console.log(errr);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const data1 = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      // Biến flag để xác định hàng đầu tiên
      let isFirstRow = true;
  
      // Chuyển đổi ngày từ số Julian thành định dạng ngày tháng
      const transformedData = data1.map(row => {
        if (isFirstRow) {
          // Giữ nguyên hàng đầu tiên
          isFirstRow = false;
          return row;
        }
  
        // Giả sử ngày nằm ở cột thứ ba (index 2)
        const julianDate = row[2]; // Số ngày Julian
        const date = new Date((julianDate - 25569) * 86400 * 1000); // Chuyển đổi
        let formattedDate = date.toLocaleDateString('en-GB'); // Định dạng thành "dd/MM/yyyy"
        if(formattedDate === 'Invalid Date') formattedDate = row[2];
        return [...row.slice(0, 2), formattedDate, ...row.slice(3)]; // Gán lại giá trị vào cột và giữ nguyên các cột khác

      });
  
      setExcelData(transformedData);
      // Do something with the excelData, e.g., display it in a table
      console.log(transformedData);
    };
    reader.readAsBinaryString(file);
  };
  
  
  
  return (
    <div>
      <Header></Header>
      <ToastContainer />
      {showLoading && <Loading></Loading>}
      <div className="container">
        <h2 className="text-center text-primary m-3">Cập nhật  ngày doanh thu</h2>
        <div>
          {/* <input
            className="rounded me-3 mb-3"
            style={{ fontSize: "25px" }}
            type="text"
            placeholder="Nhập TicketID"
            onChange={handleInput}
          />
          <button
            className="btn btn-success border-bottom mb-2 me-5"
            onClick={searchTicket}
          >
            Search
          </button> */}
          <button
            className="btn btn-primary border-bottom mb-2 me-5"
            onClick={()=>{handleDownload("Template cập nhập ngày doanh thu.xlsx")}}
          >Dowload file mẫu</button>

          <button className="btn mb-2">File excel: </button>
          <input onChange={(e)=>{
            setResult("");
            setFileExcel(e.target.files[0]);
            handleFileChange(e); // Call the function to process the selected Excel file
          }} type="file" className="border-bottom me-3" accept=".xlsx" />
          <button
            className="btn btn btn-danger border-bottom mb-2 me-5"
            onClick={handleUpdateFile}
          >
            Cập nhập File
          </button>
        </div>
        <div id="download-button-sale-order" className="mt-5">
          {result ? (
            <div>
              <dt>Click down below to download Cập nhập ngày doanh thu phải hồi.XLSX</dt>
              <button
                className="btn btn-info mt-3"
                onClick={() => handleDownload(result)}
              >
                Download Cập nhập ngày doanh thu phải hồi.XLSX
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
         {/* Display the Excel data in a table */}
      {excelData && (
        <div className="row mt-5">
          <dt className="mb-2" style={{fontSize:"20px"}}>Bảng excel cập nhật</dt>
          <table className="table table-striped table-bordered">
          <thead>
            <tr>
              {excelData[0].map((header, index) => (
                <th key={index} style={{ width: `calc(100% / ${excelData[0].length})` }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {excelData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        </div>
      )}
        {/* <div><input type="file" accept=".xlsx" /></div> */}
        <div className="login__error mb-4">{error}</div>
        <div className="row">
          {/* <div className="col-md-8" style={{ fontSize: "30px" }}>
            <ul>
              <li
                class="list-group-item"
                style={{ display: "flex", flexDirection: "row" }}
              >
                TicketI ID: {result.ticketId}
              </li>
              <li
                class="list-group-item"
                style={{ display: "flex", flexDirection: "row" }}
              >
                EPC: {result.epc}
              </li>
              <li
                class="list-group-item"
                style={{ display: "flex", flexDirection: "row" }}
              >
                Ticket Price: {result.price}
              </li>
              <li
                class="list-group-item"
                style={{ display: "flex", flexDirection: "row" }}
              >
                Revenue Date: {result.feRevenueDate}
              </li>
            </ul>
            <div> 
              <button
                className="btn btn-primary border-bottom mb-2 me-2"
                onClick={()=>{
                    setShowUpdate(!showUpdate);
                }}
              >
                Cập nhập ngày doanh thu
              </button>
            </div> */}
            {/* {(showUpdate && result.ticketId!==null) ?
            <div>
            Ngày cập nhập:<input onChange={(e)=>{
                setDateNew(e.target.value);
            }} className="rounded me-3 mb-3" type="date" />
            <button
                className="btn btn-primary border-bottom mb-2 me-2"
                onClick={handleUpdateDate}
              >
                Update
              </button>
          </div>:""}
          </div> */}
          {checkRole(userRoles) && (
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
          )}
        </div>
      </div>
    </div>
  );
}
export default ChangeDateTicket;
