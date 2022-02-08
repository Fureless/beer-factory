import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [ready, setReady] = useState(false)
    const [userId, setUserId] = useState(null)
    const [userPosition, setUserPosition] = useState(null)

    const login = useCallback((jwtToken, id, pos) => {
        setToken(jwtToken)
        setUserId(id)
        setUserPosition(pos)

        localStorage.setItem(storageName, JSON.stringify({
            userId: id, token: jwtToken, userPosition: pos
        }))
    }, [])


    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        setUserPosition(null)
        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))

        if (data && data.token) {
            login(data.token, data.userId, data.userPosition)
        }
        setReady(true)
    }, [login])

    return {login, logout, token, userId, userPosition, ready}
}
