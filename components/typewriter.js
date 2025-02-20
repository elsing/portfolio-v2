'use client'

import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";


export default function TypewriterName() {
  return (
    <div className="">
        <Typewriter words={["Elliot Singer"]}
            cursorBlinking={true}
            cursorStyle={<span className="md:text-4xl text-xl md:align-[12px] align-[6px]">█</span>}
            cursor
            typeSpeed={180}
            delaySpeed={10000}
            loop
            
        />
    </div>
  );
}
