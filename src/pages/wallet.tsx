import Image from "next/image";
import Link from "next/link";
import NavBar from "~/components/nav";

export default function Wallet() {
  return (
    <>
      <section className=" h-screen w-full bg-gray-900/50 ">
        {" "}
        <Image
          src={"/assets/images/solcitybg.png"}
          alt={""}
          width={800 * 4}
          height={600 * 4}
          className="absolute -z-10 h-screen w-screen  bg-white   object-cover "
        />
        <NavBar />
        <div className="relative mx-auto  p-4 pt-32     ">
          <div className="mx-auto mt-20  max-w-5xl items-center rounded-lg bg-gray-200  p-5 text-center shadow-lg ">
            <div className=" text-3xl font-bold text-blue-600">Wallet</div>
            <div className="flex w-full max-w-5xl gap-5 p-2 pt-2">
              <div className="w-full rounded-lg bg-white pb-5 shadow-lg">
                <div className="rounded-t-lg border border-b-gray-300 border-l-white border-r-white border-t-white p-2 text-xl">
                  wallet Balance
                </div>
                <div className="border border-b-gray-300 border-l-white border-r-white border-t-white p-2 text-left text-xl text-green-600">
                  <div className="text-xs font-bold text-gray-400">Balance</div>
                  SOL
                </div>
                <div className="flex gap-4 p-2">
                  <Link
                    className="w-full rounded-lg bg-green-500 p-2 font-bold text-white"
                    href={"deposit"}
                  >
                    Deposit
                  </Link>
                  <Link
                    className="w-full rounded-lg bg-red-500 p-2 font-bold text-white"
                    href={"withdraw"}
                  >
                    Widthdraw
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
