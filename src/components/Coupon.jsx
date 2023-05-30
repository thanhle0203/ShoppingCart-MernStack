import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Coupon = () => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get('/api/coupons');
        setCoupons(response.data);
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };

    fetchCoupons();
  }, []);

  return (
    <div>
      <h2>Coupons</h2>
      {coupons.length === 0 ? (
        <p>No coupons available.</p>
      ) : (
        <ul>
          {coupons.map((coupon) => (
            <li key={coupon._id}>
              <h4>Coupon Code: {coupon.code}</h4>
              <p>Discount: {coupon.discount}%</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Coupon;
