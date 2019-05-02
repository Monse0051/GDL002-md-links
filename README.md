# Markdown Links

## Preámbulo

[Markdown](https://es.wikipedia.org/wiki/Markdown) es un lenguaje de marcado
ligero muy popular entre developers. Es usado en muchísimas plataformas que
manejan texto plano (GitHub, foros, blogs, ...), y es muy común
encontrar varios archivos en ese formato en cualquier tipo de repositorio
(empezando por el tradicional `README.md`).

Estos archivos `Markdown` normalmente contienen _links_ (vínculos/ligas) que
muchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de
la información que se quiere compartir.

## Documentación
Requerimientos previos
node.js
# Instalación
Este módulo se instala desde la terminal, en donde será necesario escribir el siguiente comando:


npm install https://github.com/Monse0051/GDL002-md-links

# Funcionamiento
## JavaScript API
El módulo puede importarse en otros scripts de Node.js y debe ofrece la siguiente interfaz:

md-Links(path, options)


## Argumentos
- path: Ruta absoluta o relativa al archivo o directorio. Si la ruta es
una carpeta, la función leerá todos los archivos *.md dentro de la misma.
options: Un objeto con las siguientes propiedades:
- validate: Booleano que determina si se desea validar los links encontrados.

## Valor de retorno
La función retorna una promesa (Promise) que resuelve a un arreglo (Array) de objetos (Object), donde cada objeto representa un link y contiene las siguientes propiedades:

- href: URL encontrada.
- text: Texto que aparecía dentro del link.
- file: Ruta del archivo donde se encontró el link.

Si el parámetro options contiene la propiedad validate:true los objetos dentro del array que resuelve la promesa tendrán adicionalmente las siguientes propiedades:

- ok: True si la url existe y devolvió un código menor a 400.
De lo contrario a este atributo se le asigna false.
- status: Código HTPP devuelto por la url consultada o -1 si la url no existe.

## CLI (Command Line Interface - Interfaz de Línea de Comando)
El ejecutable de nuestra aplicación se ejecuta de la siguiente manera a través de la terminal:

md-links path-to-file [options]

Si no se instalo en global, será necesario ejecutarlo de la siguiente manera:

.\md-links.cmd path-to-file [options].

# Options
--validate

Si pasamos la opción --validate, el módulo hace una petición HTTP para averiguar si el link funciona o no. Si el link resulta en una redirección a una URL que responde ok, entonces consideraremos el link como ok.

--stats

Si pasamos la opción --stats el output (salida) será un texto con estadísticas básicas sobre los links.

 md-links ./some/example.md --stats

Total: 3

Unique: 3

También podemos combinar --stats y --validate para obtener estadísticas que necesiten de los resultados de la validación.

$ md-links ./some/example.md --stats --validate

Total: 3

Unique: 3

Broken: 1