import { gql } from "@apollo/client";

const GET_INSCRIPCIONES = gql`
  query Inscripciones {
    Inscripciones {
      _id
      estado
      estudiante {
        _id
        nombre
        apellido
        correo
      }
      proyecto {
        _id
        nombre
        lider {
          _id
        }
      }
    }
  }
`;
const GET_INSCRIPCION = gql`
  query InscripcionDelEstudiante($estudiante: String!, $proyecto: String!) {
    InscripcionDelEstudiante(estudiante: $estudiante, proyecto: $proyecto) {
      _id
      estado
      estudiante {
        _id
      }
    }
  }
`;
export { GET_INSCRIPCIONES,  GET_INSCRIPCION };
