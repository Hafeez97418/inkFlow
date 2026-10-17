import React, { useState } from 'react'
import type { ReactNode, SyntheticEvent } from 'react'
import { Snackbar, Alert } from '@mui/material'
import type { AlertColor } from '@mui/material'
import { NotificationContext } from './notificationContextDef'

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<AlertColor>('info')

  const showNotification = (msg: string, sev: AlertColor = 'info') => {
    setMessage(msg)
    setSeverity(sev)
    setOpen(true)
  }

  const showSuccess = (msg: string) => showNotification(msg, 'success')
  const showError = (msg: string) => showNotification(msg, 'error')
  const showInfo = (msg: string) => showNotification(msg, 'info')

  const handleClose = (_event: Event | SyntheticEvent<unknown, Event> | null, reason?: string) => {
    if (reason === 'clickaway') return
    setOpen(false)
  }

  return (
    <NotificationContext.Provider value={{ showNotification, showSuccess, showError, showInfo }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%', boxShadow: 3 }}>
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  )
}
