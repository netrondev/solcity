import Image from "next/image";
import NavBar from "./nav";

import Draw from "./draw";

export default function Homepage() {
  return (
    <>
      <section className=" h-screen w-full bg-gray-900/50">
        {" "}
        <Image
          src={"/assets/images/solcitybg.png"}
          alt={""}
          width={800 * 4}
          height={600 * 4}
          className="absolute -z-10 h-screen w-screen  bg-white   object-cover "
        />
        <NavBar />
        <Draw />
      </section>
    </>
  );
}
