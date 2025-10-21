import "./App.css";
import { urlBase } from "./modules/UrlBase";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./modules/Login/Login";
import Home from "./modules/Home/Home";
import Gsvh from "./modules/GSVH/Gsvh";
import SearchEtag from "./modules/GSVH/Detail/SearchEtag";
import SearchMtc from "./modules/GSVH/Detail/SearchMtc";
import SearchEpcRead from "./modules/GSVH/Detail/SearchEpcRead";
import ContractReport from "./modules/GSVH/Detail/ContractReport";
import CDRCheckin from "./modules/GSVH/Detail/CDRChekin";
import DoiSoatSaleOrder from "./modules/GSVH/Detail/DoiSoatSaleOrder";
import DoiSoatTopUpEtc from "./modules/GSVH/Detail/DoiSoatTopUpEtc";
import KhongDocThe from "./modules/GSVH/Detail/KhongDocThe";
import GdVTP from "./modules/GSVH/Detail/GdVTP";
import GdMOMO from "./modules/GSVH/Detail/GdMOMO";
import InvoiceList from "./modules/GSVH/Detail/InvoiceList";
import HistoryAccount from "./modules/GSVH/Detail/HistoryAccount";
import ContractPayment from "./modules/GSVH/Detail/ContractPayment";
import InvoiceError from "./modules/GSVH/Detail/InvoiceError";
import KPIFeGw from "./modules/GSVH/Detail/KPIFeGw";
import KPIVtpay from "./modules/GSVH/Detail/KPIVtpay";
import KPIBackEnd from "./modules/GSVH/Detail/KPIBackEnd";
import SearchStatusVehicle from "./modules/GSVH/Detail/SearchStatusVehicle";
import CustRegister from "./modules/GSVH/Detail/CustRegister";
import CustTermination from "./modules/GSVH/Detail/CustTermination";
import KHDNNotVehicle from "./modules/GSVH/Detail/KHDNNotVehicle";
import EtagHistory from "./modules/GSVH/Detail/EtagHistory";
import StationAlert from "./modules/GSVH/Detail/StationAlert";
import ChangDateTicket from "./modules/GSVH/Detail/ChangeDateTicket";
import CancleDiscount from "./modules/GSVH/Detail/CancleDiscount";
import TongHopGDByPass from "./modules/GSVH/Detail/TongHopGDByPass";
import InvoiceFlowMoney from "./modules/GSVH/Detail/InvoiceFlowMoney";
import ReportError from "./modules/GSVH/Detail/ReportError";
import ReportACV from "./modules/GSVH/Detail/ReportACV";
import KPIOCS from "./modules/GSVH/Detail/KPIOCS";
import DeleteSmS from "./modules/GSVH/Detail/DeleteSmS";
import RoadParking from "./modules/GSVH/Detail/RoadParking";
import ReportPaymentTransaction from "./modules/GSVH/Detail/ReportPaymentTransaction";
import SearchVehicleBOO2ParkingBOO1 from "./modules/GSVH/Detail/SearchVehicleBOO2ParkingBOO1";
import FptPay from "./modules/GSVH/Detail/FptPay";
import GiaoDichSMSVTQ from "./modules/GSVH/Detail/gdSMSVTQ"
import ReportCollectionTransaction from "./modules/GSVH/Detail/ReportCollectionTransaction";
import KPIVISA from "./modules/GSVH/Detail/KPIVISA";
import KPIBaiDo from "./modules/GSVH/Detail/KPIBaiDo";
import KPISanBay from "./modules/GSVH/Detail/KPISanBay";
import DoiSoatNgayFPTPay from "./modules/GSVH/Detail/DoiSoatNgayFPTPay";
import BaoCaoBanGoiBaoHiem from "./modules/KD/Detail/BaoCaoBanGoiBaoHiem";
import BaoCaoFPTVisa from "./modules/KD/Detail/BaoCaoFPTVisa";
import BaoCaoVnPay from "./modules/KD/Detail/BaoCaoVnPay";
import BaoCaoMomo from "./modules/KD/Detail/BaoCaoMomo";
import BaoCaoVCB from "./modules/KD/Detail/BaoCaoVCB";
import BaoCaoFinwin from "./modules/KD/Detail/BaoCaoFinwin";
// Chăm khóc khách hàng
import Cskh from "./modules/CSKH/Cskh";
import CancleViettelPay from "./modules/CSKH/Detail/CancelViettelPay";
import SmsToiuu from "./modules/CSKH/Detail/SmsToiuu";
import ChangeBillCycle from "./modules/CSKH/Detail/ChangeBillCycle";
import SynchronizeCRMOCS from "./modules/CSKH/Detail/SynchronizeCRMOCS";
import ChangePlateNumber from "./modules/CSKH/Detail/ChangePlateNumber";
import VehicleParking from "./modules/CSKH/Detail/VehicleParking";
import LinkedWallet from "./modules/CSKH/Detail/LinkedWallet"

// Tài chính
import Tc from "./modules/TC/Tc"
import HoaDonGop from "./modules/TC/Detail/HoaDonGop";
import BaoCaoSmsHoaDon from "./modules/TC/Detail/BaoCaoSmsHoaDon";

// Kinh Doanh
import Kd from "./modules/KD/Kd";
import BaoCaoSms from "./modules/KD/Detail/BaoCaoSms";
import BaoCaoKd from "./modules/KD/Detail/BaoCaoKd";
import GetReportGSM from "./modules/KD/Detail/GetReportGSM";
import BaoCaoDauDeVETC from "./modules/KD/Detail/Báo cáo đấu đè VETC";
import BaoCaoDoanhThu from "./modules/KD/Detail/BaoCaoDoanhThu";
import BaoCaoVTM from "./modules/KD/Detail/BaoCaoVTM";
import BaoCaoStatusSms from "./modules/KD/Detail/BaoCaoStatusSms";
import BaoCaoDATA from "./modules/KD/Detail/BaoCaoDATA";
import UserBlackList from "./modules/KD/Detail/UserBlackList";
import BaoCaoLienKetVTM from "./modules/KD/Detail/BaoCaoLienKetVTM";
import HienTrangLienKetNguonTien from "./modules/KD/Detail/HienTrangLienKetNguonTien";
import DoiSoatLienThongBaiDo from "./modules/GSVH/Detail/DoiSoatLienThongBaiDo"
import BaoCaoBanPhat from "./modules/KD/Detail/BaoCaoBanPhat";
import BanPhat from "./modules/KD/Detail/BanPhat";
import BaoCao10 from "./modules/KD/Detail/BaoCao10";
import BaoCao52 from "./modules/KD/Detail/BaoCao52";
import KHNapTienThang from "./modules/KD/Detail/KHNapTienThang";
import KHNapTienThangNew from "./modules/KD/Detail/KHNapTienThangNew";
import KHCuNapTienThang from "./modules/KD/Detail/KHCuNapTienThang";

// Đầu tư
import DT from "./modules/DT/DT";
import axios from "axios";
import Loading from "./modules/Loading/Loading";
import { useEffect, useState } from "react";

// Kỹ thuật công nghệ
import KTCN from "./modules/KTCN/KTCN";
import ScanBilling from "./modules/KTCN/Detail/ScanBilling";


function App() {
  const [auth, setAuth] = useState(false);
  const rolesString = localStorage.getItem("roles");
  const token = localStorage.getItem("token");
  const [tokenLoad, setTokenLoad] = useState(false);
  const userRoles = rolesString ? JSON.parse(rolesString) : [];
  const checkRole = (userRoles) => {
    if (userRoles.includes("ADMIN")) {
      return true;
    }
    return false;
  };
  useEffect(() => {
    if (token) {
      const currentTime = new Date().getTime() / 1000;
      const payload = JSON.parse(atob(token.split(".")[1]));
      // Nếu thời gian hiện tại lớn hơn thời gian hết hạn của token, remove token khỏi localStorage
      if (currentTime > payload.exp - 5) {
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
        setTokenLoad(true);
      }
    }
    if (token) {
      axios
        .get(`${urlBase}/api/auth/checkToken`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.data === "true_token") {
            setAuth(true);
          }
        })
        .catch((errr) => {
          console.log(errr);
        });
    }
  }, [auth, tokenLoad]);
  const [show, setShow] = useState();

  /*
  Xóa token khi token hết hạn cho phép truy nhập
  */
  function removeExpiredToken() {
    // Lấy thời gian hiện tại
    const currentTime = new Date().getTime() / 1000;

    // Lấy token từ localStorage
    const token = localStorage.getItem("token");

    // Nếu không tìm thấy token, return
    if (!token) return;

    // Parse token và lấy thông tin payload
    const payload = JSON.parse(atob(token.split(".")[1]));
    // Nếu thời gian hiện tại lớn hơn thời gian hết hạn của token, remove token khỏi localStorage
    if (currentTime > payload.exp - 5) {
      localStorage.removeItem("token");
      localStorage.removeItem("roles");
      setTokenLoad(true);
    }
  }

  window.addEventListener("DOMContentLoaded", function () {
    removeExpiredToken();
  });
  window.addEventListener("load", removeExpiredToken);
  window.addEventListener("beforeunload", removeExpiredToken);

  if (!auth && token) {
    return <Loading></Loading>;
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={auth ? <Home /> : <Login />} />
          <Route path="/home" element={auth ? <Home /> : <Login />} />
          <Route path="/GSVH" element={auth ? <Gsvh /> : <Login />} />
          <Route
            path="/GSVH/search-etag/:id"
            element={auth ? <SearchEtag /> : <Login />}
          />
          <Route
            path="/GSVH/search-mtc/:id"
            element={auth ? <SearchMtc /> : <Login />}
          />
          <Route
            path="/GSVH/search-epc-read/:id"
            element={auth ? <SearchEpcRead /> : <Login />}
          />
          <Route
            path="/GSVH/contract-report/:id"
            element={auth ? <ContractReport /> : <Login />}
          />
          <Route
            path="/GSVH/doi-soat-sale-order/:id"
            element={auth ? <DoiSoatSaleOrder /> : <Login />}
          />
          <Route
            path="/GSVH/doi-soat-topup-etc/:id"
            element={auth ? <DoiSoatTopUpEtc /> : <Login />}
          />
          <Route
            path="/GSVH/tra-cuu-cdr-checkin/:id"
            element={auth ? <CDRCheckin /> : <Login />}
          />
          <Route
            path="/GSVH/khong-doc-the/:id"
            element={auth ? <KhongDocThe /> : <Login />}
          />
          <Route
            path="/GSVH/giao-dich-lien-ket-vtp/:id"
            element={auth ? <GdVTP /> : <Login />}
          />
          <Route
            path="/GSVH/giao-dich-lien-ket-momo/:id"
            element={auth ? <GdMOMO /> : <Login />}
          />
          <Route
            path="/GSVH/danh-sach-hoa-don/:id"
            element={auth ? <InvoiceList /> : <Login />}
          />
          <Route
            path="/GSVH/lich-su-thay-doi-tai-khoan/:id"
            element={auth ? <HistoryAccount /> : <Login />}
          />
          <Route
            path="/GSVH/station-alert/:id"
            element={auth ? <StationAlert /> : <Login />}
          />
          <Route
            path="/GSVH/contract-payment/:id"
            element={auth ? <ContractPayment /> : <Login />}
          />
          <Route
            path="/GSVH/invoice-error-info/:id"
            element={auth ? <InvoiceError /> : <Login />}
          />
          <Route
            path="/GSVH/kpi-fegw/:id"
            element={auth ? <KPIFeGw /> : <Login />}
          />
          <Route
            path="/GSVH/kpi-vtpay/:id"
            element={auth ? <KPIVtpay /> : <Login />}
          />
          <Route
            path="/GSVH/kpi-backend/:id"
            element={auth ? <KPIBackEnd /> : <Login />}
          />
          <Route
            path="/GSVH/tra-cuu-vehicle/:id"
            element={auth ? <SearchStatusVehicle /> : <Login />}
          />
          <Route
            path="/GSVH/cust-regis/:id"
            element={auth ? <CustRegister /> : <Login />}
          />
          <Route
            path="/GSVH/contract-termination/:id"
            element={auth ? <CustTermination /> : <Login />}
          />
          <Route
            path="/GSVH/khdn-not-vehicle/:id"
            element={auth ? <KHDNNotVehicle /> : <Login />}
          />
          <Route
            path="/GSVH/etag-history/:id"
            element={auth ? <EtagHistory /> : <Login />}
          />
          <Route
            path="/GSVH/change-date-ticket/:id"
            element={auth ? <ChangDateTicket /> : <Login />}
          />
          <Route
            path="/GSVH/cancle-discount/:id"
            element={auth ? <CancleDiscount /> : <Login />}
          />
          <Route
            path="/GSVH/tong-hop-bypass/:id"
            element={auth ? <TongHopGDByPass /> : <Login />}
          />
          <Route
            path="/GSVH/hoa-don-dong-tien/:id"
            element={auth ? <InvoiceFlowMoney /> : <Login />}
          />
          <Route
            path="/GSVH/get-report-acv/:id"
            element={auth ? <ReportACV /> : <Login />}
          />
          <Route
            path="/GSVH/kpi-ocs/:id"
            element={auth ? <KPIOCS /> : <Login />}
          />
          <Route
            path="/GSVH/delete-sms/:id"
            element={auth ? <DeleteSmS /> : <Login />}
          />
          <Route
            path="/GSVH/get-road-parking/:id"
            element={auth ? <RoadParking /> : <Login />}
          />
          <Route
            path="/GSVH/get-report-payment-transaction/:id"
            element={auth ? <ReportPaymentTransaction /> : <Login />}
          />
          <Route
            path="/GSVH/search-vehicle-BOO2-connect-parking-BOO1/:id"
            element={auth ? <SearchVehicleBOO2ParkingBOO1 /> : <Login />}
          />
          <Route
            path="/GSVH/search-fpt-pay/:id"
            element={auth ? <FptPay /> : <Login />}
          />
          <Route
            path="/GSVH/giao-dich-sms-vtq/:id"
            element={auth ? <GiaoDichSMSVTQ /> : <Login />}
          />
          <Route
            path="/GSVH/get-collection-trasaction-report/:id"
            element={auth ? <ReportCollectionTransaction /> : <Login />}
          />
          <Route
            path="/GSVH/kpi-visa/:id"
            element={auth ? <KPIVISA /> : <Login />}
          />
          <Route
            path="/GSVH/kpi-bai-do/:id"
            element={auth ? <KPIBaiDo /> : <Login />}
          />
          <Route
            path="/GSVH/kpi-san-bay/:id"
            element={auth ? <KPISanBay /> : <Login />}
          />
          <Route
            path="/GSVH/doi-soat-ngay-fpt-pay/:id"
            element={auth ? <DoiSoatNgayFPTPay /> : <Login />}
          />
          <Route
            path="/GSVH/doi-soat-lien-thong-bai-do/:id"
            element={auth ? <DoiSoatLienThongBaiDo /> : <Login />}
          />


          {/* Chăm sóc khách hành */}
          <Route path="/CSKH" element={auth ? <Cskh /> : <Login />} />
          <Route
            path="/CSKH/cancle-viettelpay/:id"
            element={auth ? <CancleViettelPay /> : <Login />}
          />
          <Route
            path="/CSKH/sms-toi-uu/:id"
            element={auth ? <SmsToiuu /> : <Login />}
          />
          <Route
            path="/CSKH/change-bill-cycle/:id"
            element={auth ? <ChangeBillCycle /> : <Login />}
          />
          <Route
            path="/CSKH/synchronize-ocs/:id"
            // path="/CSKH/synchronize-ocs"
            element={auth ? <SynchronizeCRMOCS /> : <Login />}
          />
          <Route
            path="/CSKH/vehicle-parking/:id"
            element={auth ? <VehicleParking /> : <Login />}
          />
          <Route
            // path="/CSKH/synchronize-ocs/:id"
            path="/GSVH/report-error/:id"
            element={auth ? <ReportError /> : <Login />}
          />
          <Route
            // path="/CSKH/synchronize-ocs/:id"
            path="/CSKH/change-platenumber/:id"
            element={auth ? <ChangePlateNumber /> : <Login />}
          />
          <Route
            // path="/CSKH/synchronize-ocs/:id"
            path="/CSKH/linked-wallet/:id"
            element={auth ? <LinkedWallet /> : <Login />}
          />



          {/* KD */}
          <Route path="/KD" element={auth ? <Kd /> : <Login />} />
          <Route path="/KD/bao-cao-kd/:id" element={auth ? <BaoCaoKd /> : <Login />} />
          <Route path="/KD/bao-cao-gsm/:id" element={auth ? <GetReportGSM /> : <Login />} />
          <Route path="/KD/bao-cao-dau-de-vetc/:id" element={auth ? <BaoCaoDauDeVETC /> : <Login />} />
          <Route path="/KD/bao-cao-sms/:id" element={auth ? <BaoCaoSms /> : <Login />} />
          <Route path="/KD/bao-cao-doanh-thu/:id" element={auth ? <BaoCaoDoanhThu /> : <Login />} />
          <Route path="/KD/hien-trang-lien-ket-nguon-tien/:id" element={auth ? <HienTrangLienKetNguonTien /> : <Login />} />
          <Route path="/KD/bao-cao-vtm/:id" element={auth ? <BaoCaoVTM /> : <Login />} />
          <Route path="/KD/bao-cao-sms-status/:id" element={auth ? <BaoCaoStatusSms /> : <Login />} />
          <Route path="/KD/bao-cao-data/:id" element={auth ? <BaoCaoDATA /> : <Login />} />
          <Route path="/KD/user-black-list/:id" element={auth ? <UserBlackList /> : <Login />} />
          <Route path="/KD/bao-cao-lien-ket-vtm/:id" element={auth ? <BaoCaoLienKetVTM /> : <Login />} />
          <Route path="/KD/bao-cao-ban-goi-bao-hiem/:id" element={auth ? <BaoCaoBanGoiBaoHiem /> : <Login />} />
          <Route path="/KD/bao-cao-fpt-visa/:id" element={auth ? <BaoCaoFPTVisa /> : <Login />} />
          <Route path="/KD/bao-cao-vn-pay/:id" element={auth ? <BaoCaoVnPay /> : <Login />} />
          <Route path="/KD/bao-cao-momo/:id" element={auth ? <BaoCaoMomo /> : <Login />} />
          <Route path="/KD/bao-cao-vcb/:id" element={auth ? <BaoCaoVCB /> : <Login />} />
          <Route path="/KD/bao-cao-finwin/:id" element={auth ? <BaoCaoFinwin /> : <Login />} />
          <Route path="/KD/bao-cao-ban-phat/:id" element={auth ? <BaoCaoBanPhat /> : <Login />} />
          <Route path="/KD/bao-cao-52/:id" element={auth ? <BaoCao52 /> : <Login />} />
          <Route path="/KD/bao-cao-10/:id" element={auth ? <BaoCao10 /> : <Login />} />
          <Route path="/KD/ban-phat/:id" element={auth ? <BanPhat /> : <Login />} />
          <Route path="/KD/kh-nap-tien-thang/:id" element={auth ? <KHNapTienThang /> : <Login />} />
          <Route path="/KD/kh-nap-tien-thang-new/:id" element={auth ? <KHNapTienThangNew /> : <Login />} />
          <Route path="/KD/kh-cu-nap-tien-thang/:id" element={auth ? <KHCuNapTienThang /> : <Login />} />
          {/* Tài chính */}
          <Route path="/TC" element={auth ? <Tc /> : <Login />} />
          <Route path="/TC/hoa-don-gop/:id" element={auth ? <HoaDonGop /> : <Login />} />
          <Route path="/TC/bao-cao-sms-hoa-don/:id" element={auth ? <BaoCaoSmsHoaDon /> : <Login />} />

          {/* Đầu tư */}
          <Route path="/DT" element={auth ? <DT /> : <Login />} />

          {/* Kỹ thuật công nghệ */}
          <Route path="/KTCN" element={auth ? <KTCN /> : <Login />} />
          <Route path="/KTCN/scan-billing/:id" element={auth ? <ScanBilling /> : <Login />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
