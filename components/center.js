import Image from "next/image";
import me from "../public/me.jpg";

export default function Center() {
  return (
    <div className="flex-grow flex">
        {/* Center Item */}
        {/* <div className="py-2 flex-grow md:flex flow-row"> */}
        <div className="p-2 flex-grow flex">
            {/* Left side */}
            <div className="w-full items-center flex">
                {/* Middle box */}
                <div className="md:justify-end justify-center items-center w-full flex mr-[10px] text-[#52F7B0]">
                    <div className="md:text-right text-center">
                    <h1 className="md:text-7xl text-4xl text-nowrap">Elliot Singer</h1>
                    <div className="grid md:grid-cols-5 grid-rows-3 gap-0 text-nowrap">
                        <h2 className="md:text-2xl pt-[16px] text-base">IT Engineer 🛠️</h2>
                        <h2 className="md:text-2xl pt-[16px] text-base md:block hidden">|</h2>
                        <h2 className="md:text-2xl pt-[16px] text-base">DevOps Enthusiast 🤖</h2>
                        <h2 className="md:text-2xl pt-[16px] text-base md:block hidden">|</h2>
                        <h2 className="md:text-2xl pt-[16px] text-base">Motorbike Rider 🏍️</h2>
                    </div>
                        <h2 className="md:text-2xl text-[#F9A11E] pt-[48px] text-base">i&apos;m friendly email me | linkedin | github</h2>
                    </div>
                </div>
            </div>
            {/* Right Side */}
            <div className="w-full items-center justify-start flex pt-4">
            {/* <div className="w-full md:items-center md:justify-start justify-center flex pt-4"> */}
                <div className="md:pl-[42px]">
                <Image
                src={me}
                alt="Picture of me."
                className="rounded-full md:w-96 w-64"
                // width={299}
                // lenth={374}
                quality={100}
                />
                </div>
            </div>
        </div>


      {/* <div className="py-2 border-black border-2 flex-grow">
        <div className="flex justify-center py-2">
          <Image
            src={me}
            alt="Picture of me."
            className="rounded-md max-w-64 h-64"
          />
        </div>
        <h1 className="text-4xl flex justify-center italic font-bold py-2">
          Elliot Singer
        </h1>
        <p className="flex justify-center py-1">
          IT Engineer | DevOps Enthusiast | Motorbike Rider 🏍️
        </p>
      </div>
      <hr /> */}
    </div>
  );
}
