import Image from "next/image";
import ChatWindow from "@/components/chat/chat-window";


export default function Home() {
  return (
    <div className="rounded-lg border border-gray-200 shadow-sm">
      <div className="bg-gray-50 border-b border-gray-200 w-full">
        <h1 className="font-semibold text-gray-800 text-center">Chat</h1>
      </div>
      <ChatWindow id={'d'} user={{}} demoQuestions={[]}/>
    </div>
    // <div className="group radius-8 w-full flex flex-col flex-1 h-lvh mx-auto overflow-auto peer-[[data-state=open]]:lg:pl-[300px] peer-[[data-state=open]]:xl:pl-[320px]">
    //   <div className="flex flex-row items-center justify-between bg-black px-4 py-2">
    //     <div className="flex flex-row items-center">
    //       <Image src="/favicon.ico" alt="logo" width={40} height={40} className="size-40"/>
    //       <h1 className="text-3xl font-bold">Wuyill</h1>
    //     </div>
    //     <div className="flex flex-row items-center">
    //       <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    //         Sign In
    //       </button>
    //     </div>
    //   </div>
    //   <div className="grow">
    //       <ChatWindow id={'d'} user={{}} demoQuestions={[]}/>
    //       {/* {showFeatureSections && <DemoGallery />} */}
    //       {/* {showFeatureSections && <FeatureSections />} */}
    //   </div>
    //   {/* <SimpleSiteFooter /> */}
    // </div>
  );
}
