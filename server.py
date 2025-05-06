# Este script inicia un servidor web local simple
# para servir archivos desde el directorio actual.
# Esto permite que el archivo index.html cargue data.json
# sin problemas de seguridad del navegador (Same-Origin Policy).

import http.server
import socketserver
import os

# Define el puerto en el que se ejecutará el servidor.
# Puedes cambiarlo si el puerto 8000 ya está en uso.
PORT = 8000

# Obtiene el directorio actual donde se encuentra este script
DIRECTORY = "." # Esto significa el directorio actual

# Configura el manejador para servir archivos desde el directorio especificado
Handler = http.server.SimpleHTTPRequestHandler

# Cambia el directorio de trabajo al directorio especificado
os.chdir(DIRECTORY)

# Crea el servidor TCP/IP
# Le pasamos la dirección y el manejador, pero no lo vinculamos ni activamos aún
with socketserver.TCPServer(("", PORT), Handler, bind_and_activate=False) as httpd:
    # Permite reutilizar el puerto rápidamente después de cerrar el servidor
    httpd.allow_reuse_address = True

    # Vincula explícitamente el servidor a la dirección.
    # ¡Aquí no pasamos la dirección de nuevo, ya la tiene del constructor!
    httpd.server_bind()

    # Activa el servidor
    httpd.server_activate()

    print(f"Sirviendo archivos desde el directorio '{os.path.abspath(DIRECTORY)}' en el puerto {PORT}")
    print(f"Puedes acceder a la aplicación en: http://localhost:{PORT}")
    print("Presiona Ctrl+C para detener el servidor.")

    # Inicia el servidor y lo mantiene en ejecución hasta que se interrumpa (Ctrl+C)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")

# El servidor se cierra automáticamente al salir del bloque 'with'
