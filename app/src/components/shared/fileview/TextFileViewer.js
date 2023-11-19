const TextFileViewer = (content) => {
  return (
    <div className="text-file-container">
      <pre>{content}</pre>
    </div>
  );
};

export default TextFileViewer;
