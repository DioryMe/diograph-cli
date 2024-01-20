const listCommand = (resourceName: string) => {
  const validResources = ['rooms', 'connections']

  if (!validResources.includes(resourceName)) {
    console.error(
      `Invalid resource: ${resourceName}. Resource should be either 'rooms' or 'connections'`,
    )
    process.exit(1)
  }

  switch (resourceName) {
    case 'rooms':
      break
    case 'connections':
      break
    default:
      break
  }
}

export { listCommand }
