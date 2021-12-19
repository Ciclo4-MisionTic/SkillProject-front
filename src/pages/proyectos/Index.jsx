import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { PROYECTOS } from "graphql/proyectos/queries";
import DropDown from "components/Dropdown";
import { Dialog } from "@mui/material";
import { Enum_EstadoProyecto } from "utils/enums";
import { Enum_FaseProyecto } from "utils/enums";
import ButtonLoading from "components/ButtonLoading";
import { EDITAR_PROYECTO } from "graphql/proyectos/mutations";
import useFormData from "hooks/useFormData";
import PrivateComponent from "components/PrivateComponent";
import { Link } from "react-router-dom";
import { CREAR_INSCRIPCION } from "graphql/inscripciones/mutaciones";
import { useUser } from "context/userContext";
import { toast } from "react-toastify";
const IndexProyectos = () => {
  const { data: queryData, loading, error } = useQuery(PROYECTOS);
  const { userData } = useUser();
  useEffect(() => {
    console.log("datos proyecto", queryData);
  }, [queryData]);

  if (loading) return <div>Cargando...</div>;

  if (queryData.Proyectos && userData.estado === "AUTORIZADO") {
    return (
      <>
        <PrivateComponent roleList={["LIDER", "ADMINISTRADOR"]}>
          <div className="w-full border-b border-gray-200 flex items-center justify-end p-2">
            <div className="">
              <Link to={`/proyectos/mis-proyectos/${userData._id}`}>
                <button className="bg-indigo-500 text-gray-50 p-2 rounded-lg shadow-lg hover:bg-indigo-400">
                  Mis Proyectos
                </button>
              </Link>
            </div>
            {/* crear nuevo proyecto */}
            <div className="mx-3">
              <Link to="/proyectos/nuevo">
                <button className="bg-indigo-500 text-gray-50 p-2 rounded-lg shadow-lg hover:bg-indigo-400">
                  Crear nuevo proyecto
                </button>
              </Link>
            </div>
            {/* fin crear nuevo proyecto */}
          </div>
        </PrivateComponent>

        <div className="p-10 flex flex-col justify-center">
          <div className="grid lg:grid-cols-2 gap-4">
            {queryData.Proyectos.map((proyecto) => {
              return (
                <AccordionProyecto key={proyecto._id} proyecto={proyecto} />
              );
            })}
          </div>
        </div>
      </>
    );
  }

  return <></>;
};

const AccordionProyecto = ({ proyecto }) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <div className="shadow rounded-xl relative justify-center px-6 py-6 bg-gray-200 text-gray-900">
      <Link to={`/proyectos/${proyecto._id}`}>
        <div className="flex w-full ">
          <h2 className="uppercase font-bold font-20 ">{proyecto.nombre}</h2>
        </div>
        <div>
          <p>
            Liderado Por: {proyecto.lider.nombre} {proyecto.lider.apellido}
          </p>
          <div className="flex flex-col md:absolute md:right-12 md:top-12">
            <div className="">
              {proyecto.estado}
              {proyecto.estado === "INACTIVO" ? (
                <i className="fas fa-circle px-3 text-red-600" />
              ) : (
                <i className="fas fa-circle px-3 text-green-500" />
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* editar */}
      <div className="absolute right-0 top-3">
        <PrivateComponent roleList={["ADMINISTRADOR"]}>
          <i
            className="mx-4 fas fa-pen text-yellow-600 hover:text-yellow-400"
            onClick={() => {
              setShowDialog(true);
            }}
          />
        </PrivateComponent>
      </div>
      {/* inscribirse */}

      <PrivateComponent roleList={["ESTUDIANTE"]}>
        <InscripcionProyecto
          idProyecto={proyecto._id}
          estado={proyecto.estado}
          inscripciones={proyecto.inscripciones}
        />
      </PrivateComponent>

      <Dialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
        }}
      >
        <FormEditProyecto
          _id={proyecto._id}
          estado={proyecto.estado}
          fase={proyecto.fase}
        />
      </Dialog>
    </div>
  );
};

const FormEditProyecto = ({ _id, estado, fase }) => {
  const { form, formData, updateFormData } = useFormData();
  const [editarProyecto, { data: dataMutation, loading, error }] =
    useMutation(EDITAR_PROYECTO);

  const submitForm = (e) => {
    e.preventDefault();
    editarProyecto({
      variables: {
        _id,
        campos: formData,
      },
    });
  };

  useEffect(() => {
    console.log("data mutation", dataMutation);
  }, [dataMutation]);

  return (
    <div className="p-4">
      <h1 className="font-bold">Modificar Estado del Proyecto</h1>
      <form
        ref={form}
        onChange={updateFormData}
        onSubmit={submitForm}
        className="flex flex-col items-center"
      >
        <DropDown
          label="Estado del Proyecto"
          name="estado"
          options={Enum_EstadoProyecto}
          defaultValue={estado}
        />
        <DropDown
          label="Estado del Proyecto"
          name="fase"
          options={Enum_FaseProyecto}
          defaultValue={fase}
        />
        <ButtonLoading disabled={false} loading={loading} text="Confirmar" />
      </form>
    </div>
  );
};

const InscripcionProyecto = ({ idProyecto, estado, inscripciones }) => {
  const [estadoInscripcion, setEstadoInscripcion] = useState("");
  const [crearInscripcion, { data, loading, error }] =
    useMutation(CREAR_INSCRIPCION);
  const { userData } = useUser();

  useEffect(() => {
    if (userData && inscripciones) {
      const flt = inscripciones.filter(
        (el) => el.estudiante._id === userData._id
      );
      if (flt.length > 0) {
        setEstadoInscripcion(flt[0].estado);
      }
    }
  }, [userData, inscripciones]);

  useEffect(() => {
    if (data) {
      console.log(data);
      toast.success("inscripcion creada con exito");
    }
  }, [data]);

  const confirmarInscripcion = () => {
    crearInscripcion({
      variables: { proyecto: idProyecto, estudiante: userData._id },
    });
  };

  return (
    <>
      {estadoInscripcion !== "" ? (
        <span className="md:absolute md:bottom-10">{estadoInscripcion}</span>
      ) : (
        <ButtonLoading
          onClick={() => confirmarInscripcion()}
          disabled={estado === "INACTIVO"}
          loading={loading}
          text="Inscribirme"
        />
      )}
    </>
  );
};

export default IndexProyectos;
