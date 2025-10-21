import React from "react";

function Footer() {
  return (
    <footer
      className="footer rounded"
      style={{
        background:
          "linear-gradient(to right, rgba(218, 220, 206, 0.5), rgba(37, 117, 252, 0.3))",
      }}
    >
      <div className="container">
        <div className="row ">
          <div className="col-md-4 mt-3">
            <h3>Thông tin</h3>
            <img src="https://epass-vdtc.com.vn/wp-content/uploads/2020/10/logo.png" alt="" />
            <p>
              Công ty Cổ phần Giao thông số Việt Nam Đ/C: Tầng 15, toà nhà Cục
              Tần Số, 115 Trần Duy Hưng, quận Cầu Giấy, Hà Nội Email:
              cskh@vdtc.com.vn Hotline: 19009080 MSDN: 0109266456 do Sở Kế hoạch
              & Đầu tư TP Hà Nội cấp lần đầu ngày 14/07/2020
            </p>
          </div>
          <div className="col-md-4 mt-3">
            <h3>Hỗ trợ</h3>
            <ul>
              <li>
                <a href="/">Hướng dẫn mua hàng</a>
              </li>
              <li>
                <a href="/">Hướng dẫn thanh toán</a>
              </li>
              <li>
                <a href="/">Chính sách đổi trả</a>
              </li>
            </ul>
          </div>
          <div className="col-md-4 mt-3">
            <h3>Liên hệ</h3>
            <p>VDTC</p>
            <p>Email:</p>
            <p>Điện thoại: </p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <p className="text-center">
              Copyright 2023 © ePass. All Right Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
