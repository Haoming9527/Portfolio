"use client";

import Image from "next/image";
import { useState } from "react";
import { Certificate } from "../lib/interface";

interface CertificatesClientProps {
  certificates: Certificate[];
}

export default function CertificatesClient({ certificates }: CertificatesClientProps) {
  const [activeTag, setActiveTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredData, setFilteredData] = useState<Certificate[]>(certificates);
  const [modalImage, setModalImage] = useState<string>("");
  const [modalAlt, setModalAlt] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Define the order of tags 
  const tagOrder = ["All", "Programming", "Design", "IT", "Cybersecurity", "AI", "FinTech", "Hackathon", "Leadership", "Others"];
  
  // Collect all unique tags from the certificates and sort them according to the defined order
  const allTags = ["All", ...Array.from(
    new Set(
      certificates.flatMap(cert => cert.tags || [])
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
  })];

  // Filter certificates based on tag and search query
  const filterCertificates = (tag: string, query: string) => {
    let filtered = certificates;
    
    // Filter by tag
    if (tag !== "All") {
      filtered = filtered.filter((cert: Certificate) => 
        (cert.tags || []).includes(tag)
      );
    }
    
    // Filter by search query
    if (query.trim()) {
      filtered = filtered.filter((cert: Certificate) => 
        (cert.title?.toLowerCase().includes(query.toLowerCase()) || false) ||
        (cert.description?.toLowerCase().includes(query.toLowerCase()) || false)
      );
    }
    
    return filtered;
  };

  // Handle tag filtering
  const handleTagClick = (tag: string) => {
    setActiveTag(tag);
    const filtered = filterCertificates(tag, searchQuery);
    setFilteredData(filtered);
    setIsFilterOpen(false); // Close mobile filter menu
  };

  // Handle search input
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const filtered = filterCertificates(activeTag, query);
    setFilteredData(filtered);
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
      {/* Filter Section */}
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">

        {/* Desktop Search Bar */}
        <div className="hidden sm:block mb-8">
          <div className="max-w-lg mx-auto">
            <div className="relative group p-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl hover:from-blue-500/30 hover:via-purple-500/30 hover:to-indigo-500/30 transition-all duration-300">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder={`Search in ${activeTag === "All" ? "all certificates" : activeTag}...`}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border-0 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-base font-medium"
              />
            </div>
          </div>
        </div>

        {/* Desktop Filter */}
        <div className="hidden sm:block">
          <div className="flex flex-wrap justify-center gap-3">
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
        </div>

      </div>

      {/* Mobile Search Bar and Filter */}
      <div className="sm:hidden flex items-center gap-3 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        {/* Mobile Filter Button */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center justify-center gap-1 w-12 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 border-transparent"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <svg className={`w-3 h-3 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Mobile Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative group p-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-xl hover:from-blue-500/30 hover:via-purple-500/30 hover:to-indigo-500/30 transition-all duration-300">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={`Search in ${activeTag === "All" ? "all certificates" : activeTag}...`}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border-0 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Dropdown */}
      {isFilterOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-lg mb-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-wrap justify-center gap-3">
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
        </div>
      )}
      
      <div className="grid md:grid-cols-3 gap-8 grid-cols-1">
        {filteredData.map((cert, index) => (
                     <div
             key={cert._id}
             onClick={() => handleCertificateClick(cert.imageUrl || "", cert.title || "")}
             className="group block bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-500 cursor-pointer"
             style={{ animationDelay: `${index * 100}ms` }}
           >
            <div className="aspect-[3/4] md:aspect-[4/3] overflow-hidden rounded-2xl relative mb-6 bg-gray-50 dark:bg-gray-800">
              {cert.imageUrl ? (
                <Image
                  src={cert.imageUrl}
                  alt={cert.title || "Certificate Image"}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-500 ease-in-out rounded-2xl"
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
              <div className="flex flex-wrap gap-2">
                {cert.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/30 px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                {cert.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && modalImage && (
        <div
          className="fixed inset-0 z-[1000] flex items-start justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto pt-20"
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-[1010] text-white hover:text-red-400 text-3xl font-bold transition-all md:top-6 md:right-6"
            aria-label="Close large certificate view"
          >
            ✕
          </button>
          <div
            className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden
                      flex flex-col md:flex-row-reverse items-stretch
                      animate-in fade-in slide-in-from-bottom-4 duration-300
                      mt-0 md:mt-0
                      max-h-[85vh] sm:max-h-[80vh]"
          >
            <div className="w-full md:w-2/3 flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-4 md:p-6">
              <div className="relative w-full flex items-center justify-center h-[50vh] sm:h-[60vh] md:h-[78vh]">
                <Image
                  src={modalImage}
                  alt={modalAlt || 'Certificate Image'}
                  width={1200}
                  height={900}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-md transition-transform duration-300"
                  priority
                />
              </div>
            </div>
            <div className="w-full md:w-1/3 p-4 sm:p-6 md:p-10 flex flex-col justify-center text-center md:text-left overflow-y-auto max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh]">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                {modalAlt}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                {filteredData.find(cert => cert.title === modalAlt)?.description}
              </p>
            </div>
          </div>
        </div>
      )}
     </>
   );
 }
