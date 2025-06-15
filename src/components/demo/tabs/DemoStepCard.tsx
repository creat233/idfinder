
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface Step {
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
}

interface DemoStepCardProps {
  step: Step;
  index: number;
  isLast: boolean;
}

export const DemoStepCard = ({ step, index, isLast }: DemoStepCardProps) => {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className="relative"
    >
      <Card className="h-full border-2 border-gray-100 hover:border-[#9b87f5] transition-all duration-300 hover:shadow-2xl group transform hover:-translate-y-2">
        <CardHeader className="text-center pb-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
              {step.icon}
            </div>
            {!isLast && (
              <div className="hidden lg:block absolute top-10 left-full w-8 h-0.5 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] opacity-30"></div>
            )}
          </div>
          <CardTitle className="text-xl font-bold text-gray-900 mb-2">
            {step.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center pt-0">
          <div className="mb-6">
            <img
              src={step.image}
              alt={step.title}
              className="w-full h-40 object-contain rounded-xl border border-gray-200 bg-gray-50 group-hover:bg-[#9b87f5]/5 transition-all duration-300"
            />
          </div>
          <CardDescription className="text-gray-600 text-base leading-relaxed">
            {step.description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
};
