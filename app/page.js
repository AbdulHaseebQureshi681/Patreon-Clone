import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex justify-center flex-col items-center text-white h-[60vh] gap-4">
        <div className="text-7xl font-bold flex items-center">Fundora<span><Image src="/alien-21107.gif" alt="logo" width={50} height={50} /></span></div>
        <p>
          Join the community of creators and supporters. Start your journey
          today.
        </p>
        <div>
          <button
            type="button"
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Start Here
          </button>
          <button
            type="button"
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Read More
          </button>
        </div>
      </div>
      <div className="bg-white h-2 opacity-10"></div>
      <div className="text-white container mx-auto my-15 " >
        <h1 className="text-center my-4 text-3xl    font-bold " >You can support your favorite creators</h1>
        <div className="flex justify-around my-8 mt-12 gap-5 items-center" >
          <div className="item w-[20%] space-y-3 flex flex-col items-center">
        <Image className=" bg-gray-800 p-2 rounded-full " src="/cash-289_512.gif" alt="" width={80} height={80} />
        <p>Fund Yourself</p>
          </div>
          <div className="item w-[20%] space-y-3 flex flex-col items-center">
        <Image className=" bg-gray-800 p-2 rounded-full " src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbG9ncHBzMmxiM2FsNThuZW9ycXZjd2d3OWQwdGhreHp0bGJ3ZzBqdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/fsLU6qu7OddhGHDvso/giphy.gif" alt="" width={80} height={80} />
        <p className="text-center w-[70%]    " >Built around fans & creators</p>
          </div>
          <div className="item w-[20%] space-y-3 flex flex-col items-center">
        <Image className=" bg-gray-800 p-2 rounded-full " src="/spring-20172_512.gif" alt="" width={80} height={80} />
        <p className="text-center w-[70%] " >Turn passion into growth</p>
          </div>
                    
        

        </div>
      </div>
      <div className="bg-white h-2 opacity-10"></div>
      <div className="text-white container mx-auto flex justify-center flex-col items-center my-8 " >
        <h2 className="text-center my-4 text-3xl font-bold mb-8 " >Learn More about Fundora</h2>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/QtaorVNAwbI?si=ULaZorodtiXCaFWw" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
      </div>
    </>
  );
}
