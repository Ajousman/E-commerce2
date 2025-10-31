import React from 'react'
import './Popular.css'
import data_product from '../Navbar/Assets/Frontend_Assets/data'
import Item from '../Items/Items'   // assuming you have an Item component

const Popular = () => {
  return (
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr/>
      <div className="popular-item">
        {data_product && data_product.map((item, i) => (
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
