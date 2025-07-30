import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => {
    setCount(count + 1)
  }

  return (
    <div>
      <div data-testid="count">{count}</div>
      <button onClick={increment}>Increment</button>
    </div>
  )
}

export default Counter
