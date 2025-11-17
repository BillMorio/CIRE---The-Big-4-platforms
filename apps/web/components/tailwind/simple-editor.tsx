"use client";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  type JSONContent,
  handleCommandNavigation,
} from "novel";
import { useEffect, useState, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { CharacterCount, Placeholder, StarterKit, AIHighlight, MarkdownExtension, HighlightExtension, Command, renderItems, createSuggestionItems, useEditor } from "novel";
import { Separator } from "./ui/separator";
import GenerativeMenuSwitch from "./generative/generative-menu-switch";
import { Smile, Hash, AtSign, Sparkles } from "lucide-react";
import { EditorBubbleItem } from "novel";
import { Button } from "./ui/button";
import { EmojiPicker } from "../ui/emoji-picker";

// Simple slash command for social media - only AI features
const simpleSuggestionItems = createSuggestionItems([
  {
    title: "Continue writing",
    description: "Use AI to continue your writing",
    searchTerms: ["ai", "continue"],
    icon: <Sparkles className="w-4 h-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
    },
  },
]);

const simpleSlashCommand = Command.configure({
  suggestion: {
    items: () => simpleSuggestionItems,
    render: renderItems,
  },
});

// Minimal extensions for social media
const simpleExtensions = [
  StarterKit.configure({
    // Disable features not needed for social media
    heading: false,
    codeBlock: false,
    blockquote: false,
    horizontalRule: false,
    dropcursor: false,
    bulletList: false,
    orderedList: false,
    listItem: false,
  }),
  Placeholder.configure({
    placeholder: "What's on your mind? Type '/' for AI assistance...",
  }),
  CharacterCount,
  AIHighlight,
  HighlightExtension,
  MarkdownExtension.configure({
    html: false,
    transformCopiedText: true,
  }),
  simpleSlashCommand,
];

const defaultContent: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};

// Simple AI suggestions for social media
const socialSuggestions = [
  {
    title: "✨ Improve Writing",
    description: "Enhance clarity and engagement",
    command: ({ editor, range }: any) => {
      editor.chain().focus().deleteRange(range).run();
      // AI command would be triggered here
    },
  },
  {
    title: "🎯 Make Shorter",
    description: "Condense for social media",
    command: ({ editor, range }: any) => {
      editor.chain().focus().deleteRange(range).run();
    },
  },
  {
    title: "📝 Expand Ideas",
    description: "Add more detail and context",
    command: ({ editor, range }: any) => {
      editor.chain().focus().deleteRange(range).run();
    },
  },
  {
    title: "🔄 Rephrase",
    description: "Say it differently",
    command: ({ editor, range }: any) => {
      editor.chain().focus().deleteRange(range).run();
    },
  },
  {
    title: "😊 Add Emojis",
    description: "Make it more engaging",
    command: ({ editor, range }: any) => {
      editor.chain().focus().deleteRange(range).run();
    },
  },
  {
    title: "# Add Hashtags",
    description: "Suggest relevant hashtags",
    command: ({ editor, range }: any) => {
      editor.chain().focus().deleteRange(range).run();
    },
  },
  {
    title: "🎨 Different Tone",
    description: "Professional, casual, or friendly",
    command: ({ editor, range }: any) => {
      editor.chain().focus().deleteRange(range).run();
    },
  },
];

interface SimpleEditorProps {
  platformLimit?: number; // Character limit (e.g., 280 for Twitter)
  showHashtags?: boolean;
  showMentions?: boolean;
  initialContent?: string; // New prop for passing content from parent
}

const TailwindSimpleEditor = ({ 
  platformLimit = 280, 
  showHashtags = true, 
  showMentions = true,
  initialContent: initialContentProp
}: SimpleEditorProps) => {
  const [initialContent, setInitialContent] = useState<null | JSONContent>(null);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [charsCount, setCharsCount] = useState(0);
  const [openAI, setOpenAI] = useState(false);
  const [editorInstance, setEditorInstance] = useState<EditorInstance | null>(null);

  const debouncedUpdates = useDebouncedCallback(async (editor: EditorInstance) => {
    const json = editor.getJSON();
    const charCount = editor.storage.characterCount.characters();
    setCharsCount(charCount);
    window.localStorage.setItem("simple-content", JSON.stringify(json));
    setSaveStatus("Saved");
  }, 500);

  useEffect(() => {
    // If initialContent prop is provided, use it
    if (initialContentProp) {
      setInitialContent({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: initialContentProp
              }
            ]
          }
        ]
      });
    } else {
      // Otherwise, try localStorage or use default
      const content = window.localStorage.getItem("simple-content");
      if (content) setInitialContent(JSON.parse(content));
      else setInitialContent(defaultContent);
    }
  }, [initialContentProp]);

  // Trigger character count update when initialContent changes
  useEffect(() => {
    if (editorInstance && initialContent) {
      // Small delay to let editor render
      setTimeout(() => {
        const charCount = editorInstance.storage.characterCount.characters();
        setCharsCount(charCount);
      }, 100);
    }
  }, [initialContent, editorInstance]);

  if (!initialContent) return null;

  const isOverLimit = charsCount > platformLimit;
  const percentUsed = (charsCount / platformLimit) * 100;

  return (
    <div className="relative w-full">
      {/* Character Counter - Always Visible */}
      <div className="flex absolute right-3 top-3 z-10 gap-2 items-center">
        <div className="rounded-lg bg-background/80 backdrop-blur-sm px-3 py-1.5 text-sm border shadow-sm">
          <span className={isOverLimit ? "text-red-500 font-semibold" : "text-muted-foreground"}>
            {charsCount}
          </span>
          <span className="text-muted-foreground"> / {platformLimit}</span>
        </div>
        {/* Progress Ring */}
        <div className="relative w-8 h-8">
          <svg className="transform -rotate-90 w-8 h-8">
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-muted/20"
            />
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 14}`}
              strokeDashoffset={`${2 * Math.PI * 14 * (1 - percentUsed / 100)}`}
              className={
                isOverLimit
                  ? "text-red-500"
                  : percentUsed > 90
                  ? "text-yellow-500"
                  : "text-blue-500"
              }
            />
          </svg>
        </div>
      </div>

      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={simpleExtensions}
          className="relative min-h-[300px] w-full border-muted bg-background rounded-lg border shadow-sm p-4"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            attributes: {
              class:
                "prose prose-lg dark:prose-invert font-default focus:outline-none max-w-full min-h-[250px]",
            },
          }}
          onCreate={({ editor }) => {
            setEditorInstance(editor);
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
            setSaveStatus("Unsaved");
          }}
        >
          {/* Slash Command Menu */}
          <EditorCommand className="z-50 h-auto max-h-[400px] overflow-y-auto rounded-lg border border-muted bg-background/95 backdrop-blur-sm px-1 py-2 shadow-xl transition-all">
            <EditorCommandEmpty className="px-2 py-4 text-center text-muted-foreground">
              <div className="flex flex-col items-center gap-2">
                <Sparkles className="w-8 h-8 text-muted-foreground/50" />
                <p>Type to search AI commands...</p>
              </div>
            </EditorCommandEmpty>
            <EditorCommandList>
              {socialSuggestions.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command(val)}
                  className="flex w-full items-center space-x-3 rounded-md px-3 py-2.5 text-left text-sm hover:bg-accent aria-selected:bg-accent cursor-pointer transition-colors"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-muted bg-background/50 text-xl">
                    {item.title.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          {/* Minimal Bubble Menu - Only AI */}
          <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <div className="flex items-center gap-1 px-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Select text for AI help
              </span>
            </div>
          </GenerativeMenuSwitch>
        </EditorContent>
      </EditorRoot>

      {/* Quick Action Buttons Below Editor */}
      {editorInstance && (
        <QuickActionsExternal
          editor={editorInstance}
          showMentions={showMentions}
          showHashtags={showHashtags}
        />
      )}

      {/* Warning Message */}
      {isOverLimit && (
        <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-600 dark:text-red-400">
          ⚠️ Content exceeds platform limit by {charsCount - platformLimit} characters
        </div>
      )}
    </div>
  );
};

// Quick actions component with external editor reference
function QuickActionsExternal({ 
  editor, 
  showMentions, 
  showHashtags 
}: { 
  editor: EditorInstance; 
  showMentions?: boolean; 
  showHashtags?: boolean;
}) {
  const handleEmojiSelect = (emoji: string) => {
    editor.chain().focus().insertContent(emoji).run();
  };

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {showMentions && (
        <Button
          variant="outline"
          size="sm"
          className="text-xs gap-1.5"
          onClick={() => {
            editor.chain().focus().insertContent("@").run();
          }}
        >
          <AtSign className="w-3 h-3" />
          Mention
        </Button>
      )}
      {showHashtags && (
        <Button
          variant="outline"
          size="sm"
          className="text-xs gap-1.5"
          onClick={() => {
            editor.chain().focus().insertContent("#").run();
          }}
        >
          <Hash className="w-3 h-3" />
          Hashtags
        </Button>
      )}
      <EmojiPicker onEmojiSelect={handleEmojiSelect}>
        <Button variant="outline" size="sm" className="text-xs gap-1.5">
          <Smile className="w-3 h-3" />
          Emoji
        </Button>
      </EmojiPicker>
    </div>
  );
}

export default TailwindSimpleEditor;
