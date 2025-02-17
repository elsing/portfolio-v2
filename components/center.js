import Image from "next/image";
import me from "../public/me.jpg";

export default function Center() {
  return (
    <div className="flex-grow flex">
        {/* Center Item */}
        {/* <div className="py-2 flex-grow lg:flex flow-row"> */}
        <div className="p-2 flex-grow flex">
            <div className="w-full items-center justify-center flex">
                <div className="flex-col lg:text-right text-center lg:flex-row-reverse flex">
                    <div className="justify-center flex lg:flex-initial">
                        <Image
                            src={me}
                            alt="Picture of me."
                            className="rounded-full lg:w-96 w-48 m-10"
                            // width={299}
                            // lenth={374}
                            quality={100}
                        />
                    </div>
                        <div className="justify-center flex flex-col lg:pr-3">
                            <h1 className="lg:text-7xl text-4xl text-nowrap">Elliot Singer</h1>
                            <h2 className="lg:text-2xl pt-[16px] text-base flex">IT Engineer 🛠️ | DevOps Enthusiast 🤖 | Motorbike Rider 🏍</h2>
                            <h2 className="lg:text-2xl text-[#F9A11E] pt-[48px] text-base">i&apos;m friendly email me | linkedin | github</h2>
                        </div> 
                    </div>
            </div>
        </div>
    </div>
  );
}
