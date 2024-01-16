const listCommand = (resourceName: string) => {
  const validResources = ['rooms', 'connections', 'connectionContents']

  if (!validResources.includes(resourceName)) {
    console.error(
      `Invalid resource: ${resourceName}. Resource should be either 'rooms', 'connections' or 'connectionContents'.`,
    )
    process.exit(1)
  }

  switch (resourceName) {
    case 'rooms':
      break
    case 'connections':
      break
    case 'connectionContents':
      break
    default:
      break
  }
}

export { listCommand }
