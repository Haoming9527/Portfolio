import { Intro } from "./components/Intro";
import { About } from "./components/About";
import { Technology } from "./components/Technology";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <div>
      <Intro />
      <About />
      <Technology />
    </div>
  );
}
