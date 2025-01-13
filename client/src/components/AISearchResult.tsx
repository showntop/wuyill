// desktop/Verve/src/routes/App/lib/SearchResult.jsx
import { Message, TextSource } from '../lib/types';
import AnswerSection from './search/answer-section';
import ExpandableSection from './search/expandable-section';
import { FileTextIcon, Film, Images, ListPlusIcon, PlusIcon, TextSearchIcon, Map } from 'lucide-react';
import SourceBubble from './search/source-bubble';
// import FileSearchResult from './FileSearchResult';

const   AISearchResult = (props: { message: Message, onSelect: (question: string) => void;}) => {
  const { message, onSelect } = props;

  return (
    <div className="aiSearchResult">
      {message && message.content && <AnswerSection title={message.query} content={message.content} sources={message.sources||[]} />}

      {message && message.sources && message.sources.length > 0 && (
        <ExpandableSection title={'来源'} icon={TextSearchIcon}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {message.sources.map((source, index) => (
                    <div key={index}>
                        <SourceBubble source={source} onSelect={onSelect} />
                    </div>
                ))}
            </div>
        </ExpandableSection>
      )}
    </div>
  );
};

export default  AISearchResult ;