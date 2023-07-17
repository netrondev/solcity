import Image from "next/image";
import Link from "next/link";
import NavBar from "~/components/nav";

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
        <div className="relative mx-auto  p-4    ">
          <div className="mx-auto mt-20  max-w-5xl items-center rounded-lg bg-gray-200  p-5 text-center shadow-lg ">
            <div className=" text-7xl font-bold text-blue-600">
              Deposit QR Code
            </div>
            <div className="flex w-full max-w-5xl gap-5 p-2 pt-10">
              <div className="w-full rounded-lg bg-white pb-5 shadow-lg">
                <div className="mx-auto rounded-t-lg border border-b-gray-300 border-l-white border-r-white border-t-white p-2 text-xl">
                  <div className="m-10 ml-52 mr-52 h-96 border shadow-lg">
                    qr code
                  </div>
                </div>
                <div className="border border-b-gray-300 border-l-white border-r-white border-t-white p-2 text-left text-xl text-gray-600">
                  <div className="text-xs font-bold text-gray-400">
                    Unique ID
                  </div>
                  jhnud-shifshuiohiofs-shbfhjs-snjfhuhsd-nxhid-adjjhuidh
                </div>

                <div className="flex gap-4 p-2">
                  <Link
                    className="w-full rounded-lg bg-red-500 p-2 font-bold text-white"
                    href={"deposit"}
                  >
                    Cancel
                  </Link>
                  <Link
                    className="w-full rounded-lg bg-green-500 p-2 font-bold text-white"
                    href={"wallet"}
                  >
                    Done
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
