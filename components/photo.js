'use client'

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import me from "../public/me.jpg";

export default function AnimatedImage() {
  const [loaded, setLoaded] = useState(false);
  // const [firstAnimation, setFirst] = useState(false);
  // const [secondAnimation, setSecond] = useState(false);

  return (
    <div className="relative overflow-hidden">

      {/* Background color layer */}
      {/* <motion.div
        initial={{ y: 0, opacity: 1 }} // Fully visible, covering the image
        animate={{ y: "100%", opacity: 0 }} // Moves down but stays fully opaque
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 bg-[#F9A11E] rounded-3xl"
        exit={{ opacity: 0}}
        onAnimationComplete={latest => setFirst(true)}
        /> */}

      {/* Background color layer */}
      {/* <motion.div
        initial={{ y: 100, opacity: 1 }} // Fully visible, covering the image
        animate={{ y: "-100%", opacity: 0 }} // Moves down but stays fully opaque
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 bg-[#F9A11E] rounded-3xl"
        exit={{ opacity: 0}}
        onAnimationComplete={latest => setSecond(true)}
        /> */}


      {/* Next.js Optimized Image */}
      <motion.div
        initial={{ opacity: 0}}
        animate={{ opacity: (loaded) ? 1 : 0 }}
        transition={{ duration: 2.5, delay: 0.25 }}
        className=""
      >
        <Image
          src={me} // Change this to your actual image path
          alt="Animated"
          className="rounded-full lg:w-96 w-44 m-8 sm:w-52"
        //   layout="fill" // Ensures it fills the container
        //   objectFit="cover" // Maintains aspect ratio
          onLoad={() => {
            console.log("Image loaded!"); // Debugging
            setLoaded(true);
          }}
        />
      </motion.div>
    </div>
  );
}