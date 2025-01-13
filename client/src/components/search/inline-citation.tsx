import { TextSource } from "@/lib/types";

export function InlineCitation(props: { source: TextSource; sourceNumber: number }) {
    const { source, sourceNumber } = props;
    return (
        <a href={source.link} target="_blank" rel="noreferrer" className="relative hover:text-primary bottom-1.5 rounded-full px-1 text-xs bg-gray-300">
            {sourceNumber}
        </a>
    );
}
