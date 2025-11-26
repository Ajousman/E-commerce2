import React, { useEffect, useState } from 'react'
import './Popular.css'
//import data_product from '../Navbar/Assets/Frontend_Assets/data'
import Item from '../Items/Items'   // assuming you have an Item component

const Popular = () => {
  const[popularproducts,setPopularProducts]=useState([]);
  useEffect(()=>{
    fetch('http://localhost:4000/popularinwomen')
    .then((response)=>response.json())
    .then((data)=>setPopularProducts(data))
  },[]);
  return (
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr/>
      <div className="popular-item">
        {popularproducts && popularproducts.map((item, i) => (
          <Item
            key={item.id ?? i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  )
}

export default Popular
