import { generateId } from '@/lib/shared-utils';
import { useRouter } from 'next/navigation';

export function useChat() {
    const router = useRouter();

    const handleChat = () => {
        const id = generateId();
        router.push(`/chat/?id=${id}`);
    };

    return handleChat;
}
