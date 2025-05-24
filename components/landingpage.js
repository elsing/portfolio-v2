import TypewriterName from "./typewriter";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div>
        <div className="md:text-7xl text-4xl text-nowrap text-[#52F7B0]">
            {/* <h2 className="flex">i&apos;m friendly </h2> */}
            <TypewriterName />
        </div>
        <h2 className="md:text-2xl text-[#52F7B0] pt-[16px] text-base flex">IT Engineer 🛠️ | DevOps Enthusiast 🤖 | Motorbiker 🏍</h2>
        <h2 className="md:text-xl text-[#F9A11E] pt-[32px] text-base">
            connect with me -&gt;
            <Link href="mailto:elliot@singer.systems"> email |</Link>
            <Link href="https://linkedin.com/in/elliotsinger"> linkedin </Link>
            <Link href="https://github.com/elsing">| github</Link>
        </h2>
    </ div> 
  );
}
