import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchArticles } from "./api";
import styles from "./App.module.css";
export const App = () => {
    const [items, setItems] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    useEffect(() => {
        const run = async () => {
            try {
                const nextItems = await fetchArticles();
                setItems(nextItems);
            }
            catch (error) {
                setErrorMessage(error instanceof Error ? error.message : "Unknown error");
            }
        };
        void run();
    }, []);
    return (_jsxs("main", { className: styles.main, children: [_jsx("h1", { children: "Prolixy" }), _jsx("p", { children: "Latest scraped articles" }), errorMessage ? _jsx("p", { className: styles.error, children: errorMessage }) : null, _jsx("ul", { children: items.map((item) => (_jsxs("li", { children: [_jsx("a", { href: item.sourceUrl, target: "_blank", rel: "noreferrer", children: item.title }), item.summary ? _jsx("p", { children: item.summary }) : null] }, item.id))) })] }));
};
//# sourceMappingURL=App.js.map