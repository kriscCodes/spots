/* eslint-disable react/prop-types */

import Tilt from "react-parallax-tilt";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function EventCard (props) {

    console.log('type', typeof props.data);
    console.log('data', props.data);
    const [showCard, setShowCard] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowCard(true);
        }, 190*props.delay);
        return () => clearTimeout(timer);
    }, [props.delay]);

    // setTimeout(() => {
    //     setShowCard(true);
    // }, 190*props.delay)



    const handleClickEvent= () => {
        props.handleEventClick(props.data.name || props.data.title);
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
            className={`p-5 transition duration-100 w-fit ${showCard ? 'opacity-100' : 'opacity-0'} ${props.clickedId === (props.data.name ||props.data.title) ? 'scale-125' : ''}`}
        >
            <div
                className={`transition min-h-[320px] flex flex-col justify-end
                rounded-lg hover:cursor-pointer w-[350px] ${props.clickedId === (props.data.name ||props.data.title) ? 'bg-[#B8B8B8] scale-125'
                : ' hover:scale-105 bg-[#F2F2F2]'}`}
                onClick={handleClickEvent}
            >
                <div
                    className='h-1/3 bg-[#F8F8F8] rounded-b-lg shadow-lg shadow-[#C5C5C5] p-4'
                >
                    <div
                        className='flex flex-col'
                    >
                        <p
                            className='font-light'
                        >
                            {props.data.isRestaurant ? 'RESTAURANT' : 'EVENT'}
                        </p>
                        <p
                            className='font-bold text-lg overflow-hidden overflow-ellipsis whitespace-nowrap'
                        >
                            {props.data.name || props.data.title}
                        </p>
                        <p
                            className='font-light text-sm'
                        >
                            {props.data.isRestaurant ? props.data.address : props.data.address}
                        </p>
                    </div>

                </div>
            </div>
        </Tilt>
    )
}

export default EventCard;