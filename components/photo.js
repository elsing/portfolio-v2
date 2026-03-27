'use client'

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import me from "../public/me.jpg";

export default function AnimatedImage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0}}
        animate={{ opacity: (loaded) ? 1 : 0 }}
        transition={{ duration: 2.2, delay: 0.2 }}
        className=""
      >
        <Image
          src={me} // Change this to your actual image path
          alt="Animated"
          className="rounded-full lg:w-96 w-44 m-8 sm:w-52"
          onLoad={() => {
            setLoaded(true);
          }}
        />
      </motion.div>
    </div>
  );
}