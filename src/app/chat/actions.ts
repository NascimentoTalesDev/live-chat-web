"use server"

import { baseUrl } from "@/utils/base-url"
import { revalidatePath } from "next/cache"

export async function getAllMessages (id: string){
    console.log("getAllMessages", id);
    
    const res = await fetch(`${baseUrl}/chats/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'API-Key': process.env.DATA_API_KEY!,
        },
    })
    revalidatePath('/chat')

    const messages = await res.json()    
    return messages
}

export async function getAllMessagesSugestions (query:string){
    
    const res = await fetch(`${baseUrl}/messages?search_query=${query}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'API-Key': process.env.DATA_API_KEY!,
        },
    })
    const messages = await res.json()            
    return messages
}