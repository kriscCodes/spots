/* eslint-disable react/prop-types */

import Tilt from "react-parallax-tilt";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

function EventCard (props) {

    const [showCard, setShowCard] = useState(false);

    const navigate = useNavigate();
    // console.log('data', props.data);

    setTimeout(() => {
        setShowCard(true);
    }, 190*props.delay)

    const handleClickEvent= () => {
        props.handleEventClick(props.data.name);
        setTimeout(() => {
            navigate('/event', {state: {
                    eventName: props.data.name,
                    address: props.data.address,
                    desc: props.data.description,
                    imgUrl: props.data.img_url,
                    isRestaurant: true
            }});
        }, 450);
    }

    return (
        <Tilt
            tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.05} tiltReverse={true} glarePosition="all"
            className={`p-5 transition duration-100 w-fit ${showCard ? 'opacity-100' : 'opacity-0'} ${props.clickedId === props.data.name ? 'scale-125' : ''}`}
        >
            <div
                className={`transition min-h-[320px] flex flex-col justify-end
                rounded-lg hover:cursor-pointer w-[350px] ${props.clickedId === props.data.name ? 'bg-[#B8B8B8] scale-125'
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
                            RESTAURANT
                        </p>
                        <p
                            className='font-bold text-lg overflow-hidden overflow-ellipsis whitespace-nowrap'
                        >
                            {props.data.name}
                        </p>
                        <p
                            className='font-light text-sm'
                        >
                            {props.data.address}
                        </p>
                    </div>

                </div>
            </div>
        </Tilt>
    )
}

export default EventCard;