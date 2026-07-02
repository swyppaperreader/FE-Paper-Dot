import SecondMainScreen from "@/app/components/home/SecondMainScreen";
import MainTopScreenUi from "@/app/components/home/MainTopScreenUi";
import ThirdMainScreen from "@/app/components/home/ThirdMainScreen";
import FourthMainScreen from "@/app/components/home/FourthMainScreen";
import FifthMainScreen from "@/app/components/home/FifthMainScreen";

export default function MainLayout() {
  return (
    <>
      <MainTopScreenUi />
      <SecondMainScreen />
      <ThirdMainScreen />
      <FourthMainScreen />
      <FifthMainScreen />
    </>
  );
}
