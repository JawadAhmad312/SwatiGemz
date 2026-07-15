import { useEffect,useState } from "react"
import API from "../services/api"

export default function Users(){

const [users,setUsers] = useState([])

useEffect(()=>{

API.get("/api/users")
.then(res=>setUsers(res.data))

},[])

return(

<div>

<h1 className="text-2xl font-bold mb-6">
Users
</h1>

<ul>

{users.map((u)=>(
<li key={u._id}>
{u.username}
</li>
))}

</ul>

</div>

)

}