CREATE TABLE metodo_pago (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  metodo TEXT NOT NULL
);

CREATE TABLE marcas_productos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombre TEXT NOT NULL
);

CREATE TABLE proveedores (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  contacto_proveedor TEXT,
  direccion_proveedor TEXT,
  email_proveedor TEXT,
  nombre_proveedor TEXT,
  telefono_proveedor TEXT,
  metodo_pago_id BIGINT REFERENCES metodo_pago (id) ON DELETE CASCADE
);

CREATE TABLE referencias_productos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  codigo TEXT NOT NULL
);

CREATE TABLE productos (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre text NOT NULL,
    descripcion text,
    fecha_entrada date NOT NULL,
    marca_id bigint,
    nivel_minimo_stock integer NOT NULL,
    precio_compra numeric(10,3) NOT NULL,
    precio_venta numeric(10,3) NOT NULL,
    proveedor_id bigint,
    referencia_id bigint,
    stock integer NOT NULL,
    marca text,
    proveedor text,
    referencia text,
    CONSTRAINT productos_marca_id_fkey FOREIGN KEY (marca_id)
        REFERENCES public.marcas_productos(id) ON DELETE CASCADE,
    CONSTRAINT productos_proveedor_id_fkey FOREIGN KEY (proveedor_id)
        REFERENCES public.proveedores(id) ON DELETE CASCADE,
    CONSTRAINT productos_referencia_id_fkey FOREIGN KEY (referencia_id)
        REFERENCES public.referencias_productos(id) ON DELETE CASCADE
);

CREATE TABLE tipo_clientes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tipo TEXT NOT NULL
);

CREATE TABLE clientes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombre_cliente TEXT NOT NULL,
  direccion_cliente TEXT,
  email_cliente TEXT,
  telefono_cliente TEXT,
  tipo_cliente_id BIGINT REFERENCES tipo_clientes (id) ON DELETE CASCADE
);

CREATE TABLE estado_venta (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  estado TEXT NOT NULL
);

CREATE TABLE metodo_envio_venta (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    metodo text NOT NULL,
    precio numeric(10,3) NOT NULL
);

CREATE TABLE ventas (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    precio_venta numeric(10,3) NOT NULL,
    cliente_id bigint,
    fecha_venta date NOT NULL,
    estado_venta_id bigint,
    metodo_pago_id bigint,
    descuento_venta integer CHECK (descuento_venta >= 0 AND descuento_venta <= 100),
    nota_venta text,
    metodo_envio_venta_id bigint,
    subtotal numeric(10,3) NOT NULL,
    total numeric(10,3) NOT NULL,
    productos jsonb[],
    cliente jsonb,
    CONSTRAINT ventas_cliente_id_fkey FOREIGN KEY (cliente_id)
        REFERENCES public.clientes(id) ON DELETE CASCADE,
    CONSTRAINT ventas_estado_venta_id_fkey FOREIGN KEY (estado_venta_id)
        REFERENCES public.estado_venta(id) ON DELETE CASCADE,
    CONSTRAINT ventas_metodo_envio_venta_id_fkey FOREIGN KEY (metodo_envio_venta_id)
        REFERENCES public.metodo_envio_venta(id) ON DELETE CASCADE,
    CONSTRAINT ventas_metodo_pago_id_fkey FOREIGN KEY (metodo_pago_id)
        REFERENCES public.metodo_pago(id) ON DELETE CASCADE
);

CREATE TABLE venta_productos (
    venta_id bigint NOT NULL,
    producto_id bigint NOT NULL,
    cantidad integer NOT NULL,
    precio numeric(10,3) NOT NULL,
    PRIMARY KEY (venta_id, producto_id),
    CONSTRAINT venta_productos_venta_id_fkey FOREIGN KEY (venta_id)
        REFERENCES public.ventas(id) ON DELETE CASCADE,
    CONSTRAINT venta_productos_producto_id_fkey FOREIGN KEY (producto_id)
        REFERENCES public.productos(id) ON DELETE CASCADE
);