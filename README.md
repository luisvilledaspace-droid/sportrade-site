# Sportrade — Sitio web

Sitio institucional de **Sportrade OÜ** (código de registro estonio 16685537),
que desarrolla la tecnología del puente entre fiat y criptomonedas.

Es un sitio **estático** (HTML + CSS + JavaScript, sin build ni dependencias).
Se puede subir tal cual a cualquier hosting.

## Estructura

```
index.html        Página principal
terminos.html     Términos de servicio
privacidad.html   Política de privacidad (RGPD)
datos.html        Tratamiento de datos
css/styles.css    Estilos del sitio
css/legal.css     Estilos de las páginas legales
js/i18n.js        Traducciones ES · EN · ET
js/main.js        Animaciones, formularios y lógica
.cpanel.yml       Despliegue automático de cPanel
```

## Idiomas

El sitio está en **español, inglés y estonio**, con un selector compacto
(ES · EN · ET) en la barra de navegación. En móvil vive dentro del menú.

- El HTML se escribe **en español**, que es el idioma base.
- `js/i18n.js` contiene los tres diccionarios (170 claves cada uno).
- Cada elemento traducible lleva `data-i18n="clave"`; los marcadores de
  posición de los formularios usan `data-ph="clave"`.
- Al primer acceso se detecta el idioma del navegador; después se recuerda
  la elección en `localStorage`.

**Para añadir o cambiar un texto:** edite el HTML (versión española), añada
el atributo `data-i18n` con una clave nueva y registre esa clave en los tres
diccionarios. Si falta en alguno, ese elemento simplemente conserva el
español, sin romper la página.

> Las páginas legales están **solo en español**. Traducir textos jurídicos
> requiere revisión profesional en cada idioma; no conviene hacerlo de forma
> automática.

## Páginas legales

Los tres documentos legales están redactados sobre una premisa central:
**Sportrade OÜ es una empresa de desarrollo de software** (EMTAK 62101) y
**no posee licencia financiera**. Declaran expresamente que no es banco,
entidad de pago ni proveedor de servicios de activos virtuales.

Si en el futuro la sociedad obtiene una licencia (por ejemplo la autorización
del *Rahapesu Andmebüroo* estonio), hay que revisar el apartado 3 de
`terminos.html` y el aviso legal del pie de `index.html`.

> Son textos informativos, no asesoramiento jurídico. Antes de operar
> comercialmente conviene que un abogado estonio los revise.

## Ver el sitio localmente

Abra `index.html` directamente en el navegador, o levante un servidor local:

```bash
npx serve .
```

## Publicar en cPanel

### Opción A — Git Version Control (recomendada, permite actualizar con un clic)

El archivo `.cpanel.yml` ya está listo y **no hay que editarlo**.

> **Ojo con el document root.** `sportrade.co` es un dominio *adicional* de la
> cuenta `gsbwndpt`, y su document root es `/home/gsbwndpt/sportrade.co`,
> **no** `public_html` (que pertenece al dominio principal). Confírmelo en
> *cPanel → Dominios → sportrade.co → Document Root* si algún día cambia.

1. En cPanel: **Git™ Version Control → Create**.
   - Active *Clone a Repository*.
   - **Clone URL:** `https://github.com/luisvilledaspace-droid/sportrade-site.git`
   - **Repository Path:** `repositories/sportrade-site`
   - **Repository Name:** `sportrade-site`
2. Pulse **Create**. cPanel clona el repositorio.
3. Entre al repositorio → pestaña **Pull or Deploy** → **Deploy HEAD Commit**.

> Si el repositorio de GitHub es **privado**, cPanel pedirá una clave SSH:
> genere una en *Terminal* o *SSH Access*, y añádala en GitHub bajo
> *Settings → Deploy keys*. Si es público, no hace falta.

Para publicar cambios futuros: `git push` y luego *Deploy HEAD Commit* en cPanel.

### Opción B — Administrador de archivos (más rápida por una sola vez)

1. Comprima `index.html`, la carpeta `css` y la carpeta `js` en un `.zip`.
2. En cPanel: **Administrador de archivos → public_html → Cargar**.
3. Suba el `.zip` y use **Extraer**.

## Formularios de contacto

Ambos formularios (Solicitar acceso y Conversión Express) envían a
**info@sportrade.co** mediante [FormSubmit](https://formsubmit.co), sin backend.

> **Activación obligatoria, y es por URL:** la primera vez que se envía un
> formulario desde una dirección web concreta, FormSubmit manda un correo con
> un botón **"Activate Form"** a info@sportrade.co. Hasta que se haga clic en
> ese enlace, **ningún envío desde esa URL se entrega**.
>
> Ojo: activar `localhost` **no** activa `sportrade.co`. Cada origen cuenta
> como un formulario distinto y necesita su propio clic. Si algún día el sitio
> se mueve a otro dominio o subdominio, habrá que repetir la activación.
>
> Si un envío falla, la consola del navegador registra el motivo exacto
> (`[Sportrade] Envío no confirmado: ...`).
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
- [ ] Reemplazar las cifras de demostración que siguen siendo inventadas:
      "640+ empresas", "40+ activos", "99.99% disponibilidad" y los tres
      testimonios. La cifra de conversiones totales ya es real (viene del panel).
- [ ] Revisar dos afirmaciones técnicas por si no corresponden a integraciones
      contratadas: "KYC/KYB y Travel Rule embebidos" (tarjeta de API) y
      "Screening on-chain con Chainalysis" (sección de plataforma).
- [ ] Reemplazar las fotos de Unsplash por fotografía propia si se desea.
- [ ] Revisar el texto legal del pie de página con un asesor jurídico.
