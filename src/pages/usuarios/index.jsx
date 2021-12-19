import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USUARIOS } from 'graphql/usuarios/queries';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Enum_Rol, Enum_EstadoUsuario } from 'utils/enums';
import PrivateRoute from 'components/PrivateRoute';
import PrivateComponent from "components/PrivateComponent";

const IndexUsuarios = () => {
  const { data, error, loading, refetch } = useQuery(GET_USUARIOS);

  useEffect(()=>{
    if(data){
      refetch();
    }
  }, [data]);
  
  useEffect(() => {
    if (error) {
      toast.error('Error consultando los usuarios');
    }
  }, [error]);

  if (loading) return <div>Cargando....</div>;

  return (
    <PrivateRoute roleList={['ADMINISTRADOR','LIDER']}>
      <div className='text-white'>
      <div className='flex w-full items-center justify-center'>
        <h1 className='text-white text-2xl font-bold '>Tabla de usuarios</h1>
        </div>
        <table className='tabla'>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Correo</th>
              <th>Identificación</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {data && data.Usuarios ? (
              <>
                <PrivateComponent roleList={["ADMINISTRADOR"]}>
                  {data.Usuarios.map((u) => {
                    return (
                      <tr key={u._id}>
                        <td>{u.nombre}</td>
                        <td>{u.apellido}</td>
                        <td>{u.correo}</td>
                        <td>{u.identificacion}</td>
                        <td>{Enum_Rol[u.rol]}</td>
                        <td>{Enum_EstadoUsuario[u.estado]}</td>
                        <td>
                          <Link to={`/usuarios/editar/${u._id}`}>
                            <i className='fas fa-pen text-yellow-600 hover:text-yellow-400 cursor-pointer' />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </PrivateComponent>
                <PrivateComponent roleList={["LIDER"]}>
                  {data.Usuarios.filter((el) => el.rol === 'ESTUDIANTE').map((u) => {
                    return (
                      <tr key={u._id}>
                        <td>{u.nombre}</td>
                        <td>{u.apellido}</td>
                        <td>{u.correo}</td>
                        <td>{u.identificacion}</td>
                        <td>{Enum_Rol[u.rol]}</td>
                        <td>{Enum_EstadoUsuario[u.estado]}</td>
                        <td>
                          <Link to={`/usuarios/editar/${u._id}`}>
                            <i className='fas fa-pen text-yellow-600 hover:text-yellow-400 cursor-pointer' />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </PrivateComponent>
              </>
            ) : (
              <div>No autorizado</div>
            )}
          </tbody>
        </table>
      </div>
    </PrivateRoute>
  );
};

export default IndexUsuarios;
