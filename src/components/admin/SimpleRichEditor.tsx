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

  // Ensure Enter creates <p> tags for consistent formatting
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      range.deleteContents();

      const p = document.createElement("p");
      p.appendChild(document.createElement("br"));
      range.insertNode(p);

      // Move cursor into the new paragraph
      const newRange = document.createRange();
      newRange.setStart(p, 0);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);

      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
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
        className="px-3 py-2 text-sm min-h-[80px] focus:outline-none prose prose-sm max-w-none [&>p]:my-1 [&>div]:my-1 [&>br+br]:block"
        style={{ minHeight: `${(rows || 3) * 24}px` }}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default SimpleRichEditor;
