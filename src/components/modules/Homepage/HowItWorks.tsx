
import { FaCar, FaUserShield, FaGift, FaLocationArrow } from "react-icons/fa";

export default function HowItWorks() {
  return (
    <section className="how-it-works py-20 max-w-6xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-12">How It Works</h2>
      <div className="grid md:grid-cols-4 gap-8">
        <div className="p-6 border rounded-lg hover:shadow-lg transition">
          <FaLocationArrow className="text-4xl mx-auto mb-4 text-red-900" />
          <h3 className="text-xl font-semibold mb-2">Select location</h3>
          <p>Select locations(lat, lng) using Set Pickup and Set Dropoff from map!</p>
        </div>
        <div className="p-6 border rounded-lg hover:shadow-lg transition">
          <FaUserShield className="text-4xl mx-auto mb-4 text-red-900" />
          <h3 className="text-xl font-semibold mb-2">Driver Assigned</h3>
          <p>With available nearest option a driver will be assigned to your request in minutes.</p>
        </div>
        <div className="p-6 border rounded-lg hover:shadow-lg transition">
          <FaCar className="text-4xl mx-auto mb-4 text-red-900" />
          <h3 className="text-xl font-semibold mb-2">Request a Ride</h3>
          <p>Enter your location and destination to request a ride instantly.</p>
        </div>
        <div className="p-6 border rounded-lg hover:shadow-lg transition">
          <FaGift className="text-4xl mx-auto mb-4 text-red-900" />
          <h3 className="text-xl font-semibold mb-2">Book & Enjoy Ride</h3>
          <p>Pay secure online payments seamlessly and enjoy a safe, comfortable ride.</p>
        </div>
      </div>
    </section>
  );
};

