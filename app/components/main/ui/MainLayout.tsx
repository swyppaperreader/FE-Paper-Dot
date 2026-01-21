import React from "react";
import SecondMainScreen from "../SecondMainScreen";
import MainTopScreenUi from "../MainTopScreenUi";
import ThirdMainScreen from "../ThirdMainScreen";

export default function MainLayout() {
  return (
    <>
      <MainTopScreenUi />
      <SecondMainScreen />
      <ThirdMainScreen />
    </>
  );
}
