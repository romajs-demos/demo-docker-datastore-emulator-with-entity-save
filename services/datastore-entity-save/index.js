const Datastore = require('@google-cloud/datastore')
const waitPort = require('wait-port')
const entities = require('./entities.json')

const {
  DATASTORE_EMULATOR_HOST: datastoreEmulatorHost,
  DATASTORE_PROJECT_ID: projectId
} = process.env

console.log('Environment variables:', process.env)

console.log('Used variables:', {
  datastoreEmulatorHost,
  projectId
})

const [host, port] = datastoreEmulatorHost.split(':')
const datastoreClient = new Datastore({ projectId })

const insertEntities = (entities = []) => {
  return datastoreClient.save(entities).then(() => {
    console.info('Saved all entites successfully.')
  }).catch((err) => {
    console.error('Failed to save all entities:', err)
    return Promise.reject(err)
  })
}

return waitPort({ host, port: parseInt(port) }).then(() => {
  console.log('Entites:')
  console.table(entities)
  return insertEntities(entities).then(() => {
    console.log('Every entity was created successfully.')
  }).catch((err = {}) => {
    process.exit(err.code || -1)
  })
})
