import React from "react";
import { useUser } from "context/userContext";

const Index = () => {
  const { userData } = useUser();
  return (
    <div>
      <div className=" h-96">
        <div className=" p-10 flex flex-col w-full  justify-center">
          <h1 className="text-white text-2xl font-bold  ">
            Bienvenido a Skill Project {userData.nombre}
          </h1>
          <h2 className="text-white text-2xl font-bold p-10 ">
            Esta aplicación te ayudará a manejar tus proyectos, ya seas lider o
            estudiante
          </h2>
          <h2 className="text-white text-2xl font-bold pt-10">
            Nota importante:{" "}
          </h2>
          <h2 className="text-white text-2xl font-bold p-10">
            Si no estás autorizado, no tendrás la barra de opciones desplegada
            en la izquierda, por lo tanto debes contactarte con tu lider de
            proyecto o en última instancia con los administradores de la
            aplicación
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Index;
