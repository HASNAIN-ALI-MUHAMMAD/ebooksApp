import { NextResponse } from "next/server";




async function  summariseAi(prompt,chunk) {
    try{
        const res = await fetch(process.env.OPENAI_API_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": process.env.OPENAI_API_MODEL,
            "messages": [
            {
                "role": "user",
                "content": `${prompt}${chunk}`
            }
            ]
        })
    });
    return res.json();
    }
    catch(err){
        return err
    }
    
}

export async function POST(req) {
    const {text} = await req.json();
    //if the text size is less than 100000 words...
    if(text.length <100000) {
        try{
            const finalSummary = await summariseAi(`write a summary of the following text provide your answer in json format as like this response:{"author":"{name of the author}","title":"{title}","summary":"{your summary}"}
                 the author and the title should be extracted from the text and the summary should not exceed 200 words text starts now:`,text);
            if(!finalSummary){
                return NextResponse.json({error: "Invalid response format"})
            }
            const responseText = finalSummary?.choices[0]?.message?.content;
            if(!responseText){
                return NextResponse.json({error: "Invalid response format"})
            }

            const match = responseText.match(/```json\s*([\s\S]*?)\s*```/);

            if (match) {
                try {
                    const jsonString = match[1]; // the inner JSON text
                    const jsonData = JSON.parse(jsonString);
                    return NextResponse.json({data:jsonData});
                } 
                catch (e) {
                    return NextResponse.json({error: "Invalid JSON format"});
                }
            } 
        else {
            return NextResponse.json({error: "JSON block not found"});
        }}
        catch(err){
            return NextResponse.json({error: err.message})
        }}
    // when the text size increases 115k tokens...
    else{
        function splitIntoChunks(text, maxWords = 100000) {
                const words = text.split(/\s+/);
                const chunks = [];
                for (let i = 0; i < words.length; i += maxWords) {
                    chunks.push(words.slice(i, i + maxWords).join(" "));
                }
                return chunks;
            }
        const chunks = splitIntoChunks(text);
        const summaries = []
        for(const chunk of chunks){
            const res = await summariseAi(`write a summary of the following text provide
                 your answer in clear terms with refernece to the authors name and the title
                  and the summary should not exceed 200 words text starts now :`,chunk);
            if(!res.ok){
                return NextResponse.json({error: res.error})
            }
            const data = await res.choices[0].message.content;
            summaries.push(data)
        }
            const finalSummary = await summariseAi(`write a summary of the following text summaries,these were summarised by you in chunks,now provide
                 your answer in json format as like this response:{"author":"{name of the author}","title":"{title}","summary":"{your summary}"}
                the author and the title should be extracted/(try to find in the text) from the text and the summary should not exceed 
                200 words text starts now:`,summaries.join(' '));
            if(!finalSummary.ok){
                return NextResponse.json({error: finalSummary.error})
            }
            const responseText = finalSummary.choices[0].message.content;
            const match = responseText.match(/```json\s*([\s\S]*?)\s*```/);
            if (match) {
                try {
                    const jsonString = match[1]; // the inner JSON text
                    const jsonData = JSON.parse(jsonString);
                    return NextResponse.json({data:jsonData});
                } 
                catch (e) {
                    return NextResponse.json({error: "Invalid JSON format"});
                }
            } 
            else {
                return NextResponse.json({error: "JSON block not found"});
            }
    
    }
        

    
    
    
}