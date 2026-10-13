import Hero from "@/components/Hero";
import About from "@/components/About";
import Facts from "@/components/Facts";
import Skills from "@/components/Skills";
import Resume from "@/components/Resume";
import Portfolio from "@/components/Portfolio";
import Tools from "@/components/Tools";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <main id="main">
        <About />
        <Facts />
        <Skills />
        <Resume />
        <Portfolio />
        <Tools />
        <Testimonials />
        <Contact />
      </main>
    </>
  );
}
