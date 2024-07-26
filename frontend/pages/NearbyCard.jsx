/* eslint-disable react/prop-types */
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import StarIcon from "@mui/icons-material/Star.js";
import Rating from "@mui/material/Rating";
import Tilt from "react-parallax-tilt";


// eslint-disable-next-line react/prop-types
function NearbyCard (props) {

    const [eventData, setEventData] = useState(props.data);
    const [rating, setRating] = useState(props.data.rating);
    const [showCard, setShowCard] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // const fetchPlaceInfo = async () => {
        //     try {
        //         await fetch('http://127.0.0.1:2700/api/place-rating-reviews', {
        //             method: 'POST',
        //             headers: {'Content-Type': 'application/json'},
        //             body: JSON.stringify({name: eventData.name})
        //         })
        //             .then(response => {
        //                 if (response.status === 200) {
        //                     return response.json();
        //                 }
        //                 throw new Error('could not fetch query');
        //             })
        //             .then(data => {
        //                 setRating(parseInt(data['rating']));
        //                 // dp({type: actionTypes.SET_RATING_REVIEWS, pl: data});
        //             })
        //     } catch (e) {
        //         console.log('error in fetching place info', e);
        //     }
        // };
        // fetchPlaceInfo();

        const timer = setTimeout(() => {
            setShowCard(true);
        }, 190*props.delay);

        return () => clearTimeout(timer);
    })

    const handleClickEvent= () => {
        props.handleEventClick(props.data.name);
        setTimeout(() => {
            navigate('/event', {
                state: {
                    name: props.data.isRestaurant ? props.data.name : props.data.title,
                    address: props.data.isRestaurant ? props.data.address : props.data.address[0] || "No address",
                    desc: props.data.isRestaurant ? props.data.description : props.data.description || `Description for ${props.data.title}`,
                    imgUrl: props.data.isRestaurant ? props.data.img_url : props.data.thumbnail || null,
                    isRestaurant: props.data.isRestaurant === 1
                }
            });
        }, 450);
    }

    return (
         <Tilt
            tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.05} tiltReverse={true} glarePosition="all"
            className={`p-5 transition duration-100 z-30 hover:scale-110 rounded-lg w-full ${showCard ? 'opacity-100' : 'opacity-0'} ${props.clickedId === (props.data.name ||props.data.title) ? 'scale-125' : ''}`}
        >
            <div
                // className='w-full h-[120px] flex items-center gap-5 justify-center'
                className={`transition min-h-[120px] flex items-center gap-5 justify-center
                rounded-lg hover:cursor-pointer hover:bg-[#B8B8B8] w-full ${props.clickedId === props.data.name ? 'bg-[#B8B8B8] scale-125'
                : ' hover:scale-105 bg-[#F2F2F2]'}`}
                onClick={handleClickEvent}
            >
                <span>
                    {eventData.name}
                </span>
                <span>
                    <Rating
                      name="readOnly"
                      value={rating}
                      precision={0.5}
                      emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                      size="large"
                      readOnly
                    />
                </span>
            </div>
         </Tilt>
    )
}

export default NearbyCard;