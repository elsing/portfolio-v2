import Link from "next/link";



export default function Footer() {
  return (
    <div className="text-center mb-6 mt-2 text-2xl">
        <div>
            {/* <h2 className="text-[#F9A11E] pb-2">i&apos;m friendly, email me | github | linkedin</h2> */}
            <Link href="https://status.singer.systems" className="font-bold italic text-xl">servers status</Link>
        </div>
    </div>
  );
}
