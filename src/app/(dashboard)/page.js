import Link from "next/link";
import { linksOption } from "@/helper/commonValues";
// import "primereact/resources/themes/lara-light-cyan/theme.css";

export default function Home() {
  return (
    <>
      <div className="text-right">
        {/* <SignOutButton redirectUrl={routes.push('/sign-in')}/> */}
      </div>
      <div className="main flex justify-center items-center">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-5 home_page_btn_group">
          {linksOption?.map(({ text, href }) => (
            <Link
              key={text}
              href={href}
              className="flex justify-center items-center p-4 w-full max-w-xs mx-auto my-8 gradient_common_btn"
            >
              {text}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export async function generateMetadata() {
  return {
    title: "Home | Shopi",
    description: "Home Page of Shopi",
  };
}
