import { useContext } from 'react';

import LogoutIcon from "../assets/images/logout.png";
import { useLocation, useNavigate } from "react-router";
import { logOut } from "../helpers/firebaseControl";
import { AppContext } from './AppProvider';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  function pathMatchRoute(route) {
    if (location.pathname.includes(route)) {
      return true;
    }
  };

  const { user, userRole } = useContext(AppContext);

  const getRole = () => {
    switch (userRole) {
      case "accountant": 
        return 'Бухгалтер';

      case "operator": 
        return 'Оператор';

      case "content": 
        return 'Контент-менеджер';

      default:
        return '';
    }
  };

  return (
    <div className=" bg-[#00B488] h-[70px] flex border border-[#DEE2E6] sticky top-0">
      <header className="flex justify-between items-center px-10 w-[100%]">

        {user && (
          <>
          {userRole === "accountant" ? (
             <div className="flex items-center">
            <div
              className={`pr-6 cursor-pointer text-white ${pathMatchRoute("/clients") && "font-bold"}`}
              onClick={() => {
                navigate("/clients");
              } }
            >
              Клієнти
            </div>
            <div
              className={`text-white cursor-pointer ${pathMatchRoute("/employees") && "font-bold"}`}
              onClick={() => {
                navigate("/employees");
              } }
            >
              Працівники
            </div>
          </div>
          ) : (
            <div />
          )}
         
          <div className=" flex items-center">
              <div className="pr-[27px]">
                <div className="text-white text-lg">{getRole()}</div>
                <div className="text-[#E9E9E9] text-sm">{user.email}</div>
              </div>
              <button className="pr-4">
                <img
                  src={LogoutIcon}
                  alt="avatar"
                  className=" h-[18px] w-[18px]"
                  onClick={logOut} />
              </button>
            </div>
            </>
        )}
      </header>
    </div>
  );
}
