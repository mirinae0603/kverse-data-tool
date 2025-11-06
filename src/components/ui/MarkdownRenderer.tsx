import React from 'react';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkBreaks from 'remark-breaks';


interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = ''
}) => {
  const components: Components = {
    img: ({ node, ...props }) => {
      let { alt } = props;
      let position: "left" | "right" | "block" | "inline" = "inline"; // default inline

      // Check if alt has a position specified
      const match = alt?.match(/\{position=(left|right|block)\}/);
      if (match) {
        position = match[1] as any;
        alt = alt?.replace(/\{position=(left|right|block)\}/, "");
      }

      // Determine additional styles based on position
      let positionStyles = "";
      if (position === "left") positionStyles = "text-center md:float-left md:mr-4 md:mb-4 !max-w-[200px]";
      else if (position === "right") positionStyles = "md:float-right md:ml-4 md:mb-4 !max-w-[200px]";
      else if (position === "block") positionStyles = "block my-4";

      return (
        <img
          {...props}
          alt={alt}
          className={`max-w-full h-auto rounded-lg control-float ${positionStyles} `}
        />
      );
    },
    pre: ({ node, ...props }) => (
      <pre {...props} className="overflow-x-auto max-w-full" />
    ),
    code: ({ node, ...props }) => (
      <code {...props} className="break-words" />
    )
  };

  const parsedChildren = content;

  return (
    <div className={`relative markdown-body ${className}`}>
      <Markdown
        remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={components}
      >
        {parsedChildren}
      </Markdown>
    </div>
  );
};

export default MarkdownRenderer;