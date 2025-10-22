import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../Footer/Fotter";
import Header from "../Header/Header";
import { urlBase } from "../UrlBase";

function Gsvh() {
  const token = localStorage.getItem("token");
  const [tools, setTools] = useState([{}]);
  useEffect(() => {
    axios
      .get(`${urlBase}/api/tool-department/getByGroupId?groupId=1`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setTools(response.data ? response.data : []);
        // console.log(response.data);
      })
      .catch((errr) => {
        console.log(errr);
      });
  }, []);
  return (
    <div className="custom-bg-container">
      <Header></Header>
      <div className="container mb-5">
        <h2 className="text-center text-primary">
          Chào mừng bạn đến với trang giám sát vận hành.
        </h2>
        <div className="row row-cols-1 row-cols-md-4 g-4 mt-3">
          {tools?.map((tool) => (
            <div key={tool.id} className="col">
              <div className="card border-bottom rounded border-warning">
                <div className="card-body">
                  <dt style={{ fontSize: "27px", font: "initial" }} className="card-title  fw-bolder">{tool.option_tool}</dt>
                  <div className="d-flex justify-content-between align-items-center mt-3" style={{ marginLeft: "75px" }}>
                    {
                      tool.option_tool === "Tra cứu thẻ ETAG" ?
                        <Link
                          to={`/GSVH/search-etag/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Tra cứu MTC" ?
                        <Link
                          to={`/GSVH/search-mtc/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Tra cứu EPC Read" ?
                        <Link
                          to={`/GSVH/search-epc-read/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Báo cáo nạp tiền theo hợp đồng" ?
                        <Link
                          to={`/GSVH/contract-report/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Lấy thông tin Đối soát SaleOrder" ?
                        <Link
                          to={`/GSVH/doi-soat-sale-order/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Lấy thông tin Đối soát TopUpEtc" ?
                        <Link
                          to={`/GSVH/doi-soat-topup-etc/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Tra cứu CDR Checkin" ?
                        <Link
                          to={`/GSVH/tra-cuu-cdr-checkin/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Xe không đọc được thẻ" ?
                        <Link
                          to={`/GSVH/khong-doc-the/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Giao dịch liên kết VTP" ?
                        <Link
                          to={`/GSVH/giao-dich-lien-ket-vtp/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                     {
                      tool.option_tool === "Giao dịch liên kết MoMo - VNPAY" ?
                        <Link
                          to={`/GSVH/giao-dich-lien-ket-momo/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Danh sách hợp đồng lỗi hóa đơn vì sai MST trong tháng" ?
                        <Link
                          to={`/GSVH/danh-sach-hoa-don/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Lấy lịch sử thay đổi tài khoản" ?
                        <Link
                          to={`/GSVH/lich-su-thay-doi-tai-khoan/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Cảnh báo giao dịch" ?
                        <Link
                          to={`/GSVH/station-alert/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Lịch sử đăng kí ViettelPay" ?
                        <Link
                          to={`/GSVH/contract-payment/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Hóa đơn lỗi do thông tin KH" ?
                        <Link
                          to={`/GSVH/invoice-error-info/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "KPI FEGW 7 ngày gần nhất" ?
                        <Link
                          to={`/GSVH/kpi-fegw/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "KPI VTPAY 7 ngày gần nhất" ?
                        <Link
                          to={`/GSVH/kpi-vtpay/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "KPI BACKEND 7 ngày gần nhất" ?
                        <Link
                          to={`/GSVH/kpi-backend/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Tra cứu trạng thái xe" ?
                        <Link
                          to={`/GSVH/tra-cuu-vehicle/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Thông tin đăng kí của KH" ?
                        <Link
                          to={`/GSVH/cust-regis/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Danh sách hủy hợp đồng" ?
                        <Link
                          to={`/GSVH/contract-termination/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Tra cứu lịch sử thẻ ETAG" ?
                        <Link
                          to={`/GSVH/etag-history/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiếte
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Khách hàng doanh nghiệp chưa có xe" ?
                        <Link
                          to={`/GSVH/khdn-not-vehicle/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Thay đổi ngày doanh thu" ?
                        <Link
                          to={`/GSVH/change-date-ticket/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Hủy gói miễn giảm" ?
                        <Link
                          to={`/GSVH/cancle-discount/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Tổng hợp giao dịch truy thu bypass" ?
                        <Link
                          to={`/GSVH/tong-hop-bypass/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Đối soát hóa đơn dòng tiền" ?
                        <Link
                          to={`/GSVH/hoa-don-dong-tien/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }

                    {
                      tool.option_tool === "Đồng bộ OCS" ?
                        <Link
                          to={`/CSKH/synchronize-ocs/${tool.id}`}
                          className="btn btn-outline-primary"
                        >
                          Xem chi tiết
                        </Link> : ""
                    }
                    {
                      tool.option_tool === "Thống kê lỗi đối soát"?
                      <Link
                      to={`/GSVH/report-error/${tool.id}`}
                      className="btn btn-outline-primary"
                    >
                      Xem chi tiết
                    </Link>:""
                    }
                    {
                      tool.option_tool === "Báo cáo ACV"?
                      <Link
                      to={`/GSVH/get-report-acv/${tool.id}`}
                      className="btn btn-outline-primary"
                    >
                      Xem chi tiết
                    </Link>:""
                    }
                    {
                      tool.option_tool === "Dữ liệu KPI OCS"?
                      <Link
                      to={`/GSVH/kpi-ocs/${tool.id}`}
                      // to={`/GSVH/kpi-ocs`}
                      className="btn btn-outline-primary"
                    >
                      Xem chi tiết
                    </Link>:""
                    }
                    {
                      tool.option_tool === "Xóa SMS"?
                      <Link
                      // to={`/GSVH/kpi-ocs/${tool.id}`}
                      to={`/GSVH/delete-sms/${tool.id}`}
                      className="btn btn-outline-primary"
                    >
                      Xem chi tiết
                    </Link>:""
                    }

                    {
                      tool.option_tool === "Tra cứu lịch sử giao dịch ROAD_PARKING"?
                      <Link
                      to={`/GSVH/get-road-parking/${tool.id}`}
                      className="btn btn-outline-primary"
                    >
                      Xem chi tiết
                    </Link>:""
                    }
                    {
                      tool.option_tool === "Báo cáo giao dịch thanh toán"?
                      <Link
                      to={`/GSVH/get-report-payment-transaction/${tool.id}`}
                      className="btn btn-outline-primary"
                    >
                      Xem chi tiết
                    </Link>:""
                    }
                    {
                      tool.option_tool === "Tra cứu Xe BOO2 trừ liên thông bãi đỗ BOO1"?
                      <Link
                      to={`/GSVH/search-vehicle-BOO2-connect-parking-BOO1/${tool.id}`}
                      className="btn btn-outline-primary"
                    >
                      Xem chi tiết
                    </Link>:""
                    }
                    {
                      tool.option_tool === "Tra cứu FPT Pay"?
                      <Link
                      to={`/GSVH/search-fpt-pay/${tool.id}`}
                      className="btn btn-outline-primary"
                    >
                      Xem chi tiết
                    </Link>:""
                    }
                    {
                      tool.option_tool === "Giao dịch SMS VTQ DANTHE"?
                      <Link
                      to={`/GSVH/giao-dich-sms-vtq/${tool.id}`}
                      className="btn btn-outline-primary"
                    >
                      Xem chi tiết
                    </Link>:""
                    } 
                    {
                      tool.option_tool === "Báo cáo giao dịch truy thu"?
                      <Link
                      to={`/GSVH/get-collection-trasaction-report/${tool.id}`}
                      className="btn btn-outline-primary"
                    >
                      Xem chi tiết
                    </Link>:""
                    }
                    {
                      tool.option_tool === "KPI VISA"?
                      <Link
                      to={`/GSVH/kpi-visa/${tool.id}`}
                      className="btn btn-outline-primary"
                    >
                      Xem chi tiết
                    </Link>:""
                    }
                    {
                      tool.option_tool === "KPI Bai Do"?
                      <Link
                      to={`/GSVH/kpi-bai-do/${tool.id}`}
                      className="btn btn-outline-primary"
                    >
                      Xem chi tiết
                    </Link>:""
                    }
                    {
                      tool.option_tool === "KPI Sân Bay"?
                      <Link
                      to={`/GSVH/kpi-san-bay/${tool.id}`}
                      className="btn btn-outline-primary"
                    >
                      Xem chi tiết
                    </Link>:""
                    }
                    {
                      tool.option_tool === "Đối soát ngày FPT PAY"?
                      <Link
                      to={`/GSVH/doi-soat-ngay-fpt-pay/${tool.id}`}
                      className="btn btn-outline-primary"
                    >
                      Xem chi tiết
                    </Link>:""
                    }
                    {tool.option_tool === "Đối soát liên thông bãi đỗ" ? (
                      <Link
                        to={`/GSVH/doi-soat-lien-thong-bai-do/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {
                      tool.option_tool === "Giao dịch Fintwin"?
                      <Link
                      to={`/GSVH/giao-dich-fw/${tool.id}`}
                      className="btn btn-outline-primary"
                    >
                      Xem chi tiết
                    </Link>:""
                    }
                    {
                      tool.option_tool === "Giao dịch VCB"?
                      <Link
                      to={`/GSVH/giao-dich-vcb/${tool.id}`}
                      className="btn btn-outline-primary"
                    >
                      Xem chi tiết
                    </Link>:""
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
export default Gsvh;
