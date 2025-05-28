import React, { createContext, useState, useEffect } from 'react'
import dataTranslate from './Data.json'

export const LanguageContext = createContext()

// Get initial language synchronously from localStorage
const getInitialLanguage = () => {
    const saved = localStorage.getItem('appLanguage')
    return saved && dataTranslate[saved] ? saved : 'english'
}

const getInitialTheme = () => {
    const saved = localStorage.getItem('theme')
    return saved === 'dark' ? 'dark' : 'light'
}

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(getInitialLanguage)
    const [content, setContent] = useState(dataTranslate[getInitialLanguage()])
    const [theme, setTheme] = useState(getInitialTheme)

    useEffect(() => {
        if (dataTranslate[language]) {
            setContent(dataTranslate[language])
            localStorage.setItem('appLanguage', language)
        }
    }, [language])

    useEffect(() => {
        localStorage.setItem('theme', theme) // <-- renamed here
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])


    return (
        <LanguageContext.Provider value={{ language, setLanguage, content, theme, setTheme }}>
            {children}
        </LanguageContext.Provider>
    )
}
