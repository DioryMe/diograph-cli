import chalk from 'chalk'

const listCommand = (resourceName: string) => {
  const validResources = ['rooms', 'connections']

  if (!validResources.includes(resourceName)) {
    console.error(
      chalk.red(
        `Invalid resource: ${resourceName}. Resource should be either 'rooms' or 'connections'`,
      ),
    )
    process.exit(1)
  }

  switch (resourceName) {
    case 'rooms':
      console.log('this is a list of rooms')
      break
    case 'connections':
      break
    default:
      break
  }
}

export { listCommand }
