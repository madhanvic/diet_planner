import Spinner from "../components/ui/Spinner";

function Loader() {
  return (
    <div className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute inline-block">
      <Spinner size={60} />
    </div>
  );
}

export default Loader;
