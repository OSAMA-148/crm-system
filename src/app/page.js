import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
      <>
          <div className="flex items-center justify-center min-h-screen bg-slate-300 w-full">
                      <div className="flex flex-col gap-4">
                          
                          <div className="flex flex-col gap-4">
                              <Link href="/login">
                                  <button className="w-64 bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition duration-300 ">
                                      Login
                                  </button>
                              </Link>
                              <Link href="/register">
                                  <button className="w-64 bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition duration-300">
                                      Register
                                  </button>
                              </Link>
                          </div>
                      </div>
                  </div>
      </>
  );
}
