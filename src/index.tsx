import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { CookiesProvider } from "react-cookie";

const container = document.getElementById('root');
createRoot(container!).render(<CookiesProvider><App/></CookiesProvider>);
