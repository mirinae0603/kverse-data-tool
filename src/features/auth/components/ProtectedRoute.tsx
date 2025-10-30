// import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useAuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const { user } = useAuthContext();

    // if (loading) {
    //     return <div className="h-dvh flex items-center justify-center">
    //         <Spinner />
    //     </div>
    // }

    if(!user) return <Navigate to="/"/>

    return <Outlet />
}

export default ProtectedRoute;