import { Link } from "react-router";


export default function Promotions() {
    return (
        <section className="promotions py-20 bg-red-950 text-white text-center">
            {/* dark:bg-gray-950 */}
            <h2 className="text-3xl font-bold mb-4">🎉🎉Special Offers🎉🎉</h2>
            <p className="mb-6">✨Now 20% off, get your 1st ride! Limited time offer.✨</p>
            <button className="bg-white border-2 border-red-700 text-red-800 hover:text-red-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition">
                <Link to={"/rider/request"}>Claim Offer 🎯</Link>
            </button>
        </section>
    );
};
