import { useState } from "react";
import axios from "axios";
import { Link, useNavigate  } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";
import { Button } from "reactstrap";
import { urlBase } from "../UrlBase";

function Login() {
  const toastObject = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState({
    usernameError: "",
    passwordError: "",
    result: "",
  });

  async function login(event) {
    const error = {
      usernameError: "",
      passwordError: "",
      result: "",
    };
    // event.preventDefault();
    if (username.length === 0) {
      error.usernameError = "Vui lòng nhập tên đăng nhập";
    }
    if (password.length === 0) {
      error.passwordError = "Vui lòng nhập mật khẩu";
    }
    if (username.length > 0 && password.length > 0) {
      try {
        const response = await axios.post(
          `${urlBase}/api/auth/signin`,
          {
            username: username,
            password: password,
          }
        );

        if (response.data.token) {
          toast.success("Đăng nhập thành công !!", toastObject);
          const token = response.data.token;
          const roles = response.data.roles.map((role) => role.authority);
          localStorage.setItem("token", token); // Lưu mã thông báo vào local storage
          localStorage.setItem("name",response.data.name)
          localStorage.setItem("roles", JSON.stringify(roles));
          setTimeout(() => {
            navigate("/home")
            window.location.reload();
          }, 1500);
        } else {
          // alert("Incorrect email or password");
          error.result = "Incorrect email or password !!";
          toast.error("Incorrect email or password !!", toastObject);
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred during login.");
      }
    }
    setError(error);
  }

  return (
    <MDBContainer
      fluid className="custom-bg-container"
      style={{
        background:
          "linear-gradient(to right, rgba(164, 100, 39, 0.58), rgba(116, 100, 39, 0.58))",
      }}
    >
      <ToastContainer />
      <MDBRow
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <MDBCol col="12">
          <MDBCard
            className="my-5 mx-auto"
            style={{ borderRadius: "1rem", maxWidth: "400px", background:"#f28158" }}
          >
            <MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">
              {/* <h2 className="fw-bold mb-2 text-uppercase" color="white">
                Login
              </h2> */}
              <img src="https://epass-vdtc.com.vn/wp-content/uploads/2020/10/logo.png" alt="" />
              <p className="text-dark-50 mb-5">
                Please enter your login and password!
              </p>
              <div style={{color:"#31ff76"}} className="login__error" >{error.usernameError}</div>
              <MDBInput
                wrapperClass="mb-4 mx-5 w-100"
                onChange={(e) => {
                  setusername(e.target.value);
                }}
                labelClass="text-dark"
                label="Username"
                id="formControlLg"
                type="text"
                size="lg"
              />
              <div style={{color:"#31ff76"}} className="login__error">{error.passwordError}</div>
              <MDBInput
                wrapperClass="mb-4 mx-5 w-100"
                onKeyDown={(e)=>{
                  if(e.key==="Enter")
                  {
                    login();
                  }
                }}
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
                labelClass="text-dark"
                label="Password"
                id="formControlLg"
                type="password"
                size="lg"
              />
              <div style={{color:"#31ff76"}} className="login__error">{error.result}</div>
              <p className="small mb-3 pb-lg-2">
                {/* <a class="text-dark-50" href="#!">
                  Forgot password?
                </a> */}
              </p>
              <Button
                outline
                className="mx-2 px-5 text-dark-50 mb-5"
                style={{
                  // background:"white",
                  WebkitBorderRadius: "20px",
                  borderRadius: "20px",
                  borderColor: "white",
                  color: "white",
                }}
                color="white"
                size="lg"
                onClick={login}
              >
                Login
              </Button>
              {/* <div>
                <p className="mb-0">
                  Don't have an account?{" "}
                  <Link to={`/register`} className="">
                    Sign in
                  </Link>
                </p>
              </div> */}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
