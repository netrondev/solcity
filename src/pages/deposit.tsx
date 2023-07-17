import Image from "next/image";
import Link from "next/link";
import NavBar from "~/components/nav";

export default function Deposit() {
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
        <div className="relative mx-auto    p-4   ">
          <div className="mx-auto mt-20  max-w-5xl items-center rounded-lg bg-gray-200  p-5 text-center shadow-lg ">
            <div className=" text-7xl font-bold text-blue-600">Deposit</div>
            <div className="flex w-full max-w-5xl gap-5 p-2 pt-10">
              <div className="w-full rounded-lg bg-white  shadow-lg">
                <div className="rounded-t-lg border border-b-gray-300 border-l-white border-r-white border-t-white p-2 text-xl">
                  Deposit Solana
                </div>
                <div className="border border-b-gray-300 border-l-white border-r-white border-t-white p-2 text-left text-xl text-green-600">
                  <div className="text-xs font-bold text-gray-400">Balance</div>
                  SOL
                </div>
                <div className="p-3">
                  <Link className="p-4 text-blue-700 underline" href={"qrcode"}>
                    Click here to get QR Code
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
