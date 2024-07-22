import {useLocation} from "react-router-dom";


function EventPage () {

    const loc = useLocation()
    const eventName = loc.state?.eventName
    const address = loc.state?.address
    const desc = loc.state?.desc


    return (
        <div className='w-full h-full flex flex-col '>
            <div className='h-1/3 flex items-center justify-center bg-slate-400'>
                IMAGE
            </div>
            <div className='h-2/3 flex flex-col p-5'>
                <div className='flex justify-between'>
                    <p className='text-2xl'>DATE</p>
                    <div className='px-2 py-1 bg-[#E9E9E9] text-3xl mr-5 hover:cursor-pointer'>Tickets</div>
                </div>
                {/*<div className='h-1/2 flex flex-col'>*/}
                    <h1 className='text-5xl'>{eventName}</h1>
                    <h2 className='text-2xl'>{address}</h2>
                {/*</div>*/}
                <p className='h-1/4'>{desc}</p>
            </div>
        </div>
    );
}

export default EventPage;