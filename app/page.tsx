import Home from "./components/landingPage/Home";
import About from "./components/landingPage/About";
import Dept from "./components/landingPage/Debt";
import Services from "./components/landingPage/Services";
import Contact from "./components/landingPage/Contact";
import Header from "./components/landingPage/Header";
import Footer from "./components/footer/Footer";

export default function Page() {
  return (
    <main>
      <Header />
      <Home />
      <About />
      <Dept />
      <Services />
      <Contact />
      <Footer />
    </main>
  );
}
