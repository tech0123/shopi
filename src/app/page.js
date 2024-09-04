import { linksOption } from "@/helper/commonValues";
import Link from "next/link";

export default function Home() {
  return (
    <div className="main flex justify-center items-center min-h-screen">
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-5">
        {linksOption?.map(({ text, href }) => (
          <Link
            key={text}
            href={href}
            className="flex justify-center items-center p-4 w-full max-w-xs mx-auto my-8 bg-gray-100 text-black"
          >
            {text}
          </Link>
        ))}

      </div>
    </div>
  );
}

export async function generateMetadata() {
  return {
    title: "Home | Shopi",
    description: "Home Page of Shopi"
  }
}
