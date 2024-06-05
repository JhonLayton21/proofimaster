import proofisillasLogo from '/proofisillas.svg'
import './App.css'

function App() {

  return (
    <>
      <div className="bg-slate-100 dark:bg-slate-800">
        <a href="https://vitejs.dev" target="_blank">
          <img src={proofisillasLogo} className="logo" alt="Proofisillas logo" />
        </a>
        <h1 className="text-5xl not-italic font-bold">BIENVENIDO A PROOFIMASTER!</h1>
        <h2 className="text-2xl italic font-bold">Gestiona tu negocio fácilmente y enfocate en la productividad</h2>
        <h3>texto para probar deploy con github</h3>
      </div>
    </>
  )
}

export default App
