"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef, useMemo, useDeferredValue } from "react";
import { Certificate } from "../lib/interface";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Folder, FolderOpen, ChevronLeft } from "lucide-react";

interface CertificatesClientProps {
  certificates: Certificate[];
}

interface FolderItem {
  type: "folder";
  company: string;
  certificates: Certificate[];
  orderRank: string;
  previewImages: string[];
}

interface CertificateItem {
  type: "certificate";
  certificate: Certificate;
  orderRank: string;
}

type DisplayItem = FolderItem | CertificateItem;

export default function CertificatesClient({
  certificates,
}: CertificatesClientProps) {
  const [activeTag, setActiveTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const [modalImage, setModalImage] = useState<string>("");
  const [modalAlt, setModalAlt] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const contentTopRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const certificatesRef = useRef(certificates);

  useEffect(() => {
    certificatesRef.current = certificates;
  }, [certificates]);

  useEffect(() => {
    if (activeFolder && contentTopRef.current) {
        setTimeout(() => {
            contentTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    }
  }, [activeFolder]);

  const tagOrder = useMemo(() => [
    "All",
    "Programming",
    "Design",
    "IT",
    "Cybersecurity",
    "AI",
    "FinTech",
    "Hackathon",
    "Leadership",
    "Others",
  ], []);

  const allTags = useMemo(() => [
    "All",
    ...Array.from(
      new Set(certificates.flatMap((cert) => cert.tags || []))
    ).sort((a, b) => {
      const aIndex = tagOrder.indexOf(a);
      const bIndex = tagOrder.indexOf(b);

      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    }),
  ], [certificates, tagOrder]);

  const filteredData = useMemo(() => {
    let filtered = certificates;

    if (activeTag !== "All") {
      filtered = filtered.filter((cert: Certificate) =>
        (cert.tags || []).includes(activeTag)
      );
    }

    if (deferredSearchQuery.trim()) {
      const lowerQuery = deferredSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (cert: Certificate) =>
          cert.title?.toLowerCase().includes(lowerQuery) ||
          cert.description?.toLowerCase().includes(lowerQuery) ||
          cert.company?.toLowerCase().includes(lowerQuery)
      );
    }

    return filtered;
  }, [certificates, activeTag, deferredSearchQuery]);

  const createFoldersAndItems = useCallback((certs: Certificate[]) => {
    const grouped: { [key: string]: Certificate[] } = {};
    const ungrouped: Certificate[] = [];

    certs.forEach((cert) => {
      if (!cert.orderRank) cert.orderRank = "";

      if (cert.company && cert.company.trim()) {
        if (!grouped[cert.company]) {
          grouped[cert.company] = [];
        }
        grouped[cert.company].push(cert);
      } else {
        ungrouped.push(cert);
      }
    });

    const folders: FolderItem[] = Object.entries(grouped)
      .filter(([, certificates]) => certificates.length > 1)
      .map(([company, certificates]) => {
        const sortedCerts = certificates.sort((a, b) => 
          (a.orderRank || "").localeCompare(b.orderRank || "")
        );
        
        const folderRank = sortedCerts[0]?.orderRank || "";

        return {
          type: "folder" as const,
          company,
          certificates: sortedCerts,
          orderRank: folderRank,
          previewImages: sortedCerts
            .slice(0, 3)
            .map((cert) => cert.imageUrl)
            .filter(Boolean),
        };
      });

    const singleCompanyCerts = Object.entries(grouped)
      .filter(([, certificates]) => certificates.length === 1)
      .flatMap(([, certificates]) => certificates);

    const allIndividualCerts = [...ungrouped, ...singleCompanyCerts];

    const allItems: DisplayItem[] = [
      ...folders,
      ...allIndividualCerts.map((cert) => ({
        type: "certificate" as const,
        certificate: cert,
        orderRank: cert.orderRank || "",
      })),
    ].sort((a, b) => (a.orderRank || "").localeCompare(b.orderRank || ""));

    return { allItems, folders };
  }, []);

  const { allItems, folders } = useMemo(() => createFoldersAndItems(filteredData), [filteredData, createFoldersAndItems]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalImage("");
    setModalAlt("");

    const params = new URLSearchParams(searchParams);
    params.delete("id");
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, replace]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const cert = certificatesRef.current.find((c) => c._id === id);
      if (cert) {
        setModalImage(cert.imageUrl);
        setModalAlt(cert.title);
        setIsModalOpen(true);
      }
    }
  }, [searchParams]);

  const handleTagClick = (tag: string) => {
    setActiveTag(tag);
    setActiveFolder(null); 
    setIsFilterOpen(false);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query) setActiveFolder(null);
  };

  const handleCertificateClick = (cert: Certificate) => {
    setModalImage(cert.imageUrl);
    setModalAlt(cert.title);
    setIsModalOpen(true);

    const params = new URLSearchParams(searchParams);
    params.set("id", cert._id);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const openFolder = (company: string) => {
    setActiveFolder(company);
  };

  const backToRoot = () => {
    setActiveFolder(null);
  };

  return (
    <>
      <div className="mb-8">
        <div className="hidden sm:block mb-8">
          <div className="max-w-lg mx-auto">
            <div className="relative group p-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl hover:from-blue-500/30 hover:via-purple-500/30 hover:to-indigo-500/30 transition-all duration-300">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
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

      <div className="sm:hidden flex items-center gap-3 mb-12">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center justify-center gap-1 w-12 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 border-transparent"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <svg className={`w-3 h-3 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="flex-1 max-w-md">
          <div className="relative group p-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-xl hover:from-blue-500/30 hover:via-purple-500/30 hover:to-indigo-500/30 transition-all duration-300">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={`Search...`}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border-0 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-sm font-medium"
            />
          </div>
        </div>
      </div>

      {isFilterOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-lg mb-8">
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

      {(() => {
        if (allItems.length === 0) {
            return (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No certificates found</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                        We couldn&apos;t find any certificates matching &quot;{searchQuery}&quot; in {activeTag}. Try adjusting your search or filter.
                    </p>
                    <button
                        onClick={() => {
                            setActiveTag("All");
                        }}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                        Clear filters
                    </button>
                </div>
            );
        }

        const currentFolder = activeFolder 
          ? folders.find(f => f.company === activeFolder) 
          : null;

        if (currentFolder) {
          return (
            <div ref={contentTopRef} className="space-y-6 scroll-mt-24">
              <button
                onClick={backToRoot}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to all certificates
              </button>
              
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
                 <FolderOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                   {currentFolder.company}
                 </h2>
                 <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                   {currentFolder.certificates.length} items
                 </span>
              </div>

              <div className="grid md:grid-cols-3 gap-8 grid-cols-1">
                {currentFolder.certificates.map((cert) => (
                  <div
                    key={cert._id}
                    onClick={() => handleCertificateClick(cert)}
                    className="group block bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 cursor-pointer"
                    // Removed animation delay
                  >
                    <CertificateCard cert={cert} />
                  </div>
                ))}
              </div>
            </div>
          );
        } else {
          return (
            <div className="grid md:grid-cols-3 gap-8 grid-cols-1">
              {allItems.map((item) => {
                if (item.type === "folder") {
                  return (
                    <div
                      key={`folder-${item.company}`}
                      onClick={() => openFolder(item.company)}
                      className="group block bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 cursor-pointer"
                      // Removed animation delay
                    >
                      <FolderCard folder={item} />
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={item.certificate._id}
                      onClick={() => handleCertificateClick(item.certificate)}
                      className="group block bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 cursor-pointer"
                      // Removed animation delay
                    >
                      <CertificateCard cert={item.certificate} />
                    </div>
                  );
                }
              })}
            </div>
          );
        }
      })()}

      {isModalOpen && modalImage && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto pt-20">
          <div className="absolute top-4 left-4 z-[1010] md:top-6 md:left-6">
            <button
              onClick={handleShare}
              className="group flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all duration-300"
              title="Copy link to clipboard"
            >
              {showCopiedToast ? (
                <>
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span className="text-sm font-medium">Share</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-[1010] text-white hover:text-red-400 text-3xl font-bold transition-all md:top-6 md:right-6"
            aria-label="Close large certificate view"
          >
            ✕
          </button>

          <div className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse items-stretch mt-0 md:mt-0 max-h-[85vh] sm:max-h-[80vh]">
            <div className="w-full md:w-2/3 flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-4 md:p-6">
              <div className="relative w-full flex items-center justify-center h-[50vh] sm:h-[60vh] md:h-[78vh]">
                <Image
                  src={modalImage}
                  alt={modalAlt || "Certificate Image"}
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
                {filteredData.find((cert) => cert.title === modalAlt)?.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FolderCard({ folder }: { folder: FolderItem }) {
  const firstCert = folder.certificates[0];
  const isLandscape = firstCert?.dimensions ? firstCert.dimensions.width > firstCert.dimensions.height : true;

  return (
    <>
      <div className={`${isLandscape ? 'aspect-[4/3]' : 'aspect-[3/4]'} md:aspect-[4/3] overflow-hidden rounded-2xl relative mb-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20`}>
        <div className="relative w-full h-full p-4 flex items-center justify-center">
          {folder.previewImages.length > 0 ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {folder.previewImages
                .slice(0, 3)
                .map((imageUrl: string, index: number) => (
                  <div
                    key={index}
                    className="absolute w-[80%] h-[80%] bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-300 dark:border-gray-600 transition-transform duration-300"
                    style={{
                      transform: `translate(${index * 15}px, ${-index * 15}px) scale(${1 - index * 0.05})`,
                      zIndex: 3 - index,
                    }}
                  >
                    {index === 0 && (
                      <div className="relative w-full h-full"> 
                        <Image
                          src={imageUrl}
                          alt="Certificate preview"
                          fill
                          className="object-contain rounded-xl p-2"
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Folder className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {folder.company}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {folder.company}
            </h2>
          </div>
          <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-sm font-medium">
            {folder.certificates.length}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            Array.from(
              new Set(
                folder.certificates.flatMap(
                  (cert: Certificate) => cert.tags || []
                )
              )
            ) as string[]
          )
            .slice(0, 3)
            .map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/30 px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
              >
                {tag}
              </span>
            ))}
          {Array.from(
            new Set(
              folder.certificates.flatMap(
                (cert: Certificate) => cert.tags || []
              )
            )
          ).length > 3 && (
            <span className="inline-flex items-center rounded-full bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
              +
              {Array.from(
                new Set(
                  folder.certificates.flatMap(
                    (cert: Certificate) => cert.tags || []
                  )
                )
              ).length - 3}
            </span>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
          {folder.certificates.length} certificate
          {folder.certificates.length !== 1 ? "s" : ""} from {folder.company}
        </p>
      </div>
    </>
  );
}

function CertificateCard({ cert }: { cert: Certificate }) {
  const isLandscape = cert.dimensions ? cert.dimensions.width > cert.dimensions.height : true;

  return (
    <>
      <div className={`${isLandscape ? 'aspect-[4/3]' : 'aspect-[3/4]'} md:aspect-[4/3] overflow-hidden rounded-2xl relative mb-6 bg-gray-50 dark:bg-gray-800`}>
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
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                Certificate
              </span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {cert.title}
        </h2>

        {cert.company && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {cert.company}
            </span>
          </div>
        )}

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

        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
          {cert.description}
        </p>
      </div>
    </>
  );
}
