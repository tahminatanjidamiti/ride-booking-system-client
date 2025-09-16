import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const team = [
  { name: "Nur", role: "CEO", img: "https://i.ibb.co.com/F8mJ9Hc/smiling-young-man-with-crossed-arms-outdoors.jpg" },
  { name: "Maya", role: "CTO", img: "https://i.ibb.co.com/kmdv8QN/close-up-shot-happy-charming-tender-cute-young-20s-brunette-olive-t-shirt-smiling-shy-energized-feel.jpg" },
  { name: "Nodhi", role: "Lead Engineer", img: "https://i.ibb.co.com/FXZ4KYm/unique-barn-1.jpg" },
];

export default function About() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-16">
      {/* Company Info */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          We’re a forward-thinking company revolutionizing the way riders,
          drivers, and admins interact on a ride-sharing platform. Our mission
          is to connect communities with safe, reliable, and efficient
          transportation.
        </p>
      </motion.section>

      {/* Mission */}
      <motion.section initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
        <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed">
          To empower riders with seamless journeys, enable drivers with fair
          opportunities, and provide admins with full transparency and control.
        </p>
      </motion.section>

      {/* Team */}
      <motion.section initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h2 className="text-3xl font-semibold mb-8">Meet Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member) => (
            <Card key={member.name} className="text-center shadow-md">
              <CardHeader>
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-28 h-28 mx-auto rounded-full object-cover"
                />
                <CardTitle className="mt-4">{member.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>
    </div>
  );
}