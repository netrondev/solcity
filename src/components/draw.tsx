import Image from "next/image";
import { useEffect, useState } from "react";

export default function Draw() {
  const [days, setdays] = useState(0);
  const [houers, sethouers] = useState(0);
  const [minutes, setminutes] = useState(0);
  const [seconds, setseconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const futureDate = new Date("2023-07-20T16:00:00");
      const diff = futureDate.getTime() - date.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const houers = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setdays(days);
      sethouers(houers);
      setminutes(minutes);
      setseconds(seconds);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div className="relative mx-auto    max-w-2xl object-cover pt-1 sm:pt-[600px] md:pt-[600px] lg:pt-[600px] xl:pt-[600px] ">
        <div className="mx-auto    items-center ">
          <h1 className=" xs:text-base md-text-lg lg-text-xl xl-text-xl relative  m-5 pt-16 text-center text-base font-extrabold tracking-tight text-green-400 sm:text-lg">
            Prize Pot
            <div className="-z-10 flex   h-14 rounded-lg border-4 border-white bg-indigo-400 p-2 md:h-20 md:pt-3">
              <Image
                src={"/assets/images/solanacoin.png"}
                alt={""}
                width={800 * 4}
                height={600 * 4}
                className=" xs:h-8 xs:w-8 h-8 w-8 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14 "
              />
              <div className="sm:text-1xl xl-text-5xl h-16  w-full  pl-2 text-left text-xl md:text-2xl lg:text-3xl ">
                pot amount.sol
              </div>
            </div>
            <div className="mx-auto p-5 font-sans text-7xl text-white">
              <div>SOLANA</div>
              <div>LOTTERY</div>
            </div>
            <div className="mx-auto flex h-20  rounded-lg border-4 border-white bg-indigo-400 p-1 text-white">
              <div className="w-full text-center text-6xl">
                {days}:{houers}:{minutes}:{seconds}
              </div>
            </div>
            <div className=" h-full p-5 text-3xl text-white">
              Till Next Draw
            </div>
          </h1>
        </div>
      </div>
    </>
  );
}
