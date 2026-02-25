import { useRef, useCallback } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Bold, Italic, Underline } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimpleRichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

const SimpleRichEditor = ({ value, onChange, placeholder, rows = 3, className }: SimpleRichEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = useCallback((command: string) => {
    document.execCommand(command, false);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    editorRef.current?.focus();
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  return (
    <div className={cn("border border-input rounded-md bg-background", className)}>
      <div className="flex items-center gap-0.5 border-b border-input px-1 py-1">
        <Toggle size="sm" aria-label="Bold" onPressedChange={() => execCommand("bold")}>
          <Bold className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle size="sm" aria-label="Italic" onPressedChange={() => execCommand("italic")}>
          <Italic className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle size="sm" aria-label="Underline" onPressedChange={() => execCommand("underline")}>
          <Underline className="h-3.5 w-3.5" />
        </Toggle>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="px-3 py-2 text-sm min-h-[80px] focus:outline-none prose prose-sm max-w-none [&>*]:my-0"
        style={{ minHeight: `${(rows || 3) * 24}px` }}
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default SimpleRichEditor;
