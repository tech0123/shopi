import CustomersDemo from "./MyDataTable";

export default function Cart() {
    return (
        <div className="main flex flex-col justify-center items-center">
            <div className="container w-ful p-6 mt-6 mx-10 lg:mx-24 ">
                <CustomersDemo type={"allProducts"} />
            </div>
            <div className="container w-ful p-6 mt-3 mx-10 lg:mx-24 ">
                <CustomersDemo type={"selectedProducts"} />
            </div>
            {/* <div className="container w-ful p-6 mt-6 mx-10 lg:mx-24 border-2 border-white">
                <div className="container flex flex-row">
                    <div className="container w-ful p-6 m-3 border-2 border-white ">Hii</div>
                    <div className="container w-ful p-6 m-3 border-2 border-white ">Hii</div>
                </div>
            </div> */}
        </div>
    );
}

export async function generateMetadata() {
    return {
        title: "Cart | Shopi",
        description: "Cart Page of Shopi"
    }
}
