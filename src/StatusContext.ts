import React from 'react'

export type contextType = {
    ws: React.MutableRefObject<any>;
    running: boolean; 
    setRunning: React.Dispatch<React.SetStateAction<boolean>>;
    userCount: number; 
    setUserCount: React.Dispatch<React.SetStateAction<number>>;
    completedCount: number;
    setCompletedCount: React.Dispatch<React.SetStateAction<number>>;
    log: string|undefined;
    setLog: React.Dispatch<React.SetStateAction<string|undefined>>;
    logContent: string|undefined;    
    loginError: string|undefined;
};

export const StatusContext = React.createContext<contextType>({ ws: {} as React.MutableRefObject<any>,
                                                running: false, setRunning: {} as React.Dispatch<React.SetStateAction<boolean>>,
                                                userCount: 0, setUserCount: {} as React.Dispatch<React.SetStateAction<number>>,
                                                completedCount: 0, setCompletedCount: {} as React.Dispatch<React.SetStateAction<number>>,
                                                log: undefined, setLog: {} as React.Dispatch<React.SetStateAction<string|undefined>>,
                                                logContent: undefined, loginError: undefined,
                                            });