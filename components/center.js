import Image from "next/image";
import me from "../public/me.jpg";
import { Typewriter } from "react-simple-typewriter";
import TypewriterName from "./typewriter";
import AnimatedImage from "./photo";

export default function Center() {
  return (
    <div className="flex-grow flex">
        {/* Center Item */}
        {/* <div className="py-2 flex-grow md:flex flow-row"> */}
        <div className="p-6 m-2 flex-grow flex">
            <div className="w-full items-center justify-center flex">
                <div className="flex-col md:text-right text-center md:flex-row-reverse flex">
                    {/* Picture */}
                    <div className="justify-center flex min-w-fit">
                        {/* <Image
                            src={me}
                            alt="Picture of me."
                            className="rounded-full lg:w-96 w-44 m-8 sm:w-52"
                            // width={299}
                            // lenth={374}
                            quality={100}
                        /> */}
                        <div>
                            <AnimatedImage />
                        </div>
                    </div> 
                    {/* Text */}
                    <div className="justify-center flex flex-col m-2">
                        {/* <h1 className="md:text-7xl text-4xl text-nowrap">Elliot Singer</h1> */}
                        <div className="md:text-7xl text-4xl text-nowrap text-[#52F7B0]">
                            {/* <h2 className="flex">i&apos;m friendly </h2> */}
                            <TypewriterName />
                        </div>
                        <h2 className="md:text-2xl text-[#52F7B0] pt-[16px] text-base flex">IT Engineer 🛠️ | DevOps Enthusiast 🤖 | Motorbiker 🏍</h2>
                        {/* <h2 className="md:text-2xl text-[#52F7B0] pt-[16px] text-base flex ">IT Engineer 🛠️ | DevOps Enthusiast 🤖</h2>
                        <h2 className="md:text-2xl text-[#52F7B0] pt-[16px] text-base flex text-center justify-center">Motorbiker 🏍</h2> */}
                        <h2 className="md:text-2xl text-[#F9A11E] pt-[48px] text-base">i&apos;m friendly email me | linkedin | github</h2>
                    </div> 
                </div>
            </div>
        </div>
    </div>
  );
}
