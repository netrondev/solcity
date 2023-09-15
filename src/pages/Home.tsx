import { Canvas } from "@react-three/fiber";
import Head from "next/head";
import { Stars } from "~/components/NewHomePage";

import Image from "next/image";

export default function Homebg() {
  return (
    <>
      <main className="absolute h-screen w-screen bg-[#030405] object-cover">
        {/* <Image
          height={1200 * 2}
          width={1200 * 2}
          src="/assets/images/spacebg.png"
          alt="bg"
          className="absolute inset-0 -z-50 h-full w-full  object-cover opacity-10"
        /> */}
        <div className="absolute h-screen w-screen object-cover">
          <Canvas className="">
            <ambientLight intensity={0.01} />
            <directionalLight color="blue" position={[0, 0, 50]} />
            <mesh rotation={[0.1, 0.5, 0.5]} position={[0, 0, 3]}>
              <Stars />

              <meshStandardMaterial />
            </mesh>
          </Canvas>
        </div>
      </main>
    </>
  );
}
