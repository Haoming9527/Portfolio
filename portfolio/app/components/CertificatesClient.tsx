"use client";

import Image from "next/image";
import { useState } from "react";
import { Certificate } from "../lib/interface";

interface CertificatesClientProps {
  certificates: Certificate[];
}

export default function CertificatesClient({ certificates }: CertificatesClientProps) {
  const [activeTag, setActiveTag] = useState<string>("General");
  const [filteredData, setFilteredData] = useState<Certificate[]>(
    certificates.filter(cert => (cert.tags || ["General"]).includes("General"))
  );
  const [modalImage, setModalImage] = useState<string>("");
  const [modalAlt, setModalAlt] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Define the order of tags 
  const tagOrder = ["General", "Programming & IT", "Cybersecurity"];
  
  // Collect all unique tags from the certificates and sort them according to the defined order
  const allTags = Array.from(
    new Set(
      certificates.flatMap(cert => cert.tags || ["General"])
    )
  ).sort((a, b) => {
    const aIndex = tagOrder.indexOf(a);
    const bIndex = tagOrder.indexOf(b);
    
    // If both tags are in the order array, sort by their position
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    
    // If only one tag is in the order array, prioritize it
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    
    // If neither tag is in the order array, sort alphabetically
    return a.localeCompare(b);
  });

  // Handle tag filtering
  const handleTagClick = (tag: string) => {
    setActiveTag(tag);
    if (tag === "General") {
      const generalCerts = certificates.filter((cert: Certificate) => 
        (cert.tags || ["General"]).includes("General")
      );
      setFilteredData(generalCerts);
    } else {
      const filteredCerts = certificates.filter((cert: Certificate) => 
        (cert.tags || []).includes(tag)
      );
      setFilteredData(filteredCerts);
    }
  };

  // Handle certificate card click
  const handleCertificateClick = (image: string, title: string) => {
    setModalImage(image);
    setModalAlt(title);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage("");
    setModalAlt("");
  };

  return (
    <>
      {/* Tag Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 border-2 text-sm ${
              activeTag === tag
                ? "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white border-transparent shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 grid-cols-1">
        {filteredData.map((cert, index) => (
                     <div
             key={cert._id}
             onClick={() => handleCertificateClick(cert.imageUrl || "", cert.title || "")}
             className="group block bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-500 cursor-pointer"
             style={{ animationDelay: `${index * 100}ms` }}
           >
            <div className="aspect-[4/3] overflow-hidden rounded-2xl relative mb-6">
              {cert.imageUrl ? (
                <Image
                  src={cert.imageUrl}
                  alt={cert.title || "Certificate Image"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out rounded-2xl"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">Certificate</span>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {cert.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                {cert.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {cert.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/30 px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

             {/* Certificate Image Modal */}
       {isModalOpen && modalImage && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
           <div className="relative max-w-5xl w-full">
                           <button 
                onClick={closeModal}
                className="absolute -top-10 right-0 text-white hover:text-red-400 text-2xl transition-colors" 
                aria-label="Close large certificate view"
              >
                ✕
              </button>
                            <Image
                 src={modalImage}
                 alt={modalAlt || "Certificate Image"}
                 width={1200}
                 height={900}
                 className="w-full h-auto max-h-[85vh] object-contain rounded-lg bg-gray-100 dark:bg-gray-800"
               />
           </div>
         </div>
       )}
     </>
   );
 }
