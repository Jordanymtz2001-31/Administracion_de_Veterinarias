#Imagen base para python
#slim para reducir el tamaño de la imagen
FROM python:3.13-slim 
#Evitampos que python genere archivos de configuracion  que no necesitamos para esta ocasion
ENV PYTHONDONTWRITEBYTECODE 1
#Evitamos que python haga buffering y muestre los logs en tiempo real
ENV PYTHONUNBUFFERED 1
#Creamos una carpeta dentro del contenedor para alojar el codigo de la aplicacion
WORKDIR /app
#Copiamos el archivo de requerimientos al contenedor
COPY requerimientos.txt .
#Instalamos las dependencias del proyecto
RUN pip install --no-cache-dir -r requerimientos.txt 
#Copiamos el codigo de la aplicacion al contenedor
COPY . .
#Exponemos el puerto en el que correrá la aplicacion
EXPOSE 8003
#Comando para ejecutar la aplicacion
CMD ["python", "manage.py", "runserver", "0.0.0.0:8003"]