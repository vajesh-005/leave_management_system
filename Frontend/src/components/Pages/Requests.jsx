  import React, { useEffect, useState } from 'react'
  import Side_nav from '../Side_nav'
  import '../../style/requests.css'
  import Pending_card from '../Pending_card';
  import {Token} from '../Token';

  function Requests() {
    const {decode , token} = Token();
    const [pendingList , setPendingList] = useState([]);

    useEffect(()=>{
      fetch(`http://localhost:2406/userswithrequest/${decode.id}` ,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result)=>result.json())
      .then((data)=>setPendingList(data))
      .catch((error)=>console.log(error.message));
    } , [decode?.id, token] )
    return (
      <div className='width requests-container'>
        <Side_nav/>
        <div className="grid">
          <Pending_card data={pendingList}/>
        </div>
      </div>
    )
  }

  export default Requests