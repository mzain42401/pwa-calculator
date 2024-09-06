import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"

const useTheme = () => {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light"
    setTheme(savedTheme)
    document.documentElement.classList.toggle("dark", savedTheme === "dark")
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return { theme, toggleTheme }
}

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [result, setResult] = useState(null) // To store the final result
  const [expression, setExpression] = useState("") // To store the final expression
  const { theme, toggleTheme } = useTheme()

  const handleClick = (value) => {
    setDisplay((prev) => {
      let sanitizedPrev = prev.replace(/X/g, "*")
      const operators = ["/", "*", "-", "+"]

      if (value === "C") {
        setResult(null) 
        setExpression("") 
        return "0"
      }

      if (value === "←") {
        const newDisplay = prev.slice(0, -1) || "0"
        return newDisplay
      }

      if (value === "=") {
        try {
          const sanitizedExpression = sanitizedPrev.replace(/[*/+-]$/, "") // Remove trailing operator before evaluation
          const res = eval(sanitizedExpression).toString()
          setExpression(prev) 
          setResult(res) 
          return res.replace(/\*/g, "X")
        } catch {
          return "Error"
        }
      }

      const currentOperator = value === "X" ? "*" : value
      const lastChar = sanitizedPrev[sanitizedPrev.length - 1]

      // If last character is an operator and the new input is also an operator, replace the previous one
      if (operators.includes(lastChar) && operators.includes(currentOperator)) {
        return prev.slice(0, -1) + currentOperator.replace("*", "X")
      }

      // If initial value is "0", overwrite it unless the user types "."
      if (prev === "0" && value !== ".") {
        return value === "X" ? "X" : value
      }

      // Append the new value
      return prev + (value === "X" ? "X" : value)
    })
  }

  const buttons = [
    "/", "X", "-", "+",
    "9", "8", "7", "6",
    "5", "4", "3", "2",
    "1", "0", ".", "=",
    "C", "←" 
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Calculator</h1>
          <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>

        {/* Placeholder for result (even if not yet calculated) */}
        <div className="h-6 mb-2">
          {expression && (
            <p className="text-right text-lg font-semibold text-gray-600 dark:text-gray-300">
              {expression.replace(/\*/g, "X")} = 
            </p>
          )}
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
          <input
            type="text"
            value={display}
            readOnly
            className=" w-full text-right text-2xl font-bold bg-transparent text-gray-800 dark:text-white  outline-none"
          />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleClick(btn)}
              className={`p-3 rounded-lg text-lg font-semibold flex justify-center items-center
                ${btn === "=" || btn === "C"  
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : btn === "+" || btn === "-" || btn === "/" || btn === "X" || btn === "←"
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"}

                  ${
                  btn ==='='?"row-span-2":""
                  }
                  ${
                  btn ==='C'?"col-span-2":""
                  }
                transition-colors duration-200`}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Result is always shown below the input */}
        
      </div>
    </div>
  )
}
