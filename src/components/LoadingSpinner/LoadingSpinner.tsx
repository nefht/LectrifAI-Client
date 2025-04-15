import { Spinner } from "flowbite-react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  isLoading: boolean;
}

const LoadingSpinner = ({ isLoading }: LoadingSpinnerProps) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* <motion.div
        className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <p className="text-white text-lg ml-4">Processing, please wait...</p> */}
      <Spinner size="xl" color="purple"/>
    </div>
  );
};

export default LoadingSpinner;
