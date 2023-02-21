import React, { useEffect, useState } from "react";
import { Route, Navigate } from "react-router-dom";

function PrivateRoute ( { path, element } ) {
  const [ isAuthenticated, setIsAuthenticated ] = useState( false );

  useEffect( () => {
    const token = localStorage.getItem( "token" );
    if ( token ) {
      console.log( "token", token );
      setIsAuthenticated( true );
    }
  }, [] );

  return isAuthenticated ? (
    <Route path={path} element={element} />
  ) : (
    <Navigate to="/login" />
  );
}

export default PrivateRoute;
