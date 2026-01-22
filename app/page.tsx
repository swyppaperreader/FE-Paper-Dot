import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import MainLayout from "./components/main/ui/MainLayout";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <MainLayout />
      {/* <Footer /> */}
    </main>
  );
}
