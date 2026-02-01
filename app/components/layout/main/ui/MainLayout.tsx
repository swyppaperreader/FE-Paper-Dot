import dynamic from "next/dynamic";
import MainTopScreenUi from "../MainTopScreenUi";

const SecondMainScreen = dynamic(() => import("../SecondMainScreen"), {
  ssr: true,
});
const ThirdMainScreen = dynamic(() => import("../ThirdMainScreen"), {
  ssr: true,
});
const ForthMainScreen = dynamic(() => import("../ForthMainScreen"), {
  ssr: true,
});
const FifthMainScreen = dynamic(() => import("../FifthMainScreen"), {
  ssr: true,
});

export default function MainLayout() {
  return (
    <>
      <MainTopScreenUi />
      <SecondMainScreen />
      <ThirdMainScreen />
      <ForthMainScreen />
      <FifthMainScreen />
    </>
  );
}
