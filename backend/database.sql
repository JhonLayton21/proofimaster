CREATE DATABASE proofimaster
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Spain.1252'
    LC_CTYPE = 'Spanish_Spain.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
	
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
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  fecha_entrada DATE NOT NULL,
  marca_id BIGINT REFERENCES marcas_productos (id) ON DELETE CASCADE,
  nivel_minimo_stock INT NOT NULL,
  precio_compra NUMERIC(10, 3) NOT NULL,
  precio_venta NUMERIC(10, 3) NOT NULL,
  proveedor_id BIGINT REFERENCES proveedores (id) ON DELETE CASCADE,
  referencia_id BIGINT REFERENCES referencias_productos (id) ON DELETE CASCADE,
  stock INT NOT NULL
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
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  metodo TEXT NOT NULL
);


CREATE TABLE ventas (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  precio_venta NUMERIC(10, 3) NOT NULL,
  cliente_id BIGINT REFERENCES clientes (id) ON DELETE CASCADE,
  fecha_venta DATE NOT NULL,
  estado_venta_id BIGINT REFERENCES estado_venta (id) ON DELETE CASCADE,
  metodo_pago_id BIGINT REFERENCES metodo_pago (id) ON DELETE CASCADE,
  descuento_venta INT CHECK (
    descuento_venta >= 0
    AND descuento_venta <= 100
  ),
  nota_venta TEXT,
  metodo_envio_venta_id BIGINT REFERENCES metodo_envio_venta (id) ON DELETE CASCADE,
  subtotal NUMERIC(10, 3) NOT NULL,
  total NUMERIC(10, 3) NOT NULL
);

CREATE TABLE venta_productos (
  venta_id BIGINT REFERENCES ventas(id) ON DELETE CASCADE,
  producto_id BIGINT REFERENCES productos(id) ON DELETE CASCADE,
  cantidad INT NOT NULL,
  precio NUMERIC(10, 3) NOT NULL,
  PRIMARY KEY (venta_id, producto_id)
);


CREATE TABLE informes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  gastos NUMERIC(10, 3),
  ingresos NUMERIC(10, 3),
  clientes_frecuentes TEXT,
  clientes_mayor_gasto TEXT,
  compras_por_cliente TEXT,
  compras_por_periodo TEXT,
  compras_por_proveedor TEXT,
  costos_compras NUMERIC(10, 3),
  margen_beneficio NUMERIC(10, 3),
  productos_bajo_stock TEXT,
  productos_obsoletos TEXT,
  stock_actual TEXT,
  ventas_por_cliente TEXT,
  ventas_por_periodo TEXT,
  ventas_por_producto TEXT
);


CREATE TABLE reportes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ruta_archivo TEXT
);
