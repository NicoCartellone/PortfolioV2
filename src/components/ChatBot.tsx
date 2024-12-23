import React, { useRef, useState, useEffect } from "react";
import profileImg from "../../public/profile.png";
import SendIcon from "./icons/SendIcon";

type Message = {
  id: string;
  type: "bot" | "user";
  text: React.ReactNode;
};

type Props = {
  apiKey: string;
};

const ANSWERS = {
  presentacion: (
    <div>
      <p>
        Hola, mi nombre es <strong>Nicolás Cartellone</strong> 👋. Soy desarrollador <strong>frontend</strong> web y móvil con más de <strong>1 año de experiencia</strong> 💻. Actualmente, me desempeño como freelancer, transformando las ideas de los clientes en productos y aportando mi valor.
      </p>
    </div>
  ),
  
  contacto: (
    <div>
      <p>
        Si deseas ponerte en contacto conmigo, puedes hacerlo a través de mi perfil en LinkedIn:
      </p>
      <p>
        <a
          className="underline"
          href="https://www.linkedin.com/in/nicolas-cartellone/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <strong>LinkedIn</strong> 💼
        </a>
      </p>
      <p>
        O mediante mi correo electrónico:
      </p>
      <p>
        <a className="underline" href="mailto:nicolas.cartellone@gmail.com">
          <strong>nicolas.cartellone@gmail.com</strong> 📧
        </a>
      </p>
      <p>
        Además, puedes consultar mi:
      </p>
      <p>
        <a className="underline" href="src/assets/CV.pdf" target="_blank">
          <strong>Curriculum</strong> 📄
        </a>
      </p>
    </div>
  ),
  
  tecnologia: (
    <div>
      <p>
        Actualmente, mi conjunto principal de tecnologías incluye:
      </p>
      <ul>
        <li><strong>React</strong> ⚛️ con <strong>Vite.js</strong> o <strong>Next.js</strong> para desarrollo web</li>
        <li><strong>React Native</strong> 📱 con <strong>Expo</strong> o <strong>RN CLI</strong> para aplicaciones móviles</li>
        <li><strong>Javascript</strong> y <strong>Typescript</strong> 💬 como lenguajes de programación</li>
        <li><strong>Tailwind CSS</strong> 🎨 para el diseño</li>
        <li><strong>Node.js</strong> 🌐 con <strong>Express</strong> o <strong>Firebase</strong> para el backend</li>
        <li><strong>SQL Server</strong> y <strong>MongoDB</strong> 💾 para bases de datos</li>
        <li><strong>Git</strong> y <strong>Github</strong> 🛠️ para control de versiones</li>
        <li><strong>Vercel</strong> o <strong>Netlify</strong> 🚀 para el despliegue de proyectos web</li>
        <li><strong>Google Play Store</strong> 📲 para aplicaciones móviles</li>
      </ul>
    </div>
  ),
  
  experiencia: (
    <div>
      <p>
        Cuento con más de <strong>un año de experiencia</strong> 🌟 trabajando como freelance, tanto en equipos colaborativos como de manera individual para diversos clientes. Mi enfoque es aportar valor al convertir ideas en productos concretos.
      </p>
      <p>
        He participado en todas las fases de un proyecto, incluyendo:
      </p>
      <ul>
        <li>Captura de los requisitos iniciales del cliente 📋</li>
        <li>Análisis de tecnologías y metodologías a utilizar 🔍</li>
        <li>Diseño visual UX/UI 🎨</li>
        <li>Desarrollo y despliegue del producto final 🚀</li>
      </ul>
    </div>
  ),
  
  formacion: (
    <div>
      <p>
        Actualmente, estoy cursando la <strong>tecnicatura en Desarrollo de Aplicaciones Móviles</strong> 📚 en la Universidad Nacional de La Matanza, con un enfoque en el desarrollo nativo de aplicaciones móviles.
      </p>
      <p>
        Además, completé un <strong>curso intensivo de React Native</strong> 🎓 en la agencia Aprendizaje a lo Largo de la Vida en colaboración con IBM, donde adquirí los fundamentos de React Native y trabajé en equipo para crear una aplicación como proyecto final.
      </p>
      <p>
        De manera autodidacta, continúo ampliando y reforzando mis conocimientos en diversas tecnologías, aplicándolas en proyectos personales para seguir creciendo como desarrollador 🌱.
      </p>
    </div>
  ),
  
  default: (
    <div>
      <p>
        No entendí tu pregunta 😕. ¿Podrías reformularla?
      </p>
    </div>
  ),
};



const EXAMPLES = [
  { text: "Hola", label: "presentacion" },
  { text: "Como estas ?", label: "presentacion" },
  { text: "Quien sos?", label: "presentacion" },
  { text: "Cuales son tus redes?", label: "contacto" },
  { text: "como puedo contactarte?", label: "contacto" },
  { text: "Con que tecnologias trabajas?", label: "tecnologia" },
  { text: "Con que tecnologias tenes experiencia?", label: "tecnologia" },
  { text: "Cuantos años de experiencia tenes?", label: "experiencia" },
  { text: "Donde trabajste?", label: "experiencia" },
  { text: "Como es tu linkedin?", label: "contacto" },
  { text: "Como es tu github?", label: "contacto" },
  { text: "Tenes curriculum?", label: "contacto" },
  { text: "Contacto", label: "contacto" },
  { text: "podrias contarme algo de vos?", label: "presentacion" },
  { text: "podrias presentarte?", label: "presentacion" },
  { text: "que formacion tenes?", label: "formacion" },
  { text: "que estudiaste?", label: "formacion" },
  { text: "estas estudiando una carrera universitaria?", label: "formacion" },
  { text: "sos autodidacta?", label: "formacion" },
  { text: "dime tu experiencia", label: "experiencia" },
  { text: "Trabajaste o tienes experiencia laboral?", label: "experiencia" },
  { text: "que tecnologias manejas?", label: "tecnologia" },
];

export default function ChatBot({ apiKey }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      text: "Hola, soy un bot preparado para contestar preguntas sobre Nico. Haceme tu pregunta!",
    },
  ]);
  const [question, setQuestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const container = useRef<HTMLDivElement>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (isLoading) return;
    if (question === "") return;

    setIsLoading(true);
    setMessages((messages) =>
      messages.concat({ id: String(Date.now()), type: "user", text: question })
    );
    setQuestion("");

    const { classifications } = await fetch(
      "https://api.cohere.ai/v1/classify",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "large",
          inputs: [question],
          examples: EXAMPLES,
        }),
      }
    ).then((response) => response.json());

    setMessages((messages) =>
      messages.concat({
        id: String(Date.now()),
        type: "bot",
        text:
          ANSWERS[classifications[0].prediction as keyof typeof ANSWERS] ||
          ANSWERS["default"],
      })
    );

    setIsLoading(false);
  }

  useEffect(() => {
    container.current?.scrollTo(0, container.current.scrollHeight);
  }, [messages]);

  return (
    <>
      {isChatOpen ? (
        <div className="bg-white dark:bg-[#202030] flex flex-col gap-4 m-5 max-w-lg border border-gray-700 p-4 fixed bottom-5 md:right-10 z-50 rounded-lg">
          <div className="flex flex-row justify-between gap-3 items-center">
            <div className="flex items-center gap-3">
              <img
                src={profileImg.src}
                alt="profile chat"
                className="w-14 h-14"
              />
              <div className="flex flex-col">
                <h3 className="font-semibold">Nico Cartellone</h3>
                <p className="dark:text-gray-300">en linea 🟢</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)}>
              <svg
                className="w-10 h-10 dark:text-white text-black"
                viewBox="0 0 24 24"
                version="1.1"
                fill="currentColor"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <title>Close</title>
                  <g
                    id="Page-1"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fill-rule="evenodd"
                  >
                    <g id="Close">
                      <rect
                        id="Rectangle"
                        fill-rule="nonzero"
                        x="0"
                        y="0"
                        width="24"
                        height="24"
                      ></rect>
                      <line
                        x1="16.9999"
                        y1="7"
                        x2="7.00001"
                        y2="16.9999"
                        id="Path"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      ></line>
                      <line
                        x1="7.00006"
                        y1="7"
                        x2="17"
                        y2="16.9999"
                        id="Path"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      ></line>
                    </g>
                  </g>
                </g>
              </svg>
            </button>
          </div>
          <div
            ref={container}
            className="flex flex-col gap-4 h-[400px] overflow-y-auto pt-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 max-w-[80%] rounded-3xl text-white shadow-lg ${
                  message.type === "bot"
                    ? "bg-indigo-500 text-left self-start rounded-bl-none"
                    : "bg-indigo-950 text-right self-end rounded-br-none"
                }`}
              >
                <div>{message.text}</div>
              </div>
            ))}
          </div>
          <form className="flex items-center gap-1" onSubmit={handleSubmit}>
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Podrías presentarte?"
              className="rounded rounder-r-none flex-1 border border-gray-600 py-2 px-4 bg-white dark:bg-[#202030]"
              type="text"
              name="question"
            />
            <button
              disabled={isLoading}
              className={`px-4 py-3 bg-blue-500 rounded-lg roundend-l-none ${
                isLoading ? "bg-indigo-300" : "bg-indigo-500 hover:bg-white/10"
              }`}
              type="submit"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      ) : (
        <div className="fixed bottom-5 right-5 z-50 shadow-lg bg-[#003159] hover:bg-black dark:hover:bg-white/10 p-2 rounded-full">
          <button onClick={() => setIsChatOpen(true)}>
            <svg
              className="w-12 h-10"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  stroke="#fff"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.88235 15C13.261 15 16 12.5376 16 9.5C16 6.46243 13.261 4 9.88235 4C6.50367 4 3.76471 6.46243 3.76471 9.5C3.76471 10.3179 3.96327 11.094 4.31942 11.7917L3 15L6.82353 14.2642C7.72335 14.7322 8.76806 15 9.88235 15Z"
                ></path>
                <path
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.8042 18.1242C11.759 18.6784 12.8966 19 14.1176 19C15.2319 19 16.2766 18.7322 17.1765 18.2642L21 19L19.6806 15.7917C20.0367 15.094 20.2353 14.3179 20.2353 13.5C20.2353 12.2553 19.7754 11.1071 19 10.1854C18.251 9.29505 17.2076 8.61598 16 8.26526"
                ></path>
                <circle
                  r="1"
                  fill="#fff"
                  transform="matrix(-1 0 0 1 13 9.5)"
                ></circle>
                <circle
                  r="1"
                  fill="#fff"
                  transform="matrix(-1 0 0 1 10 9.5)"
                ></circle>
                <circle
                  r="1"
                  fill="#fff"
                  transform="matrix(-1 0 0 1 7 9.5)"
                ></circle>
              </g>
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
