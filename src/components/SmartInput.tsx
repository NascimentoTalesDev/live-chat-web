import EmojiPicker from "emoji-picker-react";
import { getAllMessagesSugestions } from '@/app/chat/actions';
import React, { useEffect, useState } from 'react'
import { Image as Photo, SendHorizonal, SmilePlus } from "lucide-react";

interface SmartInputProps {
    onSendMessage: (message: string) => void;
}

interface messagesSugestionsProps {
    text: string,
}

const SmartInput = ({ onSendMessage }: SmartInputProps) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [message, setMessage] = useState("");
    const [query, setQuery] = useState('');
    const [messagesSugestions, setMessagesSugestions] = useState<messagesSugestionsProps[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage("");
        }
    };

    const newMessage = (emoji: string) => {
        console.log(emoji);
        
        setMessage((prev) => prev + emoji)
    };

    const handleEmogiModal = () => {
        setShowEmojiPicker(!showEmojiPicker)
    };

    const fetchSuggestions = async (query: string) => {
        setMessage(query)
        if (!query) return []

        const allsugestion = await getAllMessagesSugestions(query)
        setMessagesSugestions(allsugestion);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchSuggestions(query);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <label htmlFor="message" className="w-full p-4 bg-slate-100 flex items-center h-24 border">
            <ul className='absolute bottom-20 py-2 rounded-md bg-slate-50 w-fit'>
                {messagesSugestions.map((suggestion, index) => (
                    <li key={index} className='flex px-2 gap-2 mb-1 hover:bg-red-300'>
                        <div className='rounded-full px-2 gap-2 bg-slate-400'>
                            {index + 1}
                        </div>
                        <div>
                            {suggestion?.text}
                        </div>
                    </li>
                ))}
            </ul>
                <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full">
                    <div onClick={handleEmogiModal}>
                        <SmilePlus />
                    </div>
                    {showEmojiPicker && (
                        <div className="absolute bottom-20 left-4">
                            <EmojiPicker onEmojiClick={(e) => newMessage(e.emoji)} />
                        </div>
                    )}
                    <div>
                        <label htmlFor="avatar" className="cursor-pointer">
                            <Photo />
                        </label>

                        <input className="hidden" type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" />

                    </div>
                    <div className="w-full flex">
                        <input
                            type="text"
                            value={query}
                            id="message"
                            onChange={(e) => { setMessage(e.target.value), setQuery(e.target.value) }}
                            className="w-full border rounded-l-lg p-2 "
                            placeholder="Digite sua mensagem"
                        />
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-lg">
                            <SendHorizonal />
                        </button>
                    </div>
                </form>
        </label>
    )
}

export default SmartInput
