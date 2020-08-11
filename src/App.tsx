import React from 'react'
import { CookiesProvider, useCookies } from "react-cookie";

import { StatusContext } from './StatusContext';
import { NewTask } from './NewTask'
import NavBar from './NavBar'
import Login from './Login'

const App = () => {

    const [user, setUser] = React.useState<string | null>(null)
    const [running, setRunning] = React.useState<boolean>(false)
    const statusValue = React.useMemo(() => ({ running, setRunning }), [running, setRunning]);
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
                        </StatusContext.Provider>
                    </div> : <Login setUser={setUser} />
                }
            </React.Fragment>
        </CookiesProvider>
    )
}

export default App