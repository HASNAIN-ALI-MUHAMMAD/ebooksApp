"use client"
import { useEffect, useRef,useState } from "react";
import ePub from "epubjs";
import Image from "next/image";

const EpubReader = ({ file }) => {
  const [bookInfo,setBookInfo]=useState({});
  const [error,setError] = useState("");
  const containerRef = useRef(null);
  const hasInitializedRef = useRef(false);
  const renditionRef = useRef(null);
  const [links,setLinks] = useState([]);

  useEffect(() => {
    if(!file ) return alert("Error rendering failed!");
    if (file && containerRef.current && !hasInitializedRef.current) {
    //Avoiding multiple renders
      hasInitializedRef.current=true;
      //main function: book loader
      const loadBook = async()=>{
      try{
        const res = await fetch(file,{
          cache:'force-cache',
        },5000);
        if(!res.ok){
          setError("A error occurred.Status: "+res.status)
        }
        const data = await res.blob();
        const book = ePub(file || data);

     
        const render = book.renderTo(containerRef.current, {
          width: "100%",
          method:'horizontal',
          height: "100%",    
          flow:'scrolled-doc',

        });
        renditionRef.current=render;
      
        //main display
        await book.ready;
        await book.locations.generate(1600)
        await render.display();
        
        //navigation
        book.loaded.metadata.then(meta => {
          setBookInfo({
            title: meta.title,
            author: meta.creator,
          })
        }); 

        //Tabke of contents
        const toc =await book.navigation.toc;
        setLinks(toc);



      }catch(err){
        setError(err.message,"Error:"+err)
      }
      
 
        //Final return ending/destroying the render
        return () => {
          book.destroy(); 
        };
      
      }
    
      loadBook();}}, [file,bookInfo,error]);



  //Navigation buttons
  const next = () => {
    renditionRef.current && renditionRef.current.next();
  };

  const prev = () => {
    renditionRef.current && renditionRef.current.prev();
  };
  const goToChapter=(href)=>{
    renditionRef.current && renditionRef.current.display(href);
  }

  //logs
  console.log(error)
  if(error){
    return(
      <>
        <p className="text-3xl text-black ">{error}</p>
        {/* <button onClick={reload}>Try again</button> */}
      </>
    )

  } 


  return(
    <>
      <div className="flex flex-col w-4/4 px-8 lg:flex-row flex-1 space-x-5">
      <div ref={containerRef} className="p-5 flex flex-col items-center justify-center" style={{width:"100%", overflow:"auto",height:'95vh', border: "1px solid #ddd"  }} />

        {/* TOC Sidebar */}
        <div className="w-1/2 lg:1/3 flex flex-col space-y-5 overflow-y-scroll h-screen overflow-x-hidden ">
          <h3 className="font-bold mb-2">Table of Contents</h3>
          <ul className="text-sm space-y-1">
            {links.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => goToChapter(item.href)}
                  className="text-blue-600 hover:underline"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>
      <div className="flex flex-row gap-4">
          <button className="text-white bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded " onClick={next}>Next page</button>
          <button onClick={prev} className="text-white bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ">Prev page</button>
      </div>
     
    </>

  )
};

export default EpubReader;
