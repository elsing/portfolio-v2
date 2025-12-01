import Link from "next/link";



export default function Footer() {
  return (
    <div className="text-center mb-6 mt-2 text-2xl">
        <div>
            <Link href="https://status.singer.systems" className="font-bold italic text-xl text-white">servers status</Link>
        </div>
    </div>
  );
}

