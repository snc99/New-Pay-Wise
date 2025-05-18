import Home from "../components/landing-page/Home";
import About from "../components/landing-page/About";
import Dept from "../components/landing-page/Debt";
import Services from "../components/landing-page/Services";
import Contact from "../components/landing-page/Contact";
import Header from "../components/landing-page/Header";
import Footer from "../components/footer/Footer";

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
