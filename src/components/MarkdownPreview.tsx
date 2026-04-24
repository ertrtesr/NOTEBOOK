import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type MarkdownPreviewProps = {
  markdown: string;
  className?: string;
};

export function MarkdownPreview({
  markdown,
  className = "",
}: MarkdownPreviewProps) {
  return (
    <div className={`note-preview overflow-auto px-4 py-3 ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown || "_暂无内容_"}</ReactMarkdown>
    </div>
  );
}
