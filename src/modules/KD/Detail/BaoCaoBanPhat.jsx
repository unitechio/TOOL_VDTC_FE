import { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import DatePicker from "react-datepicker"
import { Calendar, Download, FileText, BarChart2, AlertCircle, Edit2, Save, Store } from "lucide-react"
import Header from "../../Header/Header"
import Loading from "../../Loading/Loading"
import { urlBase } from "../../UrlBase"
import "react-datepicker/dist/react-datepicker.css"
import "react-toastify/dist/ReactToastify.css"
import "./BaoCaoDoanhThu.css"

function BaoCaoBanPhat() {
  const token = localStorage.getItem("token")
  const [result, setResult] = useState("")
  const [sql, setSql] = useState([])
  const [optionTool, setOptionTool] = useState("")
  const { id } = useParams()
  const [error, setError] = useState("")
  const [showSql, setShowSql] = useState(true)
  const [showLoading, setShowLoading] = useState(false)
  const [groupId, setGroupId] = useState("")
  const [channle, setChannle] = useState("")

  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [dateLimit, setDateLimit] = useState(900)

  const [shopName, setShopName] = useState([])

  const rolesString = localStorage.getItem("roles")
  const userRoles = rolesString ? JSON.parse(rolesString) : []
  const isAdmin = userRoles.includes("ADMIN")

  const toastObject = {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  }

  useEffect(() => {
    // Fetch tool information
    axios
      .get(`${urlBase}/api/tool-department/getById?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setGroupId(response.data.groupId)
        setOptionTool(response.data.option_tool)
        setDateLimit(response.data.limitDate ? response.data.limitDate : 900)

        // Fetch SQL query
        axios
          .get(`${urlBase}/api/sql/getbyName?optionTool=${response.data.option_tool}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response1) => {
            setSql(response1.data)
          })
          .catch((err) => {
            console.log(err)
          })
      })
      .catch((err) => {
        console.log(err)
      })

    // Fetch shop names
    axios
      .get(`${urlBase}/api/kd/shop-name`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setShopName(response.data)
        if (response.data.length > 0) {
          setChannle(response.data[0])
        }
      })
      .catch((err) => {
        console.log(err)
        toast.error("Không thể tải danh sách kênh bán hàng", toastObject)
      })
  }, [id, token])

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
            },
          },
        )
        .then((response) => {
          if (response.data === "true_update") {
            setShowSql(true)
            toast.success("Update thành công !!", toastObject)
          } else {
            toast.error("Lỗi cú pháp câu lệnh", toastObject)
          }
        })
        .catch((err) => {
          toast.error("Bạn không có quyền làm điều này !!", toastObject)
          console.log(err)
        })
    }
  }

  const handleSubmit = () => {
    setError("");
    setResult("");
  
    if (!startTime || !endTime) {
      setError("Vui lòng chọn ngày bắt đầu và ngày kết thúc");
      return;
    }
  
    if (endTime < startTime) {
      setError("Ngày kết thúc không thể trước ngày bắt đầu");
      return;
    }
  
    setShowLoading(true);
  
    // Format dates properly to match the expected format in SQL
    const formatDate = (date) => {
      if (!date) return "";
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year} 00:00:00`;
    };
  
    const formattedStartTime = formatDate(startTime);
    const formattedEndTime = formatDate(endTime);
  
    axios
      .get(
        `${urlBase}/api/kd/get-report-by-sql?startTime=${encodeURIComponent(formattedStartTime)}&endTime=${encodeURIComponent(formattedEndTime)}&optionTool=${optionTool}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      )
      .then((response) => {
        setResult(response.data);
        toast.success("Báo cáo đã được tạo thành công", toastObject);
        setShowLoading(false);
      })
      .catch((err) => {
        setError("Đã xảy ra lỗi khi tạo báo cáo. Vui lòng thử lại sau.");
        console.log(err);
        setShowLoading(false);
      });
  };

  const handleChannelOnchange = (event) => {
    setChannle(event.target.value)
  }

  const handleDownload = (fileName) => {
    setShowLoading(true)

    axios({
      url: `${urlBase}/api/download/download-xlsx?fileName=${fileName}`,
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", "BaoCaoBanPhat.xlsx")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setShowLoading(false)
      })
      .catch((err) => {
        setError("Đã xảy ra lỗi khi tải xuống báo cáo. Vui lòng thử lại sau.")
        console.log(err)
        setShowLoading(false)
      })
  }

  return (
    <div className="revenue-report-page">
      <Header />
      <ToastContainer />
      {showLoading && <Loading />}

      <div className="revenue-report-hero">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <BarChart2 className="hero-icon" size={48} />
              <h1 className="revenue-report-title">Chi Tiết Báo Cáo Bán Phạt</h1>
              {/* <p className="revenue-report-subtitle">Báo cáo chi tiết doanh thu bán hàng theo serial 1:1</p> */}
            </div>
          </div>
        </div>
      </div>

      <div className="container revenue-report-container">
        <div className="report-card">
          <div className="report-card-header">
            <Calendar className="report-icon" size={24} />
            <h2 className="report-title">Tạo Báo Cáo Bán Phạt</h2>
          </div>
          <div className="report-card-body">
            <div className="report-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Ngày bắt đầu:</label>
                  <DatePicker
                    selected={startTime}
                    onChange={(date) => setStartTime(date)}
                    timeIntervals={1}
                    timeCaption="time"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Chọn ngày bắt đầu"
                    className="date-picker"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Ngày kết thúc:</label>
                  <DatePicker
                    selected={endTime}
                    onChange={(date) => {
                      if (startTime) {
                        const startDateObj = new Date(startTime)
                        const endDateObj = new Date(date)
                        const maxEndDate = new Date(startDateObj.getTime() + dateLimit * 24 * 60 * 60 * 1000)

                        const newEndTime = endDateObj > maxEndDate ? maxEndDate : date

                        if (endDateObj > maxEndDate) {
                          toast.info(
                            `Ngày kết thúc đã được điều chỉnh để không vượt quá ${dateLimit} ngày từ ngày bắt đầu`,
                            toastObject,
                          )
                        }

                        setEndTime(newEndTime)
                      } else {
                        setEndTime(date)
                        toast.info("Vui lòng chọn ngày bắt đầu trước", toastObject)
                      }
                    }}
                    timeIntervals={1}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Chọn ngày kết thúc"
                    className="date-picker"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <button className="submit-button" onClick={handleSubmit} disabled={showLoading}>
                    <FileText size={18} />
                    <span>Tạo báo cáo</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {result && (
          <div className="download-card">
            <div className="download-card-header">
              <Download className="download-icon" size={24} />
              <h3 className="download-title">Tải Xuống Báo Cáo</h3>
            </div>
            <div className="download-card-body">
              <p className="download-info">Báo cáo doanh thu của bạn đã sẵn sàng để tải xuống</p>
              <button className="download-button" onClick={() => handleDownload(result)}>
                <Download size={18} />
                <span>Tải xuống BaoCaoBanPhat.xlsx</span>
              </button>
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="admin-section">
            <div className="sql-card">
              <div className="sql-card-header">
                <h3 className="sql-title">Câu Lệnh Truy Vấn</h3>
              </div>
              <div className="sql-card-body">
                <div className="sql-field">
                  <label>SQL Tool:</label>
                  <textarea
                    disabled={showSql}
                    className="sql-textarea"
                    value={sql.nameSqlTool || ""}
                    onChange={(e) => {
                      setSql((prev) => ({
                        ...prev,
                        nameSqlTool: e.target.value,
                      }))
                    }}
                  />
                </div>

                <div className="sql-field">
                  <label>Option Tool:</label>
                  <textarea
                    disabled={showSql}
                    className="sql-textarea"
                    value={sql.option_tool || ""}
                    onChange={(e) => {
                      setSql((prev) => ({
                        ...prev,
                        option_tool: e.target.value,
                      }))
                    }}
                  />
                </div>
              </div>

              <div className="sql-card-footer">
                <button onClick={() => setShowSql(!showSql)} className="sql-button edit-button">
                  <Edit2 size={16} />
                  <span>{showSql ? "Chỉnh sửa" : "Hủy"}</span>
                </button>

                <button onClick={handleSetNameSpl} className="sql-button save-button" disabled={showSql}>
                  <Save size={16} />
                  <span>Lưu</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

export default BaoCaoBanPhat

