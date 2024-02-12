import { connectionInFocusAddress, roomInFocusId } from './configManager.js'

const statusCommand = async () => {
  const output = await generateOutput()
  console.log(output)
}

// TODO: Generate table output with column headers
const generateOutput = async () => {
  return Promise.all([roomInFocusId(), connectionInFocusAddress()]).then((values) => {
    return [`Room in focus: ${values[0]}`, `Connection in focus: ${values[1]}`].join('\n')
  })
}

export { statusCommand }
