import { Container } from "./_component/Container";
import { HistoryHeader } from "./_component/HistoryHeader";

export default async function Home() {
  return (
    <div className="flex w-[1440px]">
      <HistoryHeader />
      <div className="w-[1368px] h-[1080px] flex justify-center  bg-[#f8f8f8] border">
        <Container />
      </div>
    </div>
  );
}
