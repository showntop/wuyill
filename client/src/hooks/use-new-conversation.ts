import { generateId } from '@/lib/shared-utils';
import { useRouter } from 'next/navigation';

export function useNewConversation() {
    const router = useRouter();

    const handleNewConversation = () => {
        const id = generateId();
        router.push(`/chat/?id=${id}`);
    };

    return handleNewConversation;
}
