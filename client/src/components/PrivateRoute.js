import React, { useEffect, useState } from "react";
import { Route, Navigate } from "react-router-dom";

function PrivateRoute ( { path, element } ) {
  const [ isAuthenticated, setIsAuthenticated ] = useState( false );

  useEffect( () => {
    const token = localStorage.getItem( "token" );
    if ( token ) {
      setIsAuthenticated( true );
      <Navigate to="/" />;
    }
  }, [] );

  return isAuthenticated ? (
    <Route path={path} element={element} />
  ) : (
    <Navigate to="/login" />
  );
}

export default PrivateRoute;
