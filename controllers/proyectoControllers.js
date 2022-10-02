import Proyecto from "../models/Proyecto.js";
import Usuario from "../models/Usuario.js";

const obtenerProyectos = async (req, res) => {
  const proyectos = await Proyecto.find({
    $or: [
      { colaboradores: { $in: req.usuario } },
      { creador: { $in: req.usuario } },
    ],
  }).select("-tareas");
  res.json(proyectos);
};

const nuevoProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body);
  proyecto.creador = req.usuario._id;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const obtenerProyecto = async (req, res) => {
  const { id } = req.params;
  const proyectos = await Proyecto.findById(id)
    .populate({
      path: "tareas",
      populate: {
        path: "completado",
        select: "name",
      }
    })
    .populate("colaboradores", "name email ");
  if (!proyectos) {
    const error = new Error("No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (
    proyectos.creador.toString() !== req.usuario._id.toString() &&
    !proyectos.colaboradores.some(
      (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
    )
  ) {
    const error = new Error("Acción no Válida");
    return res.status(404).json({ msg: error.message });
  }
  res.json(proyectos);
};

const editarProyecto = async (req, res) => {
  const { id } = req.params;
  const proyectos = await Proyecto.findById(id);
  if (!proyectos) {
    const error = new Error("No Encontrado");
    return res.status(404).json({ error: error.message });
  }

  if (proyectos.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no Válida");
    return res.status(404).json({ error: error.message });
  }

  proyectos.nombre = req.body.nombre || proyectos.nombre;
  proyectos.descripcion = req.body.descripcion || proyectos.descripcion;
  proyectos.fechaEntrega = req.body.fechaEntrega || proyectos.fechaEntrega;
  proyectos.cliente = req.body.cliente || proyectos.cliente;

  try {
    const proyectoAlmacenado = await proyectos.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const eliminarProyecto = async (req, res) => {
  const { id } = req.params;
  const proyectos = await Proyecto.findById(id);
  if (!proyectos) {
    const error = new Error("No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (proyectos.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no Válida");
    return res.status(404).json({ msg: error.message });
  }

  try {
    await proyectos.deleteOne();
    res.json({ msg: "Proyecto eliminado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const buscarColaborador = async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email }).select(
    "-password -__v -token -createdAt -updatedAt -confirmado"
  );

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  res.json(usuario);
};

const agregarColaborador = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id);
  if (!proyecto) {
    const error = new Error("Proyecto no Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no válida");
    return res.status(404).json({ msg: error.message });
  }

  const { email } = req.body;
  const usuario = await Usuario.findOne({ email }).select(
    "-password -__v -token -createdAt -updatedAt -confirmado"
  );

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  // El colaborador no es el admin del proyecto
  if (proyecto.creador.toString() === usuario._id.toString()) {
    const error = new Error("El creador del proyecto no puede ser colaborador");
    return res.status(404).json({ msg: error.message });
  }

  // Revisar si el usuario ya es colaborador
  if (proyecto.colaboradores.includes(usuario._id)) {
    const error = new Error("El usuario ya es colaborador");
    return res.status(404).json({ msg: error.message });
  }

  // Esta bien, se puede agregar
  proyecto.colaboradores.push(usuario._id);
  await proyecto.save();
  res.json({ msg: "Colaborador agregado correctamente" });
};

const eliminarColaborador = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id);
  if (!proyecto) {
    const error = new Error("Proyecto no Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no válida");
    return res.status(404).json({ msg: error.message });
  }

  // Esta bien, se puede eliminar
  proyecto.colaboradores.pull(req.body.id);

  await proyecto.save();
  res.json({ msg: "Colaborador eliminado correctamente" });
};

export {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador,
  buscarColaborador,
};
