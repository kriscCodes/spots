import Tilt from 'react-parallax-tilt'
import {useState} from "react";

// eslint-disable-next-line react/prop-types
function EventCard ({name, delay}) {

    const [show, setShow] = useState(true);

    setTimeout( () => {
        setShow(false);
    }, 190*delay)

    return (
        <Tilt
            tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.05} tiltReverse={true} glarePosition="all"
            className={`p-5 transition duration-100 ${show ? 'opacity-0' : 'opacity-100'}`}
        >
            <div
                className='transition w-full max-w-[350px] min-h-[320px] flex flex-col justify-end bg-[#F2F2F2] -z-[2] rounded-lg'
            >
                <div className='h-1/3 bg-[#F8F8F8] rounded-b-lg shadow-lg shadow-[#C5C5C5] p-4'>
                    <div className='flex flex-col'>
                        <p className='font-light'>
                            Type
                        </p>
                        <p className='font-bold text-lg overflow-hidden overflow-ellipsis whitespace-nowrap'>
                            {/*Event Title*/}
                            {name}
                        </p>
                        <p className='font-light text-sm'>
                            DATE & TIME
                        </p>
                    </div>
                </div>
            </div>
        </Tilt>
    )
}

export default EventCard;