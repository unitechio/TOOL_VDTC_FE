"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Search, Car, Database, History, User, Info } from "lucide-react"
import Header from "../../Header/Header";
import { ToastContainer, toast } from "react-toastify";
import { Table, Pagination, Tag, Descriptions, Spin } from "antd";
import API from "../../../api";

function VehicleParking() {
  const [vehicleNumber, setVehicleNumber] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [searchResults, setSearchResults] = useState(null)
  const [showSections, setShowSections] = useState(false)
  const [isSearchCollapsed, setIsSearchCollapsed] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Loading states
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isLogLoading, setIsLogLoading] = useState(false);

  // Log search states
  const [logVehicleNumber, setLogVehicleNumber] = useState("")
  const [logStartTime, setLogStartTime] = useState("")
  const [logEndTime, setLogEndTime] = useState("")
  const [currentLogPage, setCurrentLogPage] = useState(1);
  const itemsLogPerPage = 10;

  const trace_columns = [
    { title: "Tên bãi đỗ xe", dataIndex: "parkingLotName", key: "parkingLotName", width: 150, fixed: "left" },
    { title: "Mã bãi", dataIndex: "lotCode", key: "lotCode", width: 100, fixed: "left" },
    { title: "Loại bãi", dataIndex: "typeLot", key: "typeLot", width: 120, fixed: "left" },
    { title: "EPC", dataIndex: "epc", key: "epc", width: 120 },
    { title: "Biển số xe", dataIndex: "plateNumber", key: "plateNumber", width: 150 },
    { title: "Người tạo", dataIndex: "createUser", key: "createUser", width: 120 },
    { title: "Trạng thái đỗ xe", dataIndex: "trangThaiDoXe", key: "trangThaiDoXe", width: 150 },
    { title: "Giờ vào", dataIndex: "checkInTime", key: "checkInTime", width: 160 },
    { title: "Hình thức vào", dataIndex: "inType", key: "inType", width: 130 },
    { title: "Block vào", dataIndex: "blockNum", key: "blockNum", width: 100 },
    { title: "Số tiền vào", dataIndex: "amount", key: "amount", width: 130, render: (value) => <span style={{ color: "red", fontWeight: 500 }}>{value}</span> },
    { title: "Giờ ra", dataIndex: "checkOutTime", key: "checkOutTime", width: 160 },
    { title: "Hình thức ra", dataIndex: "outType", key: "outType", width: 130 },
    { title: "Block ra", dataIndex: "blockNumOut", key: "blockNumOut", width: 100 },
    { title: "Số tiền ra", dataIndex: "outAmount", key: "outAmount", width: 130, render: (value) => <span style={{ color: "blue", fontWeight: 500 }}>{value}</span> },
    { title: "Mã giao dịch", dataIndex: "transId", key: "transId", width: 150 },
    { title: "Loại giao dịch", dataIndex: "parkingType", key: "parkingType", width: 130 },
    { title: "Trạng thái giao dịch", dataIndex: "trangThaiGiaoDich", key: "trangThaiGiaoDich", width: 180, render: (value) => <span style={{ color: "red", fontWeight: 500 }}>{value}</span> },
    { title: "Phương thức/Loại", dataIndex: "methodCharge", key: "methodCharge", width: 150 },
    { title: "Mã hóa đơn", dataIndex: "invoiceCode", key: "invoiceCode", width: 150 },
    { title: "Link hóa đơn", dataIndex: "invoiceUrl", key: "invoiceUrl", width: 150, render: (value) => value ? <a href={value} target="_blank" rel="noreferrer">Xem</a> : null },
    { title: "Trạng thái TT QR VTPay", dataIndex: "trangThaiTTVtpay", key: "trangThaiTTVtpay", width: 200 },
    { title: "Mã QR VTPay", dataIndex: "idQrVtpay", key: "idQrVtpay", width: 160 },
    { title: "Trạng thái TT QR Epay", dataIndex: "trangThaiTTEpay", key: "trangThaiTTEpay", width: 200, render: (value) => <span style={{ color: "red", fontWeight: 500 }}>{value}</span> },
    { title: "Mã QR Epay", dataIndex: "idQrEpay", key: "idQrEpay", width: 160 },
    { title: "Ngày giao dịch", dataIndex: "createDateTrans", key: "createDateTrans", width: 180 },
  ];

  const info_columns = [
    {
      title: "Mã phương tiện",
      dataIndex: "vehicle_id",
      key: "vehicle_id",
    },
    {
      title: "Biển số xe",
      dataIndex: "plate_number",
      key: "plate_number",
      render: (value) => <span style={{ color: "#ea580c", fontWeight: 500 }}>{value}</span>,
    },
    {
      title: "EPC",
      dataIndex: "epc",
      key: "epc",
    },
    {
      title: "Loại biển",
      dataIndex: "plate_type_code",
      key: "plate_type_code",
    },
    {
      title: "Khối lượng",
      dataIndex: "cargo_weight",
      key: "cargo_weight",
    },
    {
      title: "Loại xe",
      dataIndex: "vehicle_type_id",
      key: "vehicle_type_id",
    },
    {
      title: "Số chỗ",
      dataIndex: "seat_number",
      key: "seat_number",
    },
    {
      title: "KLKT",
      dataIndex: "klkt",
      key: "klkt",
    },
    {
      title: "Loại",
      dataIndex: "loai",
      key: "loai",
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (value) => (
        <Tag color="green" style={{ backgroundColor: "#dcfce7", color: "#166534", border: "none" }}>
          {value}
        </Tag>
      ),
    },
  ];

  const log_columns = [
    {
      title: "Ứng dụng",
      dataIndex: "app",
      key: "app",
      width: "10%",
    },
    {
      title: "Thời gian",
      dataIndex: "ngay",
      key: "ngay",
      width: "10%",
    },
    {
      title: "Đường dẫn",
      dataIndex: "tien",
      key: "tien",
      width: "20%",
      render: (value) => (
        <span style={{ color: "red", fontWeight: 500 }}>{value}</span>
      ),
    },
    {
      title: "Yêu cầu",
      dataIndex: "yeuCau",
      key: "yeuCau",
      width: "35%",
    },
    {
      title: "Trả lời",
      dataIndex: "traLoi",
      key: "traLoi",
      width: "35%",
    },
  ];

  const [vehicleInfo, setVehicleInfo] = useState(null)
  const [accountInfo, setAccountInfo] = useState(null)
  const [transactionHistory, setTransactionHistory] = useState([])
  const [transactionLogHistory, setTransactionLogHistory] = useState([])

  // Cắt dữ liệu theo trang
  const paginatedData = transactionHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedLogsData = transactionLogHistory.slice(
    (currentLogPage - 1) * itemsLogPerPage,
    currentLogPage * itemsLogPerPage
  );

  useEffect(() => {
    const collapseElement = document.getElementById("searchCollapse");

    if (collapseElement) {
      collapseElement.addEventListener("shown.bs.collapse", () => {
        setIsSearchCollapsed(false);
      });
      collapseElement.addEventListener("hidden.bs.collapse", () => {
        setIsSearchCollapsed(true);
      });
    }

    return () => {
      if (collapseElement) {
        collapseElement.removeEventListener("shown.bs.collapse", () => { });
        collapseElement.removeEventListener("hidden.bs.collapse", () => { });
      }
    };
  }, []);

  // Set default date range for log (current date)
  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().slice(0, 16); // Format for datetime-local
    const threeDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

    if (!logStartTime) setLogStartTime(threeDaysAgo);
    if (!logEndTime) setLogEndTime(today);
  }, []);

  // Utility function to convert 12h format to 24h format
  const convertTo24Hour = (dateTimeString) => {
    if (!dateTimeString) return "";

    // If it's already in datetime-local format (YYYY-MM-DDTHH:mm), return as is
    if (dateTimeString.includes('T') && !dateTimeString.includes('AM') && !dateTimeString.includes('PM')) {
      return dateTimeString;
    }

    // Handle AM/PM format conversion
    let convertedDateTime = dateTimeString;

    // Check if the string contains AM or PM
    if (dateTimeString.includes('AM') || dateTimeString.includes('PM')) {
      const date = new Date(dateTimeString);
      if (!isNaN(date.getTime())) {
        convertedDateTime = date.toISOString().slice(0, 19); // Remove Z and keep YYYY-MM-DDTHH:mm:ss
      }
    }

    return convertedDateTime;
  };

  // Validate date range (max 3 days)
  const validateDateRange = (start, end, maxDays = 3) => {
    if (!start || !end) return { isValid: false, message: "Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc" };

    const startDate = new Date(convertTo24Hour(start));
    const endDate = new Date(convertTo24Hour(end));

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { isValid: false, message: "Định dạng ngày giờ không hợp lệ" };
    }

    if (startDate > endDate) {
      return { isValid: false, message: "Ngày bắt đầu không được lớn hơn ngày kết thúc" };
    }

    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > maxDays) {
      return { isValid: false, message: `Khoảng thời gian tìm kiếm không được vượt quá ${maxDays} ngày` };
    }

    return { isValid: true, message: "" };
  };

  // Format datetime for API call (ensure 24h format)
  const formatDateTimeForAPI = (dateTimeString) => {
    if (!dateTimeString) return "";

    const converted = convertTo24Hour(dateTimeString);

    // If it doesn't have seconds, add them
    if (converted.length === 16) { // YYYY-MM-DDTHH:mm
      return converted + ":00";
    }

    return converted;
  };

  const handleSearch = async () => {
    if (!vehicleNumber.trim()) {
      toast.error("Vui lòng nhập biển số xe");
      return;
    }

    // Validate date range if both dates are provided
    if (startTime && endTime) {
      const validation = validateDateRange(startTime, endTime, 3);
      if (!validation.isValid) {
        toast.error(validation.message);
        return;
      }
    }

    setIsSearchLoading(true);
    try {
      const token = localStorage.getItem('token'); // Adjust based on your auth implementation

      if (!token) {
        toast.error("Phiên đăng nhập đã hết hạn");
        setIsSearchLoading(false);
        return;
      }

      const response = await API.getFullVehicleInfo(
        token,
        vehicleNumber
      );

      if (response.success) {
        // Update states with API response
        setVehicleInfo(response.data.vehicleInfo);
        setAccountInfo(response.data.accountInfo);
        setTransactionHistory(response.data.transactions || []);

        // Auto-fill log search with vehicle info
        setLogVehicleNumber(vehicleNumber);
        if (response.data.vehicleInfo?.epc) {
          setLogVehicleNumber(response.data.vehicleInfo.epc);
        }

        setSearchResults("success");
        setShowSections(true);
        setCurrentPage(1);

        toast.success("Tìm kiếm thành công!");
      } else {
        toast.error(response.message || "Không tìm thấy thông tin xe");
        setSearchResults(null);
        setShowSections(false);
        // Reset data
        setVehicleInfo(null);
        setAccountInfo(null);
        setTransactionHistory([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Có lỗi xảy ra khi tìm kiếm");
      setSearchResults(null);
      setShowSections(false);
      // Reset data
      setVehicleInfo(null);
      setAccountInfo(null);
      setTransactionHistory([]);
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleLogSearch = async () => {
    if (!logVehicleNumber.trim()) {
      toast.error("Vui lòng nhập biển số xe hoặc EPC");
      return;
    }

    const validation = validateDateRange(logStartTime, logEndTime, 3);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    setIsLogLoading(true);
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error("Phiên đăng nhập đã hết hạn");
        setIsLogLoading(false);
        return;
      }

      // Format dates for API
      const formattedLogStartTime = formatDateTimeForAPI(logStartTime);
      const formattedLogEndTime = formatDateTimeForAPI(logEndTime);

      const response = await API.getVehicleAuditLog(
        token,
        logVehicleNumber,
        formattedLogStartTime,
        formattedLogEndTime
      );

      if (response.success) {
        setTransactionLogHistory(response.data || []);
        setCurrentLogPage(1);
        toast.success("Tải log thành công!");
      } else {
        toast.error(response.message || "Không tìm thấy log");
        setTransactionLogHistory([]);
      }
    } catch (error) {
      console.error("Log search error:", error);
      toast.error("Có lỗi xảy ra khi tìm kiếm log");
      setTransactionLogHistory([]);
    } finally {
      setIsLogLoading(false);
    }
  };

  const handleClearSearch = () => {
    setVehicleNumber("")
    setStartTime("")
    setEndTime("")
    setSearchResults(null)
    setShowSections(false)
    setVehicleInfo(null)
    setAccountInfo(null)
    setTransactionHistory([])
    setLogVehicleNumber("")
    setLogStartTime("")
    setLogEndTime("")
    setTransactionLogHistory([])
    setCurrentPage(1)
    setCurrentLogPage(1)

    // Reset default dates for log
    const now = new Date();
    const today = now.toISOString().slice(0, 16);
    const threeDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
    setLogStartTime(threeDaysAgo);
    setLogEndTime(today);

    toast.success("Đã xóa kết quả tìm kiếm");
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <Header />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div
        className="d-flex justify-content-center align-items-center px-4 py-2"
        style={{
          backgroundColor: "#f8f9fa",
          border: "1px solid #dee2e6",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}
      >
        <h5 className="mb-0 text-primary fw-bold">
          Tra cứu thông tin bãi đỗ
        </h5>
      </div>

      <div className="container-fluid px-4 py-3">
        {/* Search Section */}
        <div className="card mb-3" style={{ borderColor: '#fed7aa' }}>
          <div
            className="card-header text-white d-flex justify-content-between align-items-center"
            style={{
              background: 'linear-gradient(to right, #ea580c, #ef4444)',
              cursor: 'pointer'
            }}
            data-bs-toggle="collapse"
            data-bs-target="#searchCollapse"
            aria-expanded="true"
            aria-controls="searchCollapse"
          >
            <div className="d-flex align-items-center">
              <Search size={20} className="me-2" />
              <span>Tìm kiếm (Tối đa 3 ngày)</span>
            </div>
            <ChevronDown
              size={20}
              style={{
                transform: isSearchCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.3s ease'
              }}
            />
          </div>

          <div className="collapse show" id="searchCollapse">
            <div className="card-body">
              <div className="row g-3 mb-4 align-items-end">
                {/* Cột nhập biển số xe */}
                <div className="col-md-8">
                  <div className="d-flex flex-column">
                    <label
                      htmlFor="vehicle-number"
                      className="form-label fw-medium text-start"
                    >
                      Biển số xe <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="vehicle-number"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                      placeholder="37B01051"
                      style={{ borderColor: "#fdba74" }}
                      disabled={isSearchLoading}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Cột chứa button */}
                <div className="col-md-4 d-flex justify-content-end gap-2 flex-wrap">
                  <button
                    className="btn d-flex align-items-center"
                    style={{
                      backgroundColor: "#ea580c",
                      borderColor: "#ea580c",
                      color: "white",
                    }}
                    onClick={handleSearch}
                    disabled={isSearchLoading}
                  >
                    {isSearchLoading ? (
                      <Spin size="small" className="me-2" />
                    ) : (
                      <Search size={16} className="me-2" />
                    )}
                    {isSearchLoading ? "Đang tìm..." : "Tìm kiếm"}
                  </button>

                  <button
                    className="btn btn-outline-danger"
                    onClick={handleClearSearch}
                    disabled={isSearchLoading}
                  >
                    Xóa tìm kiếm
                  </button>
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* Vehicle Information */}
        {showSections && vehicleInfo && (
          <div className="card mb-3" style={{ borderColor: '#fed7aa' }}>
            <div
              className="card-header text-white d-flex justify-content-between align-items-center"
              style={{
                background: 'linear-gradient(to right, #ea580c, #ef4444)',
                cursor: 'pointer'
              }}
              data-bs-toggle="collapse"
              data-bs-target="#vehicleCollapse"
              aria-expanded="true"
              aria-controls="vehicleCollapse"
            >
              <div className="d-flex align-items-center">
                <Car size={20} className="me-2" />
                <span>Thông tin phương tiện</span>
              </div>
              <ChevronDown size={20} />
            </div>

            <div className="collapse show" id="vehicleCollapse">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <Table
                    columns={info_columns}
                    dataSource={[vehicleInfo]}
                    pagination={false}
                    bordered
                    rowKey="vehicle_id"
                    size="small"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Account Information & Transaction History */}
        {showSections && (
          <div className="row g-3 mb-3">
            {/* Account Info Section */}
            <div className="col-md-3">
              <div className="card shadow-sm" style={{ borderColor: '#fed7aa' }}>
                <div
                  className="card-header text-white d-flex justify-content-between align-items-center"
                  style={{
                    background: 'linear-gradient(to right, #ea580c, #ef4444)',
                    cursor: 'pointer'
                  }}
                  data-bs-toggle="collapse"
                  data-bs-target="#transactionCollapse"
                  aria-expanded="true"
                  aria-controls="transactionCollapse"
                >
                  <div className="d-flex align-items-center">
                    <History size={20} className="me-2" />
                    <span>Các giao dịch bãi đỗ gần đây ({transactionHistory.length} bản ghi)</span>
                  </div>
                  <ChevronDown size={20} />
                </div>

                <div className="collapse show" id="transactionCollapse">
                  <div className="card-body p-0">
                    {transactionHistory.length > 0 ? (
                      <>
                        <Table
                          columns={trace_columns}
                          dataSource={paginatedData}
                          rowKey={(record, index) => `${record.transId || index}`}
                          pagination={false}
                          scroll={{ x: "max-content", y: 220 }}
                          bordered
                          size="small"
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10, marginBottom: 5, marginRight: 10 }}>
                          <Pagination
                            current={currentPage}
                            pageSize={itemsPerPage}
                            total={transactionHistory.length}
                            size="small"
                            onChange={(page) => setCurrentPage(page)}
                            showSizeChanger={false}
                            showQuickJumper={false}
                            showTotal={(total, range) =>
                              `${range[0]}-${range[1]} trên ${total} bản ghi`
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <div className="card-body text-center">
                        <p className="mb-0" style={{ color: '#ea580c' }}>Không có dữ liệu giao dịch</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Sections */}
        {(
          <>
            {/* Log History */}
            <div className="card mb-3" style={{ borderColor: '#fed7aa' }}>
              <div
                className="card-header text-white d-flex justify-content-between align-items-center"
                style={{
                  background: 'linear-gradient(to right, #ea580c, #ef4444)',
                  cursor: 'pointer'
                }}
                data-bs-toggle="collapse"
                data-bs-target="#recentTransactionCollapse"
                aria-expanded="false"
                aria-controls="recentTransactionCollapse"
              >
                <div className="d-flex align-items-center">
                  <Database size={20} className="me-2" />
                  <span>Lịch sử LOG (Tối đa 3 ngày) - {transactionLogHistory.length} bản ghi</span>
                </div>
                <ChevronDown size={20} />
              </div>

              <div className="collapse" id="recentTransactionCollapse">
                <div className="card-body">
                  <div className="row g-3 mb-4 d-flex flex-row align-items-end">
                    <div className="d-flex flex-column col-md-4" style={{ alignItems: 'flex-start' }}>
                      <label htmlFor="log-vehicle-number" className="form-label fw-medium">
                        Hợp đồng/ Biển số/ Thẻ EPC <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="log-vehicle-number"
                        value={logVehicleNumber}
                        onChange={(e) => setLogVehicleNumber(e.target.value.toUpperCase())}
                        placeholder="37B01051 hoặc EPC"
                        style={{ borderColor: '#fdba74' }}
                        disabled={isLogLoading}
                      />
                    </div>

                    <div className="d-flex flex-column col-md-3" style={{ alignItems: 'flex-start' }}>
                      <label htmlFor="log-start-time" className="form-label fw-medium">
                        Ngày giờ bắt đầu <span className="text-danger">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        id="log-start-time"
                        value={logStartTime}
                        onChange={(e) => setLogStartTime(e.target.value)}
                        step="1"
                        style={{ borderColor: '#fdba74' }}
                        disabled={isLogLoading}
                      />
                    </div>

                    <div className="d-flex flex-column col-md-3" style={{ alignItems: 'flex-start' }}>
                      <label htmlFor="log-end-time" className="form-label fw-medium">
                        Ngày giờ kết thúc <span className="text-danger">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        id="log-end-time"
                        value={logEndTime}
                        onChange={(e) => setLogEndTime(e.target.value)}
                        step="1"
                        style={{ borderColor: '#fdba74' }}
                        disabled={isLogLoading}
                      />
                    </div>

                    <div className="col-md-2 d-flex">
                      <button
                        className="btn w-100"
                        style={{
                          backgroundColor: '#ea580c',
                          borderColor: '#ea580c',
                          color: 'white',
                          height: 'calc(2.5rem + 2px)'
                        }}
                        onClick={handleLogSearch}
                        disabled={isLogLoading}
                      >
                        {isLogLoading ? (
                          <Spin size="small" className="me-2" />
                        ) : (
                          <Search size={16} className="me-2" />
                        )}
                        {isLogLoading ? 'Đang tìm...' : 'Tìm kiếm'}
                      </button>
                    </div>
                  </div>

                  {/* Date range warning */}
                  <div className="alert alert-warning py-2 mb-3" role="alert">
                    <small>
                      <strong>Lưu ý:</strong> Khoảng thời gian tìm kiếm log không được vượt quá 3 ngày. Cả hai trường ngày giờ đều bắt buộc.
                    </small>
                  </div>
                </div>

                <div className="card-body p-0">
                  {isLogLoading ? (
                    <div className="text-center py-4">
                      <Spin size="large" />
                      <p className="mt-2 mb-0">Đang tải dữ liệu log...</p>
                    </div>
                  ) : transactionLogHistory.length > 0 ? (
                    <>
                      <Table
                        columns={log_columns}
                        dataSource={paginatedLogsData}
                        rowKey={(record, index) => `log-${index}`}
                        pagination={false}
                        bordered
                        scroll={{ y: 280 }}
                        size="small"
                      />
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12, marginBottom: 12, marginRight: 10 }}>
                        <Pagination
                          size="small"
                          current={currentLogPage}
                          pageSize={itemsLogPerPage}
                          total={transactionLogHistory.length}
                          onChange={(page) => setCurrentLogPage(page)}
                          showSizeChanger={false}
                          showQuickJumper={false}
                          showTotal={(total, range) =>
                            `${range[0]}-${range[1]} trên ${total} bản ghi`
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <div className="card-body text-center" style={{ color: '#ea580c' }}>
                      <p className="mb-0">Không có dữ liệu log</p>
                      {logVehicleNumber && !isLogLoading && (
                        <small className="text-muted">
                          Thử điều chỉnh khoảng thời gian tìm kiếm
                        </small>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card Information */}
            <div className="card mb-3" style={{ borderColor: '#fed7aa' }}>
              <div
                className="card-header text-white d-flex justify-content-between align-items-center"
                style={{
                  background: 'linear-gradient(to right, #ea580c, #ef4444)',
                  cursor: 'pointer'
                }}
                data-bs-toggle="collapse"
                data-bs-target="#cardInfoCollapse"
                aria-expanded="false"
                aria-controls="cardInfoCollapse"
              >
                <div className="d-flex align-items-center">
                  <Info size={20} className="me-2" />
                  <span>Thông tin về thẻ/thẻ quy</span>
                </div>
                <ChevronDown size={20} />
              </div>

              <div className="collapse" id="cardInfoCollapse">
                <div className="card-body text-center" style={{ color: '#ea580c' }}>
                  <p className="mb-0">Chức năng đang được phát triển</p>
                </div>
              </div>
            </div>

            {/* Priority Information */}
            <div className="card mb-3" style={{ borderColor: '#fed7aa' }}>
              <div
                className="card-header text-white d-flex justify-content-between align-items-center"
                style={{
                  background: 'linear-gradient(to right, #ea580c, #ef4444)',
                  cursor: 'pointer'
                }}
                data-bs-toggle="collapse"
                data-bs-target="#priorityInfoCollapse"
                aria-expanded="false"
                aria-controls="priorityInfoCollapse"
              >
                <div className="d-flex align-items-center">
                  <Database size={20} className="me-2" />
                  <span>Thông tin ưu tiên/cấm</span>
                </div>
                <ChevronDown size={20} />
              </div>

              <div className="collapse" id="priorityInfoCollapse">
                <div className="card-body text-center" style={{ color: '#ea580c' }}>
                  <p className="mb-0">Chức năng đang được phát triển</p>
                </div>
              </div>
            </div>

            {/* Discount Information */}
            <div className="card mb-3" style={{ borderColor: '#fed7aa' }}>
              <div
                className="card-header text-white d-flex justify-content-between align-items-center"
                style={{
                  background: 'linear-gradient(to right, #ea580c, #ef4444)',
                  cursor: 'pointer'
                }}
                data-bs-toggle="collapse"
                data-bs-target="#discountInfoCollapse"
                aria-expanded="false"
                aria-controls="discountInfoCollapse"
              >
                <div className="d-flex align-items-center">
                  <Info size={20} className="me-2" />
                  <span>Thông tin miễn giảm</span>
                </div>
                <ChevronDown size={20} />
              </div>

              <div className="collapse" id="discountInfoCollapse">
                <div className="card-body text-center" style={{ color: '#ea580c' }}>
                  <p className="mb-0">Chức năng đang được phát triển</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default VehicleParking