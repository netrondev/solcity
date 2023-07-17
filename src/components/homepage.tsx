import Image from "next/image";
import NavBar from "./nav";
import Loading from "./loading";
import Draw from "./draw";
import Landing from "~/pages/landing";

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
