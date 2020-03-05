const core = require('@actions/core')
const exec = require('@actions/exec')

//get the command from user
const command = core.getInput('command')
if(!command || command === '')
  throw new Error("No aio command specified")

const os = core.getInput('os');

let commandStr = ""
if(command.toLowerCase() === 'build') {
  const namespace = core.getInput('AIO_RUNTIME_NAMESPACE');

  if(!namespace)
    throw new Error("AIO_RUNTIME_NAMESPACE must be passed to the action")

  // process.env.AIO_RUNTIME_NAMESPACE = namespace
  core.exportVariable('AIO_RUNTIME_NAMESPACE', namespace)

  commandStr = "aio app deploy --skip-deploy"
}
else if(command.toLowerCase() === 'deploy') {
  const namespace = core.getInput('AIO_RUNTIME_NAMESPACE');
  const auth = core.getInput('AIO_RUNTIME_AUTH')

  if(!namespace || !auth)
    throw new Error("AIO_RUNTIME_NAMESPACE and AIO_RUNTIME_AUTH must be passed to the action")

  // process.env.AIO_RUNTIME_NAMESPACE = namespace
  // process.env.AIO_RUNTIME_AUTH = auth
  core.exportVariable('AIO_RUNTIME_NAMESPACE', namespace)
  core.exportVariable('AIO_RUNTIME_AUTH', auth)

  commandStr = "aio app deploy --skip-build"
}
else if(command.toLowerCase() === 'test') {
  commandStr = "npm install -g jest; npm i; aio app test"
}

try {
  console.log(`Executing command ${command}!`)
  runCLICommand(os, commandStr)
  .then(res => {
    console.log("action completed")
  })
  .catch(e => {
    core.setFailed(e.message);
  })
} catch (error) {
  core.setFailed(error.message);
}


async function runCLICommand(os, commandStr) {
  if(os && os.startsWith("ubuntu"))
    commandStr = 'sudo ' + commandStr

  await exec.exec(commandStr)
}
