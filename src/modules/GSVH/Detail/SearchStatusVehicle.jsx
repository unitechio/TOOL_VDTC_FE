import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../Header/Header";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import "./Detail.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../Loading/Loading";
import { urlBase } from "../../UrlBase";

function SearchStatusVehicle() {
  const token = localStorage.getItem("token");
  const [Etags, setEtags] = useState([]);
  const [epc, setEpc] = useState("");
  const [sql, setSql] = useState([]);
  const [optionTool, setOptionTool] = useState("");
  const { id } = useParams();
  const [error, setError] = useState("");
  const [showSql, setShowSql] = useState(true);
  const [showLoading, setShowLoading] = useState(false);

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

  const handleSetNameSpl = () => {
    if (!showSql && window.confirm("Bạn có muốn thay đổi không?")) {
      axios
        .put(
          `${urlBase}/api/sql/setNameSql`,
          {
            id: sql.id ? sql.id : 0,
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
    setEpc(e.target.value);
  };

  const searchEpc = () => {
    setError("");
    const regex = /^[a-zA-Z0-9]+$/;
    const isValid = regex.test(epc);
    if (!isValid) {
      setError("Nhập đúng định dạng serial!!!");
    } else {
      setShowLoading(true);
      axios
        .get(
          `${urlBase}/api/gsvh/tra-cuu-vehicle?epc=${epc}&optionTool=${optionTool}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          setShowLoading(false);
          setEtags(response.data);
        })
        .catch((errr) => {
          setShowLoading(false);
          console.log(errr);
        });
    }
  };


  /*
  Update trạng thái xe về 1
  */
  const hanldeUpadteVehicle1 = () => {
    if (Etags.status == 0 && window.confirm("Bạn có muốn cập nhập không?")) {
      axios
        .put(
          `${urlBase}/api/gsvh/update-stattus-vehicle?epc=${
            Etags.epc
          }&optionTool=${optionTool}&status=${1}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          setEtags((prev)=>({
            ...prev,
            status:"1"
          }));
          toast.success("Cập nhập thành công",toastObject)
          setShowLoading(false);
        })
        .catch((errr) => {
          setShowLoading(false);
          toast.error("Cập nhập thành công",toastObject)
          console.log(errr);
        });
    }
  };

  /*
  Update trạng thái xe về 0
  */
  const hanldeUpadteVehicle0 = () => {
    if (Etags.status ==1 && window.confirm("Bạn có muốn cập nhập không?")) {
      axios
        .put(
          `${urlBase}/api/gsvh/update-stattus-vehicle?epc=${
            Etags.epc
          }&optionTool=${optionTool}&status=${0}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          setEtags((prev)=>({
            ...prev,
            status:"0"
          }));
          toast.success("Cập nhập thành công",toastObject)
          setShowLoading(false);
        })
        .catch((errr) => {
          setShowLoading(false);
          toast.error("Cập nhập thành công",toastObject)
          console.log(errr);
        });
    }
  };
  return (
    <div>
      <Header></Header>
      <ToastContainer />
      {showLoading && <Loading></Loading>}
      <div className="container">
        <h2 className="text-center text-primary m-3">Tra cứu trạng thái xe</h2>
        <div>
          Nhập biển số, epc cần tra cứu:
          <input
            className="rounded me-3 mb-3 ms-3"
            style={{ fontSize: "25px" }}
            type="text"
            placeholder="EPC hoặc biển số xe"
            onChange={handleInput}
          />
          <button
            className="btn btn-success border-bottom mb-2"
            onClick={searchEpc}
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
                Biển số: {Etags.plateNumber}
              </li>
              <li
                class="list-group-item"
                style={{ display: "flex", flexDirection: "row" }}
              >
                EPC: {Etags.epc}
              </li>
              <li
                class="list-group-item"
                style={{ display: "flex", flexDirection: "row" }}
              >
                Status: {Etags.status}
              </li>
              <li
                class="list-group-item"
                style={{ display: "flex", flexDirection: "row" }}
              >
                Active Status: {Etags.activeStatus}
              </li>
            </ul>
            <div>
              <button
                className="btn btn-primary border-bottom mb-2 me-2"
                onClick={hanldeUpadteVehicle0}
              >
                DeActive
              </button>
              <button
                className="btn btn-primary border-bottom mb-2"
                onClick={hanldeUpadteVehicle1}
              >
                Active
              </button>
            </div>
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
export default SearchStatusVehicle;
