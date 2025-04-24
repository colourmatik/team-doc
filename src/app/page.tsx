import Link from "next/link";

const Home = () => {
  return (
    <div className="flex min-h-screen item-center justify-center">
      Click <Link href="/documents/123"> &nbsp;<span className="text-blue-500 underline">here</span> </Link>&nbsp;to go to document id
    </div>
   );
}

export default Home;