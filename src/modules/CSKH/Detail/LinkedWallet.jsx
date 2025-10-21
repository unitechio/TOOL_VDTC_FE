"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Search, Car, Database, History, User, Info } from "lucide-react"
import Header from "../../Header/Header";
import { ToastContainer, toast } from "react-toastify";
import { Table, Pagination, Tag } from "antd";

function LinkedWallet() {
  const [vehicleNumber, setVehicleNumber] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [searchResults, setSearchResults] = useState(null)
  const [showSections, setShowSections] = useState(true)
  const [isSearchCollapsed, setIsSearchCollapsed] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // mỗi trang 10 bản ghi

  const [currentLogPage, setCurrentLogPage] = useState(1);
  const itemsLogPerPage = 10; // mỗi trang 10 bản ghi

  const columns = [
    {
      title: "Ngày",
      dataIndex: "ngay",
      key: "ngay",
      width: "25%",
    },
    {
      title: "Tiền",
      dataIndex: "tien",
      key: "tien",
      width: "20%",
      render: (value) => <span style={{ color: "red", fontWeight: 500 }}>{value}</span>,
    },
    {
      title: "Ghi chú",
      dataIndex: "ghiChu",
      key: "ghiChu",
      width: "55%",
    },
  ];

  const info_columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "BSX",
      dataIndex: "bsx",
      key: "bsx",
      render: (value) => <span style={{ color: "#ea580c", fontWeight: 500 }}>{value}</span>,
    },
    {
      title: "Số ghế",
      dataIndex: "soGhe",
      key: "soGhe",
    },
    {
      title: "KL",
      dataIndex: "kl",
      key: "kl",
    },
    {
      title: "KLCC",
      dataIndex: "klcc",
      key: "klcc",
    },
    {
      title: "KLTB",
      dataIndex: "kltb",
      key: "kltb",
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
      title: "EPC",
      dataIndex: "epc",
      key: "epc",
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
      title: "Thời gian",
      dataIndex: "ngay",
      key: "ngay",
      width: "15%",
    },
    {
      title: "Đường dẫn",
      dataIndex: "tien",
      key: "tien",
      width: "15%",
      render: (value) => (
        <span style={{ color: "red", fontWeight: 500 }}>{value}</span>
      ),
    },
    {
      title: "Yêu cầu",
      dataIndex: "ghiChu",
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

  const [vehicleInfo, setVehicleInfo] = useState({
    id: "1700200",
    bsx: "37B-010.51V",
    soGhe: "40",
    kl: "13710",
    klcc: "0",
    kltb: "16110",
    klkt: "0",
    loai: "3",
    epc: "341C21488881380003127085",
    trangThai: "HOẠT ĐỘNG",
  })

  const [accountInfo, setAccountInfo] = useState({
    bienSo: "37B-010.51V",
    maTaiKhoan: "E0104072050",
    loaiTaiKhoan: "VI",
    soDu: "600,692",
    soDuKhaDung: "600,692",
    tamGiu: "0",
  })

  const [transactionHistory, setTransactionHistory] = useState([
    { ngay: "09/09/2023 00:23:03", tien: "85,000", ghiChu: "Xe 37B-010.51V qua trạm Hoàng Mai" },
    { ngay: "08/09/2023 23:31:12", tien: "91,120", ghiChu: "Xe 37B-010.51V qua đoạn Pháp Vân - Vực Vông" },
    { ngay: "08/09/2023 14:26:37", tien: "450,000", ghiChu: "Nạp tiền qua kênh ngân hàng" },
    { ngay: "08/09/2023 01:54:32", tien: "21,000", ghiChu: "Xe 37B-010.51V qua trạm Bắc Thăng Long-Nội Bài-Xe 37B-010.51V qua trạm Bắc Thăng Long-Nội Bài" },
    { ngay: "08/09/2023 00:50:09", tien: "91,120", ghiChu: "Xe 37B-010.51V qua đoạn Pháp Vân - Vực Vông" },
    { ngay: "09/09/2023 00:23:03", tien: "85,000", ghiChu: "Xe 37B-010.51V qua trạm Hoàng Mai" },
    { ngay: "08/09/2023 23:31:12", tien: "91,120", ghiChu: "Xe 37B-010.51V qua đoạn Pháp Vân - Vực Vông" },
    { ngay: "08/09/2023 14:26:37", tien: "450,000", ghiChu: "Nạp tiền qua kênh ngân hàng" },
    { ngay: "08/09/2023 01:54:32", tien: "21,000", ghiChu: "Xe 37B-010.51V qua trạm Bắc Thăng Long-Nội Bài" },
    { ngay: "08/09/2023 00:50:09", tien: "91,120", ghiChu: "Xe 37B-010.51V qua đoạn Pháp Vân - Vực Vông" },
    { ngay: "08/09/2023 00:50:09", tien: "91,120", ghiChu: "Xe 37B-010.51V qua đoạn Pháp Vân - Vực Vông" },
    { ngay: "09/09/2023 00:23:03", tien: "85,000", ghiChu: "Xe 37B-010.51V qua trạm Hoàng Mai" },
    { ngay: "08/09/2023 23:31:12", tien: "91,120", ghiChu: "Xe 37B-010.51V qua đoạn Pháp Vân - Vực Vông" },
    { ngay: "08/09/2023 14:26:37", tien: "450,000", ghiChu: "Nạp tiền qua kênh ngân hàng" },
    { ngay: "08/09/2023 01:54:32", tien: "21,000", ghiChu: "Xe 37B-010.51V qua trạm Bắc Thăng Long-Nội Bài" },
    { ngay: "08/09/2023 00:50:09", tien: "91,120", ghiChu: "Xe 37B-010.51V qua đoạn Pháp Vân - Vực Vông" },
  ])


  // Cắt dữ liệu theo trang
  const paginatedData = transactionHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedLogsData = transactionHistory.slice(
    (currentLogPage - 1) * itemsPerPage,
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


  const handleSearch = () => {
    if (vehicleNumber.trim()) {
      setSearchResults("mock-results")
    }
  }

  const handleClearSearch = () => {
    setVehicleNumber("")
    setStartTime("")
    setEndTime("")
    setSearchResults(null)
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <Header />
      <ToastContainer />

      <div className="d-flex align-items-center px-4 py-2">
        <h5 className="mb-0">Dữ liệu truy vấn: </h5>
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
              <span>Tìm kiếm</span>
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
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label htmlFor="vehicle-number" className="form-label fw-medium">
                    Biển số xe
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="vehicle-number"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    placeholder="37B01051"
                    style={{ borderColor: '#fdba74' }}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="start-time" className="form-label fw-medium">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="start-time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    style={{ borderColor: '#fdba74' }}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="end-time" className="form-label fw-medium">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="end-time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    style={{ borderColor: '#fdba74' }}
                  />
                </div>
              </div>

              <div className="d-flex gap-2 flex-wrap justify-content-end">
                <button
                  className="btn"
                  style={{ backgroundColor: '#ea580c', borderColor: '#ea580c', color: 'white' }}
                  onClick={handleSearch}
                >
                  <Search size={16} className="me-2" />
                  Tìm kiếm
                </button>
                <button
                  className="btn btn-outline-secondary"
                  style={{ borderColor: '#fdba74', color: '#ea580c' }}
                  onClick={handleClearSearch}
                >
                  Kiểm tra thẻ
                </button>
                <button
                  className="btn btn-outline-secondary"
                  style={{ borderColor: '#fdba74', color: '#ea580c' }}
                >
                  Tạo giao dịch OTC
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        {showSections && (
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
                    dataSource={[vehicleInfo]} // chỉ 1 record
                    pagination={false}
                    bordered
                    rowKey="id"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Account Information */}
        {(
          <div className="row g-3 mb-3">
            {/* Account Info Section */}
            <div className="col-md-4">
              <div className="card shadow-sm" style={{ borderColor: '#fed7aa' }}>
                <div
                  className="card-header text-white d-flex justify-content-between align-items-center"
                  style={{
                    background: 'linear-gradient(to right, #ea580c, #ef4444)',
                    cursor: 'pointer'
                  }}
                  data-bs-toggle="collapse"
                  data-bs-target="#accountCollapse"
                  aria-expanded="true"
                  aria-controls="accountCollapse"
                >
                  <div className="d-flex align-items-center">
                    <Database size={20} className="me-2" />
                    <span>Thông tin tài khoản</span>
                  </div>
                  <ChevronDown size={20} />
                </div>

                <div className="collapse show" id="accountCollapse">
                  <div className="card-body">
                    <div className="mb-3 d-flex justify-content-between">
                      <span className="fw-medium" >Biển số:</span>
                      <span className="fw-bold">{accountInfo.bienSo}</span>
                    </div>
                    <div className="mb-3 d-flex justify-content-between">
                      <span className="fw-medium" >Mã tài khoản:</span>
                      <span>{accountInfo.maTaiKhoan}</span>
                    </div>
                    <div className="mb-3 d-flex justify-content-between">
                      <span className="fw-medium" >Loại tài khoản:</span>
                      <span>{accountInfo.loaiTaiKhoan}</span>
                    </div>
                    <div className="mb-3 d-flex justify-content-between">
                      <span className="fw-medium" >Số dư:</span>
                      <span className="fw-bold text-success">{accountInfo.soDu}</span>
                    </div>
                    <div className="mb-3 d-flex justify-content-between">
                      <span className="fw-medium" >Số dư khả dụng:</span>
                      <span className="fw-bold text-success">{accountInfo.soDuKhaDung}</span>
                    </div>
                    <div className="mb-3 d-flex justify-content-between">
                      <span className="fw-medium" >Tạm giữ:</span>
                      <span>{accountInfo.tamGiu}</span>
                    </div>
                    <div className="mb-3 d-flex justify-content-between">
                      <span className="fw-medium" >Token_Go:</span>
                      <span className="fw-medium text-danger">Hoạt động</span>
                    </div>
                    <div className="mb-3 d-flex justify-content-between">
                      <span className="fw-medium" >Token_Login:</span>
                      <span className="fw-medium text-danger">Hoạt động</span>
                    </div>
                    <div className="mb-0 d-flex justify-content-between">
                      <span className="fw-medium" >Token_Vas:</span>
                      <span className="fw-medium text-danger">Hoạt động</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction History Section */}
            <div className="col-md-8">
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
                    <span>Các giao dịch thành công</span>
                  </div>
                  <ChevronDown size={20} />
                </div>

                <div className="collapse show" id="transactionCollapse">
                  <div className="card-body p-0">
                    <Table
                      columns={columns}
                      dataSource={paginatedData}
                      rowKey={(record, index) => index}
                      pagination={false} // tắt pagination mặc định để tự custom
                      scroll={{ y: 280 }} // chiều cao scroll
                      bordered
                    />

                    {/* Phân trang */}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10, marginBottom: 5 }}>
                      <Pagination
                        current={currentPage}
                        pageSize={itemsPerPage}
                        total={transactionHistory.length}
                        size="small"
                        onChange={(page) => setCurrentPage(page)}
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Sections */}
        {showSections && (
          <>
            {/* Recent Transaction */}
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
                  <span>Giao dịch gần nhất</span>
                </div>
                <ChevronDown size={20} />
              </div>

              <div className="collapse" id="recentTransactionCollapse">
                <div className="card-body">
                  <div className="row g-3 mb-4 d-flex flex-row align-items-end">
                    <div className="d-flex flex-column col-md-4" style={{ alignItems: 'flex-start' }}>
                      <label htmlFor="vehicle-number" className="form-label fw-medium">Biển số xe</label>
                      <input
                        type="text"
                        className="form-control"
                        id="vehicle-number"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                        placeholder="37B01051"
                        style={{ borderColor: '#fdba74' }}
                      />
                    </div>

                    <div className="d-flex flex-column col-md-3" style={{ alignItems: 'flex-start' }}>
                      <label htmlFor="start-time" className="form-label fw-medium">Ngày bắt đầu</label>
                      <input
                        type="date"
                        className="form-control"
                        id="start-time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        style={{ borderColor: '#fdba74' }}
                      />
                    </div>

                    <div className="d-flex flex-column col-md-3" style={{ alignItems: 'flex-start' }}>
                      <label htmlFor="end-time" className="form-label fw-medium">Ngày kết thúc</label>
                      <input
                        type="date"
                        className="form-control"
                        id="end-time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        style={{ borderColor: '#fdba74' }}
                      />
                    </div>

                    <div className="col-md-2 d-flex">
                      <button
                        className="btn w-100"
                        style={{
                          backgroundColor: '#ea580c',
                          borderColor: '#ea580c',
                          color: 'white',
                          height: 'calc(2.5rem + 2px)' // căn bằng height của input
                        }}
                        onClick={handleSearch}
                      >
                        <Search size={16} className="me-2" />
                        Tìm kiếm
                      </button>
                    </div>
                  </div>

                </div>
                <div className="card-body p-0">
                  <div>
                    <Table
                      columns={log_columns}
                      dataSource={paginatedLogsData}
                      rowKey={(record, index) => index}
                      pagination={false}
                      bordered
                      scroll={{ y: 280 }}
                    />
                  </div>


                  {/* Phân trang */}
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 , marginBottom: 12 }}>
                    <Pagination
                      size="small"
                      current={currentLogPage}
                      pageSize={itemsLogPerPage}
                      total={transactionHistory.length}
                      onChange={(page) => setCurrentLogPage(page)}
                      showSizeChanger={false}
                    />
                  </div>

                </div>
                {/* <div className="card-body text-center" style={{ color: '#ea580c' }}>
                  <p className="mb-0">Không có dữ liệu</p>
                </div> */}
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
                  <p className="mb-0">Không có dữ liệu</p>
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
                  <p className="mb-0">Không có dữ liệu</p>
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
                  <p className="mb-0">Không có dữ liệu</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default LinkedWallet