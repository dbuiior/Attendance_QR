import React, {useEffect} from "react";
import { useState } from "react";

function App(){
  const [data, setData] = useState([]);
  useEffect(()=>{
    fetch('http://localhost:8031/project')
    .then(res => res.json())
    .then(data => setData(data))
    .then(err => console.log(err)) 
  },[])

  return(
    <div  
    style={{
      height: "100vh", 
      display: "flex",
      justifyContent: "center", 
      alignItems: "center",     
      padding: "50px",
      textAlign: "center"
    }}>
        <table>
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Project Name</th>
              <th>Company</th>
              <th>Entity</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d,i) => (
              <tr key={i}>
                <td>{d.project_id}</td>
                <td>{d.project_name}</td>
                <td>{d.company}</td>
                <td>{d.entity}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  )
}

export default App