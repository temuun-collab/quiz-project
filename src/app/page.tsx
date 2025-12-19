import { Container } from "./_component/Container";
import { Header } from "./_component/Header";
import { HistoryHeader } from "./_component/HistoryHeader";
export default async function Home() {
  return (
    <div className="w-screen h-screen flex flex-col bg-white justify-center items-center">
      <div className="w-[1440px] h-screen">
        <Header />
        <div className="flex w-[1440px]">
          <HistoryHeader />
          <div className="w-[1368px] h-[1080px] flex justify-center  bg-[#f8f8f8] border">
            <Container />
          </div>
        </div>
      </div>
    </div>
  );
}
