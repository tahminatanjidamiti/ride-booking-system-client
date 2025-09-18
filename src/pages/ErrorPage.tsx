
import { motion } from "framer-motion";
import { Link } from "react-router";


const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-t from-gray-950 from-20% via-red-900 via-50% to-red-950">
      <motion.h1
        className="text-6xl font-bold text-red-950"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
         CholoPothik 404... Error!!
      </motion.h1>

      <motion.p
        className="mt-4 text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeInOut" }}
      >
        Oops! The page you're looking for doesn't exist.
      </motion.p>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: "easeInOut" }}
      >
        <Link
          to="/"
          className="border-2 border-black px-6 py-3 bg-red-900 text-white rounded-lg shadow-md hover:bg-red-950 focus:outline-none"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default ErrorPage;