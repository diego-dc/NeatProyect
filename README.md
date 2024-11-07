# Neat Proyect App

## Descripción

Este proyecto fue desarrollado como parte de una prueba técnica para Neat. Simula una aplicación de transacciones con criptomonedas, permitiendo a los usuarios gestionar sus balances y registrar transacciones. La aplicación está construida con **Angular** para el frontend y **Firebase** para el backend, proporcionando un entorno escalable y seguro para el manejo de datos.

## Características

- **Gestión de Balances**: Los usuarios pueden actualizar el balance de sus criptomonedas y visualizar el balance en USD correspondiente.
- **Historial de Transacciones**: Cada actualización de balance genera un registro detallado de la transacción, que incluye información como la criptomoneda, la cantidad, el valor en USD.
- **Interfaz de Usuario Estilo Neat**: La aplicación proporciona una interfaz siguiendo el sistema de diseño facilitado por Neat.

## Tecnologías Utilizadas

- **Frontend**: Angular
- **Backend**: Firebase
- **Base de Datos**: Firestore
- **Autenticación**: Firebase Authentication
- **Estilos**: Tailwind CSS

## Instalación

1. Clona el repositorio:

   ```bash
   git clone <https://github.com/diego-dc/NeatProyect.git>
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura Firebase en el proyecto. Asegúrate de tener un archivo `firebase-config.ts` con tus credenciales de Firebase.

4. Inicia la aplicación:
   ```bash
   ng serve
   ```

La aplicación estará disponible en `http://localhost:4200`.

## Uso

1. Regístrate o inicia sesión utilizando Firebase Authentication. Se asignará un saldo aleatorio al ser registrado.
2. Visualiza información de las criptomonedas, tu saldo de criptomonedas y el balance en USD en el Dashboard.
3. Dirigete a 'Transacciones' para realizar transacciones y observa cómo se actualiza tu saldo y se registra la transacción en el historial.

## Estructura del Proyecto

neatProyect/
|- src/

├ src/app/
|- src/app/core/ # Directorio core del proyecto Angular (Aquí van los servicios y componentes generales)
|- src/app/core/services/ # Servicios globales de la aplicación
|- src/app/core/guards/ # Guardias para control de rutas
|
|- src/app/shared/ # Directorio shared para componentes y servicios reutilizables
|- src/app/shared/components/ # Componentes reutilizables en toda la aplicación
|- src/app/shared/interfaces/ # Interfaces utilizadas globalmente
|- src/app/shared/services/ # Servicios comunes para toda la app (e.g., manejo de utilidades, formateo de datos)
|
|- src/app/features/ # Directorio para características o módulos de la aplicación
|- src/app/features/feature1/ # Un módulo de la aplicación (por ejemplo, transacciones)
|- src/app/features/feature1/components/ # Componentes específicos para esta característica
|- src/app/features/feature1/services/ # Servicios específicos para esta característica
|
│
|- src/app/app-routing.module.ts # Archivo para definir las rutas de la aplicación
|- src/app/app.component.ts # Componente principal de la aplicación
|- src/app/app.module.ts # Módulo raíz de la aplicación
|- src/app/main.ts # Archivo principal para arrancar la aplicación Angular
│
|- styles.css # Estilos globales de la aplicación
|- tsconfig.app.json # Configuración de TypeScript para la app
│
|- angular.json # Configuración global de Angular
|- package.json # Dependencias y scripts del proyecto
|- README.md # Archivo README del proyecto (este archivo)
|- tsconfig.json # Configuración de TypeScript global

## Modelo de Datos

El modelo de datos está compuesto por las siguientes collections:

- **Crypto**: Pensado para almacenar los valores de las criptomonedas y otros campos relacionadas a estas de ser necesario.

- **Transaction_history**: Encargada de registrar las transacciones de los usuarios. Se pueden obtener las transacciones correspondientes a cada usuario por el user_id.

- **User_balances**: Se guardan los balances de los usuarios.

## Notas del Proyecto

### **Prioridades**

El enfoque principal del proyecto fue establecer el esqueleto funcional de la aplicación y asegurar que el flujo básico estuviera completo. Esto incluyó la creación de cuentas de usuario, la asignación de saldo y la capacidad de realizar compras y ventas con ese saldo. Gracias a esta prioridad, se logró cumplir con los objetivos mínimos esperados, aunque debido a las restricciones de tiempo, no se alcanzó el nivel de pulido que hubiera sido deseado.

### **Diseño**

Durante el desarrollo, se dio una gran importancia al impacto visual de la aplicación en los usuarios, como se mencionó en las especificaciones. Se intentó adoptar el sistema de diseño proporcionado para garantizar que la presentación fuera adecuada dentro de los plazos disponibles. El resultado es una interfaz intuitiva, fácil de usar y con una presentación que cumple con los estándares visuales esperados, considerando las limitaciones de tiempo.

### **Tecnologías**

Últimamente he trabajado más en proyectos con React, por lo que regresar a Angular supuso un desafío adicional. Además, no había tenido experiencia previa con Firebase, lo que añadió complejidad al proyecto. Decidí afrontar este reto utilizando Angular 17, lo que me desafió a familiarizarme con nuevas herramientas y enfoques durante el desarrollo. Si bien esto hizo que el proceso fuera un poco más lento, estoy satisfecho con los resultados obtenidos, logrando entregar (la funcionalidad básica almenos) dentro del tiempo estipulado.

### **Pendientes**

El alcance del proyecto fue amplio, por lo que lamentablemente no se pudieron completar todas las tareas previstas. Uno de los aspectos que más me preocupó no haber podido abordar fue la seguridad y las validaciones, especialmente teniendo en cuenta que la aplicación esta basada en transacciones de criptomonedas. Sin embargo, se priorizó completar las funcionalidades principales del flujo antes de enfocarse en áreas específicas como la robustez de seguridad. Entre las tareas que quedaron pendientes se encuentran: la integración de valores en tiempo real de las criptomonedas, la implementación de funciones adicionales especificadas y la simulación de respuestas rechazadas de la API en las transacciones.

### **Desarrollo**

Se trató de mantener un enfoque ordenado y modular en el desarrollo, pensando siempre en futuras implementaciones. Dado que el tiempo de entrega era limitado y el alcance del proyecto grande, se buscó que la estructura de la aplicación permitiera fácilmente la expansión considerando que no se terminaría todo. Para ello, se diseñaron componentes reutilizables y se crearon dos layouts: uno para usuarios autenticados que tienen acceso completo a la aplicación, y otro para usuarios no autenticados, que solo pueden acceder a las pantallas de inicio de sesión y registro.
