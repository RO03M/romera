import { render } from "preact";
import { App } from "./app";
import "./index.css";

const app = document.getElementById("app");
if (app !== null) {
    render(<App />, app);
}
