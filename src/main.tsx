import { render } from 'preact'
import { App } from './app.tsx'
import "./index.css";
import './config/i18next.ts';

render(<App />, document.getElementById('app')!)
