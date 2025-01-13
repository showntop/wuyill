'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ChatMessage from '@/components/chat/chat-message';

import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useSearchParams } from 'next/navigation';
// import { useSigninModal } from '@/hooks/use-signin-modal';
// import { configStore, useProfileStore, useUIStore } from '@/lib/store';

import { ImageSource, Message, SearchType, TextSource, User, VideoSource } from '@/lib/types';
// import { LoaderCircle } from 'lucide-react';
// import { useScrollAnchor } from '@/hooks/use-scroll-anchor';
import { toast } from 'sonner';
import { isProUser, extractAllImageUrls, generateId } from '@/lib/shared-utils';
// import { useUpgradeModal } from '@/hooks/use-upgrade-modal';
// import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom';
// import useSearchLimit from '@/lib/store/local-limit';
// import { useTranslations } from 'next-intl';
import InputBar from '@/components/InputBar';
import { useConversationStore } from '@/store/chat-store';

export interface SearchProps extends React.ComponentProps<'div'> {
    id?: string;
    initialMessages?: Message[];
    user?: User;
    isReadOnly?: boolean;
    demoQuestions: React.ReactNode;
    searchBar?: (props: { handleSearch: (key: string, attachments?: string[]) => void }) => React.ReactNode;
    searchType?: SearchType;
}

export default function ChatWindow({ id, initialMessages, user, isReadOnly = false, demoQuestions, searchBar, searchType = SearchType.SEARCH }: SearchProps) {
    // const t = useTranslations('Search');
    const searchParams = useSearchParams();
    // const signInModal = useSigninModal();
    // const upgradeModal = useUpgradeModal();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // const [status, setStatus] = useState(t('status-think'));

    const { addConversation, activeId, activeConversation, setActiveConversation, updateActiveConversation } = useConversationStore();

    // const { scrollRef, visibilityRef, isVisible, scrollToBottom } = useScrollAnchor();

    useEffect(() => {
        const searchId = searchParams.get('id');
        if (searchId && searchId !== activeId) {
            setActiveConversation(searchId);
            return;
        }
        if (!searchId && id && id != activeId) {
            setActiveConversation(id);
            return;
        }
        setActiveConversation(activeId || '');
    }, [id, activeId, searchParams, setActiveConversation]);

    // const { incrementSearchCount, canSearch } = useSearchLimit();

    const sendMessage = useCallback(
        async (question?: string, attachments?: string[], messageIdToUpdate?: string) => {
            // if (!user) {
            //     signInModal.onOpen();
            //     return;
            // }
            // if (isReadOnly) {
            //     toast.error(t('read-only-error'));
            //     return;
            // }

            const checkMessagesLength = () => {
                // const messages = useConversationStore.getState().activeSearch?.messages ?? [];
                const messages =  [];
                if (!user && messages.length > 10) {
                    toast.error(('msg-length-sign-in'));
                    // signInModal.onOpen();
                    return false;
                }
                // if (user && !isProUser(user) && messages.length > 20) {
                    // toast.error(('msg-length-pro'));
                    // upgradeModal.onOpen();
                    // return false;
                // }
                if (messages.length > 100) {
                    toast.error(('msg-length-all'));
                    return false;
                }
                return true;
            };

            if (isLoading || !checkMessagesLength()) {
                return;
            }

            // if (user && !isProUser(user) && !canSearch()) {
            //     toast.error(t('free-search-limit'));
            //     upgradeModal.onOpen();
            //     return;
            // }

            let messageValue = question ?? input;
            if (messageValue === '' && !attachments) {
                return;
            }
            if (!messageValue && searchType === 'search') {
                toast.error('Please give some text input');
                return;
            }

            if (!messageValue && attachments && searchType === 'ui') {
                messageValue = 'Please generate the same UI as the image';
            }

            // const imageUrls = extractAllImageUrls(messageValue);
            // if (imageUrls.length > 1 && user && !isProUser(user)) {
            //     toast.error(('multi-image-free-limit'));
            //     upgradeModal.onOpen();
            //     return;
            // }
            // if (imageUrls.length > 5) {
            //     toast.error(t('multi-image-pro-limit'));
            //     return;
            // }

            setInput('');
            setIsLoading(true);
            // setStatus(('status-think'));

            let accumulatedMessage = '';
            let accumulatedRelated = '';
            let messageIndex: number | null = null;

            const updateMessages = (
                parsedResult?: string,
                newSources?: TextSource[],
                newImages?: ImageSource[],
                newRelated?: string,
                newVideos?: VideoSource[],
                title?: string,
            ) => {
                const activeConversation = useConversationStore.getState().activeConversation;
                if (messageIndex === null || !activeConversation.messages[messageIndex]) {
                    messageIndex = activeConversation.messages.length;
                    updateActiveConversation({
                        messages: [
                            ...activeConversation.messages,
                            {
                                id: generateId(),
                                query: '',
                                content: parsedResult ? parsedResult.trim() : '',
                                sources: newSources || [],
                                images: newImages || [],
                                related: newRelated || '',
                                videos: newVideos || [],
                                role: 'assistant',
                                type: activeConversation.messages[0]?.type,
                            },
                        ],
                    });
                    return;
                }

                updateActiveConversation({
                    title: title ?? activeConversation.title,
                    messages: activeConversation.messages.map((msg, index) => {
                        if (index === messageIndex) {
                            return {
                                ...msg,
                                content: parsedResult ? parsedResult.trim() : msg.content,
                                sources: newSources || msg.sources,
                                videos: newVideos || msg.videos,
                            };
                        }
                        return msg;
                    }),
                });
            };

            // if (!messageIdToUpdate) {
            if (!messageIdToUpdate) {
                const activeConversation = useConversationStore.getState().activeConversation;
                const activeId = useConversationStore.getState().activeId;
                let title = messageValue.substring(0, 50);
                if (!activeConversation) {
                    addConversation({
                        id: activeId || '',
                        title: title,
                        createdAt: new Date(),
                        userId: user?.id || '',
                        messages: [
                            {
                                id: activeId || '',
                                query: question ?? '',
                                content: '',
                                role: 'user',
                                attachments: attachments ?? [],
                                type: searchType,
                            },
                        ],
                    });
                } else {
                    updateActiveConversation({
                        messages: [
                            ...activeConversation.messages,
                            {
                                query: question ?? '',
                                id: generateId(),
                                content: '',
                                role: 'user',
                                attachments: attachments ?? [],
                                type: activeConversation.messages[0]?.type,
                            },
                        ],
                    });
                }
            }

            try {
                const url = 'http://localhost:8000/api/v1/chat/completions';

                await fetchEventSource(url, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'text/event-stream',
                    },
                    body: JSON.stringify({
                        settings: {
                            llm_model: {
                                provider: "hunyuan2",
                                name: "hunyuan" 
                            }
                        },
                        from: "wuyill",
                        query: question,
                        stream: true,
                        conversation_id: "test",
                        attachments,
                        // messages: useConversationStore.getState().activeSearch.messages,
                    }),
                    openWhenHidden: true,
                    onerror(err) {
                        throw err;
                    },
                    async onopen(response) {
                        if (response.ok && response.status === 200) {
                        } else if (response.status === 429) {
                            setIsLoading(false);
                            // if (!user) {
                            //     signInModal.onOpen();
                            // } else {
                            //     toast.error(t('free-search-limit'));
                            //     upgradeModal.onOpen();
                            // }
                            return;
                        } else if (response.status === 403) {
                            setIsLoading(false);
                            toast.error('Your access has been restricted. If you have any questions, please contact support@memfree.me');
                            return;
                        } else if (response.status === 400) {
                            setIsLoading(false);
                            toast.error(('Please refresh the page and try again.'));
                            return;
                        } else {
                            console.error(`Received unexpected status code: ${response.status}`);
                        }
                    },
                    onclose() {
                        setIsLoading(false);
                        // if (user && !isProUser(user)) {
                        //     incrementSearchCount();
                        // }
                    },
                    onmessage(msg) {
                        const { clear, answer, status, sources, images, related, videos, error, title, delta} = JSON.parse(msg.data);
                        if (clear) {
                            accumulatedMessage = '';
                            updateMessages(accumulatedMessage);
                        }
                        if (error) {
                            setIsLoading(false);
                            setInput(messageValue);
                            const errMsg = 'The AI ​​model service is abnormal. Please try again or switch the AI ​​model.';
                            toast.error(errMsg);
                            // setStatus(errMsg);
                            return;
                        }
                        if (status) {
                            // setStatus(status);
                        }
                        const answerx = delta['message']['content'];
                        updateMessages(
                            answerx ? (accumulatedMessage += answerx) : undefined,
                            sources,
                            images,
                            related ? (accumulatedRelated += related) : undefined,
                            videos,
                            title,
                        );
                    },
                });
            } catch (e) {
                setIsLoading(false);
                setInput(messageValue);
                toast.error(('search-error'));
            }
        },
        // [input, searchType, isReadOnly, isLoading, signInModal, addSearch, updateActiveConversation, upgradeModal, user, canSearch, incrementSearchCount, t],
        [input, searchType, isReadOnly, isLoading, user],
    );

    // const sendSelectedQuestion = useCallback(
    //     async (question: string) => {
    //         sendMessage(question, null);
    //         setTimeout(() => {
    //             scrollToBottom();
    //         }, 500);
    //     },
    //     [sendMessage, scrollToBottom],
    // );

    // const reload = useCallback(
    //     async (msgId: string, isQuestion: boolean) => {
    //         const activeSearch = useConversationStore.getState().activeSearch;
    //         if (!activeSearch) {
    //             return;
    //         }
    //         const currentIndex = activeSearch.messages.findIndex((msg) => msg.id === msgId);
    //         if (currentIndex === -1) return;

    //         const updatedMessages = [...activeSearch.messages];

    //         if (isQuestion) {
    //             updatedMessages.splice(currentIndex + 1);
    //         } else {
    //             updatedMessages.splice(currentIndex, 1);
    //             if (currentIndex > 0) {
    //                 const previousMessage = updatedMessages.splice(currentIndex - 1, 1)[0];
    //                 updatedMessages.push(previousMessage);
    //             }
    //         }

    //         updateActiveConversation({
    //             messages: updatedMessages,
    //         });

    //         const questionIndex = isQuestion ? currentIndex : currentIndex - 1;
    //         if (questionIndex < 0 || questionIndex >= activeSearch.messages.length) {
    //             return;
    //         }
    //         const question = activeSearch.messages[questionIndex].content;
    //         if (question) {
    //             setTimeout(() => {
    //                 scrollToBottom();
    //             }, 500);
    //             await sendMessage(question, null, msgId);
    //         }
    //     },
    //     [sendMessage, updateActiveConversation, scrollToBottom],
    // );

    const stableHandleSearch = useCallback(
        (key: string, attachments?: string[]) => {
            sendMessage(key, attachments);
        },
        [sendMessage],
    );

    const messages = activeConversation?.messages ?? initialMessages ?? [];

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full md:w-5/6 px-4 md:px-0">
                    <div className="flex flex-col w-full py-10">
                        {messages.map((m, index) => (
                            <ChatMessage
                                key={m.id}
                                searchId={'activeId'}
                                message={{ ...m }}
                                onSelect={()=>{}}
                                reload={(msgId: string, isQuestion: boolean) => {}}
                                isLoading={index === messages.length - 1 && isLoading}
                                isReadOnly={isReadOnly}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex-shrink-0 bg-white">
                <div className="mx-auto w-full md:w-5/6 px-4 md:px-0">
                    {!isReadOnly && (
                        <InputBar 
                            handleSearch={stableHandleSearch} 
                            showWebSearch={true} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
