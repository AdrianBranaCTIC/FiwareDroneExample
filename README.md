# **FiwareDroneExample**

Este proyecto es un caso de uso basado en la plataforma IoT FIWARE. Se centra en un sistema de control de incendios mediante drones, que simulan lecturas continuas de sensores. Además, incluye una aplicación en Node.js para visualizar los datos y un entorno completamente automatizado para su despliegue.

## **Índice**
1. [Requisitos previos](#1-requisitos-previos)
2. [Despliegue automático con Docker y Taskfile](#2-despliegue-automático-con-docker-y-taskfile)
3. [Carga automática de datos con Postman y Newman](#3-carga-automática-de-datos-con-postman-y-newman)
4. [Gestión de la aplicación](#4-gestión-de-la-aplicación)
5. [Acceso a las aplicaciones web](#5-acceso-a-las-aplicaciones-web)
6. [Apagar y limpiar el sistema](#6-apagar-y-limpiar-el-sistema)
7. [Verificación de variables de entorno](#7-verificación-de-variables-de-entorno)
8. [Conceptos clave y tecnologías utilizadas](#8-conceptos-clave-y-tecnologías-utilizadas)

---

## **1. Requisitos previos**
> [!IMPORTANT]
> Antes de iniciar el despliegue, asegúrate de tener instaladas las siguientes herramientas:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Taskfile](https://taskfile.dev/)
- [Node.js y npm](https://nodejs.org/)
- [Postman y Newman](https://learning.postman.com/docs/collections/using-newman-cli/installing-running-newman/)

> [!TIP]
> Para verificar que están correctamente instalados, ejecuta:

```sh
docker --version
docker-compose --version
task --version
node --version
npm --version
newman --version
```

> [!NOTE] 
> Para revisar todas las tasks que permite ejecutar el sistema, puedes ejecutar el siguiente comando, el cual te incluye además una descripción de lo que hace cada una:
```sh
task --list
```

## **2. Despliegue automático con Docker y Taskfile**
El despliegue de la infraestructura FIWARE y la aplicación se realiza con Taskfile, evitando la necesidad de ejecutar manualmente comandos de docker-compose o cargar datos a mano.

### **Pasos para el despliegue:**
1. Ubícate en la carpeta raíz del proyecto:
```sh
cd FiwareDroneExample
```

2. Ejecuta la siguiente task según el estado de tu entorno:
    - Si ya hubiese sido cargada toda la información de contexto y estructura de datos previamente:
    ```sh
    task up
    ```
    Esto levantará todos los servicios de FIWARE y la aplicación sin necesidad de inicializar nuevamente los datos.

    - Si, por el contrario, es la primera vez que se despliega la aplicación, será necesario cargar también las estructuras de datos mediante el siguiente comando:
    ```sh
    task deploy
    ```
    - Esto levantará todos los contenedores necesarios.
    - Verificará si los datos ya están cargados y, si no lo están, los inicializará usando Postman (Newman). (Future work: Verificación para saber si los datos ya han sido introducidos)   

## **3. Carga automática de datos con Postman y Newman**

La carga de datos es necesaria para inicializar correctamente el sistema. Está completamente automatizada dentro de la tasks deploy, pero si ya tuvieses desplegado el servicio y aún así necesitas cargar los datos, usa:
```sh
task data
```
Este comando se encargará de:
- Registrar entidades en FIWARE.
- Configurar suscripciones necesarias para la recepción de eventos.
- Añadir dispositivos IoT simulados.

Si necesitas hacer healthchecks, puedes ejecutar:
```sh
task check_services
```

Si quisieras ejecutar manualmente desde Postman ejecuta las siguientes carpetas:

1️⃣ Carpeta de Postman a ejecutar para la carga de datos
- Init

2️⃣ Carpeta de Postman a ejecutar para los healthchecks
- Check

> [!CAUTION] 
> La aplicación Node.js está diseñada específicamente para este caso de los drones. Si usas otros datos, la visualización puede no ser correcta.

## **4. Gestión de la aplicación**
Una vez desplegada, puedes gestionar la aplicación mediante las siguientes tasks:

- **Ver logs en tiempo real:**
```sh
task logs
```

- **Reiniciar la aplicación sin perder datos**
```sh
task restart
```

- **Detener la aplicación temporalmente**
```sh
task stop
```

- **Iniciar de nuevo la aplicación**
```sh
task start
```

## **5. Acceso a las aplicaciones web**
Una vez levantado el sistema, los servicios estarán disponibles en:

| Servicio    | URL                   |
|-------------|-----------------------|
| Grafana     | http://localhost:3003 |
| CrateDB     | http://localhost:4200 |
| App Node.js | http://localhost:3000 |

## **6. Apagar y limpiar el sistema**
Si necesitas apagar o limpiar el entorno, usa:
- Para detener los servicios de manera ordenada, sin eliminar volúmenes ni datos:
```sh
task stop
```

- Para limpiar completamente la aplicación (eliminar contenedores y volúmenes):
```sh
task clean
```

- Para eliminar completamente la infraestructura y los datos almacenados:
```sh
task down
```

## **7. Verificación de variables de entorno**
Si has movido las variables de entorno a un archivo `.env`, asegúrate de que Docker Compose las está cargando correctamente.

### Verificar variables de entorno dentro del contenedor
Después de levantar los servicios, entra en el contenedor para verificar las variables:

```sh
docker exec -it fiware-drones-app sh
```

Dentro del contenedor, imprime las variables de entorno:
```sh
env
```

También puedes probar con:
```sh
echo $BASEPATH
echo $PORT
echo $BASEPATHIOTA
```

## **8. Conceptos clave y tecnologías utilizadas**
### **¿Qué es FIWARE?**
<TBD>



## **Notas finales**

- El sistema ahora está completamente automatizado.

- No es necesario instalar dependencias globalmente, ya que todo se maneja dentro de los contenedores.

- Si tienes problemas, revisa los logs con:
    ```sh
    task logs
    ```
### **Diagramas**
- **Arquitectura**
  
![drones_fiware_architecture](https://github.com/user-attachments/assets/735b91df-6a69-4da5-beae-50c9f607f896)

- **Secuencia**
  
![iota_sequence](https://github.com/user-attachments/assets/627c5781-0d1a-4202-b700-9052fdd05399)