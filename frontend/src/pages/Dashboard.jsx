import { AppBar } from "../components/AppBar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
export function Dashboard() {
    return (
        <>
            <div className="">

                <AppBar></AppBar>
                <Balance value={"5000"}></Balance>
                <Users></Users>
            </div>
        </>
    )
}