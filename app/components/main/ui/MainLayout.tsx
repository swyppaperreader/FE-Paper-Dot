import React from "react";
import SecondMainScreen from "../SecondMainScreen";
import MainTopScreenUi from "../MainTopScreenUi";
import ThirdMainScreen from "../ThirdMainScreen";
import ForthMainScreen from "../ForthMainScreen";
import FifthMainScreen from "../FifthMainScreen";
import Footer from "../../footer/Footer";
export default function MainLayout() {
  return (
    <>
      <MainTopScreenUi />
      <SecondMainScreen />
      <ThirdMainScreen />
      <ForthMainScreen />
      <FifthMainScreen />
      <Footer />
    </>
  );
}
