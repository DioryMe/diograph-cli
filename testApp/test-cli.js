const { App } = require('../dist/testApp/test-app')

const command = process.argv[2]
const args = process.argv.slice(3)

const app = new App()

app.run(command, ...args).then((response) => {
  console.log(response)
})
