import { Form } from "react-router-dom";

export default function Configuracion() {
  const contact = {
    first: "Jhon",
    last: "Layton",
    avatar: "https://robohash.org/you.png?size=100x100",
    notes: "Admin.",
  };

  return (
    <div id="contact" className="flex justify-center items-center ">
      <div>
        <img
          key={contact.avatar}
          src={
            contact.avatar ||
            `https://robohash.org/${contact.id}.png?size=200x200`
          }
        />
      </div>

      <div>
        <h1 className="p-4">
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
        </h1>

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button className="m-4" type="submit">Editar</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (
                !confirm(
                  "Please confirm you want to delete this record."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button className="m-4 bg-red-500 text-white" type="submit">Eliminar</button>
          </Form>
        </div>
      </div>
    </div>
  );
}
