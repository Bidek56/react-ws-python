import React from 'react'
import { CookiesProvider, useCookies } from "react-cookie";

import { StatusContext } from './StatusContext';
import { NewTask } from './NewTask'
import NavBar from './NavBar'
import Login from './Login'
import JobTableView from './JobView'

const App = () => {

    const [user, setUser] = React.useState<string | null>(null)
    const [running, setRunning] = React.useState<boolean>(false)
    const [userCount, setUserCount] = React.useState<number>(0)
    const [completedCount, setCompletedCount] = React.useState<number>(0)
    const [log, setLog] = React.useState<string|undefined>()

    const statusValue = React.useMemo(() => ({ running, setRunning, 
                                               userCount, setUserCount,
                                               completedCount, setCompletedCount,
                                               log, setLog
                                            }), [running, setRunning, userCount, setUserCount, completedCount, setCompletedCount, log, setLog]);
    const [cookies, , removeCookie] = useCookies(['token']);

    const logout = () => {
        removeCookie("token");
        setUser(null)
    }

    return (
        <CookiesProvider>
            <React.Fragment>
                { user || (cookies && cookies.token) ?
                    <div>
                        <StatusContext.Provider value={statusValue}>
                            <NavBar logout={logout} />
                            <br/>
                            <NewTask/> 
                            <br/>
                            <JobTableView/>
                        </StatusContext.Provider>
                    </div> : <Login setUser={setUser} />
                }
            </React.Fragment>
        </CookiesProvider>
    )
}

export default App