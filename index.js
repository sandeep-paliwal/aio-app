const core = require('@actions/core')
const execSync = require('child_process').execSync

//get the command from user
const command = core.getInput('command')
if(!command || command === '')
  throw new Error("No aio command specified")


let commandStr = ""
if(command.toLowerCase() === 'build') {
  const namespace = core.getInput('AIO_RUNTIME_NAMESPACE');

  if(!namespace)
    throw new Error("AIO_RUNTIME_NAMESPACE must be passed to the action")

  process.env.AIO_RUNTIME_NAMESPACE = namespace

  commandStr = "sudo --preserve-env aio app deploy --skip-deploy"
}
else if(command.toLowerCase() === 'deploy') {
  const namespace = core.getInput('AIO_RUNTIME_NAMESPACE');
  const auth = core.getInput('AIO_RUNTIME_AUTH')

  if(!namespace || !auth)
    throw new Error("AIO_RUNTIME_NAMESPACE and AIO_RUNTIME_AUTH must be passed to the action")

  process.env.AIO_RUNTIME_NAMESPACE = namespace
  process.env.AIO_RUNTIME_AUTH = auth

  commandStr = "sudo --preserve-env aio app deploy --skip-build"
}
else if(command.toLowerCase() === 'test') {
  commandStr = "sudo npm install -g jest; npm i; aio app test"
}

try {
console.log(`Executing command ${command}!`)
runCLICommand(commandStr)
} catch (error) {
  core.setFailed(error.message);
}



function runCLICommand(commandStr) {
  let options = {
      stdio: 'inherit',
      env: process.env
  }
  execSync(commandStr, options)
}
