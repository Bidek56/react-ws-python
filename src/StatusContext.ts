import React from 'react'

export const StatusContext = React.createContext({ running: false, setRunning: {} as React.Dispatch<React.SetStateAction<boolean>> });