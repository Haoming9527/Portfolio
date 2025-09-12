import { Intro } from "./components/Intro";
import { About } from "./components/About";
import { Technology } from "./components/Technology";

export default function Home() {
  return (
    <div>
      <Intro />
      <About />
      <Technology />
    </div>
  );
}
