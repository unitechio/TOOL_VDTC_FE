import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import "react-toastify/dist/ReactToastify.css";
import { urlBase } from "../UrlBase";

function DT() {
  const token = localStorage.getItem("token");
  const [tools, setTools] = useState([]);
  useEffect(() => {
    axios
      .get(`${urlBase}/api/tool-department/getByGroupId?groupId=5`, {
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
          Chào mừng bạn đến với trang Đầu tư
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
                    {tool.option_tool === "Hủy ldfiên kết ViettelPay" ? (
                      <Link
                        to={`/CSKH/cancle-viettelpay/${tool.id}`}
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
export default DT;
