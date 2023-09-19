import { Canvas, useLoader } from "@react-three/fiber";

import React from "react";
import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Backdrop } from "@react-three/drei";
// import circleImg from "../assets/solanacoin.png";

export function Stars() {
  const ref = useRef();

  // const [sphere] = useState(() =>
  //   inSphere(new Float32Array(5000), { radius: 1.5 })
  // );

  const [sphere] = useState(() =>
    new Float32Array(50000).map((i) => (Math.random() - 0.5) * 5)
  );

  console.log(sphere);

  useFrame((state, delta) => {
    if (ref.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ref.current.rotation.x -= delta / 10;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#ffa0e0"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}
export function Starsbg() {
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
