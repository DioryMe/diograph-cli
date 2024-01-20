import { connectionInFocusId, roomInFocusId } from './configManager.js'

const statusCommand = () => {
  console.log(generateOutput())
}

// TODO: Generate table output with column headers
const generateOutput = () => {
  return [`roomInFocus: ${roomInFocusId()}`, `connectionInFocus: ${connectionInFocusId()}`].join(
    '\n',
  )
}

export { statusCommand }
