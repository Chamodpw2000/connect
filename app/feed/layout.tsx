export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

      <body className="overflow-x-hidden ">
        <div className="flex  min-h-screen">
<div className="flex flex-1 bg-accent">

</div>

<div className="flex flex-3">
   {children}
</div>

<div className="flex flex-1 bg-accent">

</div>

        </div>


       
       
      </body>
 
  );
}
