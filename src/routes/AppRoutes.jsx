import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login/Login";
import PageNotFound from "../pages/PageNotFound/PageNotFound";
import ProtectedRouter from "./ProtectedRouter";
import DashBoard from "../pages/DashBoard/DashBoard";
import Profile from "../pages/Profile/Profile";
import Support from "../pages/Support/Support";
import RequireRole from "./RequireRole";
import ManageUsers from "../pages/ManageUsers/ManageUsers";

export default function AppRoutes() {

    return (<>
            <Routes>
                <Route path="login" element={<Login />}/>
                {/* TRANG CẦN BẢO VỆ  */}
                <Route element={<ProtectedRouter/>}>
                <Route element={<RequireRole  roles={[1,2]} />} >
                {/* REQUIRE ROLE */}

                <Route path="/" element={<DashBoard />}/>
                <Route path="/user-management" element={<ManageUsers />} />

                </Route>

                <Route path="/profile" element={<Profile  />} />
                </Route>
                <Route path="support" element={<Support />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
    </>)
}