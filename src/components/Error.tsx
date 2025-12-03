import React from 'react'
import { Alert } from 'react-bootstrap' 
const Error = () => {
  return (
    <div style={{display:"flex",flexDirection:"column",maxWidth:400,margin:"auto"}}>
       <Alert style={{flex:1,justifyContent:"center"}}><h1>Server Error</h1>
       <p>Sorry, something went wrong on our end. Please try again later.</p>
       </Alert>
    </div>
  )
}

export default Error
