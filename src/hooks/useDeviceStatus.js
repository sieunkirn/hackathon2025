// src/hooks/useDeviceStatus.js
import { useState, useEffect } from 'react'

export function useDeviceStatus() {
    const [deviceStatus, setDeviceStatus] = useState({
        time: new Date(),
        isOnline: navigator.onLine,
        battery: { level: 100, charging: false },
        networkType: 'unknown'
    })

    useEffect(() => {
        // 1. 시간 업데이트 (1초마다)
        const timeInterval = setInterval(() => {
            setDeviceStatus(prev => ({
                ...prev,
                time: new Date()
            }))
        }, 1000)

        // 2. 온라인/오프라인 상태 감지
        const handleOnline = () => {
            setDeviceStatus(prev => ({ ...prev, isOnline: true }))
        }

        const handleOffline = () => {
            setDeviceStatus(prev => ({ ...prev, isOnline: false }))
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        // 3. 배터리 상태 (지원되는 경우에만)
        const initBattery = async () => {
            if ('getBattery' in navigator) {
                try {
                    const battery = await navigator.getBattery()

                    const updateBattery = () => {
                        setDeviceStatus(prev => ({
                            ...prev,
                            battery: {
                                level: Math.round(battery.level * 100),
                                charging: battery.charging
                            }
                        }))
                    }

                    updateBattery()
                    battery.addEventListener('chargingchange', updateBattery)
                    battery.addEventListener('levelchange', updateBattery)

                    return () => {
                        battery.removeEventListener('chargingchange', updateBattery)
                        battery.removeEventListener('levelchange', updateBattery)
                    }
                } catch (error) {
                    console.log('Battery API not supported:', error)
                }
            }
        }

        // 4. 네트워크 타입 감지 (지원되는 경우에만)
        const updateNetworkInfo = () => {
            const connection = navigator.connection ||
                navigator.mozConnection ||
                navigator.webkitConnection

            if (connection) {
                const effectiveType = connection.effectiveType
                let networkType = 'WiFi'

                switch (effectiveType) {
                    case 'slow-2g':
                    case '2g':
                        networkType = '2G'
                        break
                    case '3g':
                        networkType = '3G'
                        break
                    case '4g':
                        networkType = '4G'
                        break
                    default:
                        networkType = 'WiFi'
                }

                setDeviceStatus(prev => ({ ...prev, networkType }))

                connection.addEventListener('change', updateNetworkInfo)
                return () => connection.removeEventListener('change', updateNetworkInfo)
            }
        }

        initBattery()
        updateNetworkInfo()

        // 클린업 함수
        return () => {
            clearInterval(timeInterval)
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    return deviceStatus
}
