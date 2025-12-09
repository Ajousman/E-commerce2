import React from 'react'
import './NewsLetter.css'
const NewsLetter = () => {
  return (
    <div className='newsletter'>
      <h1>Get Exclussive Offers On Your Email</h1>
      <p>Subscribe to Our Newsletter and Stay Updated</p>
      <div className="">
        <input type="email" placeholder='Your Email ID'/>
        <button>Subscribe</button>
      </div>
    </div>
  )
}

export default NewsLetter
