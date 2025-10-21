import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Header from "../Header/Header";
import Footer from "../Footer/Fotter";
const Home = () => {
  return (
    <div>
      <div className="custom-bg-container mb-2">
      <Header></Header>
      <div className="container mt-5" style={{marginTop:"200px"}}>
        <div class="row">
          {/* // Department GSVH */}
          <div class="col-sm-6">
            <div class="card">
              <div class="card-body">
                <h3 class="card-title fw-bolder">Tool Giám sát vận hành</h3>
                <p class="card-text fst-italic">
                  Tool giúp thuận tiện trong việc giám sát vận hành.
                </p>
                <Link
                  style={{ fontSize: "20px" }}
                  to={`/GSVH`}
                  className="text-light btn btn-success border-bottom rounded me-2 mb-2"
                >
                  Chi tiết
                </Link>
              </div>
            </div>
          </div>

          {/* Tool Department CSKH */}
          <div class="col-sm-6">
            <div class="card">
              <div class="card-body">
                <h3 class="card-title fw-bolder">Tool Chăm sóc khách hàng</h3>
                <p class="card-text fst-italic">
                  Tool giúp thuận tiện trong việc chăm sóc khách hàng.
                </p>
                <Link
                  style={{ fontSize: "20px" }}
                  to={`/CSKH`}
                  className="text-light btn btn-success border-bottom rounded me-2 mb-2"
                >
                  Chi tiết
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-3">
          {/* Tool Department KD */}
          <div class="col-sm-6">
            <div class="card">
              <div class="card-body">
                <h3 class="card-title fw-bolder">Tool Kinh Doanh</h3>
                <p class="card-text fst-italic">
                  Tool giúp thuận tiện trong việc kinh doanh.
                </p>
                <Link
                  style={{ fontSize: "20px" }}
                  to={`/KD`}
                  className="text-light btn btn-success border-bottom rounded me-2 mb-2"
                >
                  Chi tiết
                </Link>
              </div>
            </div>
          </div>

          {/* Tool Department Tài chính */}
          <div class="col-sm-6">
            <div class="card">
              <div class="card-body">
                <h3 class="card-title fw-bolder">Tool Tài chính</h3>
                <p class="card-text fst-italic">
                  Tool giúp thuận tiện trong việc quản lý tài chính.
                </p>
                <Link
                  style={{ fontSize: "20px" }}
                  to={`/TC`}
                  className="text-light btn btn-success border-bottom rounded me-2 mb-2"
                >
                  Chi tiết
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div class="row mt-3">
          {/* // Department Đầu tư */}
          <div class="col-sm-6">
            <div class="card">
              <div class="card-body">
                <h3 class="card-title fw-bolder">Tool Đầu tư</h3>
                <p class="card-text fst-italic">
                  Tool giúp thuận tiện trong việc đầu tư tài chính.
                </p>
                <Link
                  style={{ fontSize: "20px" }}
                  to={`/DT`}
                  className="text-light btn btn-success border-bottom rounded me-2 mb-2"
                >
                  Chi tiết
                </Link>
              </div>
            </div>
          </div>

          {/* Tool Department KTCN */}
          <div class="col-sm-6">
            <div class="card">
              <div class="card-body">
                <h3 class="card-title fw-bolder">Tool phòng Kĩ thuật công nghệ</h3>
                <p class="card-text fst-italic">
                  Tool giúp thuận tiện trong việc phát triển của phòng Công nghệ.
                </p>
                <Link
                  style={{ fontSize: "20px" }}
                  to={`/KTCN`}
                  className="text-light btn btn-success border-bottom rounded me-2 mb-2"
                >
                  Chi tiết
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
    </div>
  );
};

export default Home;
