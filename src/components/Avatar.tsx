// import Gravatar from "react-gravatar";
import Image from "next/image";

export function Avatar(props: {
  image?: string | null;
  email?: string;
  onClick: () => void;
}) {
  return (
    <div className="grid aspect-square h-8 w-8 items-center rounded-full bg-yellow-500 text-center text-white">
      <span className="self-center text-xs font-semibold text-white">
        <button
          onClick={props.onClick}
          className="overflow-hidden rounded-full p-0"
        >
          {props.image && (
            <Image src={props.image} width={64} height={64} alt="user image" />
          )}
          {/* <Gravatar email={props.email} className="h-8 w-8 rounded-full" /> */}
        </button>
      </span>
    </div>
  );
}
