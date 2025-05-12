import { connectMongo } from "../app/api/lib/mongoose.js";
import Ebook from "../app/api/lib/collections/ebooks.js";
import { booksData } from "./books.js";
import crypto from "crypto";
import User from "../app/api/lib/collections/User.js";
async function Trust(){
    try{
        await connectMongo();
        const result = await User.deleteMany({});
        console.log("Data uploaded Successfully",result.deletedCount);

    }
    catch(err){
        console.log(err);
    }
    //     const code = crypto.randomBytes(6).toString('hex');
    // console.log("Code is",typeof code);
    //     return code;

}

Trust();

// async function uploadFiles() {
//     try {
//       const files = await fs.readdir(dir)
//       let count =0;
//       const { data: filesFind, error2 } = await supabase.storage.from('ebooks').list("")
    
//       for (const file of files) {
//         const filepath = path.join(dir, file)
//         const fileBuffer = await fs.readFile(filepath)
        

//         if (filesFind?.find(f => f.name === file)) {
//             continue;
//         }
//           const { data, error } = await supabase.storage.from('ebooks').upload(file, fileBuffer, {
//               contentType: 'application/pdf',
//               upsert: true,
//           })
//           if (error) {
//             console.error(`❌ Error uploading ${file}:`, error.message)
//           } else {
//             console.log(`✅ Uploaded: ${file}`)
//           }
        
//           count+=1;

      
//       }
//       console.log("count",count);

//       } 
//     catch (err) {
//       console.error('Unhandled error:', err.message)
//     }
//   }
  
//   await uploadFiles()




//BULK DOWNLOAD EPUBS FROM GUTENBERG
/*mkdir -p gutenberg_books
for id in {1696..3000}; do
  wget -nc "https://www.gutenberg.org/ebooks/$id.epub.noimages" -P gutenberg_books/
done
*/
//RENAMING FILES 
/*cd gutenberg_epubs
for file in *.epub.noimages; do
  mv "$file" "${file%.epub.noimages}.epub"
done
cd ..*/

/*
for ID in {1012..5000}; do
  URL="https://www.gutenberg.org/ebooks/$ID.rdf"
  wget -c -q "$URL" -O "rdf_files/$ID.rdf"
  echo "Downloaded RDF metadata for book ID $ID"
done
 */