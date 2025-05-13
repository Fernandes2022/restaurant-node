window.onload = function() {
  // Add any custom Swagger UI initialization here
  const ui = SwaggerUIBundle({
    url: "/api-docs/swagger.json",
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  });
}; 