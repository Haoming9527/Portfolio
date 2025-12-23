"use client";

import { useState, useEffect } from "react";
import { useCli } from "./CliContext";
import { getProjects } from "../../actions/getProjects";
import { getCertificates } from "../../actions/getCertificates";
import { ProjectsCard, Certificate } from "../../lib/interface";
import { getAvailableGames, getGame } from "./games/registry";


const FILESYSTEM: Record<string, string[]> = {
  "/": ["home"],
  "/home": ["haoming"],
  "/home/haoming": ["projects", "certificates", "experience", "about.md", "contact.txt"],
  "/home/haoming/projects": [], 
  "/home/haoming/certificates": [],
};

const COMMANDS_HELP = [
  "help        - Show this help message",
  "about       - Display information about me",
  "projects    - List or view projects",
  "experience  - View experience",
  "certificates- View certificates",
  "contact     - View contact information",
  "clear       - Clear the terminal screen",
  "ls          - List directory contents",
  "cd <dir>    - Change directory",
  "pwd         - Print working directory",
  "open <link> - Open external links (github, linkedin, resume)",
  "matrix      - Toggle Matrix rain effect",
  "game        - Play games",
];

const EXTERNAL_LINKS: Record<string, string> = {
  github: "https://github.com/Haoming9527",
  linkedin: "https://www.linkedin.com/in/shen-haoming/",
  resume: "/resume.pdf", 
  email: "mailto:lbb54188@gmail.com",
};

export function useCliLogic() {
  const { closeCli } = useCli();
  
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>(["Welcome to Shen Haoming's CLI", "Type 'help' to see available commands."]);
  const [currentPath, setCurrentPath] = useState("/home/haoming");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);


  const [projectsData, setProjectsData] = useState<ProjectsCard[] | null>(null);
  const [certificatesData, setCertificatesData] = useState<Certificate[] | null>(null);
  const [activePrompt, setActivePrompt] = useState<{ callback: (ans: string) => void } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMatrix, setIsMatrix] = useState(false);
  const [activeGame, setActiveGame] = useState<string | null>(null);


  const promptLabel = activePrompt ? "> " : `${currentPath} $ `;


  useEffect(() => {
     if (projectsData) {
         const slugs = projectsData.map(p => p.title.toLowerCase().replace(/\s+/g, '-'));
         FILESYSTEM["/home/haoming/projects"] = slugs;
     }
     if (certificatesData) {
         const slugs = certificatesData.map(c => c.title.toLowerCase().replace(/\s+/g, '-'));
         FILESYSTEM["/home/haoming/certificates"] = slugs;
     }
  }, [projectsData, certificatesData]);

  const addToHistory = (lines: string[]) => {
    setHistory((prev) => [...prev, ...lines]);
  };

  const ensureProjectsLoaded = async (): Promise<ProjectsCard[]> => {
      if (projectsData) return projectsData;

      setIsLoading(true);
      try {
          const data = await getProjects();
          
          setProjectsData(data);
          
          const slugs = data.map(p => p.title.toLowerCase().replace(/\s+/g, '-'));
          FILESYSTEM["/home/haoming/projects"] = slugs; 
          
          return data;
      } catch {
          addToHistory(["Error fetching projects. Please check your network or try again later."]);
          return [];
      } finally {
          setIsLoading(false);
      }
  };

  const ensureCertificatesLoaded = async (): Promise<Certificate[]> => {
      if (certificatesData) return certificatesData;

      setIsLoading(true);
      try {
          const data = await getCertificates();
          setCertificatesData(data);
          
          const slugs = data.map(c => c.title.toLowerCase().replace(/\s+/g, '-'));
          FILESYSTEM["/home/haoming/certificates"] = slugs; 
          
          return data;
      } catch {
          addToHistory(["Error fetching certificates."]);
          return [];
      } finally {
          setIsLoading(false);
      }
  };

  const handleCommand = async (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed && !activePrompt) return;


    if (activePrompt) {
        setHistory((prev) => [...prev, `${promptLabel}${trimmed}`]); // User answer with prompt prefix
        const cb = activePrompt.callback;
        setActivePrompt(null); // Clear prompt
        cb(trimmed);
        return;
    }

    setHistory((prev) => [...prev, `${promptLabel}${trimmed}`]);
    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case "help":
        addToHistory(COMMANDS_HELP);
        break;
      
      case "clear":
        setHistory([]);
        break;

      case "about":
        addToHistory([
          "Shen Haoming - Software Developer",
          "Passionate about Full Stack Development, Software Engineering, and AI.",
          "Based in Singapore.",
        ]);
        break;

      case "pwd":
        addToHistory([currentPath]);
        break;

      case "ls":
        // dynamic check for projects/certificates
        if (currentPath === "/home/haoming/projects" && !projectsData) {
            const data = await ensureProjectsLoaded();
            const names = data.map(p => p.title.toLowerCase().replace(/\s+/g, '-'));
            addToHistory(names.length > 0 ? names : ["(empty)"]);
        } else if (currentPath === "/home/haoming/certificates" && !certificatesData) {
            const data = await ensureCertificatesLoaded();
            const names = data.map(c => c.title.toLowerCase().replace(/\s+/g, '-'));
            addToHistory(names.length > 0 ? names : ["(empty)"]);
        } else {
            const contents = FILESYSTEM[currentPath] || [];
            addToHistory(contents.length > 0 ? contents : ["(empty)"]);
        }
        break;

      case "cd":
        const target = args[0];
        if (!target || target === "~") {
            setCurrentPath("/home/haoming");
        } else if (target === "..") {
            const parent = currentPath.split("/").slice(0, -1).join("/") || "/";
            if (currentPath === "/") addToHistory(["Already at root."]);
            else setCurrentPath(parent);
        } else {
            const potentialPath = currentPath === "/" ? `/${target}` : `${currentPath}/${target}`;
            if (potentialPath === "/home/haoming/projects" && !projectsData) {
                 await ensureProjectsLoaded(); 
                 setCurrentPath(potentialPath);
            } else if (FILESYSTEM[potentialPath]) {
                setCurrentPath(potentialPath);
            } else {
                addToHistory([`cd: no such file or directory: ${target}`]);
            }
        }
        break;

      case "open":
        const linkKey = args[0]?.toLowerCase();
        if (EXTERNAL_LINKS[linkKey]) {
            addToHistory([`Opening ${linkKey}...`]);
            window.open(EXTERNAL_LINKS[linkKey], "_blank");
        } else {
            addToHistory([`Unknown link: ${linkKey}. Try: github, linkedin, resume, email`]);
        }
        break;
      
      case "sudo":
        if (args[0] === "hire" && args[1] === "haoming") {
           addToHistory(["Permission granted.", "Welcome to the team!"]);
        } else {
           addToHistory(["user is not in the sudoers file. This incident will be reported."]);
        }
        break;
        
      case "whoami":
         addToHistory(["Shen Haoming - Software Developer", "Access Level: ADMIN"]);
         break;

      case "projects":
         const data = await ensureProjectsLoaded();
         if (args[0]) {
             // Look for specific project
             const querySlug = args[0].toLowerCase();
             const project = data.find(p => p.title.toLowerCase().replace(/\s+/g, '-') === querySlug || p.title.toLowerCase().includes(querySlug));
             
             if (project) {
                 addToHistory([
                     `Title: ${project.title}`,
                     `Stack: ${project.tags.join(", ")}`,
                     `----------------------------------`,
                     project.description,
                     `----------------------------------`,
                     `Do you want to open the project link? (y/n)`
                 ]);
                 // Set Prompt
                 // Set Prompt with strict validation
                 const promptCallback = (ans: string) => {
                     const lower = ans.trim().toLowerCase();
                     if (['y', 'yes'].includes(lower)) {
                         addToHistory([`Opening ${project.title}...`]);
                         window.open(project.link, "_blank");
                     } else if (['n', 'no'].includes(lower)) {
                         addToHistory(["Action cancelled."]);
                     } else {
                         addToHistory(["Invalid input. Please answer 'y' or 'n'."]);
                         setActivePrompt({ callback: promptCallback });
                     }
                 };
                 
                 setActivePrompt({ callback: promptCallback });
             } else {
                 addToHistory([`Project '${args[0]}' not found.`]);
             }
         } else {
             // List all
             const names = data.map(p => p.title.toLowerCase().replace(/\s+/g, '-'));
             addToHistory(["Available Projects:", ...names.map(n => `> ${n}`), "(Type 'projects <name>' for details)"]);
         }
         break;

       case "certificates":
          const certs = await ensureCertificatesLoaded();
          if (args[0]) {
             const querySlug = args[0].toLowerCase();
             const cert = certs.find(c => c.title.toLowerCase().replace(/\s+/g, '-') === querySlug || c.title.toLowerCase().includes(querySlug));
             
             if (cert) {
                 addToHistory([
                     `Title: ${cert.title}`,
                     `Tags: ${cert.tags?.join(", ") || 'None'}`,
                     `----------------------------------`,
                     cert.description,
                     `----------------------------------`,
                     `Do you want to open the certificate link? (y/n)`
                 ]);
                 
                 const promptCallback = (ans: string) => {
                     const lower = ans.trim().toLowerCase();
                     if (['y', 'yes'].includes(lower)) {
                         const url = `/certificates?id=${cert._id}`;
                         addToHistory([`Opening certificate details...`]);
                         window.open(url, "_blank");
                     } else if (['n', 'no'].includes(lower)) {
                         addToHistory(["Action cancelled."]);
                     } else {
                         addToHistory(["Invalid input. Please answer 'y' or 'n'."]);
                         setActivePrompt({ callback: promptCallback });
                     }
                 };

                 setActivePrompt({ callback: promptCallback });
             } else {
                 addToHistory([`Certificate '${args[0]}' not found.`]);
             }
         } else {
             const names = certs.map(c => c.title.toLowerCase().replace(/\s+/g, '-'));
             addToHistory(["Achievements:", ...names.map(n => `> ${n}`), "(Type 'certificates <name>' for details)"]);
         }
         break;

       case "experience":
          addToHistory(["Navigating to /experience..."]);
          window.open('/experience', '_blank');
          break;

       case "contact":
          addToHistory([
              "Contact Information:",
              "----------------------------------",
              "Email:    lbb54188@gmail.com",
              "Phone:    +65 8761 3426",
              "Location: Singapore",
              "----------------------------------",
          ]);
          break;

      case "exit":
        closeCli();
        break;

      case "matrix":
         if (isMatrix) {
             setIsMatrix(false);
             addToHistory(["Disabling the Matrix..."]);
         } else {
             setIsMatrix(true);
             addToHistory(["Wake up, Neo..."]);
         }
         break;

       case "game":
          const avail = getAvailableGames();
          if (args[0] && avail.includes(args[0])) {
              setActiveGame(args[0]);
              addToHistory([`Starting ${args[0]}...`]);
          } else {
              const list = avail.map(id => {
                  const g = getGame(id);
                  return `> ${id.padEnd(8)} - ${g?.description || ''}`;
              });
              addToHistory(["Available Games:", ...list, `(Type 'game <name>' to play)`]);
          }
          break;

      default:
        addToHistory([`Command not found: ${cmd}. Type 'help' for list.`]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (activeGame) return; 

    if (e.key === "Enter") {
        handleCommand(input);
        setInput("");
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIndex < cmdHistory.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setInput(cmdHistory[cmdHistory.length - 1 - newIndex]);
        }
    } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setInput(cmdHistory[cmdHistory.length - 1 - newIndex]);
        } else if (historyIndex === 0) {
            setHistoryIndex(-1);
            setInput("");
        }
    } else if (e.key === "Tab") {

        e.preventDefault();
        const common = ["help", "clear", "ls", "cd", "projects", "about", "whoami", "sudo", "experience", "certificates", "contact", "open", "matrix", "game"];
        const match = common.find(c => c.startsWith(input));
        if (match) setInput(match);
    }
  };

  return {
    input,
    setInput,
    history,
    currentPath,
    handleKeyDown,
    isLoading,
    promptLabel,
    isMatrix,
    activeGame,
    setActiveGame
  };
}
