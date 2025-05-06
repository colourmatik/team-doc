import {Editor} from "./editor";
import { Toolbar } from "./toolbar";
import { Navbar } from "./navbar";
import { Room } from "./room";

interface DocumentIdPageProps {
    params: Promise<{documentId: string}>;
};


const DocumentIdPage = async ({ params }: 
    DocumentIdPageProps) => {
   const { documentId  } = await params;

    return ( 
        <div className='min-h-screen bg-#E6EEF7'>
            <div className="flex flex-col gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#E6EEF7] print:hidden">
            <Navbar/>
            <Toolbar />
            </div>
            <div className="pt-[108px] print:pt-0" >
            <Room>
            <Editor />
            </Room>
            </div>
        </div>
     );
}
 
export default DocumentIdPage;