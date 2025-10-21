import { Link, useNavigate } from "react-router-dom";
import { BiLogOutCircle } from "react-icons/bi"; // Import the cart icon from a library like react-icons
import {CgProfile} from "react-icons/cg"
import { useEffect, useState } from "react";
import { AiFillCaretDown,AiOutlineUser  } from "react-icons/ai";

const Header = () => {
  const [render,setRender] = useState(false);
  const navigate = useNavigate();
  const rolesString = localStorage.getItem("roles");
  const token = localStorage.getItem("token");
  const userRoles = rolesString ? JSON.parse(rolesString) : []; 
  const checkRole = (userRoles)=>{
    if( userRoles.includes("ADMIN")){
      return true
    }
    return false
  }
  const [showOptions, setShowOptions] = useState(false);

  const handleProfileClick = () => {
    setShowOptions(false);
    navigate("/UserProfile")
    
    // Thực hiện hành động khi nhấp vào Profile
    // Ví dụ: Hiển thị trang profile
  };
  const [isScrolled, setIsScrolled] = useState(false);
  const headerClass = isScrolled ? "fixed-header" : "";
  // const navigate = useNavigate();
  const handleLogout = () => {
    // Thực hiện các bước xử lý khi logout
    // Ví dụ: Xóa token, xóa thông tin người dùng khỏi storage, điều hướng đến trang đăng nhập, vv.

    // Xóa token từ localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("roles");

    // Điều hướng đến trang đăng nhập
    navigate("/")
    window.location.reload();
  };
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const isTop = scrollTop === 0;
      setIsScrolled(!isTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <nav
      className={`navbar navbar-expand-lg navbar-light bg-light red-line ${headerClass}`}
      style={{background:"linear-gradient(90deg,#f48833,#eb2957)"}}
    >
      <div className="container-fluid">
        <Link className="navbar-brand header-link text-white" to="/home">
          <img
            src={"http://10.254.247.201:9123/assets/icons/Logo_epass.svg"}
            style={{ width: 150, height: 45 }}
            alt="Logo"
            className="logo-image "
          />
        </Link>
        <h3 className="text-white fw-bold me-5"> Hệ thống hỗ trợ Epass</h3>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/home">
                <button style={{height:"35px"}} className="fw-bold text-white btn btn-outline-info rounded border">Trang chủ</button>
              </Link>
            </li>
          </ul>
        </div>
        <div className="ml-auto rounded d-flex justify-content-center" style={{fontSize:"15px"}}>
          <ul className="navbar-nav"
          onClick={() => setShowOptions(!showOptions)}>
            <li className="nav-item me-3">

              {/* <div>k</div> */}
              <div className="user-profile mt-2" style={{ width: "30px" }}>
                <img
                  className="w-100 border rounded-circle ms-2"
                  src="https://crmtest.epass-vdtc.com.vn/assets/images/avatar.jpg"
                  // src={"./avatar.jpg"}
                  alt="User Image"
                />
                {showOptions && (
                  <div
                    className="user-options notification-content list-group"
                    style={{
                      display:"inline-block",
                      position: "absolute",
                      zIndex: "1",
                      right: "25px",
                      top: "60px",
                      background: "white",
                    }}
                  >
                    <button
                      type="button"
                      class="btn btn-outline-secondary list-group-item list-group-item-action"
                      // onClick={handleLogout}
                    >
                      {<AiOutlineUser />} Thông tin cá nhân
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-secondary list-group-item list-group-item-action"
                      onClick={handleLogout}
                    >
                      {<BiLogOutCircle/>} Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </li>
            <li className="me-1 mt-1">
            <div className="mt-2 fw-bold text-white">{localStorage.getItem("name")}</div>
            </li>
            <li className="text-white mt-1" style={{fontSize:"25px"}}>
            {<AiFillCaretDown />}
            </li>
            <li>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;