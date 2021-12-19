import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PROYECTO } from "graphql/proyectos/queries";
import { useMutation, useQuery } from "@apollo/client";
import { CREAR_INSCRIPCION } from "graphql/inscripciones/mutaciones";
import { toast } from "react-toastify";
import { useUser } from "context/userContext";
import ButtonLoading from "components/ButtonLoading";
import PrivateComponent from "components/PrivateComponent";
import { EDITAR_PROYECTO } from "graphql/proyectos/mutations";
import { EDITAR_OBJETIVO } from "graphql/proyectos/mutations";
import { CREAR_OBJETIVO } from "graphql/proyectos/mutations";
import DropDown from "components/Dropdown";
import Input from "components/Input";
import useFormData from "hooks/useFormData";
import { Enum_EstadoProyecto } from "utils/enums";
import { Enum_FaseProyecto } from "utils/enums";
import { AccordionStyled } from "components/Accordion";
import { AccordionSummaryStyled } from "components/Accordion";
import { AccordionDetailsStyled } from "components/Accordion";
import { Enum_TipoObjetivos } from "utils/enums";
import { ELIMINAR_OBJETIVO } from "graphql/proyectos/mutations";
import { nanoid } from "nanoid";
import { CREAR_AVANCE } from "graphql/proyectos/mutations";
import { EDITAR_DESCRIPCION } from "graphql/proyectos/mutations";
import { EDITAR_OBSERVACIONES } from "graphql/proyectos/mutations";
import { Tooltip } from "@mui/material";
const Proyecto = () => {
  const { idProyecto } = useParams();
  const { userData } = useUser();
  const { form, formData, updateFormData } = useFormData();
  const [mostrarInputs, setMostrarInputs] = useState(false);
  const [
    actualizarProyecto,
    { dataMutation: dataMutationP, lo: loadingp, err: errorp },
  ] = useMutation(EDITAR_PROYECTO);

  const {
    data: queryData,
    loading,
    error,
  } = useQuery(PROYECTO, {
    variables: { _id: idProyecto },
  });

  const submitForm = (e) => {
    e.preventDefault();
    formData.presupuesto = parseFloat(formData.presupuesto);

    actualizarProyecto({
      variables: {
        _id: idProyecto,
        campos: formData,
      },
    });
    actualizarProyecto
      ? toast.success("Edicion exitosa")
      : toast.error("Ups algo salio mal, no se pudo editar el proyecto");

    setMostrarInputs(false);
  };
  useEffect(() => {
    console.log("data mutation", dataMutationP);
  }, [dataMutationP]);

  useEffect(() => {
    console.log("datos proyecto", queryData);
    console.log("datos usuario", userData);
  }, [queryData, userData]);

  if (loading) return <div>Cargando...</div>;
  // validacion de estado desde el token
  if (queryData.Proyecto)
    return (
      <div className="h-full p-5 md:p-14 relative ">
        <Link to="/proyectos">
          <i className="fas fa-arrow-left text-pink-400 cursor-pointer font-bold text-xl" />
        </Link>
        <div className="justify-center text-white items-center">
          {mostrarInputs ? (
            <>
              <div className="absolute right-14 md:right-20 md:top-20">
                <PrivateComponent roleList={["ADMINISTRADOR"]}>
                  <i
                    className="mx-4 fas fa-times text-red-600 hover:text-red-700"
                    onClick={() => setMostrarInputs(!mostrarInputs)}
                  />
                </PrivateComponent>
              </div>
              <form
                ref={form}
                onChange={updateFormData}
                onSubmit={submitForm}
                className="text-black"
              >
                <Input
                  label="Nombre del Proyecto"
                  type="text"
                  name="nombre"
                  defaultValue={queryData.Proyecto.nombre}
                  required={true}
                />
                <DropDown
                  label="Estado del Proyecto"
                  name="estado"
                  options={Enum_EstadoProyecto}
                  disabled={true}
                  defaultValue={queryData.Proyecto.estado}
                />
                <DropDown
                  label="Fase del Proyecto"
                  name="fase"
                  disabled={true}
                  options={Enum_FaseProyecto}
                  defaultValue={queryData.Proyecto.fase}
                />
                <Input
                  label="Presupuesto del Proyecto"
                  type="number"
                  name="presupuesto"
                  defaultValue={queryData.Proyecto.presupuesto}
                />
                <Input
                  label="fecha de inicio del Proyecto"
                  type="date"
                  disabled={true}
                  name="fechaInicio"
                  defaultValue={queryData.Proyecto.fechaInicio.slice(0, -14)}
                />
                <Input
                  label="fecha de finalizacion del Proyecto"
                  type="date"
                  name="fechaFin"
                  disabled={true}
                  defaultValue={queryData.Proyecto.fechaFin.slice(0, -14)}
                  required={true}
                />

                <div className="flex justify-center">
                  <ButtonLoading
                    disabled={false}
                    loading={loadingp}
                    text="Confirmar"
                  />
                </div>
              </form>
            </>
          ) : (
            <div className="">
              {userData._id === queryData.Proyecto.lider._id &&
              queryData.Proyecto.estado === "ACTIVO" ? (
                <div className="absolute md:right-20 md:top-20">
                  <PrivateComponent roleList={["ADMINISTRADOR", "LIDER"]}>
                    <i
                      className="mx-4 fas fa-pen text-yellow-600 hover:text-yellow-400"
                      onClick={() => setMostrarInputs(!mostrarInputs)}
                    />
                  </PrivateComponent>
                </div>
              ) : (
                ""
              )}
              <div className="flex items-center justify-between ">
                <h2 className="font-24 text-white font-bold">
                  {queryData.Proyecto.nombre}
                </h2>
                <PrivateComponent roleList={["ESTUDIANTE", "ADMINISTRADOR"]}>
                  <InscripcionProyecto
                    idProyecto={queryData.Proyecto._id}
                    estado={queryData.Proyecto.estado}
                    inscripciones={queryData.Proyecto.inscripciones}
                  />
                </PrivateComponent>
              </div>
              <div className="flex flex-col text-white font-bold">
                <span className="">estado: {queryData.Proyecto.estado}</span>
                <span className="">fase: {queryData.Proyecto.fase}</span>
                <span>presupuesto: {queryData.Proyecto.presupuesto} COP</span>
              </div>
              <div className="flex flex-col">
                <span>
                  fecha inicio: {queryData.Proyecto.fechaInicio.slice(0, -14)}
                </span>
                <span>
                  fecha fin: {queryData.Proyecto.fechaFin.slice(0, -14)}
                </span>
              </div>
              <div className="flex flex-col mb-4 mt-4">
                <h2>datos del lider: </h2>
                <span>
                  nombre: {queryData.Proyecto.lider.nombre}{" "}
                  {queryData.Proyecto.lider.apellido}
                </span>
                <span>correo: {queryData.Proyecto.lider.correo}</span>
              </div>
            </div>
          )}

          {/* acordeon Objetivos*/}
          <div className="pb-4  w-full">
            <AccordionStyled>
              <AccordionSummaryStyled>
                <h2>Objetivos</h2>
              </AccordionSummaryStyled>
              <AccordionDetailsStyled>
                {userData._id === queryData.Proyecto.lider._id &&
                queryData.Proyecto.estado === "ACTIVO" ? (
                  <div className="">
                    <CrearObjetivo idProyecto={queryData.Proyecto._id} />
                  </div>
                ) : (
                  ""
                )}
                {queryData.Proyecto.objetivos.length > 0 ? (
                  queryData.Proyecto.objetivos.map((objetivo) => {
                    return (
                      <Objetivo
                        key={nanoid()}
                        tipo={objetivo.tipo}
                        descripcion={objetivo.descripcion}
                        idProyecto={queryData.Proyecto._id}
                        idObjetivo={objetivo._id}
                        indexObjetivo={queryData.Proyecto.objetivos.indexOf(
                          objetivo
                        )}
                        userData={userData}
                        lider={queryData.Proyecto.lider}
                        estadoProyecto={queryData.Proyecto.estado}
                      />
                    );
                  })
                ) : (
                  <h2>Aun no se han registrado avances</h2>
                )}
              </AccordionDetailsStyled>
            </AccordionStyled>
          </div>
          {/* acordeon Avances*/}
          <div className="">
            <AccordionStyled>
              <AccordionSummaryStyled>
                <h2>Avances</h2>
              </AccordionSummaryStyled>
              <AccordionDetailsStyled>
                {/* {userData._id ===
                queryData.Proyecto.inscripciones.estudiante._id
                  ? "usuario encontrado"
                  : " no pude"} */}
                <div className="">
                  <CrearAvance
                    creadoPor={userData._id}
                    idProyecto={queryData.Proyecto._id}
                  />
                </div>
                {queryData.Proyecto.avances.length > 0 ? (
                  queryData.Proyecto.avances.map((avance) => {
                    return (
                      <Avance
                        key={nanoid()}
                        idAvance={avance._id}
                        fecha={avance.fecha.slice(0, -14)}
                        observaciones={avance.observaciones}
                        descripcion={avance.descripcion}
                        creadoPor={
                          avance.creadoPor.nombre +
                          " " +
                          avance.creadoPor.apellido
                        }
                        userData={userData._id}
                        idUsuario={avance.creadoPor._id}
                        lider={queryData.Proyecto.lider._id}
                      />
                    );
                  })
                ) : (
                  <h2>Aun no se han registrado avances</h2>
                )}
              </AccordionDetailsStyled>
            </AccordionStyled>
          </div>
        </div>
      </div>
    );

  return (
    <>
      <h1 className="text-center text-3xl text-white">
        hubo un error O.o por favor comunicate con un lider o administrador
      </h1>
    </>
  );
};
const Objetivo = ({
  tipo,
  descripcion,
  idProyecto,
  indexObjetivo,
  idObjetivo,
  userData,
  lider,
  estadoProyecto,
}) => {
  const { form, formData, updateFormData } = useFormData();
  const [editar, setEditar] = useState(false);
  const [editarObjetivo, { data: dataMutation, loading, error }] =
    useMutation(EDITAR_OBJETIVO);
  const submitForm = (e) => {
    e.preventDefault();
    editarObjetivo({
      variables: {
        idProyecto: idProyecto,
        indexObjetivo: indexObjetivo,
        campos: formData,
      },
    });
    setEditar(false);
  };
  useEffect(() => {
    console.log("data mutation", dataMutation);
  }, [dataMutation]);

  return (
    <div className="mx-5 relative text-black my-4 bg-gray-50 p-8 rounded-lg flex flex-col shadow-xl">
      {editar ? (
        <>
          <div className="absolute right-14 md:right-5 md:top-5">
            <PrivateComponent roleList={["ADMINISTRADOR", "LIDER"]}>
              <i
                className="mx-4 fas fa-times text-red-600 hover:text-red-700"
                onClick={() => setEditar(!editar)}
              />
            </PrivateComponent>
          </div>

          <form
            ref={form}
            onChange={updateFormData}
            onSubmit={submitForm}
            className="flex flex-col items-center"
          >
            <Input
              label="Descripcion Objetivo"
              type="text"
              name="descripcion"
              defaultValue={descripcion}
              required={true}
            />

            <DropDown
              label="Tipo Objetivo"
              name="tipo"
              options={Enum_TipoObjetivos}
              defaultValue={tipo}
            />
            <ButtonLoading
              disabled={false}
              loading={loading}
              text="Confirmar"
            />
          </form>
        </>
      ) : (
        <>
          <div className="text-lg font-bold">{tipo}</div>
          <div>{descripcion}</div>
          {userData._id === lider._id && estadoProyecto === "ACTIVO" ? (
            <PrivateComponent roleList={["ADMINISTRADOR", "LIDER"]}>
              <div className="absolute md:right-5 md:top-5">
                <i
                  className="mx-4 fas fa-pen text-yellow-600 hover:text-yellow-400"
                  onClick={() => setEditar(!editar)}
                />
              </div>
            </PrivateComponent>
          ) : (
            ""
          )}
          {userData._id === lider._id && estadoProyecto === "ACTIVO" ? (
            <EliminarObjetivo
              key={nanoid()}
              idObjetivo={idObjetivo}
              idProyecto={idProyecto}
            />
          ) : (
            ""
          )}
        </>
      )}
    </div>
  );
};
const CrearObjetivo = ({ idProyecto }) => {
  const { form, formData, updateFormData } = useFormData();
  const [crearObjetivo, { data: dataMutation, loading, error }] =
    useMutation(CREAR_OBJETIVO);
  const [mostrar, setMostrar] = useState(false);
  const submitForm = (e) => {
    e.preventDefault();
    crearObjetivo({
      variables: {
        idProyecto: idProyecto,
        campos: formData,
      },
    });
    crearObjetivo
      ? toast.success("Objetivo creado con exito")
      : toast.error("Ups algo salio mal, no se pudo crear el objetivo");
  };
  useEffect(() => {
    console.log("data mutation", dataMutation);
  }, [dataMutation]);
  return (
    <div className="">
      {mostrar ? (
        <>
          <div className="absolute md:right-5 md:top-5">
            <PrivateComponent roleList={["ADMINISTRADOR", "LIDER"]}>
              <i
                className="mx-4 fas fa-times text-red-600 hover:text-red-400"
                onClick={() => setMostrar(!mostrar)}
              />
            </PrivateComponent>
          </div>
          <form
            ref={form}
            onChange={updateFormData}
            onSubmit={submitForm}
            className="flex flex-col items-center"
          >
            <Input
              label="Descripcion Objetivo"
              type="text"
              name="descripcion"
              required={true}
            />

            <DropDown
              label="Tipo Objetivo"
              name="tipo"
              options={Enum_TipoObjetivos}
            />
            <ButtonLoading
              disabled={false}
              loading={loading}
              text="Confirmar"
            />
          </form>
        </>
      ) : (
        <>
          <div className="absolute md:right-5 md:top-5">
            <PrivateComponent roleList={["ADMINISTRADOR", "LIDER"]}>
              <i
                className="mx-4 fas fa-plus text-green-600 hover:text-green-400"
                onClick={() => setMostrar(!mostrar)}
              />
            </PrivateComponent>
          </div>
        </>
      )}
    </div>
  );
};
const EliminarObjetivo = ({ idProyecto, idObjetivo }) => {
  const [eliminarObjetivo, { data: dataMutation, loading, error }] =
    useMutation(ELIMINAR_OBJETIVO, {
      variables: {
        idProyecto: idProyecto,
        idObjetivo: idObjetivo,
      },
    });

  return (
    <div className="absolute right-14 md:right-10 md:top-8 cursor-pointer">
      <PrivateComponent roleList={["ADMINISTRADOR", "LIDER"]}>
        <i
          className="mx-4 fas fa-minus text-red-600 hover:text-red-700"
          onClick={() => eliminarObjetivo()}
        />
      </PrivateComponent>
    </div>
  );
};
const Avance = ({
  fecha,
  observaciones,
  creadoPor,
  descripcion,
  userData,
  idUsuario,
  idAvance,
  lider,
}) => {
  const [editarObs, setEditarObs] = useState(false);
  const [editarDesc, setEditarDesc] = useState(false);
  const { form, formData, updateFormData } = useFormData();

  const [
    editarDescripcion,
    { data: dataMutationEit, lo: loadingEdit, err: errorEdit },
  ] = useMutation(EDITAR_DESCRIPCION);
  const [
    editarObservaciones,
    { data: dataMutationObs, lo: loadingObs, err: errorObs },
  ] = useMutation(EDITAR_OBSERVACIONES);
  const submitForm = (e) => {
    e.preventDefault();
    editarDescripcion({
      variables: {
        _id: idAvance,
        descripcion: formData.descripcion,
      },
    });
    editarDescripcion
      ? toast.success("Descripcion editada con exito")
      : toast.error("Ups algo salio mal, no se pudo editar la descripcion");
  };

  const submitForm2 = (e) => {
    e.preventDefault();
    editarObservaciones({
      variables: {
        _id: idAvance,
        observaciones: formData.observaciones,
      },
    });
    editarObservaciones
      ? toast.success("Observacion editada con exito")
      : toast.error("Ups algo salio mal, no se pudo editar la observacion");
  };

  return (
    <div className="mx-5 relative text-black my-4 bg-gray-50 p-8 rounded-lg flex flex-col shadow-xl">
      {editarDesc ? (
        <>
          <div className="absolute md:right-5 md:top-5">
            <PrivateComponent roleList={["ADMINISTRADOR", "LIDER"]}>
              <i
                className="mx-4 fas fa-times text-red-600 hover:text-red-400"
                onClick={() => setEditarDesc(!editarDesc)}
              />
            </PrivateComponent>
          </div>

          <form
            ref={form}
            onChange={updateFormData}
            onSubmit={submitForm}
            className="flex flex-col items-center text-black"
          >
            <h2>Edicion de Descripción</h2>
            <Input
              className="text-black"
              label="Descripcion Avance"
              type="text"
              name="descripcion"
              defaultValue={descripcion}
              required={true}
            />

            <ButtonLoading
              disabled={false}
              loading={loadingEdit}
              text="Confirmar"
            />
          </form>
        </>
      ) : (
        <>
          <div className="text-lg font-bold">{fecha}</div>
          {/* observaciones */}
          <div>{observaciones}</div>
          {/* descripcion */}
          <>
            <div className="">
              {userData === idUsuario ? (
                <div className="absolute md:right-10 md:top-10">
                  <PrivateComponent roleList={["ADMINISTRADOR", "ESTUDIANTE"]}>
                    <i
                      className="mx-4 fas fa-pen text-yellow-600 hover:text-yellow-400"
                      onClick={() => setEditarDesc(!editarDesc)}
                    />
                  </PrivateComponent>
                </div>
              ) : (
                ""
              )}

              <div className="">{descripcion}</div>
            </div>
          </>

          <div>{creadoPor}</div>
        </>
      )}
      {editarObs ? (
        <>
          <div className="absolute md:right-5 md:top-5">
            <PrivateComponent roleList={["ADMINISTRADOR", "LIDER"]}>
              <i
                className="mx-4 fas fa-times text-red-600 hover:text-red-400"
                onClick={() => setEditarObs(!editarObs)}
              />
            </PrivateComponent>
          </div>

          <form
            ref={form}
            onChange={updateFormData}
            onSubmit={submitForm2}
            className="flex flex-col items-center text-black"
          >
            <h2>Agregar Observación</h2>
            <Input
              className="text-black"
              label="Descripcion Avance"
              type="text"
              name="observaciones"
              defaultValue={observaciones}
              required={true}
            />

            <ButtonLoading
              disabled={false}
              loading={loadingEdit}
              text="Confirmar"
            />
          </form>
        </>
      ) : (
        <>
          {userData === lider ? (
            <div className="absolute md:right-5 md:top-5">
              <PrivateComponent roleList={["ADMINISTRADOR", "LIDER"]}>
                <i
                  className="mx-4 fas fa-pen text-yellow-600 hover:text-yellow-400"
                  onClick={() => setEditarObs(!editarObs)}
                />
              </PrivateComponent>
            </div>
          ) : (
            ""
          )}
        </>
      )}
    </div>
  );
};

const CrearAvance = ({ idProyecto, creadoPor }) => {
  const [mostrar, setMostrar] = useState(false);
  const { form, formData, updateFormData } = useFormData();
  const [crearAvance, { data: dataMutation, loading, error }] =
    useMutation(CREAR_AVANCE);
  const {
    data: queryData,
    loadingP,
    errorP,
  } = useQuery(PROYECTO, {
    variables: { _id: idProyecto },
  });
  const submitForm = (e) => {
    e.preventDefault();
    crearAvance({
      variables: {
        proyecto: idProyecto,
        creadoPor: creadoPor,
        descripcion: formData.descripcion,
        fecha: formData.fecha,
      },
    });
    crearAvance
      ? toast.success("Avance creado con exito")
      : toast.error("Ups algo salio mal, no se pudo crear el avance");
  };

  useEffect(() => {
    crearAvance ?? console.log(queryData);
  }, [crearAvance, queryData]);

  useEffect(() => {
    console.log("data mutation crear Avance", dataMutation);
  }, [dataMutation]);

  return (
    <div className="">
      {mostrar ? (
        <>
          <div className="absolute md:right-5 md:top-5">
            <PrivateComponent roleList={["ESTUDIANTE"]}>
              <i
                className="mx-4 fas fa-times text-red-600 hover:text-red-400"
                onClick={() => setMostrar(!mostrar)}
              />
            </PrivateComponent>
          </div>
          <form
            ref={form}
            onChange={updateFormData}
            onSubmit={submitForm}
            className="flex flex-col items-center"
          >
            <Input
              label="Descripcion Avance"
              type="text"
              name="descripcion"
              required={true}
            />
            <Input
              label="fecha Avance"
              type="date"
              name="fecha"
              required={true}
            />

            <ButtonLoading
              disabled={false}
              loading={loading}
              text="Confirmar"
            />
          </form>
        </>
      ) : (
        <div className="absolute md:right-5 md:top-5">
          <PrivateComponent roleList={["ESTUDIANTE"]}>
            <i
              className="mx-4 fas fa-plus text-green-600 hover:text-green-400"
              onClick={() => setMostrar(!mostrar)}
            />
          </PrivateComponent>
        </div>
      )}
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
        <span>{estadoInscripcion}</span>
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
export default Proyecto;
