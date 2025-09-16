

export default function ServiceHighlights() {
  return (
    <section className="service-highlights py-20 text-center max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-12">Why Choose Us</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="relative p-6 rounded-lg transition hover:bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.2),transparent)]">
          <h3 className="text-xl font-semibold mb-2">Safe & Reliable</h3>
          <p>All drivers are verified, and rides are insured for your safety.</p>
        </div>
        <div className="relative p-6 rounded-lg transition hover:bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.2),transparent)]">
          <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
          <p>We are here for you anytime, anywhere.</p>
        </div>
        <div className="relative p-6 rounded-lg transition hover:bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.2),transparent)]">
          <h3 className="text-xl font-semibold mb-2">Fast Booking</h3>
          <p>Get rides in minutes with real-time driver availability.</p>
        </div>
      </div>
    </section>
  );
};

