import { useEffect, useRef } from "react";
import { normalizeRichTextHtml, plainTextFromRichText, sanitizeRichTextHtml } from "../../utils/richText";

const ToolbarButton = ({ label, children, onRun }) => (
  <button type="button" title={label} aria-label={label} onMouseDown={(event) => { event.preventDefault(); onRun(); }}>{children}</button>
);

export default function RichTextEditor({ value = "", onChange, placeholder = "Write formatted content...", required = false, minHeight = 220 }) {
  const editorRef = useRef(null);
  const selectionRef = useRef(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const html = normalizeRichTextHtml(value);
    if (sanitizeRichTextHtml(editor.innerHTML) !== html) editor.innerHTML = html;
  }, [value]);

  const saveSelection = () => {
    const selection = window.getSelection?.();
    if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) selectionRef.current = selection.getRangeAt(0).cloneRange();
  };

  const restoreSelection = () => {
    const selection = window.getSelection?.();
    if (!selection || !selectionRef.current) return;
    selection.removeAllRanges();
    selection.addRange(selectionRef.current);
  };

  const emitChange = () => {
    const editor = editorRef.current;
    if (!editor) return;
    onChange(sanitizeRichTextHtml(editor.innerHTML));
  };

  const run = (command, commandValue = null) => {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand(command, false, commandValue);
    saveSelection();
    emitChange();
  };

  const addLink = () => {
    const href = window.prompt("Enter the link URL (https://, /page, #section, mailto: or tel:)", "https://");
    if (href) run("createLink", href);
  };

  const cleanOnBlur = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const clean = sanitizeRichTextHtml(editor.innerHTML);
    if (editor.innerHTML !== clean) editor.innerHTML = clean;
    onChange(clean);
  };

  const handlePaste = (event) => {
    event.preventDefault();
    saveSelection();
    const html = event.clipboardData?.getData("text/html");
    const text = event.clipboardData?.getData("text/plain") || "";
    run("insertHTML", normalizeRichTextHtml(html || text));
  };

  return (
    <div className="admin-rich-editor">
      <div className="admin-rich-editor__toolbar" role="toolbar" aria-label="Text formatting">
        <select aria-label="Paragraph style" defaultValue="p" onMouseDown={saveSelection} onChange={(event) => run("formatBlock", event.target.value)}>
          <option value="p">Paragraph</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option><option value="h4">Heading 4</option><option value="blockquote">Quote</option>
        </select>
        <ToolbarButton label="Bold" onRun={() => run("bold")}><strong>B</strong></ToolbarButton>
        <ToolbarButton label="Italic" onRun={() => run("italic")}><em>I</em></ToolbarButton>
        <ToolbarButton label="Underline" onRun={() => run("underline")}><u>U</u></ToolbarButton>
        <ToolbarButton label="Strikethrough" onRun={() => run("strikeThrough")}><s>S</s></ToolbarButton>
        <ToolbarButton label="Bulleted list" onRun={() => run("insertUnorderedList")}>• List</ToolbarButton>
        <ToolbarButton label="Numbered list" onRun={() => run("insertOrderedList")}>1. List</ToolbarButton>
        <ToolbarButton label="Add hyperlink" onRun={addLink}>Link</ToolbarButton>
        <ToolbarButton label="Remove hyperlink" onRun={() => run("unlink")}>Unlink</ToolbarButton>
        <ToolbarButton label="Align left" onRun={() => run("justifyLeft")}>Left</ToolbarButton>
        <ToolbarButton label="Align center" onRun={() => run("justifyCenter")}>Center</ToolbarButton>
        <ToolbarButton label="Align right" onRun={() => run("justifyRight")}>Right</ToolbarButton>
        <label className="admin-rich-editor__color" title="Text color">Text <input type="color" defaultValue="#231f20" onMouseDown={saveSelection} onChange={(event) => run("foreColor", event.target.value)} /></label>
        <label className="admin-rich-editor__color" title="Highlight color">Highlight <input type="color" defaultValue="#bed747" onMouseDown={saveSelection} onChange={(event) => run("hiliteColor", event.target.value)} /></label>
        <ToolbarButton label="Clear formatting" onRun={() => run("removeFormat")}>Clear</ToolbarButton>
        <ToolbarButton label="Undo" onRun={() => run("undo")}>↶</ToolbarButton>
        <ToolbarButton label="Redo" onRun={() => run("redo")}>↷</ToolbarButton>
      </div>
      <div
        ref={editorRef}
        className="admin-rich-editor__content"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        style={{ minHeight }}
        onInput={emitChange}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        onFocus={saveSelection}
        onBlur={cleanOnBlur}
        onPaste={handlePaste}
      />
      {required ? <input className="admin-rich-editor__required" tabIndex="-1" aria-hidden="true" required readOnly value={plainTextFromRichText(value)} /> : null}
    </div>
  );
}
