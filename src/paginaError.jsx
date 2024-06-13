import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div id="paginaError" className="bg-[#CF7300] flex h-screen items-center justify-center" >
            <div>
                <h1 className="text-white py-8 font-bold">Oops!</h1>
                <p className="text-white pb-5">Lo sentimos, un error inesperado ha ocurrido.</p>
                <p className="text-slate-700">
                    <i>{error.statusText || error.message}</i>
                </p>
            </div>

        </div>
    )
}