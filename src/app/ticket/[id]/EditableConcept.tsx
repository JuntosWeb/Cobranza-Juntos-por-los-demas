"use client";

export function EditableConcept({ initialValue }: { initialValue: string }) {
  return (
    <span 
      contentEditable 
      suppressContentEditableWarning
      dangerouslySetInnerHTML={{ __html: initialValue }}
      className="outline-none border-b border-dashed border-transparent hover:border-slate-300 focus:border-blue-400 focus:bg-slate-50 transition-colors cursor-text print:border-none print:p-0 min-w-[50px] max-w-[75%] break-words inline-block"
    />
  );
}
