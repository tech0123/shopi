import AllProductsTable from "./AllProductsTable";
import SelectedProductsTable from "./SelectedProductsTable";

export default function Cart() {
    return (
        <div className="main flex flex-col justify-center items-center">
            <div className="container w-full p-6 pb-0 mt-6 mx-10 lg:mx-24">
                <AllProductsTable />
            </div>
            <div className="container w-full p-6 pt-0 mx-10 lg:mx-24 ">
                <SelectedProductsTable />
            </div>
            {/* <div className="container w-full p-6 mt-6 mx-10 lg:mx-24 border-2 border-white">
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
