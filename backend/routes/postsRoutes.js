import express from "express";
import { conectarDB } from "../db/db.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_APIKEY,
});

const moderationPrompt = `
    Eres un moderador de contenido para una comunidad en línea. Tu tarea es verificar si el contenido del siguiente post cumple con las reglas de la comunidad y si el código proporcionado no contiene elementos malintencionados. Aquí están las reglas:

    1. **Lenguaje inapropiado**: No se permite el uso de lenguaje vulgar, discriminatorio o de odio.
    2. **Contenido violento o explícito**: No se permite contenido relacionado con violencia explícita, abuso, o cualquier tipo de contenido gráfico perturbador.
    3. **Contenido sensible**: No se permite contenido que sea explícitamente sexual, relacionado con drogas, o que incite comportamientos peligrosos o ilegales.
    4. **Spam o contenido no relacionado**: No se permite contenido repetitivo o irrelevante para el tema de la comunidad.
    5. **Protección de privacidad**: No se permite compartir información personal de otras personas sin su consentimiento (por ejemplo, números de teléfono, direcciones de correo electrónico).
    6. **Código malintencionado**: Verifica que el código proporcionado no contenga ninguna de las siguientes amenazas:
        - **Inyección de código**: Como JavaScript malicioso (XSS), comandos de shell, o intentos de ejecutar código en el servidor.
        - **Acceso a información privada**: Intentos de acceder a bases de datos o información privada.
        - **Uso de funciones peligrosas**: Como "eval()", "document.write()", "setInterval()", "exec()", entre otras.
        - **Otras amenazas**: Cualquier otro comportamiento malicioso o peligroso.


    Por favor, revisa este contenido y proporciona un informe sobre cualquier violación de las reglas de la comunidad o sobre cualquier contenido que sea inapropiado o sensible.
    

    Eres un sistema de moderación. Tu única tarea es no aceptar contenido personalizable que sea ofensivo para las personas, eres moderador de un sitio para programadores, que los datos ingresados sean apodos leves y nombres correctos esta bien, mas no aceptes de manera correcta los campos que sean verdaderamente ofensivos, asegurate que sea un espacio seguro para todas las edades:

1. Rechaza cualquier texto que contenga lenguaje sexual explícito,
   incluso si no es violento ni de odio.
2. Rechaza insultos, groserías, vulgaridades o expresiones ofensivas,
   sin importar el contexto.
3. Rechaza incitaciones a violencia, odio, discriminación o autolesiones.
4. Si el texto es inofensivo, responde con "ACEPTADO".
5. Si el texto viola alguna regla, responde con "RECHAZADO".
6. No ignores ninguna palabra. No justifiques. Solo responde con ACEPTADO o RECHAZADO.
`;

const router = express.Router();

// Post
// Get all posts
router.get("/", async (req, res) => {
  try {
    const connection = await conectarDB();
    const [rows] = await connection.execute("SELECT * FROM post");
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error("There`s an error in the server:", error);
    res.status(500).json({ mensaje: "There`s an error in the server" });
  }
});

// Get a post by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await conectarDB();
    const query = ("SELECT * FROM post WHERE post_id = ?");
    const [rows] = await connection.execute(query, [id]);
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error("Server error", error);
    res.status(500).json({ mensaje: "Server error" });
  }
});

// Get post depending on a user
router.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await conectarDB();
    const query = `
      SELECT * FROM post WHERE user_id = ?
    `;
    const [rows] = await connection.execute(query, [id]);
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error("Server error", error);
    res.status(500).json({ mensaje: "Server error" });
  }
});


// Create post
router.post("/", async (req, res) => {
  const { user_id, post_title, post_description, post_code } = req.body;

  try {
    const connection = await conectarDB();

    const postData = {
      user_id,
      post_title,
      post_description,
      post_code,
    };

    const postDataJson = JSON.stringify(postData, null, 2);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: moderationPrompt },
        { role: "user", content: postDataJson },
      ],
    });

    const decision = completion.choices[0].message.content;

    if (decision === "RECHAZADO") {
      return res.status(400).json({
        ok: false,
        message: "El contenido fue rechazado por el sistema de moderación IA",
      });
    }

    const query =
      "INSERT INTO post (user_id, post_title, post_description, post_code) VALUES (?, ?, ?, ?)";
    const [rows] = await connection.execute(query, [
      user_id,
      post_title,
      post_description,
      post_code,
    ]);
    await connection.end();
    res.status(201).json({ mensaje: "Post created succesfully" });
  } catch (error) {
    console.error("There`s an error in the server:", error);
    res.status(500).json({ mensaje: "There`s an error in the server" });
  }
});

// Update post
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id, post_title, post_description, post_code } = req.body;

  try {
    const connection = await conectarDB();

    const postData = {
      user_id,
      post_title,
      post_description,
      post_code,
    };

    const postDataJson = JSON.stringify(postData, null, 2);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: moderationPrompt },
        { role: "user", content: postDataJson },
      ],
    });

    const decision = completion.choices[0].message.content;

    if (decision === "RECHAZADO") {
      return res.status(400).json({
        ok: false,
        message: "El contenido fue rechazado por el sistema de moderación IA",
      });
    }

    const query =
      "UPDATE post SET user_id = ?, post_title = ?, post_description = ?, post_code = ? WHERE post_id = ?";
    const [rows] = await connection.execute(query, [
      user_id,
      post_title,
      post_description,
      post_code,
      id,
    ]);
    await connection.end();
    res.status(200).json({ mensaje: "Post updated successfully" });
  } catch (error) {
    console.error("There`s an error in the server:", error);
    res.status(500).json({ mensaje: "There`s an error in the server" });
  }
});

// Delete post
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await conectarDB();
    const query = "DELETE FROM post WHERE post_id = ?";
    const [rows] = await connection.execute(query, [id]);
    await connection.end();
    res.status(200).json({ mensaje: "Post deleted successfully." });
  } catch (error) {
    console.error("There`s an error in the server:", error);
    res.status(500).json({ mensaje: "There`s an error in the server" });
  }
});

export default router;
