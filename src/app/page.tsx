import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <Header/>
      <div>
        <Hero/>
        <Features/>
      </div>
      <Footer/>
    </>
  );
}
