import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../Header/Header";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import "./Detail.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { urlBase } from "../../UrlBase";

function SearchMTC() {
  const token = localStorage.getItem("token");
  const [result, setResult] = useState([]);
  const [mtc, setMtc] = useState("");
  const [sql, setSql] = useState([]);
  const [optionTool, setOptionTool] = useState("");
  const { id } = useParams();
  const [error, setError] = useState("");
  const [showSql, setShowSql] = useState(true);

  const rolesString = localStorage.getItem("roles");
  const userRoles = rolesString ? JSON.parse(rolesString) : [];
  const checkRole = (userRoles) => {
    if (userRoles.includes("ADMIN")) {
      return true;
    }
    return false;
  };

  const toastObject = {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };


  useEffect(() => {
    axios
      .get(`${urlBase}/api/tool-department/getById?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setOptionTool(response.data.option_tool);
        axios
          .get(
            `${urlBase}/api/sql/getbyName?optionTool=${response.data.option_tool}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((response1) => {
            setSql(response1.data);
          })
          .catch((errr) => {
            console.log(errr);
          });
      })
      .catch((errr) => {
        console.log(errr);
      });
  }, []);

  /*
  edit câu lệnh sql và tên
  */
  const handleSetNameSpl = () => {
    if(!showSql && window.confirm("Bạn có muốn thay đổi không?") )
    {
      axios
      .put(
        `${urlBase}/api/sql/setNameSql`,
        {
          id: sql.id?sql.id:0,
          groupId: sql.groupId,
          option_tool: sql.option_tool,
          nameSqlTool: sql.nameSqlTool,
          nameSchema: sql.nameSchema,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        if(response.data ==="true_update")
        {
        setShowSql(true);
        toast.success("Update thành công !!", toastObject);
        }
        else{
          toast.error("Lỗi cú pháp câu lệnh",toastObject);
        }
      })
      .catch((errr) => {
        toast.success("Bạn không có quyển làm điều này !!", toastObject);
        console.log(errr);
      });
    }
  };
  const handleInput = (e) => {
    setMtc(e.target.value);
  };

  const searchEtag = () => {
    setError("");
    const regex = /^[a-zA-Z0-9]+$/;
    const isValid = regex.test(mtc);
    if (!isValid) {
      setError("Nhập đúng định dạng!!!");
    } else {
      axios
        .get(
          `${urlBase}/api/gsvh/getMtc?mtc=${mtc}&optionTool=${optionTool}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          setResult(response.data);
        })
        .catch((errr) => {
          console.log(errr);
        });
    }
  };

  
  return (
    <div>
      <Header></Header>
      <ToastContainer />
      <div className="container">
        <h2 className="text-center text-primary m-3">
        Nhập Barcode hoặc Mã tra cứu
        </h2>
        <div>
          <input
            className="rounded me-3 mb-3"
            style={{ fontSize: "25px" }}
            type="text"
            placeholder="Barcode hoặc Mã tra cứu"
            onChange={handleInput}
          />
          <button
            className="btn btn-success border-bottom mb-2"
            onClick={searchEtag}
          >
            Search
          </button>
        </div>
        <div className="login__error mb-4">{error}</div>
        <div className="row">
          <div className="col-md-8" style={{ fontSize: "30px" }}>
            <ul>
              <li
                class="list-group-item"
                style={{ display: "flex", flexDirection: "row" }}
              >
                Loại vé: {result.ticketType}
              </li>
              <li
                class="list-group-item"
                style={{ display: "flex", flexDirection: "row" }}
              >
                Trạng thái: {result.status}
              </li>
              <li
                class="list-group-item"
                style={{ display: "flex", flexDirection: "row" }}
              >
                Barcode: {result.barCode}
              </li>
              <li
                class="list-group-item"
                style={{ display: "flex", flexDirection: "row" }}
              >
                Mã tra cứu: {result.barCode}
              </li>
              <li
                class="list-group-item"
                style={{ display: "flex", flexDirection: "row" }}
              >
                Giá vé: {result.ticketPrice}
              </li>
              <li
                class="list-group-item"
                style={{ display: "flex", flexDirection: "row" }}
              >
                Link hóa đơn: {result.ticketLink}
              </li>
              <li
                class="list-group-item"
                style={{ display: "flex", flexDirection: "row" }}
              >
                Import Date: {result.createDate}
              </li>
              <li
                class="list-group-item"
                style={{ display: "flex", flexDirection: "row" }}
              >
                Update Date: {result.updateDate}
              </li>
              <li
                class="list-group-item"
                style={{ display: "flex", flexDirection: "row" }}
              >
                Mẫu số: {result.paymentConfirmCode}
              </li>
            </ul>
          </div>
          {checkRole(userRoles) && (
            <div className="col-md-4">
              <dt style={{ fontSize: "20px" }}>Câu lệnh truy vấn</dt>
              <textarea
                disabled={showSql}
                className="mt-4"
                type="text"
                style={{ height: "30%", width: "100%" }}
                value={sql.nameSqlTool}
                onChange={(e) => {
                  setSql((prev) => ({
                    ...prev,
                    nameSqlTool: e.target.value,
                  }));
                }}
              />
              <textarea
                disabled={showSql}
                className="mt-4"
                type="text"
                style={{ height: "30%", width: "100%" }}
                value={sql.option_tool}
                onChange={(e) => {
                  setSql((prev) => ({
                    ...prev,
                    option_tool: e.target.value,
                  }));
                }}
              />


              <div>
                <button
                  onClick={() => {
                    setShowSql(!showSql);
                  }}
                  className="mt-2 me-2 btn btn-secondary border-bottom "
                >
                  Edit
                </button>
                <button
                  onClick={handleSetNameSpl}
                  className="mt-2 btn btn-warning border-bottom "
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default SearchMTC;
