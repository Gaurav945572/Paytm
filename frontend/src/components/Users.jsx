import { useState } from "react"
import { Button } from "./Button"
import { SendMoney } from "./SendMoney";
import { Link } from "react-router-dom"

export const Users = () => {
    // Replace with backend call
    const [users, setUsers] = useState([{
        firstName: "Harkirat",
        lastName: "Singh",
        _id: 1
    },{
        firstName:"Gaurav",
        lastName:"Singh",
        _id:2
    }
    ,{
        firstName:"Shipra",
        lastName:"Singh",
        _id:3
    }
    ,{
        firstName:"Sunita",
        lastName:"Singh",
        _id:4
    }]);

    return <>
        <div className="font-bold mt-6 text-lg px-5">
            Users
        </div>
        <div className="my-2 px-5">
            <input type="text" placeholder="Search users..." className="px-5 w-full  py-1 border rounded border-slate-200"></input>
        </div>
        <div>
            {users.map(user => <User user={user} />)}
        </div>
    </>
}

function User({user}) {
    return <div className="flex justify-between px-5">
        <div className="flex">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.firstName[0]}
                </div>
            </div>
            <div className="flex flex-col justify-center h-ful">
                <div>
                    {user.firstName} {user.lastName}
                </div>
            </div>
        </div>

        <div className="flex flex-col justify-center h-ful">
            <Button label={"Send Money"} onClick={SendMoney} />
        </div>
    </div>
}