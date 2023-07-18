import Image from "next/image";
import NavBar from "./nav";

import Draw from "./draw";

export default function Homepage() {
  return (
    <>
      <section className=" h-screen w-full bg-gray-900/50">
        {" "}
        <Image
          src={"/assets/images/solcitybg2.png"}
          alt={""}
          width={1000 * 4}
          height={1000 * 4}
          className="absolute -z-10 h-screen w-screen  bg-white   object-cover "
        />
        <Image
          src={"/assets/images/starbg1.png"}
          alt={""}
          width={1000 * 4}
          height={1000 * 4}
          className="absolute -z-10 ml-20 mt-20 h-10 w-10 animate-pulse object-cover "
        />
        <Image
          src={"/assets/images/starbg1.png"}
          alt={""}
          width={1000 * 4}
          height={1000 * 4}
          className="absolute -z-10 ml-40 mt-80 h-5 w-5 animate-bounce object-cover "
        />
        <Image
          src={"/assets/images/starbg2.png"}
          alt={""}
          width={1000 * 4}
          height={1000 * 4}
          className="absolute -z-10 ml-60 mt-64 h-5 w-5 animate-bounce overflow-hidden object-cover "
        />
        <Image
          src={"/assets/images/starbg2.png"}
          alt={""}
          width={1000 * 4}
          height={1000 * 4}
          className="absolute -z-10 ml-72 mt-20 h-10 w-10 animate-bounce overflow-hidden object-cover "
        />
        <Image
          src={"/assets/images/starbg2.png"}
          alt={""}
          width={1000 * 4}
          height={1000 * 4}
          className="absolute -z-10 ml-72 mt-96 h-10 w-10 animate-pulse overflow-hidden object-cover "
        />
        <Image
          src={"/assets/images/starbg2.png"}
          alt={""}
          width={1000 * 4}
          height={1000 * 4}
          className="absolute bottom-10 -z-10 ml-40 h-10 w-10 animate-pulse overflow-hidden object-cover "
        />
        <Image
          src={"/assets/images/starbg2.png"}
          alt={""}
          width={1000 * 4}
          height={1000 * 4}
          className="absolute bottom-6 -z-10 ml-12 h-5 w-5 animate-bounce overflow-hidden object-cover "
        />
        <Image
          src={"/assets/images/starbg1.png"}
          alt={""}
          width={1000 * 4}
          height={1000 * 4}
          className="absolute bottom-16 -z-10 ml-72 h-5 w-5 animate-bounce overflow-hidden object-cover "
        />
        <NavBar />
        <Draw />
      </section>
    </>
  );
}
