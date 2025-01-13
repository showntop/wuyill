import SourceBubble from '@/components/search/source-bubble';
import { FileTextIcon, Film, Images, ListPlusIcon, PlusIcon, TextSearchIcon, Map } from 'lucide-react';
// import ImageGallery from '@/components/search/image-gallery';
import { Message, SearchCategory } from '@/lib/types';

import React, { memo, useMemo } from 'react';
import AnswerSection from '@/components/search/answer-section';
// import ActionButtons from '@/components/search/action-buttons';
import { extractAllImageUrls } from '@/lib/shared-utils';
// import VideoGallery from '@/components/search/video-gallery';
import ExpandableSection from '@/components/search/expandable-section';
import QuestionSection from './question-section';
// import MindMap from '@/components/search/mindmap';
// import { useTranslations } from 'next-intl';
// import UISection from '@/components/code/ui-section';
// import { useUIStore } from '@/lib/store';

const ChatMessage = memo(
    (props: {
        searchId: string;
        message: Message;
        onSelect: (question: string) => void;
        reload: (msgId: string, isQuestion: boolean) => void;
        isLoading: boolean;
        isReadOnly: boolean;
    }) => {
        const {
            message: { id, role, query, content, related, type, sources = [], images = [], videos = [] },
            onSelect,
            reload,
            isLoading,
            isReadOnly,
            searchId,
        } = props;

        const isUser = role === 'user';

        const message = props.message;

        const attachments = useMemo(() => {
            let initialAttachments = message.attachments ?? [];
            if (isUser) {
                const imageUrls = extractAllImageUrls(content);
                if (imageUrls.length > 0) {
                    initialAttachments = initialAttachments.concat(imageUrls);
                }
            }
            return initialAttachments;
        }, [message.attachments, isUser, content]);

        // const t = useTranslations('ChatMessage');
        // const { showMindMap } = useUIStore();

        return (
            <div className="flex flex-col w-full items-stretch space-y-6 pb-10">
                {
                    query && (
                        <div className="flex justify-end">
                            <div className="flex items-start space-x-2 max-w-[80%]">
                                <QuestionSection messageId={id} content={query} isShared={isReadOnly} onContentChange={onSelect} reload={reload} />
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                    <span className="text-white text-sm">U</span>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    content && (
                        <div className="flex justify-start">
                            <div className="flex items-start space-x-2 max-w-[80%]">
                                <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                                    <span className="text-white text-sm">A</span>
                                </div>
                                <AnswerSection title={('Answer')} content={content} sources={[]} />
                            </div>
                        </div>
                    )
                }
            </div>
        );
    },
);

ChatMessage.displayName = 'ChatMessage';
export default ChatMessage;
