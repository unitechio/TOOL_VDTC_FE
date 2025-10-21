import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import "react-toastify/dist/ReactToastify.css";
import { urlBase } from "../UrlBase";

function Kd() {
  const token = localStorage.getItem("token");
  const [tools, setTools] = useState([]);
  useEffect(() => {
    axios
      .get(`${urlBase}/api/tool-department/getByGroupId?groupId=3`, {
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
      <div className="container">
        <h2 className="text-center text-primary">
          Chào mừng bạn đến với trang Kinh Doanh
        </h2>
        <div className="row row-cols-1 row-cols-md-4 g-4 mt-3">
          {tools.map((tool) => (
            <div key={tool.id} className="col">
              <div className="card border-bottom rounded border-warning">
                <div className="card-body">
                  <dt
                    style={{ fontSize: "30px", font: "initial" }}
                    className="card-title fw-bolder"
                  >
                    {tool.option_tool}
                  </dt>
                  <div
                    className="d-flex justify-content-between align-items-center mt-3"
                    style={{ marginLeft: "75px" }}
                  >
                    {tool.option_tool === "Báo cáo Đăng ký gói SMS" ? (
                      <Link
                        to={`/KD/bao-cao-sms/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {tool.option_tool === "Báo cáo tổng số lượng SMS tối ưu" ? (
                      <Link
                        to={`/CSKH/cancle-viettelpay/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {tool.option_tool === "Báo cáo cài app" ? (
                      <Link
                        to={`/KD/bao-cao-kd/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {tool.option_tool === "Báo cáo chưa tích sms" ? (
                      <Link
                        to={`/KD/bao-cao-kd/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {tool.option_tool === "Báo cáo GSM" ? (
                      <Link
                        to={`/KD/bao-cao-gsm/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {tool.option_tool === "Báo cáo đấu đè VETC" ? (
                      <Link
                        to={`/KD/bao-cao-dau-de-vetc/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {tool.option_tool === "Báo cáo doanh thu bán hàng" ? (
                      <Link
                        to={`/KD/bao-cao-doanh-thu/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {tool.option_tool === "Báo cáo VIETTEL MONEY" ? (
                      <Link
                        to={`/KD/bao-cao-vtm/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {tool.option_tool === "Báo cáo trạng thái đăng ký khuyến mại SMS" ? (
                      <Link
                        to={`/KD/bao-cao-sms-status/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {tool.option_tool === "Báo cáo đăng kí DATA" ? (
                      <Link
                        to={`/KD/bao-cao-data/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {tool.option_tool === "Gỡ cấm user đấu nối" ? (
                      <Link
                        to={`/KD/user-black-list/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {tool.option_tool === "Báo cáo liên kết VTM" ? (
                      <Link
                        to={`/KD/bao-cao-lien-ket-vtm/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {tool.option_tool === "Báo cáo Bán gói bảo hiểm" ? (
                      <Link
                        to={`/KD/bao-cao-ban-goi-bao-hiem/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {tool.option_tool === "Báo cáo FPT Visa" ? (
                      <Link
                        to={`/KD/bao-cao-fpt-visa/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {tool.option_tool === "Báo cáo liên kết VNPay" ? (
                      <Link
                        to={`/KD/bao-cao-vn-pay/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                     {tool.option_tool === "Báo cáo liên kết VCB" ? (
                      <Link
                        to={`/KD/bao-cao-vcb/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                     {tool.option_tool === "Báo cáo liên kết Finwin" ? (
                      <Link
                        to={`/KD/bao-cao-finwin/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {tool.option_tool === "Báo cáo liên kết Momo" ? (
                      <Link
                        to={`/KD/bao-cao-momo/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {tool.option_tool === "Báo cáo bán phạt" ? (
                      <Link
                        to={`/KD/bao-cao-ban-phat/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {tool.option_tool === "Hiện trạng liên kết nguồn tiền" ? (
                      <Link
                        to={`/KD/hien-trang-lien-ket-nguon-tien/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {tool.option_tool === "Báo cáo 52" ? (
                      <Link
                        to={`/KD/bao-cao-52/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}

                    {tool.option_tool === "Báo cáo 10" ? (
                      <Link
                        to={`/KD/bao-cao-10/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {tool.option_tool === "Bán phạt" ? (
                      <Link
                        to={`/KD/ban-phat/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {tool.option_tool === "KH nạp tiền tháng" ? (
                      <Link
                        to={`/KD/kh-nap-tien-thang/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {tool.option_tool === "KH nạp tiền tháng New" ? (
                      <Link
                        to={`/KD/kh-nap-tien-thang-new/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                    {tool.option_tool === "KH cứ nạp tiền tháng" ? (
                      <Link
                        to={`/KD/kh-cu-nap-tien-thang/${tool.id}`}
                        className="btn btn-outline-primary"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Kd;
