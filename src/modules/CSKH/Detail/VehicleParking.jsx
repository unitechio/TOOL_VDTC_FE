"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Search, Car, Database, History, User, Info } from "lucide-react"
import Header from "../../Header/Header";
import { ToastContainer, toast } from "react-toastify";
import { Table, Pagination, Tag, Descriptions } from "antd";

function VehicleParking() {
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
    { title: "Link hóa đơn", dataIndex: "invoiceUrl", key: "invoiceUrl", width: 150, render: (value) => <a href={value} target="_blank" rel="noreferrer">Xem</a> },
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
      key: "ngay",
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
      dataIndex: "yeuCau",   // ✔ đúng field
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
    vehicle_id: "1700200",
    plate_number: "37B-010.51V",
    plate_type_code: "Biển đỏ",
    cargo_weight: "13710",
    vehicle_type_id: "xe khách",
    seat_number: "4 chỗ",
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
    isAuto: "600,692",
  })

  const [transactionHistory, setTransactionHistory] = useState([
    {
      parkingLotName: "Bãi Hoàng Mai",
      lotCode: "HM01",
      typeLot: "Ô tô hở",
      epc: "EPC123456EPC123456",
      plateNumber: "37B-010.51",
      createUser: "admin",
      trangThaiDoXe: "Xe đang trong bãi",
      checkInTime: "2023-09-09 08:23:03",
      inType: "QR",
      blockNum: "A12",
      amount: "20,000",
      checkOutTime: "2023-09-09 10:10:10",
      outType: "QR",
      blockNumOut: "A12",
      outAmount: "0",
      createDateTrans: "2023-09-09 10:11:00",
      transId: "TXN10001",
      parkingType: "CO",
      trangThaiGiaoDich: "tt thành công",
      methodCharge: "ETC_VDTC",
      invoiceCode: "INV20230909",
      invoiceUrl: "https://example.com/invoice/INV20230909",
      trangThaiTTVtpay: "thành công",
      idQrVtpay: "QRVTPAY123",
      trangThaiTTEpay: "pending",
      idQrEpay: "QREPAY456",
    },
    {
      parkingLotName: "Bãi Bắc Thăng Long",
      lotCode: "BTL02",
      typeLot: "Ô tô kín",
      epc: "EPC654321EPC123456",
      plateNumber: "30A-999.88",
      createUser: "user01",
      trangThaiDoXe: "Xe đã rời bãi",
      checkInTime: "2023-09-08 22:00:00",
      inType: "Thẻ từ",
      blockNum: "B05",
      amount: "50,000",
      checkOutTime: "2023-09-09 06:00:00",
      outType: "Thẻ từ",
      blockNumOut: "B05",
      outAmount: "50,000",
      createDateTrans: "2023-09-09 06:01:00",
      transId: "TXN10002",
      parkingType: "ETC",
      trangThaiGiaoDich: "chưa thanh toán",
      methodCharge: "ETC_Boo1",
      invoiceCode: "INV20230908",
      invoiceUrl: "https://example.com/invoice/INV20230908",
      trangThaiTTVtpay: "khởi tạo",
      idQrVtpay: "QRVTPAY456",
      trangThaiTTEpay: "thất bại",
      idQrEpay: "QREPAY789",
    },
    {
      parkingLotName: "Bãi Bắc Thăng Long",
      lotCode: "BTL02",
      typeLot: "Ô tô kín",
      epc: "EPC654321EPC123456",
      plateNumber: "30A-999.88",
      createUser: "user01",
      trangThaiDoXe: "Xe đã rời bãi",
      checkInTime: "2023-09-08 22:00:00",
      inType: "Thẻ từ",
      blockNum: "B05",
      amount: "50,000",
      checkOutTime: "2023-09-09 06:00:00",
      outType: "Thẻ từ",
      blockNumOut: "B05",
      outAmount: "50,000",
      createDateTrans: "2023-09-09 06:01:00",
      transId: "TXN10002",
      parkingType: "ETC",
      trangThaiGiaoDich: "chưa thanh toán",
      methodCharge: "ETC_Boo1",
      invoiceCode: "INV20230908",
      invoiceUrl: "https://example.com/invoice/INV20230908",
      trangThaiTTVtpay: "khởi tạo",
      idQrVtpay: "QRVTPAY456",
      trangThaiTTEpay: "thất bại",
      idQrEpay: "QREPAY789",
    },
    {
      parkingLotName: "Bãi Bắc Thăng Long",
      lotCode: "BTL02",
      typeLot: "Ô tô kín",
      epc: "EPC654321EPC123456",
      plateNumber: "30A-999.88",
      createUser: "user01",
      trangThaiDoXe: "Xe đã rời bãi",
      checkInTime: "2023-09-08 22:00:00",
      inType: "Thẻ từ",
      blockNum: "B05",
      amount: "50,000",
      checkOutTime: "2023-09-09 06:00:00",
      outType: "Thẻ từ",
      blockNumOut: "B05",
      outAmount: "50,000",
      createDateTrans: "2023-09-09 06:01:00",
      transId: "TXN10002",
      parkingType: "ETC",
      trangThaiGiaoDich: "chưa thanh toán",
      methodCharge: "ETC_Boo1",
      invoiceCode: "INV20230908",
      invoiceUrl: "https://example.com/invoice/INV20230908",
      trangThaiTTVtpay: "khởi tạo",
      idQrVtpay: "QRVTPAY456",
      trangThaiTTEpay: "thất bại",
      idQrEpay: "QREPAY789",
    },
    {
      parkingLotName: "Bãi Bắc Thăng Long",
      lotCode: "BTL02",
      typeLot: "Ô tô kín",
      epc: "EPC654321EPC123456",
      plateNumber: "30A-999.88",
      createUser: "user01",
      trangThaiDoXe: "Xe đã rời bãi",
      checkInTime: "2023-09-08 22:00:00",
      inType: "Thẻ từ",
      blockNum: "B05",
      amount: "50,000",
      checkOutTime: "2023-09-09 06:00:00",
      outType: "Thẻ từ",
      blockNumOut: "B05",
      outAmount: "50,000",
      createDateTrans: "2023-09-09 06:01:00",
      transId: "TXN10002",
      parkingType: "ETC",
      trangThaiGiaoDich: "chưa thanh toán",
      methodCharge: "ETC_Boo1",
      invoiceCode: "INV20230908",
      invoiceUrl: "https://example.com/invoice/INV20230908",
      trangThaiTTVtpay: "khởi tạo",
      idQrVtpay: "QRVTPAY456",
      trangThaiTTEpay: "thất bại",
      idQrEpay: "QREPAY789",
    },
  ]);

  const [transactionLogHistory, setTransactionLogHistory] = useState([
    { app: "crm", ngay: "09/09/2023 00:23:03", tien: "https://hithub.com/repos/unitech.io", yeuCau: "Xe 37B-010.51V qua trạm Hoà", traLoi: "Xe 37B-010.51V qua trạm Hoàng Mai" },
    { app: "crm", ngay: "08/09/2023 23:31:12", tien: "https://hithub.com/repos/unitech.io", yeuCau: "Xe 37B-010.51V qua đoạn Phá", traLoi: "Xe 37B-010.51V qua đoạn Pháp Vân - Vực Vông" },
    { app: "crm", ngay: "08/09/2023 14:26:37", tien: "https://hithub.com/repos/unitech.io0", yeuCau: "Nạp tiền qua kênh ngân hàng", traLoi: "Nạp tiền qua kênh ngân hàng" },
    { app: "crm", ngay: "08/09/2023 01:54:32", tien: "https://hithub.com/repos/unitech.io", yeuCau: "Xe 37B-010.51V qua trạm Bắc", traLoi: "Xe 37B-010.51V qua trạm Bắc Thăng Long-Nội Bài-Xe 37B-010.51V qua trạm Bắc Thăng Long-Nội Bài" },
    { app: "crm", ngay: "08/09/2023 00:50:09", tien: "https://hithub.com/repos/unitech.io", yeuCau: "Xe 37B-010.51V qua đoạn Phá", traLoi: "Xe 37B-010.51V qua đoạn Pháp Vân - Vực Vông" },
    { app: "crm", ngay: "09/09/2023 00:23:03", tien: "https://hithub.com/repos/unitech.io", yeuCau: "Xe 37B-010.51V qua trạm Hoà", traLoi: "Xe 37B-010.51V qua trạm Hoàng Mai" },
    { app: "crm", ngay: "08/09/2023 23:31:12", tien: "https://hithub.com/repos/unitech.io", yeuCau: "Xe 37B-010.51V qua đoạn Phá", traLoi: "Xe 37B-010.51V qua đoạn Pháp Vân - Vực Vông" },
    { app: "crm", ngay: "08/09/2023 14:26:37", tien: "https://hithub.com/repos/unitech.io0", yeuCau: "Nạp tiền qua kênh ngân hàng", traLoi: "Nạp tiền qua kênh ngân hàng" },
    { app: "crm", ngay: "08/09/2023 01:54:32", tien: "https://hithub.com/repos/unitech.io", yeuCau: "Xe 37B-010.51V qua trạm Bắc", traLoi: "Xe 37B-010.51V qua trạm Bắc Thăng Long-Nội Bài" },
    { app: "crm", ngay: "08/09/2023 00:50:09", tien: "https://hithub.com/repos/unitech.io", yeuCau: "Xe 37B-010.51V qua đoạn Phá", traLoi: "Xe 37B-010.51V qua đoạn Pháp Vân - Vực Vông" },
    { app: "crm", ngay: "08/09/2023 00:50:09", tien: "https://hithub.com/repos/unitech.io", yeuCau: "Xe 37B-010.51V qua đoạn Phá", traLoi: "Xe 37B-010.51V qua đoạn Pháp Vân - Vực Vông" },
    { app: "crm", ngay: "09/09/2023 00:23:03", tien: "https://hithub.com/repos/unitech.io", yeuCau: "Xe 37B-010.51V qua trạm Hoà", traLoi: "Xe 37B-010.51V qua trạm Hoàng Mai" },
    { app: "crm", ngay: "08/09/2023 23:31:12", tien: "https://hithub.com/repos/unitech.io", yeuCau: "Xe 37B-010.51V qua đoạn Phá", traLoi: "Xe 37B-010.51V qua đoạn Pháp Vân - Vực Vông" },
    { app: "crm", ngay: "08/09/2023 14:26:37", tien: "https://hithub.com/repos/unitech.io0", yeuCau: "Nạp tiền qua kênh ngân hàng", traLoi: "Nạp tiền qua kênh ngân hàng" },
    { app: "crm", ngay: "08/09/2023 01:54:32", tien: "https://hithub.com/repos/unitech.io", yeuCau: "Xe 37B-010.51V qua trạm Bắc", traLoi: "Xe 37B-010.51V qua trạm Bắc Thăng Long-Nội Bài" },
    { app: "crm", ngay: "08/09/2023 00:50:09", tien: "https://hithub.com/repos/unitech.io", yeuCau: "Xe 37B-010.51V qua đoạn Phá", traLoi: "Xe 37B-010.51V qua đoạn Pháp Vân - Vực Vông" },
  ])


  // Cắt dữ liệu theo trang
  const paginatedData = transactionHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedLogsData = transactionLogHistory.slice(
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

      <div
        className="d-flex justify-content-center align-items-center px-4 py-2"
        style={{
          backgroundColor: "#f8f9fa", // nền sáng
          border: "1px solid #dee2e6", // viền mảnh
          borderRadius: "8px",         // bo góc
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)" // bóng nhẹ
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
            <div className="col-md-2">
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
                  <Descriptions
                    bordered
                    size="small"
                    column={1}
                  >
                    <Descriptions.Item label="Biển số xe">
                      <span className="fw-bold">{accountInfo.bienSo}</span>
                    </Descriptions.Item>

                    <Descriptions.Item label="Hơp đồng">
                      {accountInfo.maTaiKhoan}
                    </Descriptions.Item>

                    <Descriptions.Item label="Loại tài khoản">
                      {accountInfo.loaiTaiKhoan}
                    </Descriptions.Item>

                    <Descriptions.Item label="Số dư">
                      <span className="fw-bold text-success">{accountInfo.soDu}</span>
                    </Descriptions.Item>

                    <Descriptions.Item label="Thanh toán tự động">
                      {accountInfo.is ? (
                        <span className="fw-bold text-success">Có</span>
                      ) : (
                        <span className="fw-bold text-danger">Không</span>
                      )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Token Go">
                      <span className="fw-medium text-danger">Hoạt động</span>
                    </Descriptions.Item>

                    <Descriptions.Item label="Token Login">
                      <span className="fw-medium text-danger">Hoạt động</span>
                    </Descriptions.Item>

                    <Descriptions.Item label="Token Vas">
                      <span className="fw-medium text-danger">Hoạt động</span>
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </div>
            </div>

            {/* Transaction History Section */}
            <div className="col-md-10">
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
                    <span>Các giao dịch bãi đỗ gần đây</span>
                  </div>
                  <ChevronDown size={20} />
                </div>

                <div className="collapse show" id="transactionCollapse">
                  <div className="card-body p-0">
                    <Table
                      columns={trace_columns}
                      dataSource={paginatedData}
                      rowKey={(record, index) => index}
                      pagination={false}
                      scroll={{ x: "max-content", y: 220 }} // bật scroll ngang + dọc
                      bordered
                    />

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
                  <span>Lịch sử LOG</span>
                </div>
                <ChevronDown size={20} />
              </div>

              <div className="collapse" id="recentTransactionCollapse">
                <div className="card-body">
                  <div className="row g-3 mb-4 d-flex flex-row align-items-end">
                    <div className="d-flex flex-column col-md-4" style={{ alignItems: 'flex-start' }}>
                      <label htmlFor="vehicle-number" className="form-label fw-medium">Hợp đồng/ Biển số/ Thẻ EPC</label>
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
                        type="datetime-local"
                        className="form-control"
                        id="start-time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        step="1" // cho phép chọn đến giây
                        style={{ borderColor: '#fdba74' }}
                      />
                    </div>

                    <div className="d-flex flex-column col-md-3" style={{ alignItems: 'flex-start' }}>
                      <label htmlFor="end-time" className="form-label fw-medium">Ngày kết thúc</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        id="end-time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        step="1" // cho phép chọn đến giây
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
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12, marginBottom: 12 }}>
                    <Pagination
                      size="small"
                      current={currentLogPage}
                      pageSize={itemsLogPerPage}
                      total={transactionLogHistory.length}
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

export default VehicleParking