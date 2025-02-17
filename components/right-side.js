import Image from "next/image";


import me from "../public/me.jpg";

export default function Top() {
  return (
    <div>
      <div className="py-2">
        <div className="flex justify-center py-2">
          <Image
            src={me}
            alt="Picture of me."
            className="rounded-full w-1/2 h-1/2"
          />
        </div>
        <h1 className="text-4xl flex justify-center italic font-bold py-2">
          Elliot Singer
        </h1>
        <p className="flex justify-center py-1">
          IT Engineer | DevOps Enthusiast | Motorbike Rider 🏍️
        </p>
      </div>
      <hr />
    </div>
  );
}
