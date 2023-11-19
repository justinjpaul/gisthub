import { useEffect, useState } from "react";
import { MarkdownViewer } from "./MarkdownViewer";
import TextFileViewer from "./TextFileViewer";

export const useGetFileContent = (filename) => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(filename); // Use the provided filename
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchContent();
  }, [filename]);

  return content;
};

export const FileView = ({ filename }) => {
  const content = useGetFileContent(filename);
  const fileExt =
    filename !== undefined ? filename.slice(filename.lastIndexOf(".") + 1) : "";

  return (
    <>
      {fileExt == "md" && MarkdownViewer(content)}
      {fileExt == "txt" && TextFileViewer(content)}
    </>
  );
};
