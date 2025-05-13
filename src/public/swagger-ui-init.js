window.onload = function() {
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
    layout: "StandaloneLayout",
    defaultModelsExpandDepth: 3,
    defaultModelExpandDepth: 3,
    defaultModelRendering: 'model',
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    showCommonExtensions: true,
    syntaxHighlight: {
      activate: true,
      theme: 'monokai'
    }
  });

  window.ui = ui;
}; 