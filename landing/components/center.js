import LandingPage from "./landingpage";
import AnimatedImage from "./photo";

export default function Center() {
  return (
    <div className="flex-grow flex">
        {/* Center Item */}
        <div className="p-6 m-2 flex-grow flex">
            <div className="w-full items-center justify-center flex">
                <div className="flex-col md:text-right text-center md:flex-row-reverse flex">
                    {/* Picture */}
                    <div className="justify-center flex min-w-fit">
                        <AnimatedImage />
                    </div> 
                    {/* Text */}
                    <div className="justify-center flex flex-col m-2">
                        <LandingPage />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
