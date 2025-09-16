import Marquee from 'react-fast-marquee';

export default function Testimonials() {

    return (
        <section className="testimonials py-20 mb-16 max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">What Our Riders Say</h2>
            <div className='flex gap-2'>
                <Marquee pauseOnHover={true} speed={100} className=''>
                    <div className='h-[100px] mx-4'><div className="p-6 border rounded-lg shadow-sm">
                        <p>"The fastest and safest ride service I've ever used!"</p>
                        <p className="font-semibold mt-4">– Green K.</p>
                    </div></div>
                    <div className='h-[100px] mx-4'><div className="p-6 border rounded-lg shadow-sm">
                        <p>"Booking was seamless, and the driver was super friendly."</p>
                        <p className="font-semibold mt-4">– Water D.</p>
                    </div></div>
                    <div className='h-[100px] mx-4'><div className="p-6 border rounded-lg shadow-sm">
                        <p>"Highly recommend! Perfect for urgent rides at night."</p>
                        <p className="font-semibold mt-4">– Nodi S.</p>
                    </div></div>
                </Marquee>
            </div>
        </section>
    );
};

