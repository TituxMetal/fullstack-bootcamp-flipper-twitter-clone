const shutdownServer = server => {
  const exitHandler = async signal => {
    try {
      await server.close()
      console.info(
        `Got ${signal}. Graceful shutdown. Server successfully closed`
      )
      process.exit()
    } catch (error) {
      console.warn('Something went wrong closing the server', error.stack)
      process.exitCode = 1
    }
  }

  process.on('exit', exitHandler)
  process.on('SIGINT', exitHandler)
  process.on('SIGHUP', exitHandler)
  process.on('uncaughtException', exitHandler)
}

export default shutdownServer
