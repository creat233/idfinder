
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { SupportHeader } from "@/components/support/SupportHeader";
import { SupportCards } from "@/components/support/SupportCards";
import { ContactForm } from "@/components/support/ContactForm";
import { Faq } from "@/components/support/Faq";

const Support = () => {
  const supportEmail = "idfinder06@gmail.com";

  const handleContactSupport = () => {
    window.open(`mailto:${supportEmail}`, "_blank");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-white">
        <div className="container mx-auto py-12 px-4">
          <SupportHeader />
          
          <div className="max-w-3xl mx-auto">
            <SupportCards 
              supportEmail={supportEmail} 
              handleContactSupport={handleContactSupport} 
            />
            
            <ContactForm supportEmail={supportEmail} />
            
            <Faq />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Support;
