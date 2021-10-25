import React from 'react'
import { CookiesProvider, useCookies } from "react-cookie";
import { StatusContext } from './StatusContext';
import NewTask from './NewTask'
import NavBar from './NavBar'
import Login from './Login'
import JobTableView from './JobView'

interface IMessage {
    type: string;
    count: number;
    log?: string;
    log_content?: string;
    completed?: number;
    token?: string;
    user?: string;
    message?: string;
}

const App = () => {

    const ws = React.useRef<any|null>(null);
    const [user, setUser] = React.useState<string|null>(null)
    const [running, setRunning] = React.useState<boolean>(false)
    const [userCount, setUserCount] = React.useState<number>(0)
    const [completedCount, setCompletedCount] = React.useState<number>(0)
    const [log, setLog] = React.useState<string|undefined>()
    const [logContent, setLogContent] = React.useState<string|undefined>()
    const [loginError, setLoginError] = React.useState<string|undefined>()

    const statusValue = React.useMemo(() => ({ ws, running, setRunning, 
                                               userCount, setUserCount,
                                               completedCount, setCompletedCount,
                                               log, setLog, logContent, loginError
                                            }), [ws, running, setRunning, userCount, setUserCount, completedCount, setCompletedCount, log, setLog, logContent, loginError]);
    const [cookies, setCookie, removeCookie] = useCookies(['token']);

    const logout = () => {
        removeCookie("token");
        setUser(null)

        try {
            ws.current.send(JSON.stringify({ action: "doLogout", logout: { user: user }} ));
        }
		catch(err: unknown) {
            if (err instanceof Error)
		        console.error("WS error:", err.message);
		}
    }

    const onReceiveMessage = ({ data }: { data: string; }) => {
        const obj: IMessage | null = JSON.parse(data);

        if (!obj)
            return

        // console.log("Msg rcvd:", obj)

        switch (obj.type) {
            case "state":
                if (obj?.completed) setCompletedCount(obj?.completed);
                setLog(obj?.log);
                setLogContent(obj?.log_content)
                break;
            case "users":
                setUserCount(obj?.count);
                break;
            case "token":
                if (obj?.token) {
                    setCookie("token", obj?.token, { maxAge: 3600, sameSite: 'strict'});
                    if (obj?.user) setUser(obj?.user);
                    setLoginError(undefined)
                } else {
                    setLoginError("Token not found");
                }
                break;
            case "error":
                setLoginError(obj?.message);
                break;
            default:
                console.error("unsupported event", data);
        }
    };

    const onError = (data:any) => {
        console.error("WS error")
        setLoginError("Websocket error")
    }

    React.useEffect(() => {

		//  ws?.current?.close();
        // console.log("Existing WS:", ws.current)

		try {
            if (!ws.current) {
			    ws.current = new WebSocket(`ws://localhost:6789`);
			    // console.log("New WS:", ws.current)
            }

			if (ws.current) {
				ws.current.addEventListener("message", onReceiveMessage);
                ws.current.addEventListener("error", onError);
			}

			return () => {
				ws.current.removeEventListener("message", onReceiveMessage);
			};
		}
		catch(err: unknown) {
            if (err instanceof Error)
			    console.error("Error:", err.message);
		}
	});

    return (
        <CookiesProvider>
            <StatusContext.Provider value={statusValue}>
                { user || cookies?.token ?
                    <div>                        
                        <NavBar logout={logout} />
                        <br/>
                        <NewTask token={cookies?.token}/>
                        <br/>
                        <JobTableView/>                        
                    </div> : <Login setUser={setUser} />
                }
            </StatusContext.Provider>
        </CookiesProvider>
    )
}

export default App