import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [jsonInput, setJsonInput] = useState('')
  const [error, setError] = useState('')
  const [response, setResponse] = useState(null)
  const [selectedOptions, setSelectedOptions] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest', label: 'Highest alphabet' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      // Validate JSON
      const parsedJson = JSON.parse(jsonInput)
      
      // Format request body according to API expectations
      const requestBody = {
        data: Array.isArray(parsedJson.data) ? parsedJson.data : []
      }
      
      // Use environment variable for API URL
      const result = await axios.post(import.meta.env.VITE_API_URL + '/bfhl', requestBody)
      const data = result.data
      setResponse({
        numbers: data.numbers,
        alphabets: data.alphabets,
        highest: data.highest_alphabet[0]
      })
      setShowDropdown(true)
    } catch (err) {
      setError(
        err instanceof SyntaxError 
          ? 'Invalid JSON format' 
          : err.response?.data?.message || 'API Error'
      )
      setShowDropdown(false)
    }
  }

  const handleOptionChange = (option) => {
    setSelectedOptions(prev => 
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    )
  }

  const renderFilteredResponse = () => {
    if (!response) return null

    let output = []
    if (selectedOptions.includes('numbers') && response.numbers) {
      output.push(<div key="numbers">Numbers: {response.numbers.join(', ')}</div>)
    }
    if (selectedOptions.includes('alphabets') && response.alphabets) {
      output.push(<div key="alphabets">Alphabets: {response.alphabets.join(', ')}</div>)
    }
    if (selectedOptions.includes('highest') && response.highest) {
      output.push(<div key="highest">Highest Alphabet: {response.highest}</div>)
    }

    return output
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Enter JSON (e.g., { "data": ["A","C","z"] })'
        />
        <button type="submit">Submit</button>
      </form>
      
      {error && <div className="error">{error}</div>}

      {showDropdown && (
        <div className="filters">
          <h3>Select Filters:</h3>
          {options.map(option => (
            <label key={option.value}>
              <input
                type="checkbox"
                checked={selectedOptions.includes(option.value)}
                onChange={() => handleOptionChange(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      )}

      <div className="response">
        {renderFilteredResponse()}
      </div>
    </div>
  )
}

export default App
