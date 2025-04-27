import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
      <>
          <div className="flex flex-col justify-center items-center w-full h-full gap-10 b">
              <Link
                  href="/login"
                  className="bg-blue-500 w-48 p-2 rounded-full text-2xl text-white text-center min-w-[200px] hover:bg-blue-600 transition duration-300"
              >
                  Login
              </Link>
              <Link
                  href="/register"
                  className="bg-green-700 w-48 p-2 rounded-full text-2xl text-white text-center min-w-[200px] hover:bg-green-800 transition duration-300"
              >
                  Register
              </Link>
          </div>
      </>
  );
}
