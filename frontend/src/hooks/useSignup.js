import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (email, password) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        setIsLoading(false)
        setError(errorData.error || 'Signup failed')
        return
      }

      const json = await response.json()
      
      // Save the user to local storage
      localStorage.setItem('user', JSON.stringify(json))

      // Update the auth context
      dispatch({ type: 'LOGIN', payload: json })

      // Update loading state
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      setError('An unexpected error occurred')
    }
  }

  return { signup, isLoading, error }
}