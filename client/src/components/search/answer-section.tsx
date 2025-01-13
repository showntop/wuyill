import React from 'react';
import { BookKey } from 'lucide-react';
import { TextSource } from '@/lib/types';
import MyMarkdown from './my-markdown';


const AnswerSection = (props: { title: string, content: string, sources: TextSource[] }) => {
    const { title, content, sources } = props;
    return (
        <div className="flex w-full flex-row">
            {/* <div className="flex flex-row items-center" style={{ display: 'flex', alignItems: 'center' }}> */}
                {/* <BookKey className="text-primary mr-2" style={{ width: '20px', height: '20px', color: '#556ce5' }} /> */}
            {/* </div> */}
            <div className="bg-gray-100 rounded-lg p-4">
                <MyMarkdown content={content} sources={sources}/>
            </div>
        </div>
    );
};


export default AnswerSection;
