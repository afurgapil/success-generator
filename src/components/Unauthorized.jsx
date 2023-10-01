import { FaUserSecret } from "react-icons/fa";
import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="bg-bg min-h-screen py-5 flex flex-col justify-center items-center">
      <FaUserSecret color="white" size="120px" />
      <h2 className="text-white text-5xl my-10">
        Bu sayfayı görüntülemek için izniniz yok
      </h2>
      <Link
        to="/signin"
        className="py-12 px-36 inline-flex justify-center items-center  rounded-xl bg-blue-100 border border-transparent font-semibold text-blue-500 hover:text-white hover:bg-blue-500 focus:outline-none focus:ring-2 ring-offset-white focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
      >
        Giriş yap
      </Link>
    </div>
  );
}

export default Unauthorized;
