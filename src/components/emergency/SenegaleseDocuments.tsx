
import { motion } from "framer-motion";
import { Accordion } from "@/components/ui/accordion";
import { CNIDocument } from "./document-types/CNIDocument";
import { PassportDocument } from "./document-types/PassportDocument";
import { DriverLicenseDocument } from "./document-types/DriverLicenseDocument";
import { VehicleRegistrationDocument } from "./document-types/VehicleRegistrationDocument";
import { MotorcycleRegistrationDocument } from "./document-types/MotorcycleRegistrationDocument";
import { ResidencePermitDocument } from "./document-types/ResidencePermitDocument";
import { StudentCardDocument } from "./document-types/StudentCardDocument";
import { HealthCardDocument } from "./document-types/HealthCardDocument";
import { DocumentHeader } from "./document-types/DocumentHeader";
import { DocumentFooter } from "./document-types/DocumentFooter";

export const SenegaleseDocuments = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="my-12"
    >
      <DocumentHeader itemVariants={itemVariants} />

      <Accordion type="single" collapsible className="w-full">
        <CNIDocument itemVariants={itemVariants} />
        <PassportDocument itemVariants={itemVariants} />
        <DriverLicenseDocument itemVariants={itemVariants} />
        <VehicleRegistrationDocument itemVariants={itemVariants} />
        <MotorcycleRegistrationDocument itemVariants={itemVariants} />
        <ResidencePermitDocument itemVariants={itemVariants} />
        <StudentCardDocument itemVariants={itemVariants} />
        <HealthCardDocument itemVariants={itemVariants} />
      </Accordion>

      <DocumentFooter itemVariants={itemVariants} />
    </motion.div>
  );
};

