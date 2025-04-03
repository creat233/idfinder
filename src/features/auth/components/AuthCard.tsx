
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

type AuthCardProps = {
  title: string;
  children: ReactNode;
  error: string | null;
};

const AuthCard = ({ title, children, error }: AuthCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="mt-8 bg-white/80 backdrop-blur-lg py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100"
    >
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      {children}
    </motion.div>
  );
};

export default AuthCard;
