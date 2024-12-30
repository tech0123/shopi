import { usersOption } from "@/helper/commonValues";
import Link from "next/link";

export default function Users() {
  return (
    <div className="main flex justify-center items-center min-h-screen">
      <div className="container grid grid-cols-1 gap-5">
        {usersOption?.map(({ text, href }) => (
          <Link
            key={text}
            href={href}
            className="flex justify-center items-center p-4 w-full max-w-xs gradient_common_btn  mx-auto my-8 "
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
    title: "Users | Shopi",
    description: "Users Page of Shopi",
  };
}
