import QuickLink from "@/components/feeds/quickLinks";
import UserDetails from "@/components/feeds/userDetails";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

   
      <div className="flex w-full min-h-screen">
        <div className="flex flex-1 bg-accent w-full">

          <div className="text-gray-700 text-xl font-bold w-full p-5">


            <UserDetails />

            <QuickLink />



          </div>

        </div>

        <div className="flex flex-3 p-5 w-full ">
          {children}
        </div>

        <div className="flex flex-1 bg-accent">

        </div>

      </div>




   

  );
}
