import React from "react";
import Hero from "./components/Hero";
import "./index.css";
import Page1 from "./components/Page1";
import Footer from "./components/footer/Footer";
import CardPage from "./components/card/CardPage";
import FormPage from "./components/form/FormPage";
import Solutions from "./components/solution/Solutions";
import Dev from "./components/deve/Dev";
import Latest from "./components/latest/Latest";
import Header from "./Header";

const Home = () => {
  return (
    <div className="relative">
      <div className="h-[100vh] w-[100vw]">
        <Hero />
      </div>
      <div className="main py-3 mx-auto max-w-[1700px]">
        <div className="header w-[100vw] pr-2">
          <Header />
          <Page1 />
          <Solutions />
          <Dev />
          <CardPage />
          <Latest />
        </div>
      </div>
      <div className="max-1700px mx-auto w-screen">
        <FormPage />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
