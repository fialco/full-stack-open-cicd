const Notification = ({ message, type }) => {
  const notification = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  const error = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  if (message === null) {
    return null
  }

  //if alertType is true -> notification, if false -> error
  if (type) {
    return (
      <div style={notification} className='notification'>
        {message}
      </div>
    )
  }

  return (
    <div style={error} className='error'>
      {message}
    </div>
  )
}

export default Notification
