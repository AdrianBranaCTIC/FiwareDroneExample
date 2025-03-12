# FiwareDroneExample
Ejemplo de caso de uso de plataforma IoT Fiware. Este caso de uso se basa en unos datos de contexto relacionados con un  sistema básico de control de incendios mediante drones, así como una serie de sensores instalados en estos drones los cuales simularán lectura continuas.

El despliegue es sencillo, solo debes ubicarte dentro de la carpeta raíz del proyecto y ejecutar el siguiente comando:
docker compose up

Una vez levantado será necesario ejecutar las llamadas a las APIs que se encuentran en los ficheros JSON de Postman. Esto corresponde a la inicialización de la prueba de concepto actual, necesaria para visualizar los diferentes escenarios en la aplicación de NodeJS, de otra forma puedes generar a través de llamadas a las diferentes APIs tu propio ejemplo, sin embargo debes tener en cuenta que la aplicación en NodeJS no va a mostrar información correcta debido a que está pensada para este caso concreto de los drones.
Debes ejecutar las siguientes carpetas:
- Add Entities
- Subcriptions

Luego las siguientes llamadas individuales:
- IoT/Add IoT Devices
- IoT Agent/Add IoTA Devices ...

Las aplicaciones web que componen los diferentes módulos del sistema están ubicadas en las siguientes URLs:
    localhost/3003 (Grafana)
    localhost/4200 (CrateDB)
    localhost/3000 (APP NodeJS)
