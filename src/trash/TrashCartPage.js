import Image from "next/image";
import CustomersDemo from "./MyDataTable";
export default function TrashCartPage() {
  return (
    <div className="main flex flex-col justify-center items-center">
      <div className="container w-full  mt-10 mx-10 lg:mx-24 lg:mt-16">
        <div className="relative mx-10 lg:mx-24">
          <input
            type="text"
            id="search"
            className="w-full  px-5 py-3 rounded-lg border-2 border-gray-300 focus:border-gray-100 focus:ring-1 focus:ring-gray-100 transition-colors bg-transparent duration-300 shadow-md outline-none pr-10"
            placeholder="Search"
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            // className="h-6 w-6 text-white hover:text-white transition-colors duration-300 absolute right-4 top-1/2 transform -translate-y-1/2"
            className="h-6 w-6 text-green hover:text-white transition-colors duration-300 absolute right-4 top-1/2 transform -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          > 
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 2z"
            />
          </svg>
        </div>
      </div>

      <div className="container flex w-full border-white border-2 p-6 mt-10 mx-10 lg:mx-24 lg:mt-16">
        <div className="border-2 border-white">
          <Image src="/img1.jpg" alt="image" width={350} height={350} />
        </div>
        <div className="border-2 border-white w-full ml-3 p-3">
          <p>hii</p>
        </div>

        {/* <div className="border-2 border-white">
                    <Image src="/img1.jpg" alt="image" width={350} height={350} />
                </div>
                <div className="border-2 border-white w-full ml-3 p-3">
                    <p>hii</p>
                </div>

                <div className="border-2 border-white">
                    <Image src="/img1.jpg" alt="image" width={350} height={350} />
                </div>
                <div className="border-2 border-white w-full ml-3 p-3">
                    <p>hii</p>
                </div> */}
      </div>

      <div className="container w-full border-white border-2 p-6 mt-10 mx-10 lg:mx-24 lg:mt-16">
        <h1>Hii</h1>
      </div>
    </div>
  );
}

export async function generateMetadata() {
  return {
    title: "Cart | Shopi",
    description: "Cart Page of Shopi",
  };
}
