import React from 'react';
import PrivateComponent from 'components/PrivateComponent';
import { render, screen } from '@testing-library/react';
import { UserContext } from 'context/userContext';

it('renders not authorized if the roles dont match', () => {
    render(
      <UserContext.Provider value={{ userData: { rol: 'LIDER' } }}>
        <PrivateComponent roleList={['ADMINISTRADOR']}>
          <div>Este es el children</div>
        </PrivateComponent>
      </UserContext.Provider>
    );
    expect(screen.getByTestId('not-authorized')).toBeEmptyDOMElement(
      'No estás autorizado para ver este componente.'
    );
  });
  
  it('renders the children if the user role is in the roleList', () => {
    render(
      <UserContext.Provider value={{ userData: { rol: 'ADMINISTRADOR' } }}>
        <PrivateComponent roleList={['ADMINISTRADOR']}>
          <div data-testid='children'>Este es el children</div>
        </PrivateComponent>
      </UserContext.Provider>
    );
    expect(screen.getByTestId('children')).toBeInTheDocument();
  });