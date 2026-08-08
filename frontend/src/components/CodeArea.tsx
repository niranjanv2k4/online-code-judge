import { useNavigate } from "react-router-dom";
import { CodeXml, User } from "lucide-react";
import { useState } from "react";
import { Editor } from "@monaco-editor/react";


type Props = {
    code: string
    language: string
    handleReset: () => void
    setCode: (value: string) => void
    setLanguage: (value: string) => void
}

function CodeArea({ code, language, handleReset, setCode, setLanguage } : Props){

    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    const handleEditorWillMount = (monaco) => {
      monaco.editor.defineTheme("online-judge", {
          base: "vs-dark",
          inherit: true,

          rules: [
              { token: "comment", foreground: "64748B", fontStyle: "italic" },
              { token: "keyword", foreground: "C084FC" },
              { token: "string", foreground: "86EFAC" },
              { token: "number", foreground: "FBBF24" },
              { token: "type", foreground: "67E8F9" },
              { token: "function", foreground: "A5B4FC" },
              { token: "operator", foreground: "E879F9" }
          ],

          colors: {
              "editor.background": "#334155",
              "editor.foreground": "#E5E7EB",
              "editorLineNumber.foreground": "#475569",
              "editorLineNumber.activeForeground": "#A78BFA",
              "editorCursor.foreground": "#8B5CF6",
              "editor.selectionBackground": "#4F46E555",
              "editor.lineHighlightBackground": "#1E293B",
              "editorIndentGuide.background": "#1E293B",
              "editorIndentGuide.activeBackground": "#334155",
              "scrollbarSlider.background": "#47556966",
              "scrollbarSlider.hoverBackground": "#64748B88",
              "scrollbarSlider.activeBackground": "#8B5CF6AA"
          }
      });
  };

    const handleEditorMount = (editor) => {
        editor.onDidFocusEditorText(() => {
            setIsOpen(false);
        });
    };

    function handleLogOut () {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <div className="transition-all duration-700 flex flex-col p-4 h-full flex-1 box-border overflow-hidden">
        <div className='flex items-center w-full border-b border-slate-800 h-16'>
          <div className="flex items-center justify-between px-4 py-3">

            <div className="flex items-center gap-3">

              <CodeXml size={22} className="text-slate-300" />

              <h2 className="text-lg font-semibold text-slate-200">
                Code Editor
              </h2>

              <div className="h-5 w-px bg-slate-700"></div>

            </div>

            {/* Right Section */}
            <div className="relative inline-block text-left">

              <button
                onClick={() => setIsOpen(true)}
                className="w-20 flex items-center gap-2 rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-slate-700 transition hover:bg-slate-700"
              >
                {language}

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 text-slate-400 ml-auto"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  />
                </svg>
              </button>

              {/* Dropdown */}
              {isOpen && 
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg bg-slate-800 shadow-xl ring-1 ring-slate-700 z-1000">

                <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700" onClick={() => {setIsOpen(false); setLanguage("C")}}>
                  C
                </button>

                <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700" onClick={() => {setIsOpen(false); setLanguage("CPP")}}>
                  C++
                </button>
              </div>}
              

            </div>
          </div>
          <div className='gap-4 flex ml-auto'>
            <button
              type="button"
              className="w-28 text-white bg-indigo-600 hover:bg-blue-600 shadow-md font-medium rounded-lg text-sm px-4 py-2.5"
              onClick={ handleReset }
              >
              Reset
            </button>

            <button
              type="button"
              className="w-28 text-white bg-indigo-600 hover:bg-blue-600 shadow-md font-medium rounded-lg text-sm px-4 py-2.5"
              onClick={ handleLogOut }
              >
              Log Out
            </button>

            <User size={40} className='text- bg-slate-300 border rounded-full border-black' />
          </div>
        </div>
        <div className='w-full min-h-0 flex flex-1 overflow-hidden  mt-4'>
          <form id="codeForm" className='w-full h-full flex'>
            <div className="flex-1 w-full h-full bg-slate-700 border border-gray-400 rounded-md overflow-hidden">
              <Editor
                height="100%"
                theme="online-judge" // Beautiful dark mode built-in!
                beforeMount={handleEditorWillMount}
                onMount={handleEditorMount}
                language={language === "CPP" ? "cpp" : "c"}
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  fontSize: 14,
                  lineHeight: 24,
                  padding: { top: 12, bottom: 0},
                  lineNumbers: "on",
                  lineNumbersMinChars: 3,
                  glyphMargin: false,
                  folding: false,
                  minimap: { enabled: false},
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </form>
        </div>

      </div>
    )
}

export default CodeArea