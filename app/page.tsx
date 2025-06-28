import HomeHero from "@/components/home/hero";
import Image from "next/image";
import Features from "@/components/home/features"
import AboutUs from "@/components/home/aboutUs";
import CustomerReviews from "@/components/home/customerReviews";

export default function Home() {
  return (
    <div className="pt-[90px] ">

      <HomeHero/>

      <Features/>

      <AboutUs/>


      <CustomerReviews/>


      















    </div>
  );
}
