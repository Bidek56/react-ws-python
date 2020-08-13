import React from 'react'
import { CookiesProvider, useCookies } from "react-cookie";
import { StatusContext } from './StatusContext';
import { NewTask } from './NewTask'
import NavBar from './NavBar'
import Login from './Login'
import JobTableView from './JobView'

interface IMessage {
  count: number;
  log?: string;
  completed: number;
  type: string;
  token: string;
  user: string;
}

const App = () => {

    const ws = React.useRef<any|null>(null);
    const [user, setUser] = React.useState<string|null>(null)
    const [running, setRunning] = React.useState<boolean>(false)
    const [userCount, setUserCount] = React.useState<number>(0)
    const [completedCount, setCompletedCount] = React.useState<number>(0)
    const [log, setLog] = React.useState<string|undefined>()

    const statusValue = React.useMemo(() => ({ ws, running, setRunning, 
                                               userCount, setUserCount,
                                               completedCount, setCompletedCount,
                                               log, setLog
                                            }), [ws, running, setRunning, userCount, setUserCount, completedCount, setCompletedCount, log, setLog]);
    const [cookies, setCookie, removeCookie] = useCookies(['token']);

    const logout = () => {
        removeCookie("token");
        setUser(null)

        try {
            ws.current.send(JSON.stringify({ action: "doLogout", logout: { user: user }} ));
        }
		catch(err) {
		    console.error(err.message);
		}
    }

    const onReceiveMessage = ({ data }: { data: string; }) => {
        const obj: IMessage | null = JSON.parse(data);

        if (!obj)
            return

        switch (obj.type) {
            case "state":
                setCompletedCount(obj?.completed);
                setLog(obj?.log)
                break;
            case "users":
                setUserCount(obj?.count);
                break;
            case "token":
                if (obj?.token) {
                    setCookie("token", obj?.token, { maxAge: 3600, sameSite: 'strict'});
                    setUser(obj?.user)
                }
                break;
            default:
                console.error("unsupported event", data);
        }
    };

    React.useEffect(() => {

		//  ws?.current?.close();
        // console.log("Existing WS:", ws.current)

		try {
            if (!ws.current) {
			    ws.current = new WebSocket(`ws://localhost:6789`);
			    console.log("New WS:", ws.current)
            }

			if (ws.current) {
				ws.current.addEventListener("message", onReceiveMessage);
			}

			return () => {
				ws.current.removeEventListener("message", onReceiveMessage);
			};
		}
		catch(err) {
			console.error(err.message);
		}
	});

    return (
        <CookiesProvider>
            <React.Fragment>
                <StatusContext.Provider value={statusValue}>
                { user || (cookies && cookies.token) ?
                    <div>                        
                        <NavBar logout={logout} />
                        <br/>
                        <NewTask/> 
                        <br/>
                        <JobTableView/>                        
                    </div> : <Login setUser={setUser} />
                }
                </StatusContext.Provider>
            </React.Fragment>
        </CookiesProvider>
    )
}

export default App