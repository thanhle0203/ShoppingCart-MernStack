import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Review = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetReviews = async () => {
            try {
                const response = axios.get('http://localhost:4000/api/reviews');
                setReviews(response.data);
            } catch (error) {
                console.log('Error fetching reviews:', error);
            }
        };

        fetReviews();
    }, []);

    return (
        <div>
            <h2>Review List</h2>
            <ul>
                {reviews.map((review) => {
                    <li key={review._id}>
                        <h4>Product: {review.product}</h4>
                        <p>Rating: {review.rating}</p>
                        <p>Comment: {review.comment}</p>
                    </li>
                })}
            </ul>
        </div>
    )
}