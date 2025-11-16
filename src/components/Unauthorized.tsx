import React from 'react'
import { Alert } from 'react-bootstrap'

const Unauthorized = () => {
  return (
    <div style={{width:"60%",display:"flex",justifyContent:"center",marginLeft:"auto",marginRight:"auto"}}>
      <Alert variant="danger" style={{marginTop:100,textAlign:"center"}}>
        <Alert.Heading>Unauthorized Access</Alert.Heading>
        <p>
          You do not have permission to view this page.
        </p>
      </Alert>
    </div>
  )
}

export default Unauthorized
