import Image from "next/image";

export default function Loading() {
  return (
    <>
      <main className="max-h-screen  min-h-screen bg-gray-500">
        <Image
          src={"/assets/images/solanacoin.png"}
          alt={""}
          width={800 * 4}
          height={600 * 4}
          className="absolute ml-20 mt-20 h-32 w-32 animate-spin object-center"
        />
      </main>
    </>
  );
}
