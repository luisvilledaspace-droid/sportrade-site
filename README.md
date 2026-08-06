# Sportrade — Sitio web

Sitio institucional de **Sportrade OÜ**, el puente entre fiat y criptomonedas.

Es un sitio **estático** (HTML + CSS + JavaScript, sin build ni dependencias).
Se puede subir tal cual a cualquier hosting.

## Estructura

```
index.html        Página completa
css/styles.css    Estilos
js/main.js        Animaciones, formularios y lógica
.cpanel.yml       Despliegue automático de cPanel
```

## Ver el sitio localmente

Abra `index.html` directamente en el navegador, o levante un servidor local:

```bash
npx serve .
```

## Publicar en cPanel

### Opción A — Git Version Control (recomendada, permite actualizar con un clic)

1. Suba este repositorio a GitHub (o Bitbucket).
2. Edite `.cpanel.yml` y reemplace `USUARIO` por su usuario real de cPanel.
   Confirme también la ruta de destino (`public_html` para el dominio principal).
3. En cPanel: **Git™ Version Control → Create**.
   - Marque *Clone a Repository*.
   - Pegue la URL del repositorio.
   - Defina la ruta del repositorio, por ejemplo `/home/USUARIO/repositories/sportrade-site`.
4. Entre al repositorio creado → pestaña **Pull or Deploy** → **Deploy HEAD Commit**.

Para publicar cambios futuros: `git push` y luego *Deploy HEAD Commit* en cPanel.

### Opción B — Administrador de archivos (más rápida por una sola vez)

1. Comprima `index.html`, la carpeta `css` y la carpeta `js` en un `.zip`.
2. En cPanel: **Administrador de archivos → public_html → Cargar**.
3. Suba el `.zip` y use **Extraer**.

## Formularios de contacto

Ambos formularios (Solicitar acceso y Conversión Express) envían a
**info@sportrade.co** mediante [FormSubmit](https://formsubmit.co), sin backend.

> **Activación obligatoria:** la primera vez que se envía un formulario,
> FormSubmit manda un correo con un botón **"Activate Form"** a info@sportrade.co.
> Hasta que se haga clic en ese enlace, **ningún envío se entrega**.
> Si el envío falla, el formulario ofrece un enlace de respaldo que abre el
> correo del visitante con los datos ya escritos.

Para cambiar el destinatario, edite la constante `MAIL_TO` en `js/main.js`.

## Cifra en vivo: conversiones totales

Las dos cifras marcadas con `data-live-total` en `index.html` (el hero y la
sección de números) muestran el **volumen bruto gestionado** tomado del panel
interno.

Ya está conectado al panel, configurado en `js/main.js`:

```js
var PANEL_ORIGIN = "https://guru-master-control.ai.studio";
```

Consulta `GET {PANEL_ORIGIN}/api/public/fintech/total-income` y usa el campo
`totalIncome`. Se refresca al cargar y luego cada 5 minutos.

- Si `PANEL_ORIGIN` queda vacío, no se hace ninguna petición y se muestra el
  valor estático del atributo `data-count`.
- Si el endpoint falla o no responde, también se conserva el valor estático:
  la cifra nunca queda en blanco ni en cero.

Para actualizar el valor de respaldo, cambie `data-count` en ambos elementos.

## Pendientes antes de publicar

- [ ] Activar FormSubmit con el correo de confirmación.
- [ ] Reemplazar `USUARIO` en `.cpanel.yml` por el usuario real de cPanel.
- [ ] Reemplazar cifras y certificaciones de demostración por las reales
      (volumen procesado, número de clientes, licencias, testimonios).
- [ ] Reemplazar las fotos de Unsplash por fotografía propia si se desea.
- [ ] Revisar el texto legal del pie de página con un asesor jurídico.
