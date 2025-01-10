import { ProgressSpinner } from "primereact/progressspinner";

const Loader = () => {
  return (
    <div className="loader_Wrapper">
      <ProgressSpinner
        className="loader"
        strokeWidth="3"
        fill="transparent"
        animationDuration=".8s"
        // animationDuration="10s"
      />
    </div>
  );
};

export default Loader;
