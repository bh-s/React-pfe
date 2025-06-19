// src/components/MarkdownViewer.tsx
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const MarkdownViewer = () => {
    const [markdown, setMarkdown] = useState("");

    useEffect(() => {
        fetch("/docs/file.md")
            .then((res) => res.text())
            .then((text) => setMarkdown(text))
            .catch((err) => console.error("Erreur de chargement du Markdown", err));
    }, []);

    return (
        <div style={{ padding: "1rem" }}>
            <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
    );
};

export default MarkdownViewer;
