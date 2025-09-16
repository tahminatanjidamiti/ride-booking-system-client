import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = {
  Rider: ["Book rides instantly", "Live ride tracking", "Secure payments"],
  Driver: ["Accept/cancel rides", "Earnings dashboard", "Availability Control:"],
  Admin: ["Manage users", "Analytics dashboard", "Approved Driver"],
};

export default function Features() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      <h1 className="text-4xl font-bold text-center">Our Features</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {Object.entries(features).map(([role, items], i) => (
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="text-2xl">{role}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
